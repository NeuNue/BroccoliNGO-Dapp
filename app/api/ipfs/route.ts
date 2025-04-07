import { NextRequest, NextResponse } from "next/server";
import { uploadToArweave } from "@/shared/server/ipfs";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { response, transaction } = await uploadToArweave(
      buffer,
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
  } catch (err) {
    return NextResponse.json(
      { code: 500, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
