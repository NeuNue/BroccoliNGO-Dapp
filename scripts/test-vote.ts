import * as dotenv from "dotenv";
dotenv.config();

import { supabaseClient } from "@/shared/supabase";
import { formatToVoteOnchainMetadata } from "@/shared/task";
import { uploadToArweave } from "@/shared/server/ipfs";

async function getVoteMetadata(tokenId: string) {
  // check if vote is finished
  const { data: task, error: taskError } = await supabaseClient
    .from("Task")
    .select(
      `
    *
  `
    )
    .eq("nftId", Number(tokenId))
    .single();

  const { data: result = [] } = await supabaseClient.rpc("get_vote_result", {
    p_nftid: Number(tokenId),
  });

  const yes = result?.[1]?.ticket || 0;
  const no = result?.[0]?.ticket || 0;

  console.log("getVoteMetadata result", result);

  const { data, error } = await supabaseClient
    .from("Vote")
    .select("*")
    .eq("nftId", Number(tokenId));

  console.log("getVoteMetadata", data, "error", error);

  const metadata = formatToVoteOnchainMetadata({
    yes,
    no,
    startDate: new Date(task?.vote_start_date || "0").toISOString(),
    endDate: new Date(task?.vote_end_date || "0").toISOString(),
    tokenId: tokenId,
    votes: (data || []).map((item) => {
      return {
        address: item.address ?? "",
        signature: item.sign ?? "",
        result: item.result ?? -1,
        tickets: item.balance ?? 0,
        time: new Date(item.created_at).toISOString(),
      };
    }),
  });

  console.log("getVoteMetadata metadata", metadata);

  const { response, transaction } = await uploadToArweave(
    await new Blob([JSON.stringify(metadata)]).arrayBuffer(),
    "application/json"
  );

  console.log(`https://arweave.net/${transaction.id}`);
}

getVoteMetadata("1");
