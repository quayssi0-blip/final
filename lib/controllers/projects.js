import supabaseServer from "../supabaseServer";

export class ProjectsController {
  static async getAllProjects() {
    const { data: projects, error } = await supabaseServer
      .from("projects")
      .select(`
        id,
        slug,
        title,
        excerpt,
        image,
        categories,
        start_date,
        location,
        people_helped,
        status,
        content,
        goals,
        created_at,
        updated_at,
        project_images (
          id,
          image_url,
          alt_text
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch projects");
    }

    return projects;
  }

  static async getProjectById(id) {
    const { data: project, error } = await supabaseServer
      .from("projects")
      .select(`
        id,
        slug,
        title,
        excerpt,
        image,
        categories,
        start_date,
        location,
        people_helped,
        status,
        content,
        goals,
        created_at,
        updated_at,
        project_images (
          id,
          image_url,
          alt_text
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Project not found");
      }
      throw new Error("Failed to fetch project");
    }

    return project;
  }

  static async getProjectBySlug(slug) {
    const { data: project, error } = await supabaseServer
      .from("projects")
      .select(`
        id,
        slug,
        title,
        excerpt,
        image,
        categories,
        start_date,
        location,
        people_helped,
        status,
        content,
        goals,
        created_at,
        updated_at,
        project_images (
          id,
          image_url,
          alt_text
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Return null instead of throwing for not found
      }
      throw new Error("Failed to fetch project");
    }

    // Transform project_images to gallery format for compatibility
    if (project.project_images) {
      project.gallery = project.project_images.map((img) => img.image_url);
    }

    return project;
  }

  static async createProject(user, projectData) {
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

    const {
      slug,
      title,
      excerpt,
      image,
      categories,
      start_date,
      location,
      people_helped,
      status,
      content,
      goals,
    } = projectData;

    if (!title || !slug) {
      throw new Error("Title and slug are required");
    }

    const { data: project, error } = await supabaseServer
      .from("projects")
      .insert({
        slug,
        title,
        excerpt,
        image,
        categories: categories || [],
        start_date,
        location,
        people_helped,
        status: status || "Actif",
        content: content || [],
        goals: goals || [],
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to create project");
    }

    return project;
  }

  static async updateProject(user, id, projectData) {
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

    const {
      slug,
      title,
      excerpt,
      image,
      categories,
      start_date,
      location,
      people_helped,
      status,
      content,
      goals,
    } = projectData;

    if (!title || !slug) {
      throw new Error("Title and slug are required");
    }

    const { data: project, error } = await supabaseServer
      .from("projects")
      .update({
        slug,
        title,
        excerpt,
        image,
        categories: categories || [],
        start_date,
        location,
        people_helped,
        status: status || "Actif",
        content: content || [],
        goals: goals || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to update project");
    }

    return project;
  }

  static async deleteProject(user, id) {
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
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error("Failed to delete project");
    }

    return { message: "Project deleted successfully" };
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
      .select()
      .single();

    if (error) {
      throw new Error("Failed to add image");
    }

    return image;
  }
}
