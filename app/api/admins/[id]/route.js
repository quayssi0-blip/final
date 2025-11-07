import { NextResponse } from "next/server";
import { AdminsController } from "../../../../lib/controllers/admins";

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
    const admin = await AdminsController.getAdminById(user, id);
    return NextResponse.json(admin);
  } catch (err) {
    console.error("Error fetching admin:", err.message);
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
    const admin = await AdminsController.updateAdmin(user, id, body);
    return NextResponse.json(admin);
  } catch (err) {
    console.error("Error updating admin:", err.message);
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
    const result = await AdminsController.deleteAdmin(user, id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error deleting admin:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
