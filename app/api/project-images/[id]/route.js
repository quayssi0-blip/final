import { NextResponse } from "next/server";
import { ProjectImagesController } from "../../../../lib/controllers/projectImages";
import supabaseServer from "../../../../lib/supabaseServer";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const image = await ProjectImagesController.getProjectImageById(id);
    return NextResponse.json(image);
  } catch (err) {
    console.error("Error fetching project image:", err.message);
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
    const image = await ProjectImagesController.updateProjectImage(
      user,
      id,
      body,
    );
    return NextResponse.json(image);
  } catch (err) {
    console.error("Error updating project image:", err.message);
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
    const result = await ProjectImagesController.deleteProjectImage(user, id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error deleting project image:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
