import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Calendar,
  FileSpreadsheet,
  Users,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerDashboardStatsAction } from "../../../store/statistics-store";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Notices = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);

  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetLecturerDashboardStatsAction({});

  const {
    exams = [],
    isLoading: examsLoading,
    refetch: refetchExams,
  } = useGetLecturerExamsAction();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchExams()]);
    setRefreshing(false);
  };

  // Generate notices based on data
  const generateNotices = () => {
    const notices = [];
    const pendingGrading =
      (dashboardStats?.submissions?.totalSubmissions || 0) -
      (dashboardStats?.submissions?.gradedSubmissions || 0);
    const activeExams = exams.filter((e) => e.status === "active");
    const scheduledExams = exams.filter(
      (e) => e.status === "pending" || e.status === "scheduled",
    );

    // Pending grading warning
    if (pendingGrading > 0) {
      notices.push({
        id: 1,
        type: pendingGrading > 10 ? "warning" : "info",
        title: "Pending Grading",
        message: `You have ${pendingGrading} submission${pendingGrading > 1 ? "s" : ""} awaiting grading.`,
        icon: Clock,
        action: "/lecturer/submissions/manual",
      });
    }

    // Active exams alert
    if (activeExams.length > 0) {
      notices.push({
        id: 2,
        type: "success",
        title: "Active Exams",
        message: `${activeExams.length} exam${activeExams.length > 1 ? "s" : ""} currently in progress.`,
        icon: FileSpreadsheet,
        action: "/lecturer/monitoring/live",
      });
    }

    // Scheduled exams info
    if (scheduledExams.length > 0) {
      const nextExam = scheduledExams.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime),
      )[0];
      notices.push({
        id: 3,
        type: "info",
        title: "Upcoming Exam",
        message: `${nextExam.courseId?.courseCode || "Exam"} scheduled for ${new Date(nextExam.startTime).toLocaleDateString()}`,
        icon: Calendar,
        action: "/lecturer/exams/schedule",
      });
    }

    // Low pass rate warning
    const passRate = dashboardStats?.submissions?.passRate || 0;
    if (passRate > 0 && passRate < 50) {
      notices.push({
        id: 4,
        type: "warning",
        title: "Low Pass Rate Alert",
        message: `Overall pass rate is ${passRate.toFixed(1)}%. Consider reviewing exam difficulty.`,
        icon: AlertTriangle,
        action: "/lecturer/reports/performance",
      });
    }

    // Add default info if no notices
    if (notices.length === 0) {
      notices.push({
        id: 0,
        type: "info",
        title: "All Caught Up!",
        message: "No pending actions or alerts at this time.",
        icon: CheckCircle,
      });
    }

    return notices;
  };

  const notices = generateNotices();

  const getTypeStyles = (type) => {
    switch (type) {
      case "warning":
        return {
          bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50",
          border: isDarkMode ? "border-amber-500/30" : "border-amber-200",
          icon: "text-amber-500",
        };
      case "success":
        return {
          bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50",
          border: isDarkMode ? "border-emerald-500/30" : "border-emerald-200",
          icon: "text-emerald-500",
        };
      default:
        return {
          bg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
          border: isDarkMode ? "border-blue-500/30" : "border-blue-200",
          icon: "text-blue-500",
        };
    }
  };

  const actions = (
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
  );

  return (
    <LecturerPage
      title="Notices & Alerts"
      subtitle="Stay updated with important notifications"
      icon={LecturerIcons.Notifications}
      actions={actions}
    >
      <div className="space-y-4">
        {statsLoading || examsLoading
          ? Array(3)
              .fill(0)
              .map((_, idx) => (
                <Skeleton key={idx} height={80} className="rounded-2xl" />
              ))
          : notices.map((notice, idx) => {
              const styles = getTypeStyles(notice.type);
              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-5 rounded-2xl border flex items-start gap-4 transition-all",
                    styles.bg,
                    styles.border,
                    notice.action && "cursor-pointer hover:shadow-md",
                  )}
                  onClick={() =>
                    notice.action && (window.location.href = notice.action)
                  }
                >
                  <div
                    className={cn(
                      "p-2 rounded-xl",
                      notice.type === "warning"
                        ? isDarkMode
                          ? "bg-amber-500/10"
                          : "bg-amber-100"
                        : notice.type === "success"
                          ? isDarkMode
                            ? "bg-emerald-500/10"
                            : "bg-emerald-100"
                          : isDarkMode
                            ? "bg-blue-500/10"
                            : "bg-blue-100",
                    )}
                  >
                    <notice.icon className={cn("w-5 h-5", styles.icon)} />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-semibold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {notice.title}
                    </h4>
                    <p
                      className={cn(
                        "text-sm mt-1",
                        isDarkMode ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {notice.message}
                    </p>
                  </div>
                  {notice.action && (
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                  )}
                </motion.div>
              );
            })}

        {/* Quick Stats Summary */}
        <div
          className={cn(
            "mt-8 p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-gray-50 border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Quick Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Active Exams",
                value: exams.filter((e) => e.status === "active").length,
              },
              {
                label: "Total Students",
                value: dashboardStats?.overview?.totalStudents || 0,
              },
              {
                label: "Submissions Today",
                value: dashboardStats?.submissions?.today || 0,
              },
              {
                label: "Pass Rate",
                value: `${(dashboardStats?.submissions?.passRate || 0).toFixed(0)}%`,
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {statsLoading ? <Skeleton width={40} /> : item.value}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LecturerPage>
  );
};

export default Notices;
