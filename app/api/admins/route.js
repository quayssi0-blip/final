import { NextResponse } from "next/server";
import { AdminsController } from "../../../lib/controllers/admins";
import supabaseServer from "../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await AdminsController.getAllAdmins(user);
    return NextResponse.json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err.message);
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
    const admin = await AdminsController.createAdmin(user, body);
    return NextResponse.json(admin, { status: 201 });
  } catch (err) {
    console.error("Error creating admin:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
