import { supabaseClient } from "@/shared/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    // Get proof with creator info
    const { data: fundRecords, error } = await supabaseClient
      .from("Fund")
      .select(
        `
        *
      `
      )
      .eq("nftId", Number(id))
      .order("eventId", { ascending: false });

    if (error) {
      console.error("Error fetching fundRecords:", error);
      return NextResponse.json(
        { error: "Failed to fetch fundRecords" },
        { status: 500 }
      );
    }

    if (!fundRecords) {
      return NextResponse.json(
        { error: "fundRecords not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      data: fundRecords,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
