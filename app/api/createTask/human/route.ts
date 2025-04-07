import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { createTask } from "@/shared/server/chain";
import { isBeta, TOKEN_NAME } from "@/shared/constant";
import { verify } from "@/shared/server/jwt";
import {
  nftMetaDataToHelpRequest,
  nftMetaDataToHelpRequest2,
} from "@/shared/task";
import { NFTMetaData2 } from "@/shared/types/help";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { tokenURI, pics = [] } = await req.json();

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

    const metadata: NFTMetaData2 = await fetch(tokenURI).then((res) =>
      res.json()
    );

    const transData = nftMetaDataToHelpRequest2(metadata);

    if (user.xUserName !== transData.organization.contact.twitter) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unaothorized: name not match",
        },
        {
          status: 401,
        }
      );
    }

    const address = transData.request.address;

    const { data: existingTask, error: queryError } = await supabaseClient
      .from("Task")
      .select("*")
      .eq("xHandle", user.xUserName)
      .neq("status", 2) // Add status check (!= 2)
      .limit(1)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (queryError && queryError.code !== "PGRST116") {
      console.error("Error checking existing task:", queryError);
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to check existing task",
        },
        { status: 500 }
      );
    }

    if (existingTask) {
      return NextResponse.json(
        {
          code: 400,
          message: "Task already in progress",
        },
        { status: 400 }
      );
    }

    const hash = await createTask(tokenURI);

    const { data: event } = await supabaseClient
      .from("Event")
      .select("*")
      .eq("hash", hash)
      .single();

    console.log('--- event', event);
    const { tokenId } = JSON.parse(event?.data ?? "") as { tokenId: number };
    await supabaseClient
      .from("Task")
      .update({
        helpPics: pics,
      })
      .eq("nftId", tokenId);
    // await syncData();

    return NextResponse.json({
      code: 0,
      data: {
        hash,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        code: 500,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
