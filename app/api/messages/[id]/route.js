import { NextResponse } from "next/server";
import supabaseServer from "../../../../lib/supabaseServer";
import { MessagesController } from "../../../../lib/controllers/messages-fixed";

export async function GET(request, { params }) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const message = await MessagesController.getMessageById(user, id);
    return NextResponse.json(message);
  } catch (err) {
    console.error("Error fetching message:", err.message);
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
    const message = await MessagesController.updateMessage(user, id, body);
    return NextResponse.json(message);
  } catch (err) {
    console.error("Error updating message:", err.message);
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
    const result = await MessagesController.deleteMessage(user, id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error deleting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
