// app/api/tasks/[id]/route.ts
import { supabaseClient } from "@/shared/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    // Get proof with creator info
    const { data: proofs, error } = await supabaseClient
      .from("Proof")
      .select(
        `
        *
      `
      )
      .eq("nftId", Number(id))
      .order("eventId", { ascending: false })

    if (error) {
      console.error("Error fetching Proof:", error);
      return NextResponse.json(
        { error: "Failed to fetch Proof" },
        { status: 500 }
      );
    }

    if (!proofs) {
      return NextResponse.json({ error: "Proof not found" }, { status: 404 });
    }

    return NextResponse.json({
      code: 0,
      data: proofs,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
