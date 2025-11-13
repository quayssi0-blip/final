import { NextResponse } from "next/server";
import { SettingsController } from "../../../lib/controllers/settings";
import { supabaseServer } from "../../../lib/supabaseServer";

// Validation helper
const validateSettingsData = (data) => {
  const errors = [];

  // Validate multilingual text fields - trim and check lengths
  const textFields = [
    'logo_ar', 'logo_fr', 'logo_an', 'logo_alt_ar', 'logo_alt_fr', 'logo_alt_an',
    'site_name_ar', 'site_name_fr', 'site_name_an', 'tagline_ar', 'tagline_fr', 'tagline_an',
    'description_ar', 'description_fr', 'description_an', 'meta_title_ar', 'meta_title_fr', 'meta_title_an',
    'meta_description_ar', 'meta_description_fr', 'meta_description_an', 'favicon', 'theme',
    'timezone', 'currency_code', 'contact_phone', 'address_ar', 'address_fr', 'address_an',
    'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin', 'social_youtube',
    'analytics_id', 'recaptcha_site_key', 'recaptcha_secret_key'
  ];

  textFields.forEach(field => {
    if (data[field] !== undefined) {
      const value = data[field]?.toString().trim() || "";
      if (value.length > 1000) {
        errors.push(`${field} must not exceed 1000 characters`);
      }
    }
  });

  // Validate colors if provided
  if (data.primary_color && !/^#[0-9A-Fa-f]{6}$/.test(data.primary_color)) {
    errors.push("Invalid primary color format. Use hexadecimal format (#RRGGBB)");
  }
  if (data.secondary_color && !/^#[0-9A-Fa-f]{6}$/.test(data.secondary_color)) {
    errors.push("Invalid secondary color format. Use hexadecimal format (#RRGGBB)");
  }

  // Validate emails if provided
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.contact_email && !emailRegex.test(data.contact_email)) {
    errors.push("Invalid contact email format");
  }
  if (data.support_email && !emailRegex.test(data.support_email)) {
    errors.push("Invalid support email format");
  }

  // Validate locale
  if (data.default_locale && !/^[a-z]{2}$/.test(data.default_locale)) {
    errors.push("Invalid default locale format. Use two-letter code (e.g., 'fr', 'ar', 'en')");
  }

  // Validate supported_locales if provided
  if (data.supported_locales && (!Array.isArray(data.supported_locales) ||
      !data.supported_locales.every(locale => /^[a-z]{2}$/.test(locale)))) {
    errors.push("supported_locales must be an array of two-letter locale codes");
  }

  // Validate upload size
  if (data.max_upload_size_bytes !== undefined &&
      (typeof data.max_upload_size_bytes !== 'number' || data.max_upload_size_bytes <= 0 || data.max_upload_size_bytes > 1073741824)) {
    errors.push("max_upload_size_bytes must be a positive number not exceeding 1GB");
  }

  // Validate items per page
  if (data.items_per_page !== undefined &&
      (typeof data.items_per_page !== 'number' || data.items_per_page <= 0 || data.items_per_page > 100)) {
    errors.push("items_per_page must be a positive number between 1 and 100");
  }

  // Validate maintenance_mode
  if (data.maintenance_mode !== undefined && typeof data.maintenance_mode !== 'boolean') {
    errors.push("maintenance_mode must be a boolean");
  }

  // Validate JSON fields
  ['maintenance_message', 'misc_json'].forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      if (typeof data[field] !== 'object' || Array.isArray(data[field])) {
        errors.push(`${field} must be a valid JSON object or null`);
      }
    }
  });

  // Validate allowed_file_types
  if (data.allowed_file_types !== undefined) {
    if (!Array.isArray(data.allowed_file_types)) {
      errors.push("allowed_file_types must be an array");
    } else {
      data.allowed_file_types.forEach((type, index) => {
        if (typeof type !== 'string' || type.length === 0 || type.length > 100) {
          errors.push(`allowed_file_types[${index}] must be a non-empty string not exceeding 100 characters`);
        }
      });
    }
  }

  return errors;
};

export async function GET(request) {
  try {
    // Restrict access to authenticated users only for GET
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const settings = await SettingsController.getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Error fetching settings:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Sanitize input data (additional layer beyond controller sanitization)
    const sanitizedBody = {};
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined && body[key] !== null) {
        if (typeof body[key] === 'string') {
          sanitizedBody[key] = body[key].toString().replace(/[<>]/g, '').trim();
        } else {
          sanitizedBody[key] = body[key];
        }
      }
    });

    // Validate input data
    const validationErrors = validateSettingsData(sanitizedBody);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors
        },
        { status: 400 }
      );
    }

    const result = await SettingsController.updateSettings(user, sanitizedBody);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error updating settings:", err.message);
    return NextResponse.json(
      {
        error: "Failed to update site settings",
        details: err.message
      },
      { status: 500 }
    );
  }
}

// Add PATCH method for partial updates
export async function PATCH(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Sanitize input data (additional layer beyond controller sanitization)
    const sanitizedBody = {};
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined && body[key] !== null) {
        if (typeof body[key] === 'string') {
          sanitizedBody[key] = body[key].toString().replace(/[<>]/g, '').trim();
        } else {
          sanitizedBody[key] = body[key];
        }
      }
    });

    // Validate the partial update data
    const validationErrors = validateSettingsData(sanitizedBody);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors
        },
        { status: 400 }
      );
    }

    // Get current settings
    const currentSettings = await SettingsController.getSettings();

    // Merge current settings with updates
    const updatedSettings = {
      ...currentSettings,
      ...sanitizedBody,
      updated_at: new Date().toISOString()
    };

    const result = await SettingsController.updateSettings(user, updatedSettings);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error patching settings:", err.message);
    return NextResponse.json(
      {
        error: "Failed to patch site settings",
        details: err.message
      },
      { status: 500 }
    );
  }
}

// Add DELETE method for resetting to defaults
export async function DELETE(request) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Reset to all default values
    const defaultSettings = SettingsController.getDefaultSettings();
    const result = await SettingsController.updateSettings(user, {
      ...defaultSettings,
      updated_at: new Date().toISOString()
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error resetting settings:", err.message);
    return NextResponse.json(
      {
        error: "Failed to reset site settings",
        details: err.message
      },
      { status: 500 }
    );
  }
}
