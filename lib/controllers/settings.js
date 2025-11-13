import supabaseServer from "../supabaseServer";

export class SettingsController {
  // Default values for all fields
  static getDefaultSettings() {
    return {
      logo_ar: "",
      logo_fr: "",
      logo_an: "",
      logo_alt_ar: "",
      logo_alt_fr: "",
      logo_alt_an: "",
      site_name_ar: "",
      site_name_fr: "",
      site_name_an: "",
      tagline_ar: "",
      tagline_fr: "",
      tagline_an: "",
      description_ar: "",
      description_fr: "",
      description_an: "",
      meta_title_ar: "",
      meta_title_fr: "",
      meta_title_an: "",
      meta_description_ar: "",
      meta_description_fr: "",
      meta_description_an: "",
      favicon: "",
      primary_color: "#007bff",
      secondary_color: "#6c757d",
      theme: "light",
      default_locale: "fr",
      supported_locales: ["fr", "ar", "an"],
      timezone: "UTC",
      currency_code: "EUR",
      contact_email: "",
      support_email: "",
      contact_phone: "",
      address_ar: "",
      address_fr: "",
      address_an: "",
      social_facebook: "",
      social_twitter: "",
      social_instagram: "",
      social_linkedin: "",
      social_youtube: "",
      analytics_id: "",
      recaptcha_site_key: "",
      recaptcha_secret_key: "",
      maintenance_mode: false,
      maintenance_message: null,
      items_per_page: 20,
      max_upload_size_bytes: 10485760,
      allowed_file_types: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
      misc_json: {},
    };
  }

  static async getSettings() {
    const supabase = supabaseServer;

    const { data: settings, error } = await supabase
      .from("config_site")
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // If no settings exist, return default values
        return {
          id: null,
          ...this.getDefaultSettings(),
          created_at: null,
          updated_at: null,
        };
      }
      throw new Error("Failed to fetch settings");
    }

    // Merge with defaults for any missing fields
    return {
      ...this.getDefaultSettings(),
      ...settings,
    };
  }

  static async updateSettings(user, settingsData) {
    // Sanitize input data
    const sanitizedData = this.sanitizeSettingsData(settingsData);

    const supabase = supabaseServer;

    // Check authorization
    const { data: adminData, error: roleError } = await supabase
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || adminData?.role !== "super_admin") {
      throw new Error("Only super admins can modify site settings");
    }

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from("config_site")
      .select("id")
      .single();

    let result;
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("config_site")
        .update({
          ...sanitizedData,
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
      const { data, error } = await supabase
        .from("config_site")
        .insert({
          ...sanitizedData,
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

  static sanitizeSettingsData(data) {
    const sanitized = {};

    // Text fields - trim and limit length
    const textFields = [
      'logo_ar', 'logo_fr', 'logo_an', 'logo_alt_ar', 'logo_alt_fr', 'logo_alt_an',
      'site_name_ar', 'site_name_fr', 'site_name_an', 'tagline_ar', 'tagline_fr', 'tagline_an',
      'description_ar', 'description_fr', 'description_an', 'meta_title_ar', 'meta_title_fr', 'meta_title_an',
      'meta_description_ar', 'meta_description_fr', 'meta_description_an', 'favicon', 'theme',
      'timezone', 'currency_code', 'contact_email', 'support_email', 'contact_phone',
      'address_ar', 'address_fr', 'address_an', 'social_facebook', 'social_twitter',
      'social_instagram', 'social_linkedin', 'social_youtube', 'analytics_id',
      'recaptcha_site_key', 'recaptcha_secret_key'
    ];

    textFields.forEach(field => {
      if (data[field] !== undefined) {
        const trimmed = data[field]?.toString().trim() || "";
        sanitized[field] = trimmed.length > 1000 ? trimmed.substring(0, 1000) : trimmed;
      }
    });

    // Color fields - validate hex format
    ['primary_color', 'secondary_color'].forEach(field => {
      if (data[field] && /^#[0-9A-Fa-f]{6}$/.test(data[field])) {
        sanitized[field] = data[field];
      }
    });

    // Locale fields
    if (data.default_locale && /^[a-z]{2}$/.test(data.default_locale)) {
      sanitized.default_locale = data.default_locale;
    }

    if (Array.isArray(data.supported_locales) &&
        data.supported_locales.every(locale => /^[a-z]{2}$/.test(locale))) {
      sanitized.supported_locales = data.supported_locales;
    }

    // Boolean fields
    if (typeof data.maintenance_mode === 'boolean') {
      sanitized.maintenance_mode = data.maintenance_mode;
    }

    // JSON fields
    if (data.maintenance_message && typeof data.maintenance_message === 'object') {
      sanitized.maintenance_message = data.maintenance_message;
    }

    if (data.misc_json && typeof data.misc_json === 'object') {
      sanitized.misc_json = data.misc_json;
    }

    // Numeric fields
    if (typeof data.items_per_page === 'number' && data.items_per_page > 0 && data.items_per_page <= 100) {
      sanitized.items_per_page = Math.floor(data.items_per_page);
    }

    if (typeof data.max_upload_size_bytes === 'number' && data.max_upload_size_bytes > 0 && data.max_upload_size_bytes <= 1073741824) { // 1GB max
      sanitized.max_upload_size_bytes = Math.floor(data.max_upload_size_bytes);
    }

    // File types - validate JSON array of strings
    if (Array.isArray(data.allowed_file_types) &&
        data.allowed_file_types.every(type => typeof type === 'string' && type.length <= 100)) {
      sanitized.allowed_file_types = data.allowed_file_types;
    }

    return sanitized;
  }
}
