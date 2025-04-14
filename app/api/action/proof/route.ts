import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { addProof, createTask, fundTask } from "@/shared/server/chain";
import { TOKEN_NAME } from "@/shared/constant";
import { verify } from "@/shared/server/jwt";
import { userAuth } from "@/shared/server/auth";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { tokenId, url } = await req.json();
    const { user } = await userAuth();

    if (!user) {
      throw new Error("Unauthenticated", {
        cause: { code: 401 },
      });
    }

    const { data: task } = await supabaseClient
      .from("Task")
      .select("*")
      .eq("id", tokenId)
      .single();
    
    console.log('--- task', task, 'email', task?.email);
    console.log('--- user', user, 'email', user.email);
    if (task?.email !== user.email) {
      throw new Error("Forbidden", {
        cause: { code: 403 },
      });
    }

    await addProof(tokenId, url);
    // await syncData()

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
