import { NextRequest, NextResponse } from "next/server";
import { uploadToArweave } from "@/shared/server/ipfs";
import { userAuth } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { user } = await userAuth();
    if (!user) {
      throw new Error("Unauthenticated", {
        cause: { code: 401 },
      });
    }
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
      throw new Error("Failed to post transaction", {
        cause: { code: 500 },
      });
    }
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
