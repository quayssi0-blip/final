import { NextResponse } from "next/server";
import { DashboardController } from "../../../../lib/controllers/dashboard";

export async function GET(request) {
  try {
    const stats = await DashboardController.getStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
