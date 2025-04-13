import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { verify } from "@/shared/server/jwt";
import {
  BROCCOLI_ADMIN_WHITELIST,
  isBeta,
  PRIVY_TOKEN_NAME,
} from "@/shared/constant";
import {
  getPrivyUserInfoByUserId,
  verifyPrivyAccessToken,
} from "@/shared/server/privy";

export const dynamic = "force-dynamic"; // defaults to auto
export const revalidate = 0;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(PRIVY_TOKEN_NAME)?.value;
  const privyUserId = await verifyPrivyAccessToken(token!);
  console.log("userId", privyUserId, "token", token);

  if (!privyUserId) {
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

  let user;
  const { data: user1 } = await supabaseClient
    .from("PrivyUser")
    .select("*")
    .eq("userId", privyUserId)
    .single();

  if (!user) {
    const privyUser = await getPrivyUserInfoByUserId(privyUserId);
    if (!privyUser) {
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

    await supabaseClient.from("PrivyUser").upsert(
      {
        userId: privyUserId,
        email: privyUser.email?.address,
        firstVerifiedAt: privyUser.email?.firstVerifiedAt,
        latestVerifiedAt: privyUser.email?.latestVerifiedAt,
      },
      {
        onConflict: ["userId"],
      }
    );

    const { data: user2 } = await supabaseClient
      .from("PrivyUser")
      .select("*")
      .eq("userId", privyUserId)
      .single();

    user = user2;
  } else {
    user = user1;
  }

  console.log(
    "--- user",
    user,
    "privyUserId",
    privyUserId,
    "privy user",
    await getPrivyUserInfoByUserId(privyUserId!)
  );

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
    .select(
      "URI,nftId,approved,status,metadata,xHandle,creatEventId(id,hash),address,helpPics"
    )
    .eq("email", user.email!)
    .limit(1)
    .neq("status", 2)
    .order("created_at", { ascending: false })
    .maybeSingle();

  const { data: completedTasks = [] } = await supabaseClient
    .from("Task")
    .select(
      "URI,nftId,approved,status,metadata,xHandle,creatEventId(id,hash),address,helpPics"
    )
    .eq("email", user.email!)
    .eq("status", 2) // Add status check (= 2)
    .order("created_at", { ascending: false });

  return NextResponse.json(
    {
      code: 0,
      data: {
        email: user.email,
        created_at: user.created_at,
        task,
        completedTasks,
        admin: BROCCOLI_ADMIN_WHITELIST.includes(user.email!),
      },
    },
    { status: 200 }
  );
}
