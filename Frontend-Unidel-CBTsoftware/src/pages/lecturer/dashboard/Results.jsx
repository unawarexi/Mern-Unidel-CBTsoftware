import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Clock,
  Percent,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerDashboardStatsAction } from "../../../store/statistics-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Results = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);

  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetLecturerDashboardStatsAction({});

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchStats();
    setRefreshing(false);
  };

  const totalSubmissions = dashboardStats?.submissions?.totalSubmissions || 0;
  const gradedSubmissions = dashboardStats?.submissions?.gradedSubmissions || 0;
  const pendingGrading = totalSubmissions - gradedSubmissions;
  const averageScore = parseFloat(
    dashboardStats?.submissions?.averageScore || 0,
  );
  const passRate = dashboardStats?.submissions?.passRate || 0;

  const stats = [
    {
      label: "Total Submissions",
      value: totalSubmissions,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Graded",
      value: gradedSubmissions,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Pending",
      value: pendingGrading,
      icon: Clock,
      color: "text-amber-500",
    },
    {
      label: "Average Score",
      value: `${averageScore.toFixed(1)}%`,
      icon: Award,
      color: "text-purple-500",
    },
  ];

  const recentResults = dashboardStats?.recentSubmissions?.slice(0, 8) || [];

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
      title="Results Overview"
      subtitle="Track student performance and submissions"
      icon={LecturerIcons.Results}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border text-center",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
              <p
                className={cn(
                  "text-2xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {statsLoading ? <Skeleton width={40} /> : stat.value}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pass Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30"
              : "bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-slate-400" : "text-gray-600",
                )}
              >
                Overall Pass Rate
              </p>
              <p
                className={cn(
                  "text-4xl font-bold mt-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {statsLoading ? (
                  <Skeleton width={80} />
                ) : (
                  `${passRate.toFixed(1)}%`
                )}
              </p>
            </div>
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                passRate >= 70
                  ? isDarkMode
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-100 text-emerald-600"
                  : passRate >= 50
                    ? isDarkMode
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-amber-100 text-amber-600"
                    : isDarkMode
                      ? "bg-red-500/10 text-red-400"
                      : "bg-red-100 text-red-600",
              )}
            >
              {passRate >= 70 ? (
                <TrendingUp className="w-8 h-8" />
              ) : (
                <TrendingDown className="w-8 h-8" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Recent Submissions
            </h3>
            <button
              onClick={() => navigate("/lecturer/exams/results")}
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                isDarkMode ? "text-blue-400" : "text-blue-600",
              )}
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {statsLoading ? (
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} height={60} className="rounded-xl" />
                ))}
            </div>
          ) : recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.map((result, idx) => (
                <motion.div
                  key={result._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-white border-gray-100",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                        result.passed
                          ? isDarkMode
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-emerald-100 text-emerald-600"
                          : isDarkMode
                            ? "bg-red-500/10 text-red-400"
                            : "bg-red-100 text-red-600",
                      )}
                    >
                      {result.percentage?.toFixed(0) || 0}%
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {result.studentId?.fullname || "Unknown Student"}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {result.examId?.courseId?.courseCode || ""} -{" "}
                        {result.examId?.courseId?.courseTitle || ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      result.passed
                        ? isDarkMode
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-emerald-100 text-emerald-600"
                        : isDarkMode
                          ? "bg-red-500/10 text-red-400"
                          : "bg-red-100 text-red-600",
                    )}
                  >
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "text-center py-12 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </LecturerPage>
  );
};

export default Results;
