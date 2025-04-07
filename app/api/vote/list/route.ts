// app/api/tasks/[id]/route.ts
import { supabaseClient } from "@/shared/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nftId = searchParams.get("nftId") as string;
  const page = searchParams.get("page") as string;
  const pageSize = searchParams.get("pageSize") as string;

  const { data, error: error1 } = await supabaseClient.from("Vote").select("*").eq("nftId", Number(nftId)).order("created_at", { ascending: false }).range(Number(page) - 1 * Number(pageSize), (Number(page)) * Number(pageSize) - 1);

  const { count, error: error2 } = await supabaseClient.from("Vote").select("*", { count: "exact" }).eq("nftId", Number(nftId))

  if (error1 || error2) {
    return NextResponse.json({
      code: 1,
      message: error1?.message ?? '' + error2?.message ?? ''
    })
  }

  return NextResponse.json({
    code: 0,
    data: {
      list: data,
      total: count,
    }
  });
}
