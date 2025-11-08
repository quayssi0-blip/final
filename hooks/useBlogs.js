import { useCRUD } from "./useCRUD";
import { toast } from "../lib/toastUtils";

export function useBlogs() {
  const { data, isLoading, isError, mutate, create, update, remove } = useCRUD(
    "blog_posts",
    ["blog_posts"],
    "blog",
  );

  // Alias avec toasts pour maintenir la compatibilité avec l'API existante
  const createBlog = async (blogData) => {
    try {
      await create(blogData);
      toast.success(
        "Blog créé avec succès",
        "Le blog a été ajouté à la liste des publications."
      );
    } catch (error) {
      console.error("Failed to create blog:", error);
      toast.error(
        "Erreur de création",
        "Impossible de créer le blog. Vérifiez votre connexion et réessayez."
      );
      throw error;
    }
  };

  const updateBlog = async (blogId, updatedData) => {
    try {
      await update(blogId, updatedData);
      toast.success(
        "Blog mis à jour",
        "Les modifications ont été sauvegardées avec succès."
      );
    } catch (error) {
      console.error("Failed to update blog:", error);
      toast.error(
        "Erreur de mise à jour",
        "Impossible de mettre à jour le blog. Réessayez plus tard."
      );
      throw error;
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await remove(blogId);
      toast.success(
        "Blog supprimé",
        "Le blog a été définitivement supprimé de la base de données."
      );
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error(
        "Erreur de suppression",
        "Impossible de supprimer le blog. Vérifiez vos permissions."
      );
      throw error;
    }
  };

  return {
    blogs: data,
    isLoading,
    isError,
    mutate,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
