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
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      submissions: true,
      flags: true,
      system: false,
    },
    preferences: {
      language: "en",
      timezone: "Africa/Lagos",
      autoGrade: true,
      showScores: true,
    },
    privacy: {
      showProfile: true,
      showActivity: false,
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
    },
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleSetting = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={cn(
        "relative w-12 h-6 rounded-full transition-colors duration-200",
        enabled ? "bg-blue-600" : isDarkMode ? "bg-slate-700" : "bg-gray-300",
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200",
          enabled ? "translate-x-7" : "translate-x-1",
        )}
      />
    </button>
  );

  return (
    <LecturerPage
      title="Settings"
      subtitle="Customize your experience"
      icon={LecturerIcons.Settings}
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
            saved
              ? "bg-emerald-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700",
          )}
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <>
              <Save className="w-4 h-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-purple-500" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            Appearance
          </h3>
          <div className="flex items-center justify-between">
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
                Use dark theme for the interface
              </p>
            </div>
            <ToggleSwitch enabled={isDarkMode} onChange={toggleDarkMode} />
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <Bell className="w-5 h-5 text-blue-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            {[
              {
                key: "email",
                label: "Email Notifications",
                desc: "Receive updates via email",
              },
              {
                key: "push",
                label: "Push Notifications",
                desc: "Browser push notifications",
              },
              {
                key: "submissions",
                label: "New Submissions",
                desc: "Alert when students submit exams",
              },
              {
                key: "flags",
                label: "Integrity Flags",
                desc: "Alert for flagged submissions",
              },
              {
                key: "system",
                label: "System Updates",
                desc: "Receive system maintenance alerts",
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
                  enabled={settings.notifications[item.key]}
                  onChange={() => toggleSetting("notifications", item.key)}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <Globe className="w-5 h-5 text-emerald-500" />
            Preferences
          </h3>
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
                  Interface language
                </p>
              </div>
              <select
                value={settings.preferences.language}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      language: e.target.value,
                    },
                  }))
                }
                className={cn(
                  "px-3 py-2 rounded-lg border outline-none",
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-gray-200",
                )}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Auto-Grade MCQs
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  Automatically grade objective questions
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.preferences.autoGrade}
                onChange={() => toggleSetting("preferences", "autoGrade")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Show Scores to Students
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  Allow students to see their scores
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.preferences.showScores}
                onChange={() => toggleSetting("preferences", "showScores")}
              />
            </div>
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <Shield className="w-5 h-5 text-purple-500" />
            Privacy
          </h3>
          <div className="space-y-4">
            {[
              {
                key: "showProfile",
                label: "Public Profile",
                desc: "Allow others to view your profile",
              },
              {
                key: "showActivity",
                label: "Activity Status",
                desc: "Show when you are online",
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
                  enabled={settings.privacy[item.key]}
                  onChange={() => toggleSetting("privacy", item.key)}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <Eye className="w-5 h-5 text-orange-500" />
            Accessibility
          </h3>
          <div className="space-y-4">
            {[
              {
                key: "reduceMotion",
                label: "Reduce Motion",
                desc: "Minimize animations",
              },
              {
                key: "highContrast",
                label: "High Contrast",
                desc: "Increase text contrast",
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
                  enabled={settings.accessibility[item.key]}
                  onChange={() => toggleSetting("accessibility", item.key)}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default Settings;
