import * as dotenv from "dotenv";
dotenv.config();

import { supabaseClient } from "@/shared/supabase";

async function setVoteDate(
  start_date: number | string,
  end_date: number | string,
  tokenId: string
) {
  const { data, error } = await supabaseClient
    .from("Task")
    .update({
      vote_start_date: String(start_date),
      vote_end_date: String(end_date),
    })
    .eq("nftId", Number(tokenId));

  console.log("setVoteDate", data, 'error', error);
}

setVoteDate(
  new Date(Date.UTC(2025, 3, 2)).toISOString(),
  new Date(Date.UTC(2025, 3, 5)).toISOString(),
  "1"
);
