// app/api/tasks/[id]/route.ts
import { userAuth } from "@/shared/server/auth";
import { supabaseClient } from "@/shared/supabase";
import { obfuscateEmail } from "@/shared/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const { user } = await userAuth(false);

    // Get task with creator info
    const { data: task, error } = await supabaseClient
      .from("Task")
      .select(
        `
        *
      `
      )
      .eq("nftId", Number(id))
      .single();

    if (error) {
      console.error("Error fetching task:", error);
      return NextResponse.json(
        { error: "Failed to fetch task" },
        { status: 500 }
      );
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isVoteEnabled =
      !!task.vote_start_date &&
      Date.now() >= new Date(task.vote_start_date).getTime();

    const isVoteEnded =
      new Date(task.vote_end_date || "0").getTime() <= Date.now();

    const voteLeftTime = Math.max(
      0,
      new Date(task.vote_end_date || "0").getTime() - Date.now()
    );

    const obfuscatedEmail = task.email ? obfuscateEmail(task.email) : '';

    const isAuthor = !!user && user.email === task.email;

    return NextResponse.json({
      code: 0,
      data: {
        ...task,
        email: isAuthor ? task.email : obfuscatedEmail,
        isAuthor,
        isVoteEnabled,
        isVoteEnded,
        voteLeftTime,
        // voteLeftTime: 0,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
