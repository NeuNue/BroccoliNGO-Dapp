import { NextRequest, NextResponse } from "next/server";
import { approveTask } from "@/shared/server/chain";
import { BROCCOLI_ADMIN_WHITELIST, TOKEN_NAME } from "@/shared/constant";
import { supabaseClient } from "@/shared/supabase";
import { cookies } from "next/headers";
import { verify } from "@/shared/server/jwt";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { tokenId, start_date, end_date } = await req.json();

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
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to update task",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      code: 0,
      message: "Task approved successfully",
    });
  } catch (error) {
    console.error("Error in approve endpoint:", error);
    return NextResponse.json(
      {
        code: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
