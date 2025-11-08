import supabaseServer from "../supabaseServer";

export class UploadController {
  static async uploadImage(user, file, uploadData) {
    // Check authorization
    const { data: adminData, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      roleError ||
      !["super_admin", "content_manager"].includes(adminData?.role)
    ) {
      throw new Error("Forbidden");
    }

    const { type, projectId, altText = "" } = uploadData;

    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }

    // Validate upload type
    if (!type || !["project-main", "project-gallery", "blog"].includes(type)) {
      throw new Error(
        "Invalid upload type. Must be project-main, project-gallery, or blog.",
      );
    }

    // Validate projectId for project uploads
    if ((type === "project-main" || type === "project-gallery") && !projectId) {
      // For new projects (project-main only), allow temporary upload
      if (type === "project-gallery") {
        throw new Error("Project ID is required for project gallery uploads");
      }
      // project-main without projectId means it's a new project
    }

    // Generate unique filename and determine bucket/folder
    const fileExt = file.name.split(".").pop();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const fileName = `${uniqueId}.${fileExt}`;

    // Determine bucket and path based on type
    let bucketName, filePath;
    if (type === "blog") {
      bucketName = "blogs";
      filePath = fileName; // blogs bucket has flat structure
    } else if (type === "project-main" || type === "project-gallery") {
      bucketName = "projects";
      if (projectId) {
        filePath = `${projectId}/${fileName}`; // projects bucket has project folders
      } else {
        filePath = `temp/${fileName}`; // temporary folder for new projects
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage with specific bucket and path
    const { data: uploadedData, error: uploadError } =
      await supabaseServer.storage.from(bucketName).upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error("Failed to upload file");
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseServer.storage.from(bucketName).getPublicUrl(filePath);

    let result = {
      url: publicUrl,
      path: uploadedData.path,
      fileName: filePath, // Return the full path including project folder
      bucket: bucketName,
    };

    // Handle different upload types
    if (type === "project-gallery") {
      // Store in project_images table
      const { data: galleryImage, error: galleryError } = await supabaseServer
        .from("project_images")
        .insert({
          project_id: projectId,
          image_url: publicUrl,
          alt_text: altText,
        })
        .select()
        .single();

      if (galleryError) {
        console.error("Error saving gallery image:", galleryError);
        // Don't fail the upload, but log the error
        result.galleryError = "Failed to save to gallery";
      } else {
        result.galleryImage = galleryImage;
      }
    }

    return result;
  }
}
