import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";

export function useAdmins() {
  const key = ["admins"];
  const { data, error, isLoading, mutate } = useSWR(key, supabaseFetcher);

  const createAdmin = async (adminData) => {
    const { error: createError } = await supabaseClient
      .from("admins")
      .insert([adminData]);
    if (createError) {
      console.error("Failed to create admin:", createError);
      throw new Error("Could not create admin.");
    }
    mutate(); // Revalidate
  };

  const updateAdmin = async (adminId, updatedData) => {
    const { error: updateError } = await supabaseClient
      .from("admins")
      .update(updatedData)
      .eq("id", adminId);
    if (updateError) {
      console.error("Failed to update admin:", updateError);
      throw new Error("Could not update admin.");
    }
    mutate(); // Revalidate
  };

  const deleteAdmin = async (adminId) => {
    const { error: deleteError } = await supabaseClient
      .from("admins")
      .delete()
      .eq("id", adminId);
    if (deleteError) {
      console.error("Failed to delete admin:", deleteError);
      throw new Error("Could not delete admin.");
    }
    mutate(); // Revalidate
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
