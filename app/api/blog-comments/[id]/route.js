import { NextResponse } from "next/server";
import { BlogCommentsController } from "../../../../lib/controllers/blogComments";
import supabaseServer from "../../../../lib/supabaseServer";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await BlogCommentsController.getCommentById(id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching comment:", err.message);
    if (err.message === "Comment not found") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const result = await BlogCommentsController.updateComment(user, id, body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error updating comment:", err.message);
    if (err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const result = await BlogCommentsController.deleteComment(user, id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    if (err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}