import { NextResponse } from "next/server";
import { ProjectsController } from "../../../../../lib/controllers/projects";

export async function POST(request, { params }) {
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
    const image = await ProjectsController.addProjectImage(user, id, body);
    return NextResponse.json(image, { status: 201 });
  } catch (err) {
    console.error("Error adding project image:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
