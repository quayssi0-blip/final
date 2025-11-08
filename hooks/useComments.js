import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";

/**
 * Hook pour gérer les commentaires des blogs
 * @param {string} blogId - ID du blog (optionnel, pour filtrer les commentaires d'un blog spécifique)
 * @returns {Object} - Objet contenant les commentaires et les fonctions CRUD
 */
export function useComments(blogId = null) {
  // Définir la clé SWR basée sur l'ID du blog
  const swrKey = blogId 
    ? ['blog_comments', { blog_id: blogId }] 
    : ['blog_comments'];
  
  const { data, error, isLoading, mutate } = useSWR(swrKey, supabaseFetcher);

  /**
   * Crée un nouveau commentaire
   * @param {Object} commentData - Les données du commentaire
   */
  const createComment = async (commentData) => {
    const { error: createError } = await supabaseClient
      .from('blog_comments')
      .insert([commentData]);
    
    if (createError) {
      console.error('Failed to create comment:', createError);
      throw new Error('Could not create comment.');
    }
    
    mutate(); // Revalidate
  };

  /**
   * Met à jour un commentaire
   * @param {string} commentId - L'ID du commentaire à mettre à jour
   * @param {Object} updatedData - Les données mises à jour
   */
  const updateComment = async (commentId, updatedData) => {
    const { error: updateError } = await supabaseClient
      .from('blog_comments')
      .update(updatedData)
      .eq('id', commentId);
    
    if (updateError) {
      console.error('Failed to update comment:', updateError);
      throw new Error('Could not update comment.');
    }
    
    mutate(); // Revalidate
  };

  /**
   * Supprime un commentaire
   * @param {string} commentId - L'ID du commentaire à supprimer
   */
  const deleteComment = async (commentId) => {
    const { error: deleteError } = await supabaseClient
      .from('blog_comments')
      .delete()
      .eq('id', commentId);
    
    if (deleteError) {
      console.error('Failed to delete comment:', deleteError);
      throw new Error('Could not delete comment.');
    }
    
    mutate(); // Revalidate
  };

  /**
   * Approuve un commentaire
   * @param {string} commentId - L'ID du commentaire à approuver
   */
  const approveComment = async (commentId) => {
    const { error: approveError } = await supabaseClient
      .from('blog_comments')
      .update({ is_approved: true })
      .eq('id', commentId);
    
    if (approveError) {
      console.error('Failed to approve comment:', approveError);
      throw new Error('Could not approve comment.');
    }
    
    mutate(); // Revalidate
  };

  /**
   * Publie un commentaire
   * @param {string} commentId - L'ID du commentaire à publier
   */
  const publishComment = async (commentId) => {
    const { error: publishError } = await supabaseClient
      .from('blog_comments')
      .update({ is_published: true })
      .eq('id', commentId);
    
    if (publishError) {
      console.error('Failed to publish comment:', publishError);
      throw new Error('Could not publish comment.');
    }
    
    mutate(); // Revalidate
  };

  /**
   * Récupère les commentaires d'un blog spécifique avec pagination
   * @param {string} blogId - ID du blog
   * @param {number} limit - Nombre de commentaires par page
   * @param {number} offset - Offset pour la pagination
   */
  const getCommentsByBlog = async (blogId, limit = 10, offset = 0) => {
    const { data: comments, error, count } = await supabaseClient
      .from('blog_comments')
      .select('*', { count: 'exact' })
      .eq('blog_id', blogId)
      .eq('is_published', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch comments:', error);
      throw new Error('Could not fetch comments.');
    }

    return { comments, total: count };
  };

  return {
    // Les données principales
    data: data || [],
    // État de chargement et d'erreur
    isLoading,
    isError: error,
    // Fonction de revalidation
    mutate,
    // Fonctions CRUD
    createComment,
    updateComment,
    deleteComment,
    approveComment,
    publishComment,
    getCommentsByBlog,
  };
}

/**
 * Hook spécifique pour récupérer uniquement les commentaires publiés d'un blog
 * @param {string} blogId - ID du blog
 * @param {number} limit - Nombre de commentaires par page
 * @param {number} offset - Offset pour la pagination
 * @returns {Object} - Objet contenant les commentaires publiés et les fonctions
 */
export function usePublishedComments(blogId, limit = 10, offset = 0) {
  const { data, error, isLoading, mutate } = useSWR(
    ['published_comments', blogId, limit, offset],
    async () => {
      const { data: comments, error, count } = await supabaseClient
        .from('blog_comments')
        .select('*', { count: 'exact' })
        .eq('blog_id', blogId)
        .eq('is_published', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error('Failed to fetch published comments');
      }

      return { comments, total: count };
    }
  );

  return {
    comments: data?.comments || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}