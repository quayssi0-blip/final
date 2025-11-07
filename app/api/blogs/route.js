import { NextResponse } from "next/server";
import { BlogsController } from "../../../lib/controllers/blogs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      status: searchParams.get("status"),
      category: searchParams.get("category"),
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit"))
        : null,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset"))
        : 0,
    };

    const result = await BlogsController.getAllBlogs(queryParams);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching blogs:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const blog = await BlogsController.createBlog(user, body);
    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    console.error("Error creating blog:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
