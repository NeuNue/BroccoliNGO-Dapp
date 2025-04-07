// app/api/tasks/[id]/route.ts
import { supabaseClient } from "@/shared/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nftId = searchParams.get("nftId") as string;

  const { data, error } = await supabaseClient.rpc('get_vote_result', {
    p_nftid: Number(nftId)
  })

  if (error) {
    return NextResponse.json({
      code: 1,
      message: error.message
    })
  }

  const result: Record<number, number> = {};
  data.forEach((item) => {
    result[item.result] = item.ticket;
  });

  return NextResponse.json({
    code: 0,
    data: result
  });
}
