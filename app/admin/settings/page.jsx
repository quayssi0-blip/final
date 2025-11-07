"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Bell,
  Shield,
  Palette,
  Globe,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useSettings } from "../../../hooks/useSettings";

/**
 * @typedef {Object} GeneralSettings
 * @property {string} siteName
 * @property {string} siteDescription
 * @property {string} contactEmail
 * @property {('UTC'|'EST'|'PST')} timezone
 */

/**
 * @typedef {Object} NotificationsSettings
 * @property {boolean} emailNotifications
 * @property {boolean} newMessageAlerts
 * @property {boolean} weeklyReports
 */

/**
 * @typedef {Object} SecuritySettings
 * @property {boolean} twoFactorAuth
 * @property {number} sessionTimeout
 * @property {number} passwordMinLength
 */

/**
 * @typedef {Object} AppearanceSettings
 * @property {('light'|'dark'|'auto')} theme
 * @property {('en'|'fr'|'es')} language
 * @property {('DD/MM/YYYY'|'MM/DD/YYYY'|'YYYY-MM-DD')} dateFormat
 */

/**
 * @typedef {Object} SettingsState
 * @property {GeneralSettings} general
 * @property {NotificationsSettings} notifications
 * @property {SecuritySettings} security
 * @property {AppearanceSettings} appearance
 */

/**
 * @typedef {Object} APISettingsData
 * // Note: API often uses snake_case, match this to your actual API response
 * @property {string} [site_name]
 * @property {string} [site_description]
 * @property {string} [contact_email]
 * @property {string} [timezone]
 * @property {boolean} [email_notifications]
 * @property {boolean} [new_message_alerts]
 * @property {boolean} [weekly_reports]
 * @property {boolean} [two_factor_auth]
 * @property {number} [session_timeout]
 * @property {number} [password_min_length]
 * @property {string} [theme]
 * @property {string} [language]
 * @property {string} [date_format] // Assuming this may also come from API if not just a UI setting
 */


