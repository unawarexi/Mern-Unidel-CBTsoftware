import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
  Archive,
  X,
  ChevronRight,
  Settings,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const SystemMessages = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all");

  // Mock system messages (in real app, would come from API)
  const [messages] = useState([
    {
      id: "1",
      type: "success",
      title: "Welcome to UNIDEL CBT Platform",
      message:
        "Your account has been successfully created. You can now access all student features including courses, exams, and results.",
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
    {
      id: "2",
      type: "info",
      title: "Platform Maintenance Notice",
      message:
        "Scheduled maintenance will occur on Sunday 3:00 AM - 5:00 AM. Some features may be temporarily unavailable during this time.",
      timestamp: new Date(Date.now() - 172800000),
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Password Security Reminder",
      message:
        "For your security, we recommend updating your password every 90 days. Your last password change was 85 days ago.",
      timestamp: new Date(Date.now() - 259200000),
      read: false,
    },
    {
      id: "4",
      type: "info",
      title: "New Feature: Dark Mode",
      message:
        "We've added dark mode support! Toggle it from your profile settings or click the theme button in the sidebar.",
      timestamp: new Date(Date.now() - 604800000),
      read: true,
    },
  ]);

  const getMessageIcon = (type) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getMessageColors = (type) => {
    switch (type) {
      case "success":
        return {
          bg: isDarkMode ? "bg-emerald-500/20" : "bg-emerald-50",
          icon: "text-emerald-500",
          border: "border-emerald-500",
        };
      case "warning":
        return {
          bg: isDarkMode ? "bg-amber-500/20" : "bg-amber-50",
          icon: "text-amber-500",
          border: "border-amber-500",
        };
      case "error":
        return {
          bg: isDarkMode ? "bg-red-500/20" : "bg-red-50",
          icon: "text-red-500",
          border: "border-red-500",
        };
      default:
        return {
          bg: isDarkMode ? "bg-blue-500/20" : "bg-blue-50",
          icon: "text-blue-500",
          border: "border-blue-500",
        };
    }
  };

  const filteredMessages =
    filter === "all"
      ? messages
      : filter === "unread"
        ? messages.filter((m) => !m.read)
        : messages.filter((m) => m.type === filter);

  const unreadCount = messages.filter((m) => !m.read).length;

  const actions = (
    <div className="flex items-center gap-2">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={cn(
          "px-3 py-2 text-sm rounded-xl border outline-none",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-700",
        )}
      >
        <option value="all">All Messages</option>
        <option value="unread">Unread</option>
        <option value="info">Information</option>
        <option value="warning">Warnings</option>
        <option value="success">Success</option>
      </select>
    </div>
  );

  return (
    <StudentPage
      title="System Messages"
      subtitle="Important system notifications and updates"
      icon={StudentIcons.Notifications}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total",
              value: messages.length,
              icon: MessageSquare,
              color: "text-blue-500",
            },
            {
              label: "Unread",
              value: unreadCount,
              icon: Bell,
              color: "text-orange-500",
            },
            {
              label: "Warnings",
              value: messages.filter((m) => m.type === "warning").length,
              icon: AlertCircle,
              color: "text-amber-500",
            },
            {
              label: "Info",
              value: messages.filter((m) => m.type === "info").length,
              icon: Info,
              color: "text-cyan-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <div>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {stat.value}
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
              </div>
            </motion.div>
          ))}
        </div>

        {/* Messages List */}
        <div
          className={cn(
            "rounded-3xl border overflow-hidden",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          {filteredMessages.length === 0 ? (
            <div
              className={cn(
                "text-center py-16",
                isDarkMode ? "text-slate-500" : "text-gray-500",
              )}
            >
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Messages</h3>
              <p className="text-sm">No system messages to display</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredMessages.map((message, idx) => {
                const Icon = getMessageIcon(message.type);
                const colors = getMessageColors(message.type);

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "p-4 cursor-pointer transition-all border-l-4",
                      colors.border,
                      isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-gray-50",
                      !message.read &&
                        (isDarkMode ? "bg-slate-700/20" : "bg-blue-50/50"),
                    )}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          colors.bg,
                        )}
                      >
                        <Icon className={cn("w-5 h-5", colors.icon)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-white" : "text-gray-900",
                              !message.read && "font-bold",
                            )}
                          >
                            {message.title}
                          </h4>
                          {!message.read && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-sm line-clamp-2 mt-1",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {message.message}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-2 flex items-center gap-1",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          {message.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Detail Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMessage(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full max-w-lg rounded-3xl p-6 shadow-xl",
                  isDarkMode ? "bg-slate-800" : "bg-white",
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      getMessageColors(selectedMessage.type).bg,
                    )}
                  >
                    {React.createElement(getMessageIcon(selectedMessage.type), {
                      className: cn(
                        "w-6 h-6",
                        getMessageColors(selectedMessage.type).icon,
                      ),
                    })}
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isDarkMode
                        ? "hover:bg-slate-700 text-slate-400"
                        : "hover:bg-gray-100 text-gray-500",
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {selectedMessage.title}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-4",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  {selectedMessage.message}
                </p>
                <p
                  className={cn(
                    "text-xs flex items-center gap-1",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  <Clock className="w-3 h-3" />
                  {selectedMessage.timestamp.toLocaleString()}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StudentPage>
  );
};

export default SystemMessages;
