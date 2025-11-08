import { NextResponse } from "next/server";
import { BlogCommentsController } from "../../../../../lib/controllers/blogComments";
import supabaseServer from "../../../../../lib/supabaseServer";

export async function POST(request, { params }) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const result = await BlogCommentsController.approveComment(user, id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error approving comment:", err.message);
    if (err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}