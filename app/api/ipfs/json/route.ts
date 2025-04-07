import { NextRequest, NextResponse } from "next/server";
import { uploadToArweave } from "@/shared/server/ipfs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { response, transaction } = await uploadToArweave(
      await new Blob([
        JSON.stringify(body),
      ]).arrayBuffer(),
      request.headers.get("content-type") || "image/jpeg"
    );

    if (response.status === 200) {
      return NextResponse.json({
        code: 0,
        data: { url: `https://arweave.net/${transaction.id}` },
      });
    } else {
      return NextResponse.json(
        { code: -1, error: "Failed to post transaction" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { code: 500, error: "Internal Server Error" + err?.message },
      { status: 500 }
    );
  }
}
