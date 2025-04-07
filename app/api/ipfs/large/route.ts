import { NextRequest, NextResponse } from "next/server";
import { UploadProgress, uploadToArweave, uploadToArweaveLargeFile } from "@/shared/server/ipfs";
import formidable, { File } from "formidable";
import { Readable } from "stream";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

// Configure formidable
const form = formidable({
  maxFiles: 1,
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowEmptyFiles: false,
});

// Convert ReadableStream to Buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

async function parseForm(req: NextRequest) {
  // Get content type and boundary
  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('multipart/form-data')) {
    throw new Error('Expected multipart/form-data');
  }

  const form = formidable({ 
    maxFileSize: 50 * 1024 * 1024, // 50MB
    keepExtensions: true,
    multiples: true,
  });

  // Create readable stream from request body
  const arrayBuffer = await req.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = Readable.from(buffer);

  // Add missing properties required by formidable
  const enhancedStream = Object.assign(stream, {
    headers: {
      'content-type': contentType,
      'content-length': buffer.length.toString(),
    }
  });

  return new Promise((resolve, reject) => {
    form.parse(enhancedStream as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const { files } = await parseForm(request) as any;

    const file = files.file?.[0];
    if (!file) {
      return NextResponse.json(
        { code: -1, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const { response, transaction } = await uploadToArweaveLargeFile(
      await fs.readFile(file.filepath),
      file.mimetype || 'application/octet-stream',
      (progress: UploadProgress) => {
        // Optional: Log upload progress
        console.log(`Upload progress: ${progress.uploadedChunks} / ${progress.totalChunks}`);
      }
    );

    // Clean up temp file
    await fs.unlink(file.filepath);

    console.log('response', response);
    console.log('transaction', transaction);

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
