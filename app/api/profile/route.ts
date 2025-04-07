import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { verify } from "@/shared/server/jwt";
import { BROCCOLI_ADMIN_WHITELIST, isBeta, TOKEN_NAME } from "@/shared/constant";

export const dynamic = "force-dynamic"; // defaults to auto
export const revalidate = 0;

export async function GET(req: Request) {
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

  console.log("--- user", user, 'id', id);

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

  const { data: task } = await supabaseClient
    .from("Task")
    .select("URI,nftId,approved,status,metadata,xHandle,creatEventId(id,hash),address,helpPics")
    .eq("xHandle", user.xUserName!)
    .limit(1)
    .neq("status", 2)
    .order("created_at", { ascending: false })
    .maybeSingle();

  const { data: completedTasks = [] } = await supabaseClient
    .from("Task")
    .select("URI,nftId,approved,status,metadata,xHandle,creatEventId(id,hash),address,helpPics")
    .eq("xHandle", user.xUserName!)
    .eq("status", 2) // Add status check (= 2)
    .order("created_at", { ascending: false })

  return NextResponse.json(
    {
      code: 0,
      data: {
        name: user.xName,
        avatar: user.xAvatar,
        handle: user.xUserName,
        created_at: user.created_at,
        task,
        completedTasks,
        admin: BROCCOLI_ADMIN_WHITELIST.includes(user.xUserName!)
      },
    },
    { status: 200 }
  );
}
