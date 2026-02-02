import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  RefreshCw,
  Settings,
  Globe,
  Mail,
  Bell,
  Palette,
  Upload,
  CheckCircle,
  Image,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import {
  useGetSiteSettingsAction,
  useBulkUpdateSettingsAction,
} from "../../../store/admin-content-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const GeneralSettings = () => {
  const { isDarkMode } = useThemeStore();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState({
    // Site Info
    siteName: "UniDel CBT Portal",
    siteDescription: "University CBT Examination System",
    contactEmail: "admin@unidel.edu",
    supportPhone: "+234 XXX XXX XXXX",

    // Email Settings
    enableEmailNotifications: true,
    emailFromName: "UniDel CBT",
    emailFromAddress: "noreply@unidel.edu",

    // Notification Settings
    notifyOnNewStudent: true,
    notifyOnExamSubmission: true,
    notifyOnViolation: true,

    // Appearance
    primaryColor: "#f97316",
    defaultTheme: "light",
    allowThemeToggle: true,
  });

  const {
    settings: fetchedSettings = [],
    isLoading,
    refetch,
  } = useGetSiteSettingsAction();

  const { bulkUpdateSettings } = useBulkUpdateSettingsAction();

  useEffect(() => {
    if (fetchedSettings && fetchedSettings.length > 0) {
      const generalSettings = fetchedSettings.find(
        (s) => s.category === "general" || s.key === "general_settings",
      );
      if (generalSettings?.value) {
        setSettings((prev) => ({ ...prev, ...generalSettings.value }));
      }
    }
  }, [fetchedSettings]);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await bulkUpdateSettings([
        { key: "general_settings", value: settings, category: "general" },
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p
          className={cn(
            "font-medium",
            isDarkMode ? "text-white" : "text-gray-900",
          )}
        >
          {label}
        </p>
        {description && (
          <p
            className={cn(
              "text-sm",
              isDarkMode ? "text-slate-400" : "text-gray-500",
            )}
          >
            {description}
          </p>
        )}
      </div>
      <button
        onClick={onChange}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors",
          enabled
            ? "bg-orange-500"
            : isDarkMode
              ? "bg-slate-700"
              : "bg-gray-300",
        )}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
  }) => (
    <div className="py-3">
      <label
        className={cn(
          "block text-sm font-medium mb-2",
          isDarkMode ? "text-slate-300" : "text-gray-700",
        )}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2 rounded-xl border transition-all",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-900",
        )}
      />
    </div>
  );

  const actions = (
    <div className="flex items-center gap-2">
      {saveSuccess && (
        <span className="flex items-center gap-2 text-emerald-500 text-sm">
          <CheckCircle className="w-4 h-4" />
          Saved!
        </span>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
          "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50",
        )}
      >
        {saving ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Save Changes</span>
      </button>
    </div>
  );

  return (
    <AdminPage
      title="General Settings"
      subtitle="Configure site-wide settings and preferences"
      icon={AdminIcons.Settings}
      actions={actions}
    >
      {isLoading ? (
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                height={200}
                borderRadius={16}
                baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
              />
            ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Site Information */}
          <AdminCard title="Site Information" icon={Globe}>
            <div className="space-y-1">
              <InputField
                label="Site Name"
                value={settings.siteName}
                onChange={(v) => handleChange("siteName", v)}
                placeholder="Enter site name"
              />
              <InputField
                label="Site Description"
                value={settings.siteDescription}
                onChange={(v) => handleChange("siteDescription", v)}
                placeholder="Enter site description"
              />
              <InputField
                label="Contact Email"
                type="email"
                value={settings.contactEmail}
                onChange={(v) => handleChange("contactEmail", v)}
                placeholder="admin@example.com"
              />
              <InputField
                label="Support Phone"
                value={settings.supportPhone}
                onChange={(v) => handleChange("supportPhone", v)}
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
          </AdminCard>

          {/* Email Settings */}
          <AdminCard title="Email Configuration" icon={Mail}>
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
              <ToggleSwitch
                enabled={settings.enableEmailNotifications}
                onChange={() => handleToggle("enableEmailNotifications")}
                label="Enable Email Notifications"
                description="Send email notifications for system events"
              />
              {settings.enableEmailNotifications && (
                <>
                  <InputField
                    label="From Name"
                    value={settings.emailFromName}
                    onChange={(v) => handleChange("emailFromName", v)}
                    placeholder="UniDel CBT"
                  />
                  <InputField
                    label="From Email Address"
                    type="email"
                    value={settings.emailFromAddress}
                    onChange={(v) => handleChange("emailFromAddress", v)}
                    placeholder="noreply@example.com"
                  />
                </>
              )}
            </div>
          </AdminCard>

          {/* Notification Settings */}
          <AdminCard title="Notification Preferences" icon={Bell}>
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
              <ToggleSwitch
                enabled={settings.notifyOnNewStudent}
                onChange={() => handleToggle("notifyOnNewStudent")}
                label="New Student Registration"
                description="Notify when new students register"
              />
              <ToggleSwitch
                enabled={settings.notifyOnExamSubmission}
                onChange={() => handleToggle("notifyOnExamSubmission")}
                label="Exam Submissions"
                description="Notify when exams are submitted"
              />
              <ToggleSwitch
                enabled={settings.notifyOnViolation}
                onChange={() => handleToggle("notifyOnViolation")}
                label="Security Violations"
                description="Notify on exam security violations"
              />
            </div>
          </AdminCard>

          {/* Appearance */}
          <AdminCard title="Appearance" icon={Palette}>
            <div className="space-y-4">
              <div className="py-3">
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    isDarkMode ? "text-slate-300" : "text-gray-700",
                  )}
                >
                  Primary Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) =>
                      handleChange("primaryColor", e.target.value)
                    }
                    className="w-12 h-12 rounded-xl border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) =>
                      handleChange("primaryColor", e.target.value)
                    }
                    className={cn(
                      "flex-1 px-4 py-2 rounded-xl border transition-all",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                    )}
                  />
                </div>
              </div>
              <div className="py-3">
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    isDarkMode ? "text-slate-300" : "text-gray-700",
                  )}
                >
                  Default Theme
                </label>
                <select
                  value={settings.defaultTheme}
                  onChange={(e) => handleChange("defaultTheme", e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-xl border transition-all",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                  )}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <ToggleSwitch
                enabled={settings.allowThemeToggle}
                onChange={() => handleToggle("allowThemeToggle")}
                label="Allow Theme Toggle"
                description="Let users switch between light and dark mode"
              />
            </div>
          </AdminCard>
        </div>
      )}
    </AdminPage>
  );
};

export default GeneralSettings;
