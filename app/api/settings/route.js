import { NextResponse } from "next/server";
import { SettingsController } from "../../../lib/controllers/settings";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const settings = await SettingsController.getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Error fetching settings:", err.message);
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
    const result = await SettingsController.updateSettings(user, body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error updating settings:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
