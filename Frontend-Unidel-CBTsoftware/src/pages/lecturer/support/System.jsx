import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  RefreshCw,
  Server,
  Shield,
  Database,
  Wifi,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const System = () => {
  const { isDarkMode } = useThemeStore();
  const [loading, setLoading] = useState(false);

  // Mock system messages
  const messages = [
    {
      id: 1,
      type: "success",
      title: "System Update Complete",
      message:
        "Version 2.5.0 has been successfully deployed. New features include enhanced proctoring and improved grading interface.",
      timestamp: "2024-12-15T10:30:00",
      read: true,
    },
    {
      id: 2,
      type: "info",
      title: "Scheduled Maintenance",
      message:
        "System maintenance is scheduled for December 22nd, 12:00 AM - 6:00 AM. Please save your work before this time.",
      timestamp: "2024-12-14T14:00:00",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "High Server Load",
      message:
        "Due to increased exam activity, you may experience slower response times. We are scaling resources to handle the load.",
      timestamp: "2024-12-13T09:15:00",
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "New Feature: Bulk Question Upload",
      message:
        "You can now upload multiple questions at once using Excel templates. Check the Question Bank section for details.",
      timestamp: "2024-12-10T11:00:00",
      read: true,
    },
    {
      id: 5,
      type: "success",
      title: "Security Update Applied",
      message:
        "Latest security patches have been applied. All data remains secure and encrypted.",
      timestamp: "2024-12-08T08:45:00",
      read: true,
    },
  ];

  const systemStatus = [
    { label: "API Server", status: "operational", icon: Server },
    { label: "Database", status: "operational", icon: Database },
    { label: "CDN", status: "operational", icon: Wifi },
    { label: "Security", status: "operational", icon: Shield },
  ];

  const getTypeConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          color: "text-emerald-500",
          bg: isDarkMode
            ? "bg-emerald-500/10 border-emerald-500/30"
            : "bg-emerald-50 border-emerald-200",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-amber-500",
          bg: isDarkMode
            ? "bg-amber-500/10 border-amber-500/30"
            : "bg-amber-50 border-amber-200",
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          bg: isDarkMode
            ? "bg-red-500/10 border-red-500/30"
            : "bg-red-50 border-red-200",
        };
      default:
        return {
          icon: Info,
          color: "text-blue-500",
          bg: isDarkMode
            ? "bg-blue-500/10 border-blue-500/30"
            : "bg-blue-50 border-blue-200",
        };
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0)
      return (
        "Today at " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <LecturerPage
      title="System Messages"
      subtitle="System updates and notifications"
      icon={LecturerIcons.Settings}
      actions={
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
          }}
          className={cn(
            "p-2 rounded-xl transition-all",
            isDarkMode
              ? "bg-slate-800 text-slate-400 hover:text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
        </button>
      }
    >
      <div className="space-y-6">
        {/* System Status */}
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
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            System Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemStatus.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-4 rounded-xl flex items-center gap-3",
                  isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    item.status === "operational"
                      ? "text-emerald-500"
                      : "text-red-500",
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "font-medium text-sm",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      item.status === "operational"
                        ? "text-emerald-500"
                        : "text-red-500",
                    )}
                  >
                    {item.status === "operational" ? "Operational" : "Issues"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Messages */}
        <div>
          <h3
            className={cn(
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Recent Messages
          </h3>
          {loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} height={100} className="rounded-2xl" />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => {
                const config = getTypeConfig(msg.type);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "p-5 rounded-2xl border transition-all",
                      config.bg,
                      !msg.read && "ring-2 ring-blue-500",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          isDarkMode ? "bg-slate-800" : "bg-white",
                        )}
                      >
                        <Icon className={cn("w-5 h-5", config.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            {msg.title}
                            {!msg.read && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-500 text-white">
                                New
                              </span>
                            )}
                          </h4>
                          <span
                            className={cn(
                              "text-xs flex items-center gap-1",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            <Clock className="w-3 h-3" />
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border text-center",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <Settings
            className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDarkMode ? "text-slate-500" : "text-gray-400",
            )}
          />
          <p
            className={cn(
              "font-medium",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Unidel CBT System
          </p>
          <p
            className={cn(
              "text-sm mt-1",
              isDarkMode ? "text-slate-500" : "text-gray-500",
            )}
          >
            Version 2.5.0
          </p>
          <p
            className={cn(
              "text-xs mt-2",
              isDarkMode ? "text-slate-600" : "text-gray-400",
            )}
          >
            Last updated: December 15, 2024
          </p>
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default System;
