import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  RefreshCw,
  Settings,
  Clock,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Timer,
  Monitor,
  Sliders,
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

const ExamRules = () => {
  const { isDarkMode } = useThemeStore();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [rules, setRules] = useState({
    // Browser restrictions
    allowTabSwitch: false,
    maxTabSwitches: 3,
    autoSubmitOnViolation: false,
    allowFullscreenExit: false,
    blockRightClick: true,
    blockCopyPaste: true,
    blockDevTools: true,

    // Time settings
    defaultDuration: 60,
    warningBeforeEnd: 5,
    gracePeriod: 2,
    autoSubmitWhenTimeUp: true,

    // Display settings
    showRemainingQuestions: true,
    allowQuestionNavigation: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    showScoreImmediately: false,

    // Security
    requireFaceVerification: false,
    captureScreenshots: false,
    monitorWebcam: false,
  });

  const { settings = [], isLoading, refetch } = useGetSiteSettingsAction();

  const { bulkUpdateSettings } = useBulkUpdateSettingsAction();

  useEffect(() => {
    if (settings && settings.length > 0) {
      const examSettings = settings.find(
        (s) => s.category === "exam_rules" || s.key === "exam_rules",
      );
      if (examSettings?.value) {
        setRules((prev) => ({ ...prev, ...examSettings.value }));
      }
    }
  }, [settings]);

  const handleToggle = (key) => {
    setRules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setRules((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await bulkUpdateSettings([
        { key: "exam_rules", value: rules, category: "exam" },
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
      title="Exam Rules"
      subtitle="Configure default exam security and behavior settings"
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
          {/* Browser Restrictions */}
          <AdminCard title="Browser Restrictions" icon={Shield}>
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
              <ToggleSwitch
                enabled={rules.blockRightClick}
                onChange={() => handleToggle("blockRightClick")}
                label="Block Right Click"
                description="Disable context menu during exams"
              />
              <ToggleSwitch
                enabled={rules.blockCopyPaste}
                onChange={() => handleToggle("blockCopyPaste")}
                label="Block Copy/Paste"
                description="Disable copy and paste functionality"
              />
              <ToggleSwitch
                enabled={rules.blockDevTools}
                onChange={() => handleToggle("blockDevTools")}
                label="Block Developer Tools"
                description="Prevent opening browser dev tools"
              />
              <ToggleSwitch
                enabled={!rules.allowTabSwitch}
                onChange={() => handleToggle("allowTabSwitch")}
                label="Restrict Tab Switching"
                description="Monitor and limit tab switching"
              />
              {!rules.allowTabSwitch && (
                <div className="py-3 pl-4">
                  <label
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    Max allowed tab switches before warning:
                  </label>
                  <input
                    type="number"
                    value={rules.maxTabSwitches}
                    onChange={(e) =>
                      handleChange("maxTabSwitches", parseInt(e.target.value))
                    }
                    min={1}
                    max={10}
                    className={cn(
                      "ml-3 w-20 px-3 py-1 rounded-lg border text-center",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                    )}
                  />
                </div>
              )}
              <ToggleSwitch
                enabled={rules.autoSubmitOnViolation}
                onChange={() => handleToggle("autoSubmitOnViolation")}
                label="Auto-Submit on Violation"
                description="Automatically submit exam after multiple violations"
              />
            </div>
          </AdminCard>

          {/* Time Settings */}
          <AdminCard title="Time Settings" icon={Timer}>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Default Duration (minutes)
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-500",
                    )}
                  >
                    Default exam duration if not specified
                  </p>
                </div>
                <input
                  type="number"
                  value={rules.defaultDuration}
                  onChange={(e) =>
                    handleChange("defaultDuration", parseInt(e.target.value))
                  }
                  min={10}
                  max={300}
                  className={cn(
                    "w-24 px-3 py-2 rounded-xl border text-center",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                  )}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Warning Before End (minutes)
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-500",
                    )}
                  >
                    Show warning before exam time ends
                  </p>
                </div>
                <input
                  type="number"
                  value={rules.warningBeforeEnd}
                  onChange={(e) =>
                    handleChange("warningBeforeEnd", parseInt(e.target.value))
                  }
                  min={1}
                  max={30}
                  className={cn(
                    "w-24 px-3 py-2 rounded-xl border text-center",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                  )}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Grace Period (minutes)
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-500",
                    )}
                  >
                    Extra time after exam ends to submit
                  </p>
                </div>
                <input
                  type="number"
                  value={rules.gracePeriod}
                  onChange={(e) =>
                    handleChange("gracePeriod", parseInt(e.target.value))
                  }
                  min={0}
                  max={10}
                  className={cn(
                    "w-24 px-3 py-2 rounded-xl border text-center",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                  )}
                />
              </div>
              <ToggleSwitch
                enabled={rules.autoSubmitWhenTimeUp}
                onChange={() => handleToggle("autoSubmitWhenTimeUp")}
                label="Auto-Submit When Time Up"
                description="Automatically submit exam when time expires"
              />
            </div>
          </AdminCard>

          {/* Display Settings */}
          <AdminCard title="Display Settings" icon={Monitor}>
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
              <ToggleSwitch
                enabled={rules.shuffleQuestions}
                onChange={() => handleToggle("shuffleQuestions")}
                label="Shuffle Questions"
                description="Randomize question order for each student"
              />
              <ToggleSwitch
                enabled={rules.shuffleOptions}
                onChange={() => handleToggle("shuffleOptions")}
                label="Shuffle Options"
                description="Randomize answer options for each question"
              />
              <ToggleSwitch
                enabled={rules.allowQuestionNavigation}
                onChange={() => handleToggle("allowQuestionNavigation")}
                label="Allow Question Navigation"
                description="Allow students to move between questions"
              />
              <ToggleSwitch
                enabled={rules.showRemainingQuestions}
                onChange={() => handleToggle("showRemainingQuestions")}
                label="Show Question Progress"
                description="Display remaining questions indicator"
              />
              <ToggleSwitch
                enabled={rules.showScoreImmediately}
                onChange={() => handleToggle("showScoreImmediately")}
                label="Show Score Immediately"
                description="Display score after exam submission"
              />
            </div>
          </AdminCard>

          {/* Advanced Security */}
          <AdminCard title="Advanced Security (Beta)" icon={Eye}>
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
              <ToggleSwitch
                enabled={rules.requireFaceVerification}
                onChange={() => handleToggle("requireFaceVerification")}
                label="Face Verification"
                description="Require face match before starting exam"
              />
              <ToggleSwitch
                enabled={rules.captureScreenshots}
                onChange={() => handleToggle("captureScreenshots")}
                label="Periodic Screenshots"
                description="Capture screenshots during exam for review"
              />
              <ToggleSwitch
                enabled={rules.monitorWebcam}
                onChange={() => handleToggle("monitorWebcam")}
                label="Webcam Monitoring"
                description="Enable webcam proctoring during exam"
              />
            </div>
            <div
              className={cn(
                "mt-4 p-4 rounded-xl flex items-start gap-3",
                isDarkMode ? "bg-amber-500/10" : "bg-amber-50",
              )}
            >
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-amber-400" : "text-amber-700",
                )}
              >
                Advanced security features are in beta and may affect exam
                performance. Test thoroughly before enabling in production.
              </p>
            </div>
          </AdminCard>
        </div>
      )}
    </AdminPage>
  );
};

export default ExamRules;
