import useSWR from "swr";
import { supabaseClient } from "../lib/supabaseClient";
import { supabaseFetcher } from "../lib/supabaseFetcher";

export function useSettings() {
  const key = ["config_site"];
  const { data, error, isLoading, mutate } = useSWR(key, supabaseFetcher);

  const updateSettings = async (settingsData) => {
    // Validate that we have data to update
    if (!settingsData || typeof settingsData !== 'object') {
      throw new Error("Invalid settings data provided.");
    }

    // Sanitize data before sending
    const sanitizedData = {};
    Object.keys(settingsData).forEach(key => {
      if (settingsData[key] !== undefined && settingsData[key] !== null) {
        if (typeof settingsData[key] === 'string') {
          sanitizedData[key] = settingsData[key].toString().replace(/[<>]/g, '').trim();
        } else {
          sanitizedData[key] = settingsData[key];
        }
      }
    });

    // Use upsert for safer updates (insert or update)
    const { data: result, error: updateError } = await supabaseClient
      .from("config_site")
      .upsert([
        {
          ...sanitizedData,
          updated_at: new Date().toISOString(),
        }
      ], {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select();

    if (updateError) {
      console.error("Failed to update settings:", updateError);
      throw new Error("Could not update settings: " + updateError.message);
    }

    // Revalidate cache
    mutate();

    return result;
  };

  return {
    settings: data,
    isLoading,
    isError: error,
    mutate,
    updateSettings,
  };
}
