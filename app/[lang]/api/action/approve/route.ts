import { NextRequest, NextResponse } from "next/server";
import { approveTask } from "@/shared/server/chain";
import { BROCCOLI_ADMIN_WHITELIST, TOKEN_NAME } from "@/shared/constant";
import { supabaseClient } from "@/shared/supabase";
import { cookies } from "next/headers";
import { verify } from "@/shared/server/jwt";
import { userAuth } from "@/shared/server/auth";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { tokenId, start_date, end_date } = await req.json();
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

    await approveTask(tokenId);
    // await syncData();

    // Convert timestamps to ISO strings for Supabase
    const startDateISO = new Date(Number(start_date)).toISOString();
    const endDateISO = new Date(Number(end_date)).toISOString();

    // Update database with voting period
    const { error } = await supabaseClient
      .from("Task")
      .update({
        vote_start_date: startDateISO,
        vote_end_date: endDateISO,
      })
      .eq("nftId", Number(tokenId));

    if (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task", {
        cause: { code: 500 },
      });
    }

    return NextResponse.json({
      code: 0,
      message: "Task approved successfully",
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
