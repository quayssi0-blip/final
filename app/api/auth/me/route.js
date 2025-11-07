import { NextResponse } from "next/server";
import { AuthController } from "../../../../lib/controllers/auth";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const result = await AuthController.getCurrentUser(user);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching current user:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
