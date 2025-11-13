import { NextResponse } from "next/server";
import { BlogsController } from "../../../lib/controllers/blogs";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET(request) {
  try {
    console.log("GET /api/blogs - Request received");
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
    console.log("GET /api/blogs - Query params:", queryParams);

    const result = await BlogsController.getAllBlogs(queryParams);
    console.log("GET /api/blogs - Success, returning", result?.length || 0, "blogs");
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/blogs - Error:", err.message);
    console.error("GET /api/blogs - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("POST /api/blogs - Request received");
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();
    console.log("POST /api/blogs - Auth check:", { user: user?.id, authError });

    if (authError || !user) {
      console.log("POST /api/blogs - Unauthorized:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("POST /api/blogs - Request body keys:", Object.keys(body));
    const blog = await BlogsController.createBlog(user, body);
    console.log("POST /api/blogs - Success, created blog:", blog?.id);
    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    console.error("POST /api/blogs - Error:", err.message);
    console.error("POST /api/blogs - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
