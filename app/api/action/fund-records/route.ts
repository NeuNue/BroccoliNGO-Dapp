import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { createTask, fundTask } from "@/shared/server/chain";
import { verify } from "@/shared/server/jwt";
import { TOKEN_NAME, BROCCOLI_ADMIN_WHITELIST } from "@/shared/constant";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const { tokenId, url } = await req.json();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    const payload = verify(token!);

    if (!payload) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unaothorized",
        },
        {
          status: 401,
        }
      );
    }

    const { data: user } = await supabaseClient
      .from("User")
      .select("*")
      .eq("xUid", payload.id)
      .single();

    if (!user || !user.xUserName) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unaothorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!BROCCOLI_ADMIN_WHITELIST.includes(user.xUserName)) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unaothorized",
        },
        {
          status: 401,
        }
      );
    }

    // to do: check if vote is finished

    // to do: upload vote datas before fund records

    await fundTask(tokenId, url);
    // await syncData();

    return NextResponse.json({
      code: 0,
    });
  } catch (err: any) {
    return NextResponse.json({
      code: 500,
      message: err.message,
    });
  }
}
