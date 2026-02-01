import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// PATCH /api/comments/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resolved, content, position_x, position_y } = body;
    
    // Handle both old and new Next.js param formats
    const resolvedParams = params instanceof Promise ? await params : params;
    const commentId = resolvedParams.id;
    
    console.log("PATCH /api/comments/:id called with:", { commentId, resolved, content, position_x, position_y });

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (resolved !== undefined) {
      updates.resolved = resolved;
      if (resolved) {
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = session.user.email || session.user.name || "Unknown";
      } else {
        updates.resolved_at = null;
        updates.resolved_by = null;
      }
    }

    if (content !== undefined) {
      const trimmedContent = content.trim();
      if (trimmedContent.length === 0) {
        return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
      }
      updates.content = trimmedContent;
    }

    if (position_x !== undefined && !isNaN(position_x)) {
      updates.position_x = Math.round(position_x);
    }

    if (position_y !== undefined && !isNaN(position_y)) {
      updates.position_y = Math.round(position_y);
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not configured" }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .update(updates)
      .eq("id", commentId)
      .select()
      .single();

    if (error) {
      console.error("Error updating comment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data });
  } catch (error) {
    console.error("Error in PATCH /api/comments/:id:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
