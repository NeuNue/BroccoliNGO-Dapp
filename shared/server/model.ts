import { decodeEventLog, formatUnits, TransactionReceipt } from "viem";
import { supabaseClient } from "@/shared/supabase";
import { Json } from "@/shared/supabase/types";
import {
  HelpRequest,
  NFTMetaData,
  RescueNFTMetaData,
} from "@/shared/types/rescue";
import { handleEvents } from "@/shared/server/sync";
import {
  ABI,
  DONATE_TYPE,
  hashToTopicMap,
  TOKEN_ABIs,
  TOKEN_ADDRESSES,
  topics,
} from "@/shared/constant";
import {
  formatNFTMetadataToTaskRequest,
  nftMetaDataToHelpRequest,
  nftMetaDataToHelpRequest2,
  NFTMetaDataToRescueRequestForms,
} from "@/shared/task";
import { NFTMetaData2 } from "@/shared/types/help";
import { redis } from "@/shared/server/redis";
import { ethers } from "ethers";
import { callDuneAPI, getTaskDate } from "./dune";

export async function getConfig() {
  const { data, error } = await supabaseClient
    .from("Config")
    .select("key,value");
  if (error) {
    throw error.message;
  }
  const map: Record<string, string> = {};
  data.forEach((item: any) => {
    map[item.key] = item.value;
  });
  return map;
}

export async function updateConfig(key: string, value: string) {
  const { error } = await supabaseClient
    .from("Config")
    .update({ value })
    .eq("key", key);
  if (error) {
    throw error.message;
  }
}

export async function setEventHandled(id: number) {
  const { error } = await supabaseClient
    .from("Event")
    .update({ status: 1 })
    .eq("id", id);
  if (error) {
    throw error.message;
  }
}

export async function refreshTaskMeta(nftId: number) {
  try {
    const { data: task } = await supabaseClient
      .from("Task")
      .select("URI")
      .eq("nftId", nftId)
      .single();
    if (!task) return;
    const { URI } = task;
    if (!URI) return;
    const parsed = await formatNFTMetadataToTaskRequest(URI);
    console.log("refreshTaskMeta parsed", parsed);
    if (!parsed) return;
    switch (parsed.v) {
      case "1.0": {
        const { NFTMetaData, formatedData } = parsed;
        if (!formatedData) return;
        await supabaseClient
          .from("Task")
          .update({
            metadata: NFTMetaData as never as Json,
            xHandle: formatedData.contactForm.twitter,
          })
          .eq("nftId", nftId);
        break;
      }
      case "0.2": {
        const { NFTMetaData, formatedData } = parsed;
        if (!formatedData) return;
        await supabaseClient
          .from("Task")
          .update({
            metadata: NFTMetaData as never as Json,
            xHandle: formatedData.organization.contact.twitter,
            address: formatedData.request.address,
          })
          .eq("nftId", nftId);
        break;
      }
      case "0.1": {
        const { NFTMetaData, formatedData } = parsed;
        if (!formatedData) return;
        await supabaseClient
          .from("Task")
          .update({
            metadata: NFTMetaData as never as Json,
            xHandle: formatedData.organization.contact.twitter,
          })
          .eq("nftId", nftId);
        break;
      }
    }
  } catch (err) {
    console.error("refreshTaskMeta error:", err);
  }
}

export async function createAndHandleEvents(receipt: TransactionReceipt) {
  const logs = receipt.logs;
  const filtererLogs = logs.filter((log) =>
    Object.values(topics).includes(log.topics[0]?.toLowerCase() ?? "")
  );
  if (filtererLogs.length === 0) {
    return;
  }
  for (const log of filtererLogs) {
    const parsedLog = decodeEventLog({
      abi: ABI,
      data: log.data,
      topics: log.topics,
    });
    await supabaseClient.from("Event").upsert(
      {
        block: Number(log.blockNumber),
        data: JSON.stringify(parsedLog.args),
        hash: log.transactionHash,
        timestamp: Math.floor(Date.now() / 1000),
        topic: hashToTopicMap[log.topics[0]?.toLowerCase() ?? ""],
        txIndex: Number(log.transactionIndex),
      },
      {
        onConflict: "topic,hash,data",
      }
    );
  }
  await handleEvents();
}

export async function getBalanceOfBlock(address: string, blockNumber: number) {
  const provider = new ethers.JsonRpcProvider("https://broccoli.rpc.48.club");
  const tokenAddress = TOKEN_ADDRESSES[DONATE_TYPE.BROCCOLI];
  const abi = TOKEN_ABIs[DONATE_TYPE.BROCCOLI];
  const contract = new ethers.Contract(tokenAddress, abi, provider);

  const balance = await contract.balanceOf(address, {
    blockTag: `0x${blockNumber.toString(16)}`,
  });

  return Math.floor(Number(formatUnits(balance, 18)));
}

export async function getBalanceOfDate(address: string, date: string) {
  const _address = address.toLowerCase();
  const _date = getTaskDate(date);
  const cache = await redis.get(`vote:${date}:${address}`);
  console.log("--- cache", cache);
  if (cache) {
    return Number(cache);
  }
  const filter = `(to=${_address} or from=${_address}) and block_time < '${_date}'`;
  const url = `https://api.dune.com/api/v1/query/4964458/results?filters=${filter}`;
  const res = await callDuneAPI(url);
  const rows = res.result.rows;
  let balance = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].to === _address) {
      balance += rows[i].amount;
    }
    if (rows[i].from === _address) {
      balance -= rows[i].amount;
    }
  }

  const _balance = Math.floor(balance);

  await redis.set(`vote:${date}:${address}`, _balance, {
    ex: 60 * 60 * 24 * 3, // 7 days
  });
  return _balance;
}
