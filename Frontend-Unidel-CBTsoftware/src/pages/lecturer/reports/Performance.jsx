import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  RefreshCw,
  ChevronDown,
  Search,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerDashboardStatsAction } from "../../../store/statistics-store";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Performance = () => {
  const { isDarkMode } = useThemeStore();
  const [timeFilter, setTimeFilter] = useState("month");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const { dashboardStats, isLoading, refetch } =
    useGetLecturerDashboardStatsAction({ period: timeFilter });
  const { exams = [] } = useGetLecturerExamsAction();

  // Get unique courses
  const courses = [
    ...new Set(exams.map((e) => e.courseId?.courseCode).filter(Boolean)),
  ];

  // Performance metrics
  const avgScore = dashboardStats?.submissions?.averageScore || 0;
  const passRate = dashboardStats?.submissions?.passRate || 0;
  const totalStudents = dashboardStats?.overview?.totalStudents || 0;
  const improvement = dashboardStats?.performance?.improvement || 0;

  // Performance trend data (mock)
  const trendData = [
    { month: "Jan", avgScore: 65, passRate: 70 },
    { month: "Feb", avgScore: 68, passRate: 72 },
    { month: "Mar", avgScore: 72, passRate: 75 },
    { month: "Apr", avgScore: 70, passRate: 73 },
    { month: "May", avgScore: 75, passRate: 78 },
    { month: "Jun", avgScore: avgScore, passRate: passRate },
  ];

  // Top performers (from recent submissions)
  const topPerformers = (dashboardStats?.recentSubmissions || [])
    .filter((s) => s.percentage >= 80)
    .slice(0, 5);

  return (
    <LecturerPage
      title="Performance Reports"
      subtitle="Analyze student performance trends"
      icon={LecturerIcons.Reports}
      actions={
        <div className="flex items-center gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-900",
            )}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => refetch()}
            className={cn(
              "p-2 rounded-xl transition-all",
              isDarkMode
                ? "bg-slate-800 text-slate-400 hover:text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Avg Score",
              value: `${avgScore.toFixed(1)}%`,
              icon: Award,
              color: "text-purple-500",
              trend: avgScore >= 60,
            },
            {
              label: "Pass Rate",
              value: `${passRate.toFixed(1)}%`,
              icon: Target,
              color: "text-emerald-500",
              trend: passRate >= 60,
            },
            {
              label: "Students",
              value: totalStudents,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Improvement",
              value: `${improvement >= 0 ? "+" : ""}${improvement.toFixed(1)}%`,
              icon: improvement >= 0 ? TrendingUp : TrendingDown,
              color: improvement >= 0 ? "text-emerald-500" : "text-red-500",
            },
          ].map((metric, idx) => (
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
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={cn("w-5 h-5", metric.color)} />
                {metric.trend !== undefined &&
                  (metric.trend ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ))}
              </div>
              <p
                className={cn(
                  "text-2xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {isLoading ? <Skeleton width={50} /> : metric.value}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Performance Trend */}
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
            Performance Trend
          </h3>
          {isLoading ? (
            <Skeleton height={250} />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#334155" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDarkMode ? "#94a3b8" : "#6b7280"}
                />
                <YAxis
                  stroke={isDarkMode ? "#94a3b8" : "#6b7280"}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  name="Avg Score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  name="Pass Rate"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Top Performers */}
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
            Top Performers
          </h3>
          {isLoading ? (
            <Skeleton count={5} height={50} className="mb-2" />
          ) : topPerformers.length > 0 ? (
            <div className="space-y-3">
              {topPerformers.map((student, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl",
                    isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                        idx === 0
                          ? "bg-yellow-500/20 text-yellow-500"
                          : idx === 1
                            ? "bg-gray-400/20 text-gray-400"
                            : idx === 2
                              ? "bg-orange-500/20 text-orange-500"
                              : isDarkMode
                                ? "bg-slate-600 text-slate-300"
                                : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {student.studentId?.fullname || "Unknown"}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {student.examId?.courseId?.courseCode}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-500">
                    {student.percentage?.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p
              className={cn(
                "text-center py-8",
                isDarkMode ? "text-slate-500" : "text-gray-500",
              )}
            >
              No high performers yet
            </p>
          )}
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default Performance;
