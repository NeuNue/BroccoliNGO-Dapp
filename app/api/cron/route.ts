import { syncData } from "@/shared/server/sync";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = Number(searchParams.get("from"))
  const to = Number(searchParams.get("to"))

  const res = await syncData(from, to)

  return NextResponse.json({
    code: "0",
    data: res
  });
}
