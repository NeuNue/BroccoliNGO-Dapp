// Import necessary dependencies
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Arweave from "arweave";
import { uploadToArweave } from "@/shared/server/ipfs";
import { userAuth } from "@/shared/server/auth";

// Define MIME type to extension mapping
const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  // Add more MIME types as needed
};

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { url: fileUrl } = body;

    if (!fileUrl) {
      throw new Error("URL is required", {
        cause: { code: 400 },
      });
    }

    const { user } = await userAuth();

    if (!user) {
      throw new Error("Unauthenticated", {
        cause: { code: 401 },
      });
    }

    // Fetch file from URL with timeout and error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const fileRes = await fetch(fileUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyApp/1.0)",
      },
    });
    clearTimeout(timeoutId);

    if (!fileRes.ok) {
      throw new Error(
        `Failed to fetch file: ${fileRes.status} ${fileRes.statusText}`,
        {
          cause: { code: fileRes.status },
        }
      );
    }

    // Process file metadata
    const contentType = fileRes.headers.get("content-type") || "";

    // Convert fileRes to buffer
    const buffer = await fileRes.arrayBuffer();

    const { response, transaction } = await uploadToArweave(
      buffer,
      contentType
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
