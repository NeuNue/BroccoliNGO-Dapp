// app/api/tasks/[id]/route.ts
import { getTaskDate } from "@/shared/server/dune";
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

  const date = getTaskDate(task.data.vote_start_date || '0');

  const balance = await getBalanceOfDate(address.toLowerCase(), date);

  const { data: vote, error } = await supabaseClient.from("Vote").select('result,balance').eq("address", address.toLowerCase()).eq("nftId", Number(tokenId)).maybeSingle();

  return NextResponse.json({
    code: 0,
    data: {
      balance,
      result: vote ? vote?.result : -1,
    },
  });
}
