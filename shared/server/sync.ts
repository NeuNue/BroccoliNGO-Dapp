import { createPublicClient, decodeEventLog, http, zeroAddress } from "viem";
import { ABI, BSC_OFFICIAL_RPC_URL, CONTRACT_ADDRESS, mainChain, topics } from "@/shared/constant";
import { supabaseClient } from "@/shared/supabase";
import { getConfig, refreshTaskMeta, setEventHandled, updateConfig } from "@/shared/server/model";
import { Database } from "@/shared/supabase/types";

const publicClient = createPublicClient({
  chain: mainChain,
  transport: http(BSC_OFFICIAL_RPC_URL),
});

type ContractEvent<T> = {
  address: string;
  timeStamp: number;
  block: number;
  hash: string;
  txIndex: number;
  eventName: string;
  args: T;
};

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export function debugLog(msg: any, level: "info" | "warn" | "error" = "info") {
  const logLevel = process.env.LOG_LEVEL ? JSON.parse(process.env.LOG_LEVEL!) : ["info", "warn", "error"];
  if (logLevel.includes(level)) {
    console.log(`[${new Date().toISOString()}][${level}] ${msg}`);
    const date = new Date();
    const fileName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
    if (process.env.LOG_TO_FILE === "true") {
      const fs = require("fs/promises");
      fs.appendFile(`./log/${fileName}`, `[${new Date().toISOString()}] ${msg}\n`);
    }
  }
}

export async function extractMetadata(tokenUri: string) {
  try {
    const res = await fetch(tokenUri).then((res) => res.json());
    return JSON.stringify(res);
  } catch (e) {
    return "";
  }
}

async function getTokenCreateEvent(from: number, to: number) {
  const url = `${mainChain.blockExplorers.default.apiUrl}?module=logs&action=getLogs&fromBlock=${from}&toBlock=${to}&address=${CONTRACT_ADDRESS}&apikey=${process.env.SCAN_API_KEY}`;
  const res = await fetch(url).then((res) => res.json());
  const parsed = res.result.map((v: any) => ({
    address: v.address,
    timeStamp: parseInt(v.timeStamp),
    block: parseInt(v.blockNumber),
    hash: v.transactionHash,
    txIndex: v.transactionIndex === "0x" ? 0 : parseInt(v.transactionIndex),
    ...decodeEventLog({
      abi: ABI,
      data: v.data,
      topics: v.topics,
    }),
  }));
  return parsed as ContractEvent<any>[];
}

export async function syncEvents(from: number, to: number) {
  debugLog(`Fetching events from ${from} to ${to}`);
  const allEvents = await getTokenCreateEvent(from, to)

  const getOrder = (e: any) => e.block * 100000 + e.txIndex;
  const availableEvents = Object.keys(topics)
  const events = allEvents.flat().filter(v => availableEvents.includes(v.eventName)).sort((a, b) => getOrder(a) - getOrder(b));

  debugLog(`${events.length} events found`);

  if (events.length === 0) {
    return 0;
  }

  const { error } = await supabaseClient.from("Event").upsert(
    events.map((e) => ({
      block: e.block,
      data: JSON.stringify(e.args),
      hash: e.hash,
      timestamp: e.timeStamp,
      topic: e.eventName,
      txIndex: e.txIndex,
    })),
    {
      onConflict: "topic,hash,data",
    }
  );

  if (error) {
    throw error.message;
  }

  return events.length;
}

export async function handleEvents() {
  const { data: events, error } = await supabaseClient.from("Event").select("*").eq("status", 0).order("id", { ascending: true });
  if (error) {
    throw error.message;
  }
  const functionMap: Record<string, Function> = {
    Transfer: handleTaskCreate,
    SetApproval: handleApprove,
    AddFundRecord: handleFund,
    AddProof: handleProof,
  };
  for (let i = 0; i < events.length; i++) {
    const { topic } = events[i];
    const handler = topic && functionMap[topic];
    if (handler) {
      await handler(events[i]);
    }
  }
  return events.length;
}

