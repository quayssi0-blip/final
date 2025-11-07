import supabaseServer from "../supabaseServer";

export class BlogsController {
  static async getAllBlogs(queryParams = {}) {
    const { status, category, limit, offset = 0 } = queryParams;

    let query = supabaseServer
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        category,
        status,
        share_on_social,
        views,
        image,
        created_at,
        updated_at,
        published_at
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data: blogs, error, count } = await query;

    if (error) {
      throw new Error("Failed to fetch blogs");
    }

    return { blogs, total: count };
  }

  static async getBlogById(id) {
    const { data: blog, error } = await supabaseServer
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        category,
        status,
        share_on_social,
        views,
        image,
        created_at,
        updated_at,
        published_at
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Blog post not found");
      }
      throw new Error("Failed to fetch blog post");
    }

    return blog;
  }

  static async createBlog(user, blogData) {
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
      title,
      slug,
      excerpt,
      content,
      category,
      status,
      share_on_social,
      image,
    } = blogData;

    if (!title || !slug || !excerpt || !content || !category) {
      throw new Error(
        "Title, slug, excerpt, content, and category are required",
      );
    }

    const publishedAt =
      status === "published" ? new Date().toISOString() : null;

    const { data: blog, error } = await supabaseServer
      .from("blog_posts")
      .insert({
        title,
        slug,
        excerpt,
        content,
        category,
        status: status || "draft",
        share_on_social: share_on_social || false,
        image,
        published_at: publishedAt,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to create blog post");
    }

    return blog;
  }

  static async updateBlog(user, id, blogData) {
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
      title,
      slug,
      excerpt,
      content,
      category,
      status,
      share_on_social,
      image,
    } = blogData;

    if (!title || !slug || !excerpt || !content || !category) {
      throw new Error(
        "Title, slug, excerpt, content, and category are required",
      );
    }

    const updateData = {
      title,
      slug,
      excerpt,
      content,
      category,
      status: status || "draft",
      share_on_social: share_on_social || false,
      image,
      updated_at: new Date().toISOString(),
    };

    // If publishing for the first time, set published_at
    if (status === "published") {
      const { data: existingBlog } = await supabaseServer
        .from("blog_posts")
        .select("published_at")
        .eq("id", id)
        .single();

      if (!existingBlog?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data: blog, error } = await supabaseServer
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to update blog post");
    }

    return blog;
  }

  static async deleteBlog(user, id) {
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
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error("Failed to delete blog post");
    }

    return { message: "Blog post deleted successfully" };
  }

  static async incrementBlogViews(id) {
    const { data: blog, error } = await supabaseServer
      .from("blog_posts")
      .update({
        views: supabaseServer.raw("views + 1"),
      })
      .eq("id", id)
      .select("views")
      .single();

    if (error) {
      throw new Error("Failed to update views");
    }

    return { views: blog.views };
  }
}
