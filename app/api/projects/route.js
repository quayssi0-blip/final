import { NextResponse } from "next/server";
import { ProjectsController } from "../../../lib/controllers/projects";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function GET(request) {
  try {
    console.log("GET /api/projects - Request received");
    const projects = await ProjectsController.getAllProjects();
    console.log("GET /api/projects - Success, returning", projects?.length || 0, "projects");
    return NextResponse.json(projects);
  } catch (err) {
    console.error("GET /api/projects - Error:", err.message);
    console.error("GET /api/projects - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("POST /api/projects - Request received");
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();
    console.log("POST /api/projects - Auth check:", { user: user?.id, authError });

    if (authError || !user) {
      console.log("POST /api/projects - Unauthorized:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("POST /api/projects - Request body keys:", Object.keys(body));
    const project = await ProjectsController.createProject(user, body);
    console.log("POST /api/projects - Success, created project:", project?.id);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects - Error:", err.message);
    console.error("POST /api/projects - Stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
