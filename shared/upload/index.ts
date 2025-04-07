import Compressor from "compressorjs";
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from "../constant";

export const compressFileToJpeg = async (file: File | Blob) => {
  return new Promise<File | Blob>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      mimeType: "image/jpeg",

      // The compression process is asynchronous,
      // which means you have to access the `result` in the `success` hook function.
      success(result) {
        resolve(result);
      },
      error(err) {
        console.log(err.message);
        reject(err);
      },
    });
  });
};

export async function uploadImage(
  payload: {
    file?: File | Blob;
    url?: string;
  },
  maxSize = MAX_IMAGE_SIZE
): Promise<{
  code: number;
  data: {
    url: string;
  };
  error: string;
} | null> {
  const { file, url } = payload;

  if (file) {
    const _file = await compressFileToJpeg(file);
    if (_file.size > maxSize) {
      return {
        code: -1,
        data: {
          url: "",
        },
        error: `File size should be less than ${
          MAX_IMAGE_SIZE / 1024 / 1024
        }MB`,
      };
    }
    const arrayBuffer = await _file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const reconstructedBuffer = Buffer.from(uint8Array);
    const type = _file.type;
    return uploadFileToIpfs(reconstructedBuffer, type);
  }
  if (url) {
    return uploadImageByUrl(url);
  }
  return null;
}

export async function uploadVideo(
  payload: {
    file: File | Blob;
  },
  maxSize = MAX_VIDEO_SIZE
): Promise<{
  code: number;
  data: {
    url: string;
  };
  error: string;
} | null> {
  const { file } = payload;

  if (file.size > maxSize) {
    return {
      code: -1,
      data: {
        url: "",
      },
      error: `File size should be less than ${maxSize / 1024 / 1024}MB`,
    };
  }

  const type = file.type;
  return uploadLargeFileToIpfs(file, type);
}

export const uploadImageByUrl = async (url: string) => {
  return fetch(`/api/ipfs/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  }).then((response) => response.json());
};

const MAX_REGULAR_SIZE = 5 * 1024 * 1024; // 5MB
export const uploadFileToIpfs = async (buffer: Buffer, contentType: string) => {
  const endpoint =
    buffer.length > MAX_REGULAR_SIZE ? "/api/ipfs/large" : "/api/ipfs";
  try {
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
      },
      body: buffer, // 直接发送文件的二进制内容
    }).then((response) => response.json());
  } catch (err) {
    console.log("uploadFileToIpfs error", err);
    return null;
  }
};

export const uploadLargeFileToIpfs = async (
  file: File | Blob,
  contentType: string,
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/ipfs/large", {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type header, let browser set it with boundary
        "X-Content-Type": contentType,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data;
  } catch (error) {
    console.error("Large file upload error:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to upload large file");
  }
};

export const uploadJson = async (
  payload: Partial<string>
): Promise<{
  code: number;
  data: {
    url: string;
  };
  error: string;
} | null> => {
  return fetch(`/api/ipfs/json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json());
};
