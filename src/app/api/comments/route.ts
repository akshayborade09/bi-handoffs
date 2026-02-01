import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/comments?pageId=home&resolved=false
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get("pageId");
    const resolved = searchParams.get("resolved");

    if (!pageId) {
      return NextResponse.json({ error: "pageId is required" }, { status: 400 });
    }

    let query = supabaseAdmin
      .from("comments")
      .select("*")
      .eq("page_id", pageId)
      .order("created_at", { ascending: false });

    // Filter by resolved status if provided
    if (resolved !== null) {
      query = query.eq("resolved", resolved === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments: data || [] });
  } catch (error) {
    console.error("Error in GET /api/comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pageId, positionX, positionY, content } = body;

    if (!pageId || positionX === undefined || positionY === undefined || !content) {
      return NextResponse.json(
        { error: "Missing required fields: pageId, positionX, positionY, content" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert({
        user_id: session.user.id,
        user_name: session.user.name || "Unknown",
        user_email: session.user.email || "",
        user_image: session.user.image || null,
        page_id: pageId,
        position_x: positionX,
        position_y: positionY,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating comment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
