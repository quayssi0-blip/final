import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";
import { toast } from "../lib/toastUtils";

export function useProjects() {
  const key = ["projects"];
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    supabaseFetcher("projects"),
  );

  const createProject = async (projectData) => {
    try {
      const { error: createError } = await supabaseClient
        .from("projects")
        .insert([projectData]);
      if (createError) {
        console.error("Failed to create project:", createError);
        throw new Error("Could not create project.");
      }
      mutate(); // Revalidate
      
      toast.success(
        "Projet créé",
        "Le nouveau projet a été ajouté à la galerie."
      );
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error(
        "Erreur de création",
        "Impossible de créer le projet. Vérifiez les données du Content Builder."
      );
      throw error;
    }
  };

  const updateProject = async (projectId, updatedData) => {
    try {
      const { error: updateError } = await supabaseClient
        .from("projects")
        .update(updatedData)
        .eq("id", projectId);
      if (updateError) {
        console.error("Failed to update project:", updateError);
        throw new Error("Could not update project.");
      }
      mutate(); // Revalidate
      
      toast.success(
        "Projet mis à jour",
        "Le projet et son contenu ont été mis à jour avec succès."
      );
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error(
        "Erreur de mise à jour",
        "Impossible de mettre à jour le projet. Les modifications du Content Builder sont-elles valides ?"
      );
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const { error: deleteError } = await supabaseClient
        .from("projects")
        .delete()
        .eq("id", projectId);
      if (deleteError) {
        console.error("Failed to delete project:", deleteError);
        throw new Error("Could not delete project.");
      }
      mutate(); // Revalidate
      
      toast.success(
        "Projet supprimé",
        "Le projet et tous ses contenus ont été définitivement supprimés."
      );
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error(
        "Erreur de suppression",
        "Impossible de supprimer le projet. Vérifiez vos permissions et les dépendances."
      );
      throw error;
    }
  };

  return {
    projects: data,
    isLoading,
    isError: error,
    mutate,
    createProject,
    updateProject,
    deleteProject,
  };
}
