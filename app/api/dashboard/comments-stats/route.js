import { NextResponse } from "next/server";
import { BlogCommentsController } from "../../../../lib/controllers/blogComments";
import supabaseServer from "../../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vérifier l'autorisation admin
    const { data: adminData, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      roleError ||
      !["super_admin", "content_manager"].includes(adminData?.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blog_id");

    const stats = await BlogCommentsController.getCommentStats(user, blogId);
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Error fetching comment stats:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}