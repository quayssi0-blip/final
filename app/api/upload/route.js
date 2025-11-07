import { NextResponse } from "next/server";
import { UploadController } from "../../../lib/controllers/upload";

export async function POST(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type");
    const projectId = formData.get("projectId");
    const altText = formData.get("altText") || "";

    const uploadData = { type, projectId, altText };
    const result = await UploadController.uploadImage(user, file, uploadData);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error uploading image:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
