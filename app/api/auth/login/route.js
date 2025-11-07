import { NextResponse } from "next/server";
import { AuthController } from "../../../../lib/controllers/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Login attempt for email:", body.email);

    const result = await AuthController.login(body);
    console.log("Login successful for user:", result.user?.email);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Login error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
