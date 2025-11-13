import { NextResponse } from "next/server";
import { ProjectsController } from "../../../../lib/controllers/projects";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("GET /api/projects/[id] - Request for project:", id);
    const project = await ProjectsController.getProjectById(id);
    console.log("GET /api/projects/[id] - Success for project:", id);
    return NextResponse.json(project);
  } catch (err) {
    console.error("GET /api/projects/[id] - Error for project", id, ":", err.message);
    console.error("GET /api/projects/[id] - Stack:", err.stack);
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes("not found") ? 404 : 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log("PUT /api/projects/[id] - Update request for project:", id);
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();
    console.log("PUT /api/projects/[id] - Auth check for project", id, ":", { user: user?.id, authError });

    if (authError || !user) {
      console.log("PUT /api/projects/[id] - Unauthorized for project", id, ":", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("PUT /api/projects/[id] - Request body keys for project", id, ":", Object.keys(body));
    const project = await ProjectsController.updateProject(user, id, body);
    console.log("PUT /api/projects/[id] - Success updating project:", id);
    return NextResponse.json(project);
  } catch (err) {
    console.error("PUT /api/projects/[id] - Error updating project", params.id, ":", err.message);
    console.error("PUT /api/projects/[id] - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log("DELETE /api/projects/[id] - Delete request for project:", id);
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();
    console.log("DELETE /api/projects/[id] - Auth check for project", id, ":", { user: user?.id, authError });

    if (authError || !user) {
      console.log("DELETE /api/projects/[id] - Unauthorized for project", id, ":", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await ProjectsController.deleteProject(user, id);
    console.log("DELETE /api/projects/[id] - Success deleting project:", id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE /api/projects/[id] - Error deleting project", params.id, ":", err.message);
    console.error("DELETE /api/projects/[id] - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
