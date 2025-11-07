import supabaseServer from "../supabaseServer";

export class SettingsController {
  static async getSettings() {
    const { data: settings, error } = await supabaseServer
      .from("site_config")
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // If no settings exist, return default values
        return {
          id: null,
          logo_url: "",
          created_at: null,
          updated_at: null,
        };
      }
      throw new Error("Failed to fetch settings");
    }

    return settings;
  }

  static async updateSettings(user, settingsData) {
    // Check authorization
    const { data: adminData, error: roleError } = await supabaseServer
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || adminData?.role !== "super_admin") {
      throw new Error("Only super admins can modify site settings");
    }

    const { logo_url } = settingsData;

    // Check if settings already exist
    const { data: existingSettings } = await supabaseServer
      .from("site_config")
      .select("id")
      .single();

    let result;
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabaseServer
        .from("site_config")
        .update({
          logo_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id)
        .select()
        .single();

      if (error) {
        throw new Error("Failed to update settings");
      }

      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabaseServer
        .from("site_config")
        .insert({
          logo_url,
        })
        .select()
        .single();

      if (error) {
        throw new Error("Failed to create settings");
      }

      result = data;
    }

    return result;
  }
}
