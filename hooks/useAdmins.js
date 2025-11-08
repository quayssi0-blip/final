import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";
import { toast } from "../lib/toastUtils";

export function useAdmins() {
  const key = ["admins"];
  const { data, error, isLoading, mutate } = useSWR(key, supabaseFetcher);

  const createAdmin = async (adminData) => {
    try {
      const { error: createError } = await supabaseClient
        .from("admins")
        .insert([adminData]);
      if (createError) {
        console.error("Failed to create admin:", createError);
        throw new Error("Could not create admin.");
      }
      mutate(); // Revalidate
      
      toast.success(
        "Administrateur créé",
        "Le nouvel administrateur a été ajouté avec succès."
      );
    } catch (error) {
      console.error("Failed to create admin:", error);
      toast.error(
        "Erreur de création",
        "Impossible de créer l'administrateur. Vérifiez les données saisies."
      );
      throw error;
    }
  };

  const updateAdmin = async (adminId, updatedData) => {
    try {
      const { error: updateError } = await supabaseClient
        .from("admins")
        .update(updatedData)
        .eq("id", adminId);
      if (updateError) {
        console.error("Failed to update admin:", updateError);
        throw new Error("Could not update admin.");
      }
      mutate(); // Revalidate
      
      toast.success(
        "Administrateur mis à jour",
        "Les informations de l'administrateur ont été mises à jour."
      );
    } catch (error) {
      console.error("Failed to update admin:", error);
      toast.error(
        "Erreur de mise à jour",
        "Impossible de mettre à jour l'administrateur. Réessayez plus tard."
      );
      throw error;
    }
  };

  const deleteAdmin = async (adminId) => {
    try {
      const { error: deleteError } = await supabaseClient
        .from("admins")
        .delete()
        .eq("id", adminId);
      if (deleteError) {
        console.error("Failed to delete admin:", deleteError);
        throw new Error("Could not delete admin.");
      }
      mutate(); // Revalidate
      
      toast.success(
        "Administrateur supprimé",
        "L'administrateur a été définitivement supprimé du système."
      );
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error(
        "Erreur de suppression",
        "Impossible de supprimer l'administrateur. Vérifiez vos permissions."
      );
      throw error;
    }
  };

  return {
    admins: data,
    isLoading,
    isError: error,
    mutate,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  };
}
