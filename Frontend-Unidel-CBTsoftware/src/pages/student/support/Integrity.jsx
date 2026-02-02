import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Camera,
  Laptop,
  Clock,
  FileWarning,
  Scale,
  BookOpen,
  Info,
  AlertCircle,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import { useGetStudentDashboardStatsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Integrity = () => {
  const { isDarkMode } = useThemeStore();

  // Fetch dashboard stats for security info
  const { dashboardStats, isLoading } = useGetStudentDashboardStatsAction({});

  const policies = [
    {
      icon: Eye,
      title: "No Tab Switching",
      description:
        "Do not switch to other browser tabs or windows during the examination. Tab switches are monitored and recorded.",
      severity: "high",
    },
    {
      icon: Camera,
      title: "Webcam Monitoring",
      description:
        "If webcam proctoring is enabled, ensure your face is visible throughout the exam. Any attempts to hide or cover the camera will be flagged.",
      severity: "high",
    },
    {
      icon: Laptop,
      title: "Single Device Only",
      description:
        "Complete your examination on a single device. Using multiple devices simultaneously is prohibited and detectable.",
      severity: "high",
    },
    {
      icon: Clock,
      title: "Time Limits",
      description:
        "Complete your examination within the allocated time. The exam will auto-submit when time expires.",
      severity: "medium",
    },
    {
      icon: FileWarning,
      title: "No External Resources",
      description:
        "Unless explicitly allowed, do not use external websites, notes, or resources during the examination.",
      severity: "high",
    },
    {
      icon: Scale,
      title: "Fair Play",
      description:
        "Do not share questions or answers with other students. Each examination attempt is unique and monitored.",
      severity: "high",
    },
  ];

  const consequences = [
    "Automatic submission of your examination",
    "Zero score for the affected examination",
    "Notification sent to academic authorities",
    "Potential suspension from future examinations",
    "Permanent record in academic file",
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/20";
      default:
        return "text-blue-500 bg-blue-500/20";
    }
  };

  return (
    <StudentPage
      title="Academic Integrity"
      subtitle="Understand the examination rules and policies"
      icon={StudentIcons.Support}
    >
      <div className="space-y-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30"
              : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h3
                className={cn(
                  "text-xl font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Academic Integrity Policy
              </h3>
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-slate-300" : "text-gray-600",
                )}
              >
                The CBT platform employs advanced monitoring to ensure fair
                examinations. Please read and understand all policies before
                starting your exam. Violations will result in immediate action.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Your Security Stats */}
        <div
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Your Integrity Record
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Exams Completed",
                value: dashboardStats?.overview?.completedExams || 0,
                icon: BookOpen,
                color: "text-blue-500",
              },
              {
                label: "Tab Switches",
                value: dashboardStats?.security?.tabSwitches || 0,
                icon: Eye,
                status:
                  (dashboardStats?.security?.tabSwitches || 0) === 0
                    ? "good"
                    : "warning",
              },
              {
                label: "Violations",
                value: dashboardStats?.security?.violations || 0,
                icon: AlertTriangle,
                status:
                  (dashboardStats?.security?.violations || 0) === 0
                    ? "good"
                    : "bad",
              },
              {
                label: "Trust Score",
                value: `${dashboardStats?.security?.trustScore || 100}%`,
                icon: Shield,
                status:
                  (dashboardStats?.security?.trustScore || 100) >= 90
                    ? "good"
                    : "warning",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-4 rounded-xl text-center",
                  isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                )}
              >
                <stat.icon
                  className={cn(
                    "w-5 h-5 mx-auto mb-2",
                    stat.status === "good"
                      ? "text-emerald-500"
                      : stat.status === "bad"
                        ? "text-red-500"
                        : stat.status === "warning"
                          ? "text-amber-500"
                          : stat.color || "text-gray-500",
                  )}
                />
                <p
                  className={cn(
                    "text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {isLoading ? "-" : stat.value}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Policies Grid */}
        <div>
          <h3
            className={cn(
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Examination Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-5 rounded-2xl border",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      getSeverityColor(policy.severity),
                    )}
                  >
                    <policy.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "font-semibold mb-1",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {policy.title}
                    </h4>
                    <p
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {policy.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-red-500/10 border-red-500/30"
              : "bg-red-50 border-red-200",
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Consequences of Violations
            </h3>
          </div>
          <ul className="space-y-2">
            {consequences.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-300" : "text-gray-700",
                  )}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Acknowledgment */}
        <div
          className={cn(
            "p-6 rounded-3xl border text-center",
            isDarkMode
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-emerald-50 border-emerald-200",
          )}
        >
          <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
          <h4
            className={cn(
              "font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Policy Acknowledgment
          </h4>
          <p
            className={cn(
              "text-sm mb-4",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            By starting any examination, you automatically acknowledge and agree
            to abide by these academic integrity policies.
          </p>
          <p
            className={cn(
              "text-xs",
              isDarkMode ? "text-slate-500" : "text-gray-500",
            )}
          >
            Last updated: January 2025
          </p>
        </div>
      </div>
    </StudentPage>
  );
};

export default Integrity;
