import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";

export function useProjectImages(projectId = null) {
  const key = projectId ? ["project_images", projectId] : ["project_images"];

  const fetcher = async (key) => {
    if (projectId) {
      const { data, error } = await supabaseClient
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return await supabaseFetcher(key[0]);
    }
  };

  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  const createProjectImage = async (projectImageData) => {
    const { error: createError } = await supabaseClient
      .from("project_images")
      .insert([projectImageData]);
    if (createError) {
      console.error("Failed to create project image:", createError);
      throw new Error("Could not create project image.");
    }
    mutate(); // Revalidate
  };

  const updateProjectImage = async (projectImageId, updatedData) => {
    const { error: updateError } = await supabaseClient
      .from("project_images")
      .update(updatedData)
      .eq("id", projectImageId);
    if (updateError) {
      console.error("Failed to update project image:", updateError);
      throw new Error("Could not update project image.");
    }
    mutate(); // Revalidate
  };

  const deleteProjectImage = async (projectImageId) => {
    const { error: deleteError } = await supabaseClient
      .from("project_images")
      .delete()
      .eq("id", projectImageId);
    if (deleteError) {
      console.error("Failed to delete project image:", deleteError);
      throw new Error("Could not delete project image.");
    }
    mutate(); // Revalidate
  };

  return {
    projectImages: data,
    isLoading,
    isError: error,
    mutate,
    createProjectImage,
    updateProjectImage,
    deleteProjectImage,
  };
}
