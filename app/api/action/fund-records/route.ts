import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { createTask, fundTask } from "@/shared/server/chain";
import { verify } from "@/shared/server/jwt";
import { TOKEN_NAME, BROCCOLI_ADMIN_WHITELIST } from "@/shared/constant";
import { userAuth } from "@/shared/server/auth";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { tokenId, url } = await req.json();
    const { user } = await userAuth();

    if (!user || !user.email) {
      throw new Error("Unauthenticated", {
        cause: { code: 401 },
      });
    }

    if (!BROCCOLI_ADMIN_WHITELIST.includes(user.email)) {
      throw new Error("Forbidden", {
        cause: { code: 403 },
      });
    }

    // to do: check if vote is finished

    // to do: upload vote datas before fund records

    await fundTask(tokenId, url);
    // await syncData();

    return NextResponse.json({
      code: 0,
    });
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