async function handleTaskCreate(row: Database["public"]["Tables"]["Event"]["Row"]) {
  debugLog(`Handling TaskCreate event ${row.id}`);
  const args = JSON.parse(row.data ?? "") as {
    from: string;
    to: string;
    tokenId: number
  };
  const { from, to, tokenId } = args;
  if (from !== zeroAddress) {
    await setEventHandled(row.id);
    return
  }
  const tokenURI = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  })
  // const metadata = await extractMetadata(tokenURI);
  const { error } = await supabaseClient.from("Task").upsert(
    {
      URI: tokenURI,
      nftId: tokenId,
      creatEventId: row.id,
      created_at: new Date(Number(row.timestamp) * 1000).toISOString()
    },
    {
      onConflict: "creatEventId",
    }
  );
  if (error) {
    throw error.message;
  }
  debugLog(`Task ${tokenId} synced`);
  await refreshTaskMeta(tokenId);
  await setEventHandled(row.id);
}

async function handleApprove(row: Database["public"]["Tables"]["Event"]["Row"]) {
  debugLog(`Handling Approve event ${row.id}`);
  const args = JSON.parse(row.data ?? "") as {
    tokenId: number
    flag: boolean
  };
  const { tokenId, flag } = args;
  if (!flag) {
    await setEventHandled(row.id);
    return
  }
  const { error } = await supabaseClient.from("Task").update({
    approved: 1,
    approveEventId: row.id,
    status: 1,
  }).eq('nftId', tokenId);
  if (error) {
    throw error.message;
  }
  debugLog(`Approved to task ${tokenId} synced`);
  await setEventHandled(row.id);
}

async function handleFund(row: Database["public"]["Tables"]["Event"]["Row"]) {
  debugLog(`Handling Fund event ${row.id}`);
  const args = JSON.parse(row.data ?? "") as {
    tokenId: number
    uri: string
  };
  const { tokenId, uri } = args;
  const { error: error1 } = await supabaseClient.from("Fund").upsert(
    {
      nftId: tokenId,
      URI: uri,
      eventId: row.id,
      created_at: new Date(Number(row.timestamp) * 1000).toISOString()
    },
    {
      onConflict: "eventId",
    }
  );
  const { error: error2} = await supabaseClient.from("Task").update({
    status: 2,
  }).eq('nftId', tokenId);
  if (error1 || error2) {
    throw [error1?.message, error2?.message].join(", ");
  }
  debugLog(`Fund event for ${tokenId} synced`);
  await setEventHandled(row.id);
}

async function handleProof(row: Database["public"]["Tables"]["Event"]["Row"]) {
  debugLog(`Handling Proof event ${row.id}`);
  const args = JSON.parse(row.data ?? "") as {
    tokenId: number
    uri: string
  };
  const { tokenId, uri } = args;
  const { error } = await supabaseClient.from("Proof").upsert(
    {
      nftId: tokenId,
      URI: uri,
      eventId: row.id,
      created_at: new Date(Number(row.timestamp) * 1000).toISOString()
    },
    {
      onConflict: "eventId",
    }
  );
  if (error) {
    throw error.message;
  }
  debugLog(`Proof event for ${tokenId} synced`);
  await setEventHandled(row.id);
}

export async function syncData(from?: string | number, to?: string | number) {
  const config = await getConfig()
  const numFrom = Number(from), numTo = Number(to)
  const start = (!isNaN(numFrom) && numFrom > 0) ? numFrom : parseInt(config.indexer_progress)
  const step = parseInt(config.indexer_step)
  const totalBlock = Number(await publicClient.getBlockNumber()) - 30
  const endBlock = (!isNaN(numTo) && numTo > 0) ? numTo : Math.min(start + step, totalBlock)
  console.log(`Syncing from ${start} to ${endBlock} (${totalBlock})`)
  const events = await syncEvents(start, endBlock)
  const handled = await handleEvents()
  if (!from && !to) {
    await updateConfig('indexer_progress', endBlock.toString())
  }
  return {
    events, handled
  }
}