import { NextResponse } from "next/server";
import { DashboardController } from "../../../../lib/controllers/dashboard";

export async function GET(request) {
  try {
    const activities = await DashboardController.getRecentActivity();
    return NextResponse.json({ activities });
  } catch (err) {
    console.error("Error fetching dashboard activity:", err.message);
    return NextResponse.json({ error: err.message, activities: [] }, { status: 200 });
  }
}