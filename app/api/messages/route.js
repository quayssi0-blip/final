import { NextResponse } from "next/server";
import supabaseServer from "../../../lib/supabaseServer";
import { MessagesController } from "../../../lib/controllers/messages-fixed";

export async function GET(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = {
      status: searchParams.get("status"),
      type: searchParams.get("type"),
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit"))
        : null,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset"))
        : 0,
    };

    const result = await MessagesController.getAllMessages(user, queryParams);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = await MessagesController.createMessage(body);
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("Error creating message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
