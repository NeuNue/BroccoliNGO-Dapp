import { decodeEventLog, TransactionReceipt } from "viem";
import { supabaseClient } from "@/shared/supabase";
import { Json } from "@/shared/supabase/types";
import { HelpRequest, NFTMetaData } from "@/shared/types/rescue";
import { handleEvents } from "@/shared/server/sync";
import { ABI, hashToTopicMap, topics } from "@/shared/constant";
import { nftMetaDataToHelpRequest, nftMetaDataToHelpRequest2 } from "@/shared/task";
import { NFTMetaData2 } from "@/shared/types/help";
import { redis } from "@/shared/server/redis";
import { getBalanceOfExecution } from "@/shared/server/dune";

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
    const NFTMetaData: NFTMetaData | NFTMetaData2 = await fetch(URI).then(
      (res) => res.json()
    );
    console.log("-- NFTMetaData", NFTMetaData);
    if (
      NFTMetaData.attributes.find((attr) => attr.trait_type === "version")
        ?.value === "0.2"
    ) {
      const data = nftMetaDataToHelpRequest2(NFTMetaData as NFTMetaData2);
      console.log("---- data", data);
      if (!data) return;
      await supabaseClient
        .from("Task")
        .update({
          metadata: NFTMetaData as never as Json,
          xHandle: data.organization.contact.twitter,
          address: data.request.address,
        })
        .eq("nftId", nftId);
      return;
    }
    const data = nftMetaDataToHelpRequest(NFTMetaData as NFTMetaData);
    if (!data) return;
    await supabaseClient
      .from("Task")
      .update({
        metadata: NFTMetaData as never as Json,
        xHandle: data.organization.contact.twitter,
      })
      .eq("nftId", nftId);
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

export async function getBalanceOfDate(address: string, date: string) {
  address = address.toLowerCase();
  const cache = await redis.get(`vote:${date}:${address}`);
  console.log("--- cache", cache);
  if (cache) {
    return Number(cache);
  }

  const { data } = await supabaseClient
    .from("DuneExecution")
    .select()
    .eq("queryId", "4933658")
    .eq("date", date)
    .maybeSingle();

  if (!data) {
    return 0;
  }

  const executionId = data.executionId as string;

  const balance = Math.floor(await getBalanceOfExecution(address, executionId));

  await redis.set(`vote:${date}:${address}`, balance, {
    ex: 60 * 60 * 24 * 3, // 7 days
  });

  return balance;
}
