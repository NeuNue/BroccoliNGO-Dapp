import * as dotenv from "dotenv";
dotenv.config();
import { refreshTaskMeta } from "@/shared/server/model";
import { supabaseClient } from "@/shared/supabase";

async function doRefreshTaskMeta(tokenId: number) {
  refreshTaskMeta(tokenId);
}

async function refreshAllTasks() {
  const { data } = await supabaseClient.from("Task").select("nftId");
  if (!data) return;
  for (const item of data) {
    const { nftId } = item;
    await refreshTaskMeta(nftId!);
  }
}

refreshAllTasks();
