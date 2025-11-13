import supabaseServer from "../supabaseServer";

export class BlogCommentsController {
  /**
   * Récupère tous les commentaires avec filtrage optionnel
   * @param {Object} queryParams - Paramètres de requête
   * @param {string} queryParams.blogId - Filtrer par ID de blog
   * @param {boolean} queryParams.approved - Filtrer par statut d'approbation
   * @param {boolean} queryParams.published - Filtrer par statut de publication
   * @param {number} queryParams.limit - Limite de résultats
   * @param {number} queryParams.offset - Offset pour la pagination
   */
  static async getAllComments(queryParams = {}) {
    const { 
      blogId, 
      approved, 
      published, 
      limit, 
      offset = 0 
    } = queryParams;

    let query = supabaseServer
      .from("blog_comments")
      .select(`
        id,
        blog_id,
        name,
        email,
        message,
        is_approved,
        is_published,
        created_at,
        updated_at,
        blogs!inner (
          id,
          title,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    if (blogId) {
      query = query.eq("blog_id", blogId);
    }

    if (approved !== undefined) {
      query = query.eq("is_approved", approved);
    }

    if (published !== undefined) {
      query = query.eq("is_published", published);
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data: comments, error, count } = await query;

    if (error) {
      throw new Error("Failed to fetch comments");
    }

    return { comments, total: count };
  }

  /**
   * Récupère les commentaires publiés d'un blog spécifique
   * @param {string} blogId - ID du blog
   * @param {number} limit - Limite de résultats
   * @param {number} offset - Offset pour la pagination
   */
  static async getPublishedCommentsByBlog(blogId, limit = 10, offset = 0) {
    const { data: comments, error, count } = await supabaseServer
      .from("blog_comments")
      .select(`
        id,
        name,
        message,
        created_at,
        updated_at
      `)
      .eq("blog_id", blogId)
      .eq("is_approved", true)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Failed to fetch published comments");
    }

    return { comments, total: count };
  }

  /**
   * Récupère un commentaire par ID
   * @param {string} id - ID du commentaire
   */
  static async getCommentById(id) {
    const { data: comment, error } = await supabaseServer
      .from("blog_comments")
      .select(`
        id,
        blog_id,
        name,
        email,
        message,
        is_approved,
        is_published,
        created_at,
        updated_at,
        blogs (
          id,
          title,
          slug
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Comment not found");
      }
      throw new Error("Failed to fetch comment");
    }

    return comment;
  }

  /**
   * Crée un nouveau commentaire
   * @param {Object} user - Utilisateur authentifié (optionnel)
   * @param {Object} commentData - Données du commentaire
   * @param {string} commentData.blog_id - ID du blog
   * @param {string} commentData.name - Nom du commentateur
   * @param {string} commentData.email - Email du commentateur (optionnel)
   * @param {string} commentData.message - Message du commentaire
   */
  static async createComment(user, commentData) {
    const { blog_id, name, email, message } = commentData;

    // Validation
    if (!blog_id || !name || !message) {
      throw new Error("Blog ID, name, and message are required");
    }

    if (name.length > 100) {
      throw new Error("Name cannot exceed 100 characters");
    }

    if (message.length > 1000) {
      throw new Error("Message cannot exceed 1000 characters");
    }

    // Vérifier que le blog existe
    const { data: blog, error: blogError } = await supabaseServer
      .from("blogs")
      .select("id")
      .eq("id", blog_id)
      .single();

    if (blogError || !blog) {
      throw new Error("Invalid blog ID");
    }

    // Insérer le commentaire (nécessite une modération admin)
    const { data: comment, error } = await supabaseServer
      .from("blog_comments")
      .insert({
        blog_id,
        name,
        email: email || null,
        message,
        is_approved: false,
        is_published: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to create comment");
    }

    return comment;
  }

  /**
   * Met à jour un commentaire
   * @param {Object} user - Utilisateur authentifié
   * @param {string} id - ID du commentaire
   * @param {Object} commentData - Données mises à jour
   */
  static async updateComment(user, id, commentData) {
    // Vérifier l'autorisation admin
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

    const { name, email, message, is_approved, is_published } = commentData;

    // Validation
    if (name !== undefined && (typeof name !== 'string' || name.length > 100)) {
      throw new Error("Name must be a string and cannot exceed 100 characters");
    }

    if (message !== undefined && (typeof message !== 'string' || message.length > 1000)) {
      throw new Error("Message must be a string and cannot exceed 1000 characters");
    }

    if (email !== undefined && email !== null && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      throw new Error("Invalid email format");
    }

    const updateData = {
      updated_at: new Date().toISOString(),
    };

    // Mettre à jour uniquement les champs fournis et valides
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (message !== undefined) updateData.message = message;
    if (is_approved !== undefined) updateData.is_approved = is_approved;
    if (is_published !== undefined) updateData.is_published = is_published;

    // Vérifier que le commentaire existe
    const { data: existingComment, error: fetchError } = await supabaseServer
      .from("blog_comments")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existingComment) {
      throw new Error("Comment not found");
    }

    const { data: comment, error } = await supabaseServer
      .from("blog_comments")
      .update(updateData)
      .eq("id", id)
      .select(`
        id,
        blog_id,
        name,
        email,
        message,
        is_approved,
        is_published,
        created_at,
        updated_at,
        blogs (
          id,
          title,
          slug
        )
      `)
      .single();

    if (error) {
      throw new Error("Failed to update comment");
    }

    return comment;
  }

  /**
   * Supprime un commentaire
   * @param {Object} user - Utilisateur authentifié
   * @param {string} id - ID du commentaire
   */
  static async deleteComment(user, id) {
    // Vérifier l'autorisation admin
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
      .from("blog_comments")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error("Failed to delete comment");
    }

    return { message: "Comment deleted successfully" };
  }

  /**
   * Approuve un commentaire
   * @param {Object} user - Utilisateur authentifié
   * @param {string} id - ID du commentaire
   */
  static async approveComment(user, id) {
    // Vérifier l'autorisation admin
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

    const { data: comment, error } = await supabaseServer
      .from("blog_comments")
      .update({ 
        is_approved: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to approve comment");
    }

    return comment;
  }

  /**
   * Publie un commentaire
   * @param {Object} user - Utilisateur authentifié
   * @param {string} id - ID du commentaire
   */
  static async publishComment(user, id) {
    // Vérifier l'autorisation admin
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

    const { data: comment, error } = await supabaseServer
      .from("blog_comments")
      .update({ 
        is_published: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error("Failed to publish comment");
    }

    return comment;
  }

  /**
   * Récupère les statistiques des commentaires
   * @param {Object} user - Utilisateur authentifié
   * @param {string} blogId - ID du blog (optionnel)
   */
  static async getCommentStats(user, blogId = null) {
    // Vérifier l'autorisation admin
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

    let query = supabaseServer
      .from("blog_comments")
      .select("is_approved, is_published");

    if (blogId) {
      query = query.eq("blog_id", blogId);
    }

    const { data: comments, error } = await query;

    if (error) {
      throw new Error("Failed to fetch comment statistics");
    }

    const total = comments.length;
    const approved = comments.filter(c => c.is_approved).length;
    const published = comments.filter(c => c.is_published).length;
    const pending = comments.filter(c => !c.is_approved).length;

    return {
      total,
      approved,
      published,
      pending,
    };
  }
}