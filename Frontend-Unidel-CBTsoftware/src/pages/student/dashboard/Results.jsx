import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  ChevronDown,
  Award,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Search,
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
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import { useGetStudentDashboardStatsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [timeFilter, setTimeFilter] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch submissions
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetMySubmissionsAction({ status: "graded", limit: 50 });

  // Fetch dashboard stats for performance data
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

  // Calculate stats
  const passedCount = submissions.filter((s) => s.passed).length;
  const failedCount = submissions.length - passedCount;
  const averageScore =
    submissions.length > 0
      ? (
          submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
          submissions.length
        ).toFixed(1)
      : 0;
  const passRate =
    submissions.length > 0
      ? ((passedCount / submissions.length) * 100).toFixed(1)
      : 0;

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.examId?.courseId?.courseTitle
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      sub.examId?.courseId?.courseCode
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "passed" && sub.passed) ||
      (statusFilter === "failed" && !sub.passed);
    return matchesSearch && matchesStatus;
  });

  // Chart colors
  const CHART_COLORS = ["#10b981", "#ef4444", "#f59e0b"];

  // Stats cards
  const statsCards = [
    {
      label: "Total Results",
      value: submissions.length,
      icon: Trophy,
      color: "from-blue-500/20 to-indigo-600/20",
      accent: "text-blue-500",
    },
    {
      label: "Passed",
      value: passedCount,
      icon: CheckCircle,
      color: "from-emerald-500/20 to-teal-600/20",
      accent: "text-emerald-500",
    },
    {
      label: "Failed",
      value: failedCount,
      icon: XCircle,
      color: "from-red-500/20 to-rose-600/20",
      accent: "text-red-500",
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      icon: Target,
      color: "from-orange-500/20 to-amber-600/20",
      accent: "text-orange-500",
      trend:
        parseFloat(averageScore) >= 70 ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        ),
    },
  ];

  const actions = (
    <div className="flex items-center gap-2">
      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        className={cn(
          "px-3 py-2 text-sm rounded-xl border outline-none transition-all",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-700",
        )}
      >
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
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
      title="My Results"
      subtitle="View your exam results and performance analytics"
      icon={StudentIcons.Results}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-6 rounded-3xl border transition-all",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-white border-gray-100 shadow-sm",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br",
                  stat.color,
                  stat.accent,
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p
                className={cn(
                  "text-sm font-medium mb-1",
                  isDarkMode ? "text-slate-400" : "text-gray-500",
                )}
              >
                {stat.label}
              </p>
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {submissionsLoading ? (
                    <Skeleton
                      width={60}
                      baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                      highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                    />
                  ) : (
                    stat.value
                  )}
                </h3>
                {stat.trend && (
                  <span className={stat.accent}>{stat.trend}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Trend Chart */}
          <div
            className={cn(
              "p-6 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800"
                : "bg-gray-50/50 border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Score Trend
              </h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="h-[250px]">
              {statsLoading ? (
                <Skeleton
                  height="100%"
                  borderRadius={24}
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
                  <AreaChart
                    data={
                      dashboardStats?.trends?.performance?.map((item) => ({
                        period: item._id,
                        score: Math.round(item.avgScore || 0),
                      })) || []
                    }
                  >
                    <defs>
                      <linearGradient
                        id="colorScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                      dataKey="period"
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
                      dataKey="score"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Pass/Fail Distribution */}
          <div
            className={cn(
              "p-6 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800"
                : "bg-gray-50/50 border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Results Distribution
              </h3>
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="h-[250px] flex items-center justify-center">
              {submissionsLoading ? (
                <Skeleton
                  height="100%"
                  width="100%"
                  borderRadius={24}
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
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Passed", value: passedCount },
                        { name: "Failed", value: failedCount },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" stroke="none" />
                      <Cell fill="#ef4444" stroke="none" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Passed ({passedCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Failed ({failedCount})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Results Table */}
        <div
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-gray-50/50 border-gray-100",
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3
              className={cn(
                "font-bold text-lg",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Recent Results
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-9 pr-4 py-2 text-sm rounded-xl border outline-none w-48",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                      : "bg-white border-gray-200 text-gray-700 placeholder-gray-400",
                  )}
                />
              </div>
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={cn(
                  "px-3 py-2 text-sm rounded-xl border outline-none",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-200 text-gray-700",
                )}
              >
                <option value="all">All Results</option>
                <option value="passed">Passed Only</option>
                <option value="failed">Failed Only</option>
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {submissionsLoading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    height={80}
                    borderRadius={16}
                    baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                    highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                ))
            ) : filteredSubmissions.length === 0 ? (
              <div
                className={cn(
                  "text-center py-12",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No results found</p>
              </div>
            ) : (
              filteredSubmissions.slice(0, 10).map((submission, idx) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/student/exams/completed`)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01]",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                      : "bg-white border-gray-100 hover:shadow-md",
                    submission.passed
                      ? "border-l-4 border-l-emerald-500"
                      : "border-l-4 border-l-red-500",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm",
                        submission.passed
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-600",
                      )}
                    >
                      {submission.passed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "font-semibold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {submission.examId?.courseId?.courseCode} -{" "}
                        {submission.examId?.courseId?.courseTitle}
                      </h4>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-xl font-bold",
                        submission.passed ? "text-emerald-500" : "text-red-500",
                      )}
                    >
                      {submission.percentage}%
                    </p>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isDarkMode ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      Grade: {submission.grade || "N/A"}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* View All Link */}
          {filteredSubmissions.length > 10 && (
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/student/results/all")}
                className={cn(
                  "px-6 py-2 rounded-xl font-medium transition-all",
                  isDarkMode
                    ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200",
                )}
              >
                View All Results
              </button>
            </div>
          )}
        </div>
      </div>
    </StudentPage>
  );
};

export default Results;
