import { NextResponse } from "next/server";
import { AuthController } from "../../../../lib/controllers/auth";

export async function POST(request) {
  try {
    console.log("Logout API route called");
    const result = await AuthController.logout();
    console.log("Logout API route successful:", result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error logging out:", err.message);
    console.error("Error stack:", err.stack);
    return NextResponse.json(
      {
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
