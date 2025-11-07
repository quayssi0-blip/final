import { NextResponse } from "next/server";
import { BlogsController } from "../../../../../lib/controllers/blogs";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const result = await BlogsController.incrementBlogViews(id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error updating blog views:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
