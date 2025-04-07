// Import necessary dependencies
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Arweave from "arweave";
import { uploadToArweave } from "@/shared/server/ipfs";

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
  // // Get and verify authentication
  // const user = req.headers.get("user");

  // if (!user) {
  //   return NextResponse.json(
  //     { code: -1, data: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  // Parse request body
  const body = await req.json();
  const { url: fileUrl } = body;

  if (!fileUrl) {
    return NextResponse.json(
      { code: -1, error: "URL is required" },
      { status: 400 }
    );
  }

  try {
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
        `Failed to fetch file: ${fileRes.status} ${fileRes.statusText}`
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
      return NextResponse.json(
        { code: -1, error: "Failed to post transaction" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { code: 500, error: error.message || "Failed to process file" },
      { status: 500 }
    );
  }
}
