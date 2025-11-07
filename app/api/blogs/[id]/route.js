import { NextResponse } from "next/server";
import { BlogsController } from "../../../../lib/controllers/blogs";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const blog = await BlogsController.getBlogById(id);
    return NextResponse.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err.message);
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes("not found") ? 404 : 500 },
    );
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
    const blog = await BlogsController.updateBlog(user, id, body);
    return NextResponse.json(blog);
  } catch (err) {
    console.error("Error updating blog:", err.message);
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
    const result = await BlogsController.deleteBlog(user, id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error deleting blog:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