export default function SettingsPage() {
  // --- Hook Integration ---
  /** @type {{ settings: APISettingsData | null, isLoading: boolean, updateSettings: (data: SettingsState) => Promise<any> }} */
  const { 
    settings: settingsData, 
    isLoading: isSettingsLoading, 
    updateSettings 
  } = useSettings();
  
  // --- State Declarations ---
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  /** @type {[SettingsState, React.Dispatch<React.SetStateAction<SettingsState>>]} */
  const [settings, setSettings] = useState(
    /** @type {SettingsState} */ ({
      general: {
        siteName: "Admin Assalam",
        siteDescription: "Professional portfolio and blog website",
        contactEmail: "admin@example.com",
        timezone: "UTC",
      },
      notifications: {
        emailNotifications: true,
        newMessageAlerts: true,
        weeklyReports: false,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordMinLength: 8,
      },
      appearance: {
        theme: "light",
        language: "en",
        dateFormat: "DD/MM/YYYY",
      },
    }),
  );
  
  /** @type {[Record<string, string>, React.Dispatch<React.SetStateAction<Record<string, string>>]} */
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // --- Effect to Sync Data ---
  useEffect(() => {
    if (settingsData) {
      setSettings((prev) => ({
        ...prev,
        general: {
          ...prev.general,
          siteName: settingsData.site_name ?? prev.general.siteName,
          siteDescription: settingsData.site_description ?? prev.general.siteDescription,
          contactEmail: settingsData.contact_email ?? prev.general.contactEmail,
          timezone: /** @type {('UTC'|'EST'|'PST')} */ (settingsData.timezone ?? prev.general.timezone),
        },
        appearance: {
          ...prev.appearance,
          theme: /** @type {('light'|'dark'|'auto')} */ (settingsData.theme ?? prev.appearance.theme),
          language: /** @type {('en'|'fr'|'es')} */ (settingsData.language ?? prev.appearance.language),
          // Assuming dateFormat is only set locally unless you update APISettingsData
        },
        notifications: {
          ...prev.notifications,
          // Check explicitly for undefined for booleans to respect 'false' value
          emailNotifications: settingsData.email_notifications !== undefined ? settingsData.email_notifications : prev.notifications.emailNotifications,
          newMessageAlerts: settingsData.new_message_alerts !== undefined ? settingsData.new_message_alerts : prev.notifications.newMessageAlerts,
          weeklyReports: settingsData.weekly_reports !== undefined ? settingsData.weekly_reports : prev.notifications.weeklyReports,
        },
        security: {
          ...prev.security,
          twoFactorAuth: settingsData.two_factor_auth !== undefined ? settingsData.two_factor_auth : prev.security.twoFactorAuth,
          sessionTimeout: settingsData.session_timeout ?? prev.security.sessionTimeout,
          passwordMinLength: settingsData.password_min_length ?? prev.security.passwordMinLength,
        },
      }));
    }
  }, [settingsData]);

  // --- Handler Functions ---
  /**
   * @param {keyof SettingsState} section
   * @param {string} field
   * @param {string | number | boolean} value
   */
  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  /**
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // You could also call the hook's updateSettings here: await updateSettings(settings);
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccessMessage("Settings saved successfully!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        const errorData = await response.json();
        setErrors({
          submit:
            errorData.error || "Failed to save settings. Please try again.",
        });
      }
    } catch (error) {
      console.error("Settings save error:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Input Change Helpers (To reduce inline complexity and enforce types) ---

  /**
   * Creates a change handler for text, email, and select inputs.
   * @param {keyof SettingsState} section
   * @param {string} field
   */
  const handleTextSelectChange = (section, field) => (e) => {
    handleInputChange(section, field, e.target.value);
  };

  /**
   * Creates a change handler for number inputs.
   * @param {keyof SettingsState} section
   * @param {string} field
   */
  const handleNumberChange = (section, field) => (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      handleInputChange(section, field, value);
    }
  };

  /**
   * Creates a change handler for checkbox inputs.
   * @param {keyof SettingsState} section
   * @param {string} field
   */
  const handleCheckboxChange = (section, field) => (e) => {
    handleInputChange(section, field, e.target.checked);
  };
  
  // --- Component Structure (Rest of the component remains the same, but with cleaner onChange props) ---
  
  const tabs = [
    { id: "general", label: "General", icon: <Globe className="h-5 w-5" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    { id: "security", label: "Security", icon: <Shield className="h-5 w-5" /> },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="h-5 w-5" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Settings Content */}
      
      {/* Affichage du chargement des données initiales */}
      {isSettingsLoading && (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading settings...</span>
          </div>
        </div>
      )}

      {/* Contenu du formulaire - affiché seulement si les données sont chargées */}
      {!isSettingsLoading && (
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">
                  General Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="siteName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={settings.general.siteName}
                    // Use the helper handler
                    onChange={handleTextSelectChange("general", "siteName")} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="siteDescription"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    rows={3}
                    value={settings.general.siteDescription}
                    // Use the helper handler
                    onChange={handleTextSelectChange("general", "siteDescription")} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={settings.general.contactEmail}
                    // Use the helper handler
                    onChange={handleTextSelectChange("general", "contactEmail")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={settings.general.timezone}
                    // Use the helper handler
                    onChange={handleTextSelectChange("general", "timezone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">
                  Notification Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications.emailNotifications}
                      // Use the helper handler
                      onChange={handleCheckboxChange("notifications", "emailNotifications")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      New Message Alerts
                    </h3>
                    <p className="text-sm text-gray-500">
                      Get notified when new messages are received
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications.newMessageAlerts}
                      // Use the helper handler
                      onChange={handleCheckboxChange("notifications", "newMessageAlerts")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Weekly Reports
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications.weeklyReports}
                      // Use the helper handler
                      onChange={handleCheckboxChange("notifications", "weeklyReports")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">
                  Security Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.security.twoFactorAuth}
                      // Use the helper handler
                      onChange={handleCheckboxChange("security", "twoFactorAuth")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="sessionTimeout"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    min="5"
                    max="480"
                    value={settings.security.sessionTimeout}
                    // Use the helper handler
                    onChange={handleNumberChange("security", "sessionTimeout")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="passwordMinLength"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    id="passwordMinLength"
                    min="6"
                    max="32"
                    value={settings.security.passwordMinLength}
                    // Use the helper handler
                    onChange={handleNumberChange("security", "passwordMinLength")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Palette className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900">
                  Appearance Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="theme"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Theme
                  </label>
                  <select
                    id="theme"
                    value={settings.appearance.theme}
                    // Use the helper handler
                    onChange={handleTextSelectChange("appearance", "theme")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    value={settings.appearance.language}
                    // Use the helper handler
                    onChange={handleTextSelectChange("appearance", "language")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dateFormat"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    value={settings.appearance.dateFormat}
                    // Use the helper handler
                    onChange={handleTextSelectChange("appearance", "dateFormat")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
}