// import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import Client from "twitter-api-sdk";
import { generateAuthClient } from "@/shared/server/twitter";
import { supabaseClient } from "@/shared/supabase";
import {
  HOST,
  TOKEN_NAME,
  TWITTER_CODE_CHALLENGE,
} from "@/shared/constant";
import { sign } from "@/shared/server/jwt";

export const dynamic = "force-dynamic"; // defaults to auto
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") as string;
  const referral_from = searchParams.get("state") as string;
  const error = searchParams.get("error") as string;

  if (error) {
    return NextResponse.json({
      code: 402,
      message: error,
    });
  }

  try {
    const authClient = generateAuthClient();

    authClient.generateAuthURL({
      state: referral_from,
      code_challenge_method: "plain",
      code_challenge: TWITTER_CODE_CHALLENGE,
    });
    const res = await authClient.requestAccessToken(code);

    const twitterClient = new Client(authClient);

    const twitterUser = await twitterClient.users.findMyUser({
      "user.fields": ["id", "name", "username", "profile_image_url"] as any,
    });

    if (!twitterUser.data) {
      return NextResponse.json({
        code: 401,
        message: "Failed to get twitter user info",
      });
    }

    const { id, name, username, profile_image_url } = twitterUser.data;

    await supabaseClient.from("User").upsert(
      {
        xUid: id,
        xName: name,
        xUserName: username,
        xAvatar: profile_image_url,
        xAccessToken: res.token.access_token,
        xRefreshToken: res.token.refresh_token,
        xTokenExpire: res.token.expires_at,
      },
      {
        onConflict: "xUid",
      }
    );

    const token = sign({ id });
    const cookieStore = await cookies();
    cookieStore.set({
      name: TOKEN_NAME,
      value: token,
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      secure: true,
      sameSite: "lax",
      httpOnly: true,
    });

    return NextResponse.redirect(HOST + referral_from || "/");
  } catch (err: any) {
    console.log(err, err.headers, err.error);
    return NextResponse.json(
      {
        code: err.status,
        message: err.statusText || err?.message || "authorize failed",
      },
      {
        status: 500,
      }
    );
  }
}
