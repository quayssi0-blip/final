import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";

export function useProjects() {
  const key = ["projects"];
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    supabaseFetcher("projects"),
  );

  const createProject = async (projectData) => {
    const { error: createError } = await supabaseClient
      .from("projects")
      .insert([projectData]);
    if (createError) {
      console.error("Failed to create project:", createError);
      throw new Error("Could not create project.");
    }
    mutate(); // Revalidate
  };

  const updateProject = async (projectId, updatedData) => {
    const { error: updateError } = await supabaseClient
      .from("projects")
      .update(updatedData)
      .eq("id", projectId);
    if (updateError) {
      console.error("Failed to update project:", updateError);
      throw new Error("Could not update project.");
    }
    mutate(); // Revalidate
  };

  const deleteProject = async (projectId) => {
    const { error: deleteError } = await supabaseClient
      .from("projects")
      .delete()
      .eq("id", projectId);
    if (deleteError) {
      console.error("Failed to delete project:", deleteError);
      throw new Error("Could not delete project.");
    }
    mutate(); // Revalidate
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
