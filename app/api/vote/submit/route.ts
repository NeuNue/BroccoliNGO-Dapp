import { getTaskDate } from "@/shared/server/dune";
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
      return NextResponse.json({
        code: 400,
        message: "Invalid address format",
      });
    }

    const message = getVoteSignatureMessage(nftId as string, Boolean(result));

    // Verify the signature
    try {
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
        return NextResponse.json({
          code: 404,
          message: "Task not found",
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
        return NextResponse.json({
          code: 403,
          message: "Voting is not set",
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

      const date = getTaskDate(task.data.vote_start_date || "0");

      const balance = await getBalanceOfDate(address as string, date);

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
        return NextResponse.json({
          code: 500,
          message: error.message,
        });
      }

      return NextResponse.json({
        code: 0,
        data: "ok",
      });
    } catch (error: any) {
      console.error("Signature verification error:", error);
      return NextResponse.json({
        code: -1,
        message: error.toString(),
      });
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({
      code: 500,
      message: "Invalid server error",
    });
  }
}
