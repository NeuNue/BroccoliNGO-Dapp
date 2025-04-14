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
import { userAuth } from "@/shared/server/auth";

export const dynamic = "force-dynamic"; // defaults to auto
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    let { user, privyUserId } = await userAuth();

    if (!user) {
      const privyUser = await getPrivyUserInfoByUserId(privyUserId);
      if (!privyUser) {
        throw new Error("Unauthenticated", {
          cause: { code: 401 },
        });
      }

      user = (
        await supabaseClient
          .from("PrivyUser")
          .upsert(
            {
              userId: privyUserId,
              email: privyUser.email?.address,
              firstVerifiedAt: privyUser.email?.firstVerifiedAt?.toISOString(),
              latestVerifiedAt:
                privyUser.email?.latestVerifiedAt?.toISOString(),
            },
            {
              onConflict: "userId",
            }
          )
          .select("*")
          .single()
      ).data;
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
      throw new Error("Unauthenticated", {
        cause: { code: 401 },
      });
    }

    const { data: task } = await supabaseClient
      .from("Task")
      .select(
        "URI,nftId,approved,status,metadata,email,creatEventId(id,hash),address,helpPics"
      )
      .eq("email", user.email!)
      .limit(1)
      .neq("status", 2)
      .order("created_at", { ascending: false })
      .maybeSingle();

    const { data: completedTasks = [] } = await supabaseClient
      .from("Task")
      .select(
        "URI,nftId,approved,status,metadata,email,creatEventId(id,hash),address,helpPics"
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
  } catch (err: any) {
    return NextResponse.json(
      {
        code: err?.cause?.code || 500,
        message: err.message || "Internal Server Error",
      },
      { status: err?.cause?.code || 500 }
    );
  }
}
