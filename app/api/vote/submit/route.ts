import { getBalanceOfDate } from "@/shared/server/model";
import { supabaseClient } from "@/shared/supabase";
import { getVoteSignatureMessage } from "@/shared/vote";
import { NextRequest, NextResponse } from "next/server";
import { verifyMessage, isAddress, Hex } from "viem";

export async function POST(request: NextRequest) {
  try {
    const { address, nftId, result, signature } = await request.json();

    if (!address || !nftId || !signature) {
      return NextResponse.json({
        code: 400,
        message: "Missing required parameters",
      });
    }

    // Validate address format
    if (!isAddress(address as Hex)) {
      throw new Error("Invalid address format", {
        cause: { code: 400 },
      });
    }

    const message = getVoteSignatureMessage(nftId as string, Boolean(result));

    // Verify the signature
    const isValidSignature = await verifyMessage({
      address: address as Hex,
      message,
      signature: signature as Hex,
    });

    if (!isValidSignature) {
      return NextResponse.json({
        code: 400,
        message: "Invalid signature",
      });
    }

    const task = await supabaseClient
      .from("Task")
      .select()
      .eq("nftId", Number(nftId))
      .maybeSingle();
    if (!task.data) {
      throw new Error("Task not found", {
        cause: { code: 404 },
      });
    }

    // Check if voting is currently active
    const now = new Date();
    const voteStartDate = task.data.vote_start_date
      ? new Date(task.data.vote_start_date)
      : null;
    const voteEndDate = task.data.vote_end_date
      ? new Date(task.data.vote_end_date)
      : null;

    // Validate voting period
    if (!voteStartDate || !voteEndDate) {
      throw new Error("Voting period not set", {
        cause: { code: 403 },
      });
    }

    if (now < voteStartDate) {
      return NextResponse.json({
        code: 403,
        message: "Voting has not started yet",
        data: {
          currentTime: now.toISOString(),
          startTime: voteStartDate.toISOString(),
        },
      });
    }

    if (now > voteEndDate) {
      return NextResponse.json({
        code: 403,
        message: "Voting has ended",
        data: {
          currentTime: now.toISOString(),
          endTime: voteEndDate.toISOString(),
        },
      });
    }

    const balance = await getBalanceOfDate(
      address as string,
      task.data.vote_start_date as string
    );

    const { error } = await supabaseClient.from("Vote").upsert(
      {
        address: (address as string).toLowerCase(),
        nftId: Number(nftId),
        result: result ? 1 : 0,
        sign: signature as string,
        balance,
      },
      {
        onConflict: "address,nftId",
      }
    );

    if (error) {
      throw new Error("Failed to save vote", {
        cause: { code: 500 },
      });
    }

    return NextResponse.json({
      code: 0,
      data: "ok",
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
