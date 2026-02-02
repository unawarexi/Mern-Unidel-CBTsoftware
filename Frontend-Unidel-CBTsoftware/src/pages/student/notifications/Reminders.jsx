import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Clock,
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Timer,
  GraduationCap,
  Settings,
  BellOff,
  Volume2,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetActiveExamsForStudentAction } from "../../../store/exam-store";
import {
  formatDate,
  hasExamStarted,
  createCountdownTimer,
} from "../../../core/utils/time-laspe.util";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";

const Reminders = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [examTimers, setExamTimers] = useState({});
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    beforeHours: 24,
  });

  // Fetch active exams
  const {
    activeExams = [],
    isLoading,
    refetch,
  } = useGetActiveExamsForStudentAction();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Filter upcoming exams
  const upcomingExams = activeExams.filter(
    (exam) => exam.startTime && !hasExamStarted(exam.startTime),
  );

  // Update countdown timers
  useEffect(() => {
    if (!upcomingExams || upcomingExams.length === 0) return;

    const cleanupFunctions = upcomingExams.map((exam) => {
      if (!exam.startTime) return () => {};

      return createCountdownTimer(
        exam.startTime,
        (timeData) => {
          setExamTimers((prev) => ({
            ...prev,
            [exam._id]: timeData,
          }));
        },
        1000,
      );
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
    };
  }, [upcomingExams.length]);

  // Create reminders from upcoming exams
  const reminders = upcomingExams
    .map((exam) => {
      const startDate = new Date(exam.startTime);
      const now = new Date();
      const hoursUntil = (startDate - now) / (1000 * 60 * 60);

      let priority = "normal";
      if (hoursUntil <= 1) priority = "urgent";
      else if (hoursUntil <= 24) priority = "important";

      return {
        id: exam._id,
        exam,
        startDate,
        hoursUntil,
        priority,
        timer: examTimers[exam._id],
      };
    })
    .sort((a, b) => a.hoursUntil - b.hoursUntil);

  // Stats
  const urgentCount = reminders.filter((r) => r.priority === "urgent").length;
  const todayCount = reminders.filter((r) => r.hoursUntil <= 24).length;
  const thisWeekCount = reminders.filter((r) => r.hoursUntil <= 168).length;

  const getPriorityColors = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          border: "border-red-500",
          bg: isDarkMode ? "bg-red-500/10" : "bg-red-50",
          badge: "bg-red-500 text-white",
          icon: "text-red-500",
        };
      case "important":
        return {
          border: "border-orange-500",
          bg: isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
          badge: "bg-orange-500 text-white",
          icon: "text-orange-500",
        };
      default:
        return {
          border: isDarkMode ? "border-slate-700" : "border-gray-200",
          bg: isDarkMode ? "bg-slate-800/50" : "bg-white",
          badge: isDarkMode
            ? "bg-slate-700 text-slate-300"
            : "bg-gray-200 text-gray-700",
          icon: isDarkMode ? "text-slate-400" : "text-gray-500",
        };
    }
  };

  const actions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() =>
          setReminderSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
        }
        className={cn(
          "p-2 rounded-xl transition-all",
          reminderSettings.enabled
            ? "bg-orange-500/20 text-orange-500"
            : isDarkMode
              ? "bg-slate-800 text-slate-500"
              : "bg-gray-100 text-gray-400",
        )}
      >
        {reminderSettings.enabled ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className={cn(
          "p-2 rounded-xl transition-all",
          isDarkMode
            ? "bg-slate-800 text-slate-400 hover:text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        )}
      >
        <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
      </button>
    </div>
  );

  return (
    <StudentPage
      title="Exam Reminders"
      subtitle="Stay on top of your upcoming examinations"
      icon={StudentIcons.Notifications}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Urgent",
              value: urgentCount,
              icon: AlertCircle,
              color: "text-red-500",
            },
            {
              label: "Today",
              value: todayCount,
              icon: Clock,
              color: "text-orange-500",
            },
            {
              label: "This Week",
              value: thisWeekCount,
              icon: Calendar,
              color: "text-blue-500",
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
                    {isLoading ? <Skeleton width={30} /> : stat.value}
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

        {/* Reminders List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={120} borderRadius={16} />
              ))}
          </div>
        ) : reminders.length === 0 ? (
          <div
            className={cn(
              "text-center py-16 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Exams</h3>
            <p className="text-sm">
              You don't have any exam reminders at this time
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder, idx) => {
              const colors = getPriorityColors(reminder.priority);

              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-5 rounded-2xl border-l-4 transition-all cursor-pointer hover:shadow-lg",
                    colors.border,
                    colors.bg,
                  )}
                  onClick={() => navigate(`/student/exams/upcoming`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          reminder.priority === "urgent"
                            ? "bg-red-500/20"
                            : reminder.priority === "important"
                              ? "bg-orange-500/20"
                              : isDarkMode
                                ? "bg-slate-700"
                                : "bg-gray-100",
                        )}
                      >
                        <GraduationCap className={cn("w-6 h-6", colors.icon)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={cn(
                              "font-bold",
                              isDarkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            {reminder.exam.courseId?.courseCode}
                          </h4>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs font-medium rounded-full uppercase",
                              colors.badge,
                            )}
                          >
                            {reminder.priority}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-sm mb-2",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {reminder.exam.courseId?.courseTitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span
                            className={cn(
                              "flex items-center gap-1",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            <Calendar className="w-4 h-4" />
                            {formatDate(reminder.startDate, "MMM D, YYYY")}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-1",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            <Clock className="w-4 h-4" />
                            {formatDate(reminder.startDate, "h:mm A")}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-1",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            <Timer className="w-4 h-4" />
                            {reminder.exam.duration} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Countdown */}
                    <div
                      className={cn(
                        "p-4 rounded-xl text-center min-w-[160px]",
                        reminder.priority === "urgent"
                          ? "bg-red-500/30"
                          : reminder.priority === "important"
                            ? "bg-orange-500/20"
                            : isDarkMode
                              ? "bg-slate-700/50"
                              : "bg-gray-100",
                      )}
                    >
                      <p
                        className={cn(
                          "text-xs font-medium mb-1 uppercase",
                          colors.icon,
                        )}
                      >
                        Starts In
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold font-mono",
                          colors.icon,
                        )}
                      >
                        {reminder.timer?.formatted || "--:--:--"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Reminder Settings */}
        <div
          className={cn(
            "p-5 rounded-2xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-gray-50 border-gray-100",
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <Settings
              className={cn(
                "w-5 h-5",
                isDarkMode ? "text-slate-400" : "text-gray-500",
              )}
            />
            <h4
              className={cn(
                "font-semibold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Reminder Settings
            </h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reminderSettings.enabled}
                onChange={(e) =>
                  setReminderSettings((prev) => ({
                    ...prev,
                    enabled: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
              />
              <span
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-slate-300" : "text-gray-700",
                )}
              >
                Enable exam reminders
              </span>
            </label>
            <select
              value={reminderSettings.beforeHours}
              onChange={(e) =>
                setReminderSettings((prev) => ({
                  ...prev,
                  beforeHours: Number(e.target.value),
                }))
              }
              className={cn(
                "px-4 py-2 rounded-xl border outline-none text-sm",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-200 text-gray-700",
              )}
            >
              <option value={1}>1 hour before</option>
              <option value={2}>2 hours before</option>
              <option value={6}>6 hours before</option>
              <option value={12}>12 hours before</option>
              <option value={24}>24 hours before</option>
            </select>
          </div>
        </div>
      </div>
    </StudentPage>
  );
};

export default Reminders;
