import { NextResponse } from "next/server";
import { BlogCommentsController } from "../../../lib/controllers/blogComments";
import supabaseServer from "../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      blogId: searchParams.get("blog_id"),
      approved: searchParams.get("approved") ? searchParams.get("approved") === "true" : undefined,
      published: searchParams.get("published") ? searchParams.get("published") === "true" : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")) : null,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")) : 0,
    };

    const result = await BlogCommentsController.getAllComments(queryParams);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Les commentaires peuvent être créés par des utilisateurs non authentifiés
    const body = await request.json();
    const result = await BlogCommentsController.createComment(null, body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Error creating comment:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}