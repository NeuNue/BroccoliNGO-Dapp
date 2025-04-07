import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { addProof, createTask, fundTask } from "@/shared/server/chain";
import { TOKEN_NAME } from "@/shared/constant";
import { verify } from "@/shared/server/jwt";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const { tokenId, url } = await req.json();

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

  const { id } = payload;
  const { data: user } = await supabaseClient
    .from("User")
    .select("*")
    .eq("xUid", id)
    .single();

  if (!user) {
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

  const { data: task } = await supabaseClient.from("Task").select("*").eq("id", tokenId).single();
  if (task?.xHandle !== user.xUserName) {
    return NextResponse.json(
      {
        code: 403,
        message: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  try {
    await addProof(tokenId, url);
    // await syncData()

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
