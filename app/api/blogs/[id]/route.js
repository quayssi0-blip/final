import { NextResponse } from "next/server";
import { BlogsController } from "../../../../lib/controllers/blogs";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("GET /api/blogs/[id] - Request for blog:", id);
    const blog = await BlogsController.getBlogById(id);
    console.log("GET /api/blogs/[id] - Success for blog:", id);
    return NextResponse.json(blog);
  } catch (err) {
    console.error("GET /api/blogs/[id] - Error for blog", id, ":", err.message);
    console.error("GET /api/blogs/[id] - Stack:", err.stack);
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes("not found") ? 404 : 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log("PUT /api/blogs/[id] - Update request for blog:", id);
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();
    console.log("PUT /api/blogs/[id] - Auth check for blog", id, ":", { user: user?.id, authError });

    if (authError || !user) {
      console.log("PUT /api/blogs/[id] - Unauthorized for blog", id, ":", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("PUT /api/blogs/[id] - Request body keys for blog", id, ":", Object.keys(body));
    const blog = await BlogsController.updateBlog(user, id, body);
    console.log("PUT /api/blogs/[id] - Success updating blog:", id);
    return NextResponse.json(blog);
  } catch (err) {
    console.error("PUT /api/blogs/[id] - Error updating blog", params.id, ":", err.message);
    console.error("PUT /api/blogs/[id] - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log("DELETE /api/blogs/[id] - Delete request for blog:", id);
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();
    console.log("DELETE /api/blogs/[id] - Auth check for blog", id, ":", { user: user?.id, authError });

    if (authError || !user) {
      console.log("DELETE /api/blogs/[id] - Unauthorized for blog", id, ":", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await BlogsController.deleteBlog(user, id);
    console.log("DELETE /api/blogs/[id] - Success deleting blog:", id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE /api/blogs/[id] - Error deleting blog", params.id, ":", err.message);
    console.error("DELETE /api/blogs/[id] - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
