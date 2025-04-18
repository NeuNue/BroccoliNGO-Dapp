import { syncMultilangueTaskMeta } from "@/shared/server/model";
import { supabaseClient } from "@/shared/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { data: latestTast, error } = await supabaseClient
    .from("Task")
    .select("metadata, metadata_zh, metadata_en, nftId")
    .or("metadata_zh.is.null,metadata_en.is.null")
    .order("nftId", { ascending: false })
    .limit(1)
    .single();

  if (!latestTast) {
    return NextResponse.json({
      code: 0,
      data: null,
    });
  }

  if (!latestTast?.metadata_en || !latestTast?.metadata_zh) {
    if (!latestTast?.nftId) return;
    await syncMultilangueTaskMeta(
      latestTast?.nftId,
      latestTast?.metadata as any
    );
  }

  return NextResponse.json({
    code: 0,
    data: latestTast?.nftId,
  });
}
