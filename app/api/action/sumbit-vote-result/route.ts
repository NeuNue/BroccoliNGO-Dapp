import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { createTask, fundTask } from "@/shared/server/chain";
import { verify } from "@/shared/server/jwt";
import { TOKEN_NAME, BROCCOLI_ADMIN_WHITELIST } from "@/shared/constant";
import { formatToVoteOnchainMetadata } from "@/shared/task";
import { uploadToArweave } from "@/shared/server/ipfs";
import { userAuth } from "@/shared/server/auth";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { tokenId } = await req.json();
    const { user } = await userAuth();

    if (!user || !user.email) {
      throw new Error("Unauthenticated", {
        cause: { code: 401 },
      });
    }

    if (!BROCCOLI_ADMIN_WHITELIST.includes(user.email)) {
      throw new Error("Forbidden", {
        cause: { code: 403 },
      });
    }

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

    if (taskError) {
      console.error("Error fetching task:", taskError);
      throw new Error("Failed to fetch task", {
        cause: { code: 500 },
      });
    }

    if (!task) {
      throw new Error("Task not found", {
        cause: { code: 404 },
      });
    }

    const isVoteEnded =
      new Date(task.vote_end_date || "0").getTime() <= Date.now();

    // check if vote is ended
    if (!isVoteEnded) {
      return NextResponse.json(
        { code: -1, error: "Vote is not ended yet." },
        { status: 403 }
      );
    }

    // get vote result
    const { data: voteResult = [] } = await supabaseClient.rpc(
      "get_vote_result",
      {
        p_nftid: Number(tokenId),
      }
    );

    const yes = voteResult?.[1]?.ticket || 0;
    const no = voteResult?.[0]?.ticket || 0;

    console.log("getVoteMetadata result", voteResult);

    const { data, error } = await supabaseClient
      .from("Vote")
      .select("*")
      .eq("nftId", Number(tokenId));

    console.log("getVoteMetadata", data, "error", error);

    // upload vote datas on chain before fund records
    const onchainVoteData = formatToVoteOnchainMetadata({
      yes,
      no,
      startDate: new Date(task.vote_start_date || "0").toISOString(),
      endDate: new Date(task.vote_end_date || "0").toISOString(),
      tokenId,
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

    console.log("getVoteMetadata metadata", onchainVoteData);

    const { response, transaction } = await uploadToArweave(
      await new Blob([JSON.stringify(onchainVoteData)]).arrayBuffer(),
      "application/json"
    );

    if (response.status !== 200) {
      throw new Error("Failed to upload vote result", {
        cause: { code: 500 },
      });
    }

    const url = `https://arweave.net/${transaction.id}`;

    // temp: upload vote result to fund records
    await fundTask(tokenId, url);

    return NextResponse.json({
      code: 0,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        code: err?.cause?.code || 500,
        message: err.message || "Internal Server Error",
      },
      { status: err?.cause?.code || 500 }
    );
  }
}
