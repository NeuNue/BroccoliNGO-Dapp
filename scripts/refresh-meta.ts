import * as dotenv from "dotenv";
dotenv.config();
import { refreshTaskMeta, syncMultilangueTaskMeta } from "@/shared/server/model";
import { supabaseClient } from "@/shared/supabase";

async function doRefreshTaskMeta(tokenId: number) {
  // refreshTaskMeta(tokenId);
  await syncMultilangueTaskMeta(tokenId);
}

async function refreshAllTasks() {
  const { data } = await supabaseClient.from("Task").select("nftId");
  if (!data) return;
  for (const item of data) {
    const { nftId } = item;
    const parsed = await refreshTaskMeta(nftId!);
    console.time(`syncMultilangueTaskMeta ${nftId}`);
    await syncMultilangueTaskMeta(nftId!, parsed?.NFTMetaData);
    console.timeEnd(`syncMultilangueTaskMeta ${nftId}`);
  }

  await syncMultilangueTaskMeta(11);
}

// refreshAllTasks();
doRefreshTaskMeta(10)
