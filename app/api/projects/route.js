import { NextResponse } from "next/server";
import { ProjectsController } from "../../../lib/controllers/projects";

export async function GET(request) {
  try {
    const projects = await ProjectsController.getAllProjects();
    return NextResponse.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
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
    const project = await ProjectsController.createProject(user, body);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("Error creating project:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
