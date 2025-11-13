import { NextResponse } from "next/server";
import { AuthController } from "../../../../lib/controllers/auth";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET(request) {
  try {
    console.log("DEBUG: /api/auth/me - Request received");
    console.log("DEBUG: Cookies present:", !!request.cookies?.getAll?.().length);
    console.log("DEBUG: Authorization header:", !!request.headers.get("authorization"));

    // Get user from server session (cookies are handled automatically by Supabase)
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    console.log("DEBUG: supabaseServer.auth.getUser result:");
    console.log("DEBUG: - user:", !!user, user?.id);
    console.log("DEBUG: - authError:", authError?.message);

    if (authError || !user) {
      console.log("DEBUG: No user or auth error, returning 401");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("DEBUG: User found, calling AuthController.getCurrentUser");
    const result = await AuthController.getCurrentUser(user);
    console.log("DEBUG: AuthController.getCurrentUser successful, returning result");
    return NextResponse.json(result);
  } catch (err) {
    console.error("DEBUG: Error fetching current user:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
