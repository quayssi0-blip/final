import { NextResponse } from "next/server";
import { ProjectImagesController } from "../../../lib/controllers/projectImages";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let images;
    if (projectId) {
      // Get images for a specific project
      images = await ProjectImagesController.getProjectImages(projectId);
    } else {
      // Get all project images with project info
      images = await ProjectImagesController.getAllProjectImages();
    }

    return NextResponse.json(images);
  } catch (err) {
    console.error("Error fetching project images:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
