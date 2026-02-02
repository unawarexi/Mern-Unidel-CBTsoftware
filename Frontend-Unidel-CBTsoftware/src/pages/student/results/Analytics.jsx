import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  BookOpen,
  Activity,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import { useGetStudentDashboardStatsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import ExportButton from "../../../components/ExportButton";

const Analytics = () => {
  const { isDarkMode } = useThemeStore();
  const [timeFilter, setTimeFilter] = useState("year");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetMySubmissionsAction({ status: "graded" });

  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetStudentDashboardStatsAction({ period: timeFilter });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchSubmissions(), refetchStats()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate analytics
  const totalExams = submissions.length;
  const passedExams = submissions.filter((s) => s.passed).length;
  const failedExams = totalExams - passedExams;
  const avgScore =
    totalExams > 0
      ? submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
        totalExams
      : 0;
  const passRate = totalExams > 0 ? (passedExams / totalExams) * 100 : 0;

  // Grade distribution
  const gradeDistribution = submissions.reduce((acc, sub) => {
    const grade = sub.grade || "N/A";
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
  }));

  // Score distribution
  const scoreRanges = [
    { range: "0-39", min: 0, max: 39, count: 0 },
    { range: "40-49", min: 40, max: 49, count: 0 },
    { range: "50-59", min: 50, max: 59, count: 0 },
    { range: "60-69", min: 60, max: 69, count: 0 },
    { range: "70-79", min: 70, max: 79, count: 0 },
    { range: "80-89", min: 80, max: 89, count: 0 },
    { range: "90-100", min: 90, max: 100, count: 0 },
  ];

  submissions.forEach((sub) => {
    const score = sub.percentage || 0;
    const range = scoreRanges.find((r) => score >= r.min && score <= r.max);
    if (range) range.count++;
  });

  // Monthly performance
  const monthlyPerformance = {};
  submissions.forEach((sub) => {
    const month = new Date(sub.submittedAt).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    if (!monthlyPerformance[month]) {
      monthlyPerformance[month] = { scores: [], count: 0 };
    }
    monthlyPerformance[month].scores.push(sub.percentage || 0);
    monthlyPerformance[month].count++;
  });

  const trendData = Object.entries(monthlyPerformance)
    .slice(-12)
    .map(([month, data]) => ({
      month,
      avg: Math.round(
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      ),
      count: data.count,
    }));

  // Course performance for radar
  const coursePerformance = {};
  submissions.forEach((sub) => {
    const code = sub.examId?.courseId?.courseCode || "Unknown";
    if (!coursePerformance[code]) {
      coursePerformance[code] = { scores: [], count: 0 };
    }
    coursePerformance[code].scores.push(sub.percentage || 0);
    coursePerformance[code].count++;
  });

  const radarData = Object.entries(coursePerformance)
    .slice(0, 6)
    .map(([course, data]) => ({
      course,
      score: Math.round(
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      ),
    }));

  const COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const isLoading = submissionsLoading || statsLoading;

  const actions = (
    <div className="flex items-center gap-2">
      <ExportButton
        type="analytics"
        title="My Performance Analytics"
        filters={{ period: timeFilter }}
      />
      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        className={cn(
          "px-3 py-2 text-sm rounded-xl border outline-none",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-700",
        )}
      >
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="all">All Time</option>
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

  return (
    <StudentPage
      title="Performance Analytics"
      subtitle="Comprehensive analysis of your academic performance"
      icon={StudentIcons.Analytics}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Exams",
              value: totalExams,
              icon: BookOpen,
              color: "text-blue-500",
              bg: "from-blue-500/20 to-indigo-500/20",
            },
            {
              label: "Average Score",
              value: `${avgScore.toFixed(1)}%`,
              icon: Target,
              color: "text-orange-500",
              bg: "from-orange-500/20 to-amber-500/20",
              trend: avgScore >= 70,
            },
            {
              label: "Pass Rate",
              value: `${passRate.toFixed(0)}%`,
              icon: Award,
              color: "text-emerald-500",
              bg: "from-emerald-500/20 to-teal-500/20",
              trend: passRate >= 70,
            },
            {
              label: "Total Passed",
              value: `${passedExams}/${totalExams}`,
              icon: CheckCircle,
              color: "text-purple-500",
              bg: "from-purple-500/20 to-pink-500/20",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-5 rounded-2xl border relative overflow-hidden",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  stat.bg,
                )}
              />
              <div className="relative">
                <stat.icon className={cn("w-6 h-6 mb-3", stat.color)} />
                <p
                  className={cn(
                    "text-2xl font-bold mb-1",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {isLoading ? (
                    <Skeleton
                      width={60}
                      baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                      highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                    />
                  ) : (
                    stat.value
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {stat.label}
                  </p>
                  {stat.trend !== undefined && (
                    <span
                      className={
                        stat.trend ? "text-emerald-500" : "text-red-500"
                      }
                    >
                      {stat.trend ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "p-6 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Performance Trend
              </h3>
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            <div className="h-[280px]">
              {isLoading ? (
                <Skeleton height="100%" borderRadius={16} />
              ) : trendData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  debounce={10}
                >
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                        borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                        borderRadius: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avg"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAvg)"
                      name="Average Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Pass/Fail Distribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "p-6 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Pass/Fail Distribution
              </h3>
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="h-[280px]">
              {isLoading ? (
                <Skeleton height="100%" borderRadius={16} />
              ) : totalExams === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  debounce={10}
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Passed", value: passedExams },
                        { name: "Failed", value: failedExams },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" stroke="none" />
                      <Cell fill="#ef4444" stroke="none" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "p-6 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Score Distribution
              </h3>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-[280px]">
              {isLoading ? (
                <Skeleton
                  height="100%"
                  borderRadius={16}
                  baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  debounce={10}
                >
                  <BarChart data={scoreRanges}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="range"
                      stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                        borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Course Performance Radar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "p-6 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Course Performance
              </h3>
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <div className="h-[280px]">
              {isLoading ? (
                <Skeleton height="100%" borderRadius={16} />
              ) : radarData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  debounce={10}
                >
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                    <PolarAngleAxis
                      dataKey="course"
                      stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      fontSize={11}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                      fontSize={10}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.4}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>

        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Grade Distribution
            </h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4">
            {gradeData.length === 0 ? (
              <div
                className={cn(
                  "col-span-full text-center py-8",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                No grades available
              </div>
            ) : (
              gradeData.map((item, idx) => (
                <div
                  key={item.grade}
                  className={cn(
                    "p-4 rounded-xl text-center",
                    isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                  )}
                >
                  <p
                    className={cn(
                      "text-2xl font-bold mb-1",
                      COLORS[idx % COLORS.length],
                    )}
                    style={{ color: COLORS[idx % COLORS.length] }}
                  >
                    {item.grade}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {item.count}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    exams
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </StudentPage>
  );
};

export default Analytics;
