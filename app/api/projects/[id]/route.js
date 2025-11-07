import { NextResponse } from "next/server";
import { ProjectsController } from "../../../../lib/controllers/projects";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const project = await ProjectsController.getProjectById(id);
    return NextResponse.json(project);
  } catch (err) {
    console.error("Error fetching project:", err.message);
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
    const project = await ProjectsController.updateProject(user, id, body);
    return NextResponse.json(project);
  } catch (err) {
    console.error("Error updating project:", err.message);
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
    const result = await ProjectsController.deleteProject(user, id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error deleting project:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
