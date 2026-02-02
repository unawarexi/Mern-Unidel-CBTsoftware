import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronRight,
  Filter,
  RefreshCw,
  Megaphone,
  BookOpen,
  GraduationCap,
  Trash2,
  X,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetActiveExamsForStudentAction } from "../../../store/exam-store";
import { useGetStudentDashboardStatsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";

const Notices = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Fetch active exams for upcoming reminders
  const {
    activeExams = [],
    isLoading: examsLoading,
    refetch: refetchExams,
  } = useGetActiveExamsForStudentAction();

  // Fetch dashboard stats
  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetStudentDashboardStatsAction({});

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchExams(), refetchStats()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Generate notices from various sources
  const generateNotices = () => {
    const notices = [];

    // Exam reminders
    activeExams.forEach((exam) => {
      const startDate = new Date(exam.startTime);
      const now = new Date();
      const hoursUntil = (startDate - now) / (1000 * 60 * 60);

      if (hoursUntil > 0 && hoursUntil <= 48) {
        notices.push({
          id: `exam-${exam._id}`,
          type: "exam",
          priority: hoursUntil <= 2 ? "urgent" : "important",
          title: `Upcoming Exam: ${exam.courseId?.courseCode}`,
          message: `${exam.courseId?.courseTitle} exam starts ${
            hoursUntil <= 1
              ? "in less than an hour"
              : `in ${Math.round(hoursUntil)} hours`
          }`,
          date: startDate,
          action: () => navigate(`/student/exams/take/${exam._id}`),
          actionLabel: "Go to Exam",
        });
      }
    });

    // Add system notices based on stats
    if (dashboardStats?.overview?.failedExams > 0) {
      notices.push({
        id: "failed-exams",
        type: "alert",
        priority: "warning",
        title: "Review Your Failed Exams",
        message: `You have ${dashboardStats.overview.failedExams} failed exam(s). Consider reviewing the material and retaking if available.`,
        date: new Date(),
        action: () => navigate("/student/results/all"),
        actionLabel: "View Results",
      });
    }

    if (dashboardStats?.overview?.averageScore < 60) {
      notices.push({
        id: "low-score",
        type: "alert",
        priority: "warning",
        title: "Academic Performance Alert",
        message: `Your average score is ${dashboardStats.overview.averageScore}%. Consider seeking academic support.`,
        date: new Date(),
        action: () => navigate("/student/results/analytics"),
        actionLabel: "View Analytics",
      });
    }

    // Add informational notices
    notices.push({
      id: "integrity-reminder",
      type: "info",
      priority: "normal",
      title: "Academic Integrity Reminder",
      message:
        "Remember to follow all academic integrity policies during exams. Violations may result in automatic submission.",
      date: new Date(Date.now() - 86400000),
      action: () => navigate("/student/support/integrity"),
      actionLabel: "View Policy",
    });

    if (activeExams.length > 0) {
      notices.push({
        id: "active-exams-count",
        type: "info",
        priority: "normal",
        title: `${activeExams.length} Active Exam${activeExams.length > 1 ? "s" : ""} Available`,
        message:
          "You have exams ready to take. Check your exam schedule and prepare accordingly.",
        date: new Date(),
        action: () => navigate("/student/exams/active"),
        actionLabel: "View Exams",
      });
    }

    // Sort by date (most recent first) and priority
    return notices.sort((a, b) => {
      const priorityOrder = { urgent: 0, important: 1, warning: 2, normal: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.date) - new Date(a.date);
    });
  };

  const notices = generateNotices();

  const filteredNotices =
    filter === "all"
      ? notices
      : notices.filter((n) => n.type === filter || n.priority === filter);

  const getNoticeIcon = (type, priority) => {
    if (priority === "urgent") return AlertCircle;
    if (type === "exam") return GraduationCap;
    if (type === "alert") return AlertCircle;
    if (type === "info") return Info;
    return Bell;
  };

  const getNoticeColors = (type, priority) => {
    if (priority === "urgent")
      return {
        bg: isDarkMode ? "bg-red-500/20" : "bg-red-50",
        border: "border-red-500",
        icon: "text-red-500",
        badge: "bg-red-500 text-white",
      };
    if (priority === "warning" || type === "alert")
      return {
        bg: isDarkMode ? "bg-amber-500/20" : "bg-amber-50",
        border: "border-amber-500",
        icon: "text-amber-500",
        badge: "bg-amber-500 text-white",
      };
    if (type === "exam")
      return {
        bg: isDarkMode ? "bg-blue-500/20" : "bg-blue-50",
        border: "border-blue-500",
        icon: "text-blue-500",
        badge: "bg-blue-500 text-white",
      };
    return {
      bg: isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
      border: "border-gray-300",
      icon: isDarkMode ? "text-slate-400" : "text-gray-500",
      badge: isDarkMode
        ? "bg-slate-600 text-slate-300"
        : "bg-gray-200 text-gray-700",
    };
  };

  const actions = (
    <div className="flex items-center gap-2">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={cn(
          "px-3 py-2 text-sm rounded-xl border outline-none transition-all",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-700",
        )}
      >
        <option value="all">All Notices</option>
        <option value="exam">Exam Reminders</option>
        <option value="alert">Alerts</option>
        <option value="info">Information</option>
      </select>
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

  const isLoading = examsLoading || statsLoading;

  return (
    <StudentPage
      title="Notices & Reminders"
      subtitle="Stay updated with important announcements and exam reminders"
      icon={StudentIcons.Notifications}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Notices",
              value: notices.length,
              icon: Bell,
              color: "text-blue-500",
            },
            {
              label: "Urgent",
              value: notices.filter((n) => n.priority === "urgent").length,
              icon: AlertCircle,
              color: "text-red-500",
            },
            {
              label: "Exam Reminders",
              value: notices.filter((n) => n.type === "exam").length,
              icon: GraduationCap,
              color: "text-orange-500",
            },
            {
              label: "Alerts",
              value: notices.filter((n) => n.type === "alert").length,
              icon: AlertCircle,
              color: "text-amber-500",
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
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {isLoading ? (
                      <Skeleton
                        width={30}
                        baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                        highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                      />
                    ) : (
                      stat.value
                    )}
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

        {/* Notices List */}
        <div
          className={cn(
            "rounded-3xl border overflow-hidden",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div
            className={cn(
              "px-6 py-4 border-b",
              isDarkMode ? "border-slate-700" : "border-gray-100",
            )}
          >
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              All Notices ({filteredNotices.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4">
                    <Skeleton
                      height={60}
                      borderRadius={12}
                      baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                      highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                    />
                  </div>
                ))
            ) : filteredNotices.length === 0 ? (
              <div
                className={cn(
                  "text-center py-16",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notices to display</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredNotices.map((notice, idx) => {
                  const Icon = getNoticeIcon(notice.type, notice.priority);
                  const colors = getNoticeColors(notice.type, notice.priority);

                  return (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "p-4 hover:bg-opacity-50 transition-all cursor-pointer border-l-4",
                        colors.border,
                        isDarkMode
                          ? "hover:bg-slate-700/30"
                          : "hover:bg-gray-50",
                      )}
                      onClick={() => setSelectedNotice(notice)}
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
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={cn(
                                "font-semibold truncate",
                                isDarkMode ? "text-white" : "text-gray-900",
                              )}
                            >
                              {notice.title}
                            </h4>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase",
                                colors.badge,
                              )}
                            >
                              {notice.priority}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-sm line-clamp-2",
                              isDarkMode ? "text-slate-400" : "text-gray-600",
                            )}
                          >
                            {notice.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span
                              className={cn(
                                "text-xs flex items-center gap-1",
                                isDarkMode ? "text-slate-500" : "text-gray-500",
                              )}
                            >
                              <Clock className="w-3 h-3" />
                              {new Date(notice.date).toLocaleString()}
                            </span>
                          </div>
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
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Notice Detail Modal */}
        <AnimatePresence>
          {selectedNotice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedNotice(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full max-w-md rounded-3xl p-6 shadow-xl",
                  isDarkMode ? "bg-slate-800" : "bg-white",
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      getNoticeColors(
                        selectedNotice.type,
                        selectedNotice.priority,
                      ).bg,
                    )}
                  >
                    {React.createElement(
                      getNoticeIcon(
                        selectedNotice.type,
                        selectedNotice.priority,
                      ),
                      {
                        className: cn(
                          "w-6 h-6",
                          getNoticeColors(
                            selectedNotice.type,
                            selectedNotice.priority,
                          ).icon,
                        ),
                      },
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedNotice(null)}
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
                  {selectedNotice.title}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-4",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  {selectedNotice.message}
                </p>
                <p
                  className={cn(
                    "text-xs mb-6 flex items-center gap-1",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  <Calendar className="w-3 h-3" />
                  {new Date(selectedNotice.date).toLocaleString()}
                </p>
                {selectedNotice.action && (
                  <button
                    onClick={() => {
                      selectedNotice.action();
                      setSelectedNotice(null);
                    }}
                    className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all"
                  >
                    {selectedNotice.actionLabel}
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StudentPage>
  );
};

export default Notices;
