import supabaseServer from "../supabaseServer";

export class ProjectImagesController {
  static async getProjectImages(projectId) {
    const { data: images, error } = await supabaseServer
      .from("project_images")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error("Failed to fetch project images");
    }

    return images;
  }

  static async getAllProjectImages() {
    const { data: images, error } = await supabaseServer
      .from("project_images")
      .select(`
        *,
        projects (
          id,
          title,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch project images");
    }

    return images;
  }

  static async getProjectImageById(imageId) {
    const { data: image, error } = await supabaseServer
      .from("project_images")
      .select(`
        *,
        projects (
          id,
          title,
          slug
        )
      `)
      .eq("id", imageId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Project image not found");
      }
      throw new Error("Failed to fetch project image");
    }

    return image;
  }

  static async addProjectImage(user, projectId, imageData) {
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

    const { image_url, alt_text } = imageData;

    if (!image_url) {
      throw new Error("Image URL is required");
    }

    const { data: image, error } = await supabaseServer
      .from("project_images")
      .insert({
        project_id: projectId,
        image_url,
        alt_text: alt_text || "",
      })
      .select(`
        *,
        projects (
          id,
          title,
          slug
        )
      `)
      .single();

    if (error) {
      throw new Error("Failed to add project image");
    }

    return image;
  }

  static async updateProjectImage(user, imageId, updateData) {
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

    const { alt_text } = updateData;

    const { data: image, error } = await supabaseServer
      .from("project_images")
      .update({
        alt_text: alt_text || "",
      })
      .eq("id", imageId)
      .select(`
        *,
        projects (
          id,
          title,
          slug
        )
      `)
      .single();

    if (error) {
      throw new Error("Failed to update project image");
    }

    return image;
  }

  static async deleteProjectImage(user, imageId) {
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

    const { error } = await supabaseServer
      .from("project_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      throw new Error("Failed to delete project image");
    }

    return { message: "Project image deleted successfully" };
  }
}
