import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseClient } from "@/shared/supabase";
import { createTask } from "@/shared/server/chain";
import { isBeta, TOKEN_NAME } from "@/shared/constant";
import { verify } from "@/shared/server/jwt";
import {
  HelpRequest,
  NFTMetaData,
  RescueNFTMetaData,
} from "@/shared/types/rescue";
import {
  nftMetaDataToHelpRequest,
  NFTMetaDataToRescueRequestForms,
} from "@/shared/task";
import { userAuth } from "@/shared/server/auth";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { tokenURI } = await req.json();

    const { user } = await userAuth();

    if (!user) {
      throw new Error("Unauthenticated", {
        cause: { code: 401 },
      });
    }

    const metadata: RescueNFTMetaData = await fetch(tokenURI).then((res) =>
      res.json()
    );

    const { contactForm, backgroundForm, requestForm, request } =
      NFTMetaDataToRescueRequestForms(metadata);

    if (user.email !== contactForm.email) {
      throw new Error("Forbidden", {
        cause: { code: 403 },
      });
    }

    const { data: existingTask, error: queryError } = await supabaseClient
      .from("Task")
      .select("*")
      .eq("email", user.email)
      .neq("status", 2) // Add status check (!= 2)
      .limit(1)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (queryError && queryError.code !== "PGRST116") {
      console.error("Error checking existing task:", queryError);
      throw new Error("Failed to check existing task", {
        cause: { code: 500 },
      });
    }

    if (existingTask) {
      throw new Error("Task already in progress", {
        cause: { code: 400 },
      });
    }

    const hash = await createTask(tokenURI);
    // await syncData();

    return NextResponse.json({
      code: 0,
      data: {
        hash,
      },
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
