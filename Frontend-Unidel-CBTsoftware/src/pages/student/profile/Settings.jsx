import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  BellOff,
  Globe,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  Shield,
  Eye,
  Save,
  RefreshCw,
  CheckCircle,
  Palette,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Settings = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      examReminders: true,
      resultAlerts: true,
      systemMessages: true,
      emailNotifications: false,
    },
    preferences: {
      language: "en",
      timezone: "Africa/Lagos",
      soundEffects: true,
    },
    privacy: {
      showProfile: true,
      showProgress: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
    },
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative w-12 h-6 rounded-full transition-colors",
        checked ? "bg-orange-500" : isDarkMode ? "bg-slate-700" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
          checked ? "left-7" : "left-1",
        )}
      />
    </button>
  );

  const actions = (
    <button
      onClick={handleSave}
      disabled={saving}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
        saved
          ? "bg-emerald-500 text-white"
          : saving
            ? "bg-orange-400 text-white"
            : "bg-orange-500 text-white hover:bg-orange-600",
      )}
    >
      {saved ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Saved!
        </>
      ) : saving ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          Save Changes
        </>
      )}
    </button>
  );

  return (
    <StudentPage
      title="Settings"
      subtitle="Customize your experience"
      icon={StudentIcons.Profile}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-orange-500" />
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Appearance
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-purple-500" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Dark Mode
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={isDarkMode} onChange={toggleTheme} />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-orange-500" />
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Notifications
            </h3>
          </div>
          <div className="space-y-4">
            {[
              {
                key: "examReminders",
                label: "Exam Reminders",
                desc: "Get notified about upcoming exams",
              },
              {
                key: "resultAlerts",
                label: "Result Alerts",
                desc: "Receive alerts when results are available",
              },
              {
                key: "systemMessages",
                label: "System Messages",
                desc: "Important platform updates and announcements",
              },
              {
                key: "emailNotifications",
                label: "Email Notifications",
                desc: "Receive notifications via email",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {item.desc}
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings.notifications[item.key]}
                  onChange={(val) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [item.key]: val,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-orange-500" />
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Preferences
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Language
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  Choose your preferred language
                </p>
              </div>
              <select
                value={settings.preferences.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: {
                      ...settings.preferences,
                      language: e.target.value,
                    },
                  })
                }
                className={cn(
                  "px-4 py-2 rounded-xl border outline-none",
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-gray-200 text-gray-900",
                )}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.preferences.soundEffects ? (
                  <Volume2 className="w-5 h-5 text-blue-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Sound Effects
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    Play sounds for notifications
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.preferences.soundEffects}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, soundEffects: val },
                  })
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-orange-500" />
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Privacy
            </h3>
          </div>
          <div className="space-y-4">
            {[
              {
                key: "showProfile",
                label: "Public Profile",
                desc: "Allow others to view your profile",
              },
              {
                key: "showProgress",
                label: "Show Progress",
                desc: "Display your progress to classmates",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {item.desc}
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings.privacy[item.key]}
                  onChange={(val) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, [item.key]: val },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-orange-500" />
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Accessibility
            </h3>
          </div>
          <div className="space-y-4">
            {[
              {
                key: "highContrast",
                label: "High Contrast",
                desc: "Increase color contrast for better visibility",
              },
              {
                key: "largeText",
                label: "Large Text",
                desc: "Use larger font sizes throughout the app",
              },
              {
                key: "reducedMotion",
                label: "Reduced Motion",
                desc: "Minimize animations and transitions",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {item.desc}
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings.accessibility[item.key]}
                  onChange={(val) =>
                    setSettings({
                      ...settings,
                      accessibility: {
                        ...settings.accessibility,
                        [item.key]: val,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </StudentPage>
  );
};

export default Settings;
