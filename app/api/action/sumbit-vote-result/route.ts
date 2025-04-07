import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { createTask, fundTask } from "@/shared/server/chain";
import { verify } from "@/shared/server/jwt";
import { TOKEN_NAME, BROCCOLI_ADMIN_WHITELIST } from "@/shared/constant";
import { formatToVoteOnchainMetadata } from "@/shared/task";
import { uploadToArweave } from "@/shared/server/ipfs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const { tokenId } = await req.json();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    const payload = verify(token!);

    if (!payload) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unaothorized",
        },
        {
          status: 401,
        }
      );
    }

    const { data: user } = await supabaseClient
      .from("User")
      .select("*")
      .eq("xUid", payload.id)
      .single();

    if (!user || !user.xUserName) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unaothorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!BROCCOLI_ADMIN_WHITELIST.includes(user.xUserName)) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unaothorized",
        },
        {
          status: 401,
        }
      );
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
      return NextResponse.json(
        { error: "Failed to fetch task" },
        { status: 500 }
      );
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isVoteEnded =
      new Date(task.vote_end_date || "0").getTime() <= Date.now();

    // check if vote is ended
    if (!isVoteEnded) {
      return NextResponse.json(
        {
          code: 401,
          message: "Voting not ended",
        },
        {
          status: 401,
        }
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
      return NextResponse.json(
        { code: -1, error: "Failed to upload vote result on chain." },
        { status: 500 }
      );
    }

    const url = `https://arweave.net/${transaction.id}`;

    // temp: upload vote result to fund records
    await fundTask(tokenId, url);

    return NextResponse.json({
      code: 0,
    });
  } catch (err: any) {
    return NextResponse.json({
      code: 500,
      message: err.message,
    });
  }
}
