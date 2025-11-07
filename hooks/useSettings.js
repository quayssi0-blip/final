import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";

export function useSettings() {
  const key = ["site_config"];
  const { data, error, isLoading, mutate } = useSWR(key, supabaseFetcher);

  const updateSettings = async (settingsData) => {
    const { error: updateError } = await supabaseClient
      .from("site_config")
      .upsert([settingsData]);
    if (updateError) {
      console.error("Failed to update settings:", updateError);
      throw new Error("Could not update settings.");
    }
    mutate(); // Revalidate
  };

  return {
    settings: data,
    isLoading,
    isError: error,
    mutate,
    updateSettings,
  };
}
