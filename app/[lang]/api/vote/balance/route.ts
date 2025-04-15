// app/api/tasks/[id]/route.ts
import { getBalanceOfDate } from "@/shared/server/model";
import { supabaseClient } from "@/shared/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") as string;
  const tokenId = searchParams.get("tokenId") as string;

  const task = await supabaseClient
    .from("Task")
    .select()
    .eq("nftId", Number(tokenId))
    .maybeSingle();
  if (!task.data) {
    return NextResponse.json({
      code: 404,
      message: "Task not found",
    });
  }

  const balance = await getBalanceOfDate(address as string, task.data.vote_start_date as string);

  const { data: vote, error } = await supabaseClient.from("Vote").select('result,balance').eq("address", address.toLowerCase()).eq("nftId", Number(tokenId)).maybeSingle();

  return NextResponse.json({
    code: 0,
    data: {
      balance,
      result: vote ? vote?.result : -1,
    },
  });
}
