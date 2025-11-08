import { NextResponse } from "next/server";
import supabaseServer from "../../../lib/supabaseServer";
import { AuthController } from "../../../lib/controllers/auth";
import { UploadController } from "../../../lib/controllers/upload";

export async function POST(request) {
  try {
    console.log("Upload route called");
    
    // Get user using the same approach as /api/auth/me
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      console.log("Authentication failed:", authError?.message);
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Now get current user data with role
    const authResult = await AuthController.getCurrentUser(user);
    if (!authResult || !authResult.user) {
      console.log("User is not an admin");
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log("User authenticated:", authResult.user.email, "Role:", authResult.user.role);
    
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type");
    const projectId = formData.get("projectId");
    const altText = formData.get("altText") || "";

    console.log("Upload data:", { type, projectId, fileName: file?.name });

    const uploadData = { type, projectId, altText };
    const result = await UploadController.uploadImage(authResult.user, file, uploadData);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error uploading image:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
