/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Users,
  Award,
  Target,
  Activity,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Zap,
  BookMarked,
  GraduationCap,
  Timer,
  Star,
  Flame,
  RefreshCw,
  XCircle,
  Percent,
  Download,
  Shield,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

// Import stores
import { useGetStudentDashboardStatsAction } from "../../../store/statistics-store";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import { useGetActiveExamsForStudentAction } from "../../../store/exam-store";
import useAuthStore from "../../../store/auth-store";

const Overview = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timeFilter, setTimeFilter] = useState("month");
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Fetch dashboard statistics
  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetStudentDashboardStatsAction({
    period: timeFilter,
  });

  // Fetch submissions
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetMySubmissionsAction({
    page: 1,
    limit: 10,
  });

  // Fetch active exams
  const {
    activeExams = [],
    isLoading: examsLoading,
    refetch: refetchExams,
  } = useGetActiveExamsForStudentAction();

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchSubmissions(), refetchExams()]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate statistics from API data
  const enrolledCourses = dashboardStats?.overview?.enrolledCourses || 0;
  const availableExams = dashboardStats?.overview?.availableExams || 0;
  const totalSubmissions = dashboardStats?.overview?.totalSubmissions || 0;
  const completedSubmissions =
    dashboardStats?.overview?.completedSubmissions || 0;
  const passedExams = dashboardStats?.overview?.passedExams || 0;
  const failedExams = dashboardStats?.overview?.failedExams || 0;
  const averageScore = parseFloat(dashboardStats?.overview?.averageScore || 0);

  // Calculate rates
  const passRate =
    totalSubmissions > 0
      ? ((passedExams / totalSubmissions) * 100).toFixed(1)
      : 0;
  const failRate =
    totalSubmissions > 0
      ? ((failedExams / totalSubmissions) * 100).toFixed(1)
      : 0;
  const completionRate =
    availableExams > 0
      ? ((completedSubmissions / availableExams) * 100).toFixed(1)
      : 0;

  // Quick stats cards
  const quickStats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: "Registered Courses",
      value: enrolledCourses,
      subtitle: `${availableExams} exams available`,
      color: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
      link: "/student/courses/enrolled",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: "Exams Completed",
      value: completedSubmissions,
      total: totalSubmissions,
      subtitle: `${availableExams} upcoming`,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/student/exams/completed",
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "Average Score",
      value: `${averageScore}%`,
      subtitle: `${passedExams} passed`,
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
      trend:
        averageScore >= 70 ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        ),
      link: "/student/results/all",
    },
    {
      icon: <Flame className="w-6 h-6" />,
      label: "Active Exams",
      value: activeExams.length,
      subtitle: "Ready to take",
      color: "bg-amber-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
      link: "/student/exams/active",
    },
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Pass Rate",
      value: `${passRate}%`,
      count: passedExams,
      total: totalSubmissions,
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      label: "Fail Rate",
      value: `${failRate}%`,
      count: failedExams,
      total: totalSubmissions,
      color: "bg-red-600",
      lightBg: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "Completion Rate",
      value: `${completionRate}%`,
      count: completedSubmissions,
      total: availableExams,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Total Submissions",
      value: totalSubmissions,
      count: totalSubmissions,
      color: "bg-purple-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  // Performance trend data from API
  const performanceTrend =
    dashboardStats?.trends?.performance?.length > 0
      ? dashboardStats.trends.performance.map((item) => ({
          period: item._id,
          score: Math.round(item.avgScore || 0),
          count: item.count || 0,
        }))
      : [];

  // Activity trend data from API
  const activityTrend =
    dashboardStats?.trends?.activity?.length > 0
      ? dashboardStats.trends.activity.map((item) => ({
          period: item._id,
          logins: item.logins || 0,
          examsStarted: item.examsStarted || 0,
          examsSubmitted: item.examsSubmitted || 0,
        }))
      : [];

  // Performance by course from API
  const coursePerformance = (dashboardStats?.performance?.byCourse || [])
    .slice(0, 6)
    .map((course) => ({
      course: course._id || "Unknown",
      courseTitle: course.courseTitle || "",
      score: Math.round(course.avgScore || 0),
      examsTaken: course.examsTaken || 0,
      passed: course.passed || 0,
    }));

  // Exam status distribution
  const examStatusData = [
    { name: "Passed", value: passedExams, color: "#22c55e" },
    { name: "Failed", value: failedExams, color: "#ef4444" },
    { name: "Pending", value: availableExams, color: "#f59e0b" },
  ];

  // Skills radar (mock for now - could be calculated from submission metadata)
  const performanceSkills = [
    { subject: "Accuracy", value: Math.round(averageScore * 0.9) },
    { subject: "Speed", value: Math.round(averageScore * 0.85) },
    { subject: "Completion", value: Math.round(parseFloat(completionRate)) },
    { subject: "Consistency", value: Math.round(averageScore * 0.95) },
    {
      subject: "Participation",
      value: Math.round((completedSubmissions / (availableExams || 1)) * 100),
    },
  ];

  // Recent grades from API
  const recentGrades = (dashboardStats?.performance?.recentGrades || [])
    .slice(0, 4)
    .map((grade) => ({
      exam: grade.examId?.courseId?.courseTitle || "Unknown Exam",
      score: Math.round(grade.percentage || 0),
      status:
        grade.percentage >= 80
          ? "excellent"
          : grade.percentage >= 60
            ? "good"
            : "fair",
      date: new Date(grade.gradedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      grade: grade.grade,
    }));

  // Upcoming exams (from active exams)
  const upcomingExams = activeExams.slice(0, 3).map((exam) => ({
    id: exam._id,
    title: exam.courseId?.courseTitle || "Unknown Course",
    date: new Date(exam.startTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: new Date(exam.startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    duration: `${Math.floor(exam.duration / 60)} hours`,
    department: "Computer Science",
    venue: "CBT Lab",
  }));

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Mark exam dates on calendar
  const examDates = activeExams.map((exam) =>
    new Date(exam.startTime).getDate(),
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-2">
      <Skeleton
        height={20}
        baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
        highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
      />
      <Skeleton
        height={20}
        width="80%"
        baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
        highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
      />
      <Skeleton
        height={20}
        width="60%"
        baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
        highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
      />
    </div>
  );

  // Security/Fraud data from dashboardStats
  const securityOverview = dashboardStats?.security?.overview || {};
  const myViolations = securityOverview.totalViolations || 0;
  const myAutoSubmits = securityOverview.autoSubmittedExams || 0;
  const myRank = securityOverview.rank || 0;
  const totalStudents = securityOverview.totalStudents || 0;
  const myPercentile = parseFloat(securityOverview.percentile || 0);

  const violationsByType = dashboardStats?.security?.violationsByType || [];
  const violationsByCourse = dashboardStats?.security?.violationsByCourse || [];
  const securityTips = dashboardStats?.security?.tips || [];

  return (
    <div
      className={cn(
        "min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 sm:mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <div>
              <h1
                className={cn(
                  "text-xl sm:text-3xl font-bold mb-0.5 sm:mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Welcome back, {user?.fullname?.split(" ")[0] || "Student"}!
              </h1>
              <p
                className={cn(
                  "text-xs sm:text-base",
                  isDarkMode ? "text-slate-400" : "text-gray-600",
                )}
              >
                Here's your academic overview and upcoming activities
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Time Filter */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className={cn(
                  "px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 text-white focus:ring-orange-500/20"
                    : "bg-white border-gray-300 text-gray-700 focus:ring-orange-500/20",
                )}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefreshAll}
                disabled={refreshing}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 disabled:opacity-50",
                  isDarkMode
                    ? "bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500/20"
                    : "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500/20",
                )}
              >
                <RefreshCw
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4",
                    refreshing && "animate-spin",
                  )}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6">
          {statsLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl p-3 sm:p-5 shadow-sm border",
                      isDarkMode
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <Skeleton
                      height={120}
                      baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                      highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                    />
                  </div>
                ))
            : quickStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "rounded-xl p-3 sm:p-5 shadow-sm border transition-all cursor-pointer",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-800/80"
                      : "bg-white border-gray-100 hover:shadow-md",
                  )}
                  onClick={() => stat.link && navigate(stat.link)}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-4">
                    <div
                      className={cn(
                        "p-2 sm:p-3 rounded-lg",
                        isDarkMode
                          ? stat.color.replace("bg-", "bg-opacity-20 bg-") ||
                              "bg-orange-500/20"
                          : stat.lightBg,
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg p-1 sm:p-2",
                          isDarkMode ? "bg-transparent text-white" : stat.color,
                        )}
                      >
                        {React.cloneElement(stat.icon, {
                          className: "w-4 h-4 sm:w-6 sm:h-6",
                        })}
                      </div>
                    </div>
                    {stat.trend && (
                      <div
                        className={`flex items-center gap-1 ${stat.textColor} text-xs sm:text-sm font-medium`}
                      >
                        {React.cloneElement(stat.trend, {
                          className: "w-3 h-3 sm:w-4 sm:h-4",
                        })}
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-xl sm:text-3xl font-bold mb-0.5 sm:mb-1",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {stat.value}
                  </div>
                  {stat.total && (
                    <div
                      className={cn(
                        "text-xs sm:text-sm mb-1 sm:mb-2",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      of {stat.total} total
                    </div>
                  )}
                  <div
                    className={cn(
                      "text-xs sm:text-sm font-medium",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    {stat.label}
                  </div>
                  <div
                    className={cn(
                      "text-xs mt-0.5 sm:mt-1",
                      isDarkMode ? "text-slate-500" : stat.textColor,
                    )}
                  >
                    {stat.subtitle}
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Performance Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6">
          {statsLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl p-4 shadow-sm border",
                      isDarkMode
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <Skeleton
                      height={60}
                      baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                      highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                    />
                  </div>
                ))
            : performanceMetrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className={cn(
                    "rounded-xl p-4 shadow-sm border",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-gray-100",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        isDarkMode
                          ? metric.color.replace("bg-", "bg-opacity-20 bg-") ||
                              "bg-orange-500/20"
                          : metric.lightBg,
                        isDarkMode ? "text-white" : metric.textColor,
                      )}
                    >
                      {metric.icon}
                    </div>
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {metric.value}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    {metric.label}
                  </div>
                  {metric.total !== undefined && (
                    <div
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      {metric.count} / {metric.total}
                    </div>
                  )}
                </motion.div>
              ))}
        </div>

        {/* Row 1: Activity & Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Activity Trend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-6 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Activity Trend
              </h3>
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            {statsLoading ? (
              <LoadingSkeleton />
            ) : activityTrend.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={220}
                minWidth={0}
                debounce={10}
              >
                <ComposedChart data={activityTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#1e293b" : "#f0f0f0"}
                  />
                  <XAxis
                    dataKey="period"
                    stroke={isDarkMode ? "#64748b" : "#9ca3af"}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#64748b" : "#9ca3af"}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                      borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                      color: isDarkMode ? "#f8fafc" : "#1e293b",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="logins"
                    fill="#fed7aa"
                    stroke="#f97316"
                  />
                  <Bar
                    dataKey="examsStarted"
                    fill="#60a5fa"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="examsSubmitted"
                    fill="#34d399"
                    radius={[8, 8, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">
                No activity data available
              </div>
            )}
          </motion.div>

          {/* Performance Trend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-6 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Performance Trend
              </h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            {statsLoading ? (
              <LoadingSkeleton />
            ) : performanceTrend.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={220}
                minWidth={0}
                debounce={10}
              >
                <AreaChart data={performanceTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#1e293b" : "#f0f0f0"}
                  />
                  <XAxis
                    dataKey="period"
                    stroke={isDarkMode ? "#64748b" : "#9ca3af"}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke={isDarkMode ? "#64748b" : "#9ca3af"}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                      borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                      color: isDarkMode ? "#f8fafc" : "#1e293b",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">
                No performance data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Row 2: Course Performance, Skills Radar, Exam Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Course Performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-6 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Course Performance
              </h3>
              <BarChart3 className="w-5 h-5 text-orange-500" />
            </div>
            {statsLoading ? (
              <LoadingSkeleton />
            ) : coursePerformance.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={220}
                minWidth={0}
                debounce={10}
              >
                <BarChart data={coursePerformance} layout="horizontal">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#1e293b" : "#f0f0f0"}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke={isDarkMode ? "#64748b" : "#9ca3af"}
                  />
                  <YAxis
                    dataKey="course"
                    type="category"
                    width={80}
                    stroke={isDarkMode ? "#64748b" : "#9ca3af"}
                    style={{ fontSize: "11px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                      borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                      color: isDarkMode ? "#f8fafc" : "#1e293b",
                    }}
                  />
                  <Bar dataKey="score" fill="#f97316" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">
                No course performance data available
              </div>
            )}
          </motion.div>

          {/* Skills Radar & Exam Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            {/* Skills Radar */}
            <div
              className={cn(
                "rounded-xl p-5 shadow-sm border",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={cn(
                    "text-base font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Skills
                </h3>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              {statsLoading ? (
                <Skeleton height={140} />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={160}
                  minWidth={0}
                  debounce={10}
                >
                  <RadarChart data={performanceSkills}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      style={{ fontSize: "9px" }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      dataKey="value"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Exam Status */}
            <div
              className={cn(
                "rounded-xl p-5 shadow-sm border",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={cn(
                    "text-base font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Exam Status
                </h3>
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              {statsLoading ? (
                <Skeleton height={140} />
              ) : (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height={120}
                    minWidth={0}
                    debounce={10}
                  >
                    <PieChart>
                      <Pie
                        data={examStatusData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={45}
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {examStatusData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    {examStatusData.map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-600",
                          )}
                        >
                          {item.name}
                        </div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: item.color }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Row 3: Calendar, Upcoming Exams, Recent Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-4 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Exam Schedule
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                      ),
                    )
                  }
                  className={cn(
                    "p-1 rounded transition-colors",
                    isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100",
                  )}
                >
                  <ChevronLeft
                    className={cn(
                      "w-4 h-4",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-slate-200" : "text-gray-900",
                  )}
                >
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                      ),
                    )
                  }
                  className={cn(
                    "p-1 rounded transition-colors",
                    isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100",
                  )}
                >
                  <ChevronRight
                    className={cn(
                      "w-4 h-4",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                <div
                  key={`${day}-${idx}`}
                  className={cn(
                    "text-center text-xs font-medium py-2",
                    isDarkMode ? "text-slate-400" : "text-gray-500",
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {[...Array(firstDay)].map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              {[...Array(daysInMonth)].map((_, idx) => {
                const day = idx + 1;
                const hasExam = examDates.includes(day);
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "aspect-square rounded-lg text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-orange-500 text-white"
                        : hasExam
                          ? isDarkMode
                            ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                            : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                          : isDarkMode
                            ? "hover:bg-slate-800 text-slate-400"
                            : "hover:bg-gray-100 text-gray-700",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming Exams */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-5 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Upcoming Exams
              </h3>
              <button
                onClick={() => navigate("/student/exams/active")}
                className="text-sm text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {examsLoading ? (
                <LoadingSkeleton />
              ) : upcomingExams.length === 0 ? (
                <div
                  className={cn(
                    "text-center py-8 text-sm",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  No upcoming exams
                </div>
              ) : (
                upcomingExams.map((exam, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                      isDarkMode
                        ? "bg-orange-500/10 hover:bg-orange-500/20"
                        : "bg-orange-50 hover:bg-orange-100",
                    )}
                    onClick={() => navigate(`/student/exams/take/${exam.id}`)}
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          "font-semibold text-sm truncate",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {exam.title}
                      </h4>
                      <div
                        className={cn(
                          "flex items-center gap-3 mt-1 text-xs",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exam.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exam.time}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "text-xs mt-1",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {exam.venue} • {exam.duration}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Scores */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-3 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Recent Scores
              </h3>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {statsLoading ? (
                <LoadingSkeleton />
              ) : recentGrades.length === 0 ? (
                <div
                  className={cn(
                    "text-center py-8 text-sm",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  No grades yet
                </div>
              ) : (
                recentGrades.map((score, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg",
                      isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-2xl font-bold",
                          score.status === "excellent"
                            ? "text-emerald-500"
                            : score.status === "good"
                              ? "text-blue-500"
                              : "text-orange-500",
                        )}
                      >
                        {score.score}%
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {score.date}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs font-medium truncate",
                        isDarkMode ? "text-slate-300" : "text-gray-700",
                      )}
                    >
                      {score.exam}
                    </p>
                    <span
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      Grade: {score.grade || "N/A"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Security/Integrity Section - Add after Row 3 */}
        {myViolations > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-2 sm:mb-4"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 sm:p-6 shadow-lg mb-2 sm:mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                    Academic Integrity Notice
                  </h2>
                  <p className="text-xs sm:text-base text-white text-opacity-90">
                    Review your exam behavior to maintain integrity
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-2 sm:p-4 backdrop-blur">
                  <ShieldAlert className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div
                className={cn(
                  "rounded-xl p-5 shadow-sm border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-red-500/10 p-3 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {myViolations}
                    </div>
                    <div className="text-xs text-gray-500">Violations</div>
                  </div>
                </div>
                <div className="text-xs text-red-600">Detected in exams</div>
              </div>

              <div
                className={cn(
                  "rounded-xl p-5 shadow-sm border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-orange-500/10 p-3 rounded-lg">
                    <XCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {myAutoSubmits}
                    </div>
                    <div className="text-xs text-gray-500">Auto-Submitted</div>
                  </div>
                </div>
                <div className="text-xs text-orange-600">Due to violations</div>
              </div>

              <div
                className={cn(
                  "rounded-xl p-5 shadow-sm border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      #{myRank}
                    </div>
                    <div className="text-xs text-gray-500">Rank</div>
                  </div>
                </div>
                <div className="text-xs text-blue-600">
                  of {totalStudents} students
                </div>
              </div>

              <div
                className={cn(
                  "rounded-xl p-5 shadow-sm border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {myPercentile}%
                    </div>
                    <div className="text-xs text-gray-500">Percentile</div>
                  </div>
                </div>
                <div className="text-xs text-purple-600">Integrity score</div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Courses with Violations */}
              <div
                className={cn(
                  "rounded-xl p-5 shadow-sm border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={cn(
                      "text-lg font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Violations by Course
                  </h3>
                  <BookOpen className="w-5 h-5 text-orange-600" />
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {statsLoading ? (
                    <LoadingSkeleton />
                  ) : violationsByCourse.length === 0 ? (
                    <div
                      className={cn(
                        "text-center py-8 text-sm",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      No data available
                    </div>
                  ) : (
                    violationsByCourse.map((course, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-3 rounded-lg",
                          isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              isDarkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            {course.courseCode}
                          </p>
                          <div className="text-lg font-bold text-orange-600">
                            {course.violationCount}
                          </div>
                        </div>
                        <p
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {course.courseTitle}
                        </p>
                        {course.autoSubmitted && (
                          <div className="text-xs text-red-600">
                            Auto-submitted
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Violation Types */}
              <div
                className={cn(
                  "rounded-xl p-5 shadow-sm border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={cn(
                      "text-lg font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Violation Types
                  </h3>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="space-y-2">
                  {statsLoading ? (
                    <LoadingSkeleton />
                  ) : violationsByType.length === 0 ? (
                    <div
                      className={cn(
                        "text-center py-8 text-sm",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      No data available
                    </div>
                  ) : (
                    violationsByType.map((type, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center justify-between p-2 rounded",
                          isDarkMode ? "bg-red-500/10" : "bg-red-50",
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs capitalize",
                            isDarkMode ? "text-slate-300" : "text-gray-700",
                          )}
                        >
                          {type._id.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-red-600">
                            {type.count}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs",
                              type.severity === "critical" ||
                                type.severity === "high"
                                ? "bg-red-200 text-red-700"
                                : type.severity === "medium"
                                  ? "bg-orange-200 text-orange-700"
                                  : "bg-gray-200 text-gray-700",
                            )}
                          >
                            {type.severity}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Security Tips */}
              <div
                className={cn(
                  "rounded-xl p-5 shadow-sm border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={cn(
                      "text-lg font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Integrity Tips
                  </h3>
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-3">
                  {securityTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-start gap-2 p-3 rounded-lg",
                        isDarkMode ? "bg-green-500/10" : "bg-green-50",
                      )}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-300" : "text-gray-700",
                        )}
                      >
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className={cn(
                    "mt-4 p-3 rounded-lg",
                    isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
                  )}
                >
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-blue-400" : "text-blue-800",
                    )}
                  >
                    <strong>Remember:</strong> Maintaining academic integrity
                    helps you build a strong reputation and genuine skills.
                    Focus on fair exam practices!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Clean Record Badge - Show if no violations */}
        {myViolations === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 sm:p-6 shadow-lg mb-2 sm:mb-4"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-2 sm:p-4 backdrop-blur">
                <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                  Clean Record!{" "}
                </h3>
                <p className="text-xs sm:text-base text-white text-opacity-90">
                  No violations detected. You're maintaining excellent academic
                  integrity. Keep it up!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Row 4: Quick Actions & Study Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
          {/* Study Resources */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Study Resources
              </h3>
              <BookMarked className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Course Materials",
                  desc: "Study documents",
                  route: "/student/courses/materials",
                  bg: isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
                  hover: isDarkMode
                    ? "hover:bg-orange-500/20"
                    : "hover:bg-orange-100",
                },
                {
                  label: "Past Questions",
                  desc: "Review history",
                  route: "/student/exams/history",
                  bg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
                  hover: isDarkMode
                    ? "hover:bg-blue-500/20"
                    : "hover:bg-blue-100",
                },
                {
                  label: "Performance Analytics",
                  desc: "Track progress",
                  route: "/student/results/analytics",
                  bg: isDarkMode ? "bg-green-500/10" : "bg-green-50",
                  hover: isDarkMode
                    ? "hover:bg-green-500/20"
                    : "hover:bg-green-100",
                },
                {
                  label: "Contact Lecturers",
                  desc: "Get help",
                  route: "/student/courses/lecturers",
                  bg: isDarkMode ? "bg-purple-500/10" : "bg-purple-50",
                  hover: isDarkMode
                    ? "hover:bg-purple-500/20"
                    : "hover:bg-purple-100",
                },
              ].map((res, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                    res.bg,
                    res.hover,
                  )}
                  onClick={() => navigate(res.route)}
                >
                  <div>
                    <div
                      className={cn(
                        "font-semibold text-sm",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {res.label}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {res.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Recent Submissions
              </h3>
              <button
                onClick={() => navigate("/student/results/all")}
                className="text-sm text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {submissionsLoading ? (
                <LoadingSkeleton />
              ) : submissions.length === 0 ? (
                <div
                  className={cn(
                    "text-center py-8 text-sm",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  No submissions yet
                </div>
              ) : (
                submissions.slice(0, 4).map((submission, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors",
                      isDarkMode
                        ? "bg-slate-800/50 hover:bg-slate-800"
                        : "bg-gray-50 hover:bg-gray-100",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        submission.status === "graded"
                          ? submission.passed
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600",
                      )}
                    >
                      {submission.status === "graded" ? (
                        submission.passed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {submission.examId?.courseId?.courseTitle ||
                          "Unknown Course"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          {new Date(
                            submission.submittedAt,
                          ).toLocaleDateString()}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            submission.status === "graded"
                              ? submission.passed
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                              : "bg-blue-500/20 text-blue-500",
                          )}
                        >
                          {submission.status === "graded"
                            ? `${submission.percentage}%`
                            : submission.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <h3
              className={cn(
                "text-lg font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Quick Actions
            </h3>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => navigate("/student/exams/active")}
                className="w-full p-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Take Active Exam
              </button>
              <button
                onClick={() => navigate("/student/courses/enrolled")}
                className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                View My Courses
              </button>
              <button
                onClick={() => navigate("/student/results/all")}
                className="w-full p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Check Results
              </button>
            </div>

            <h3
              className={cn(
                "text-lg font-bold mb-3",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Notifications
            </h3>
            <div className="space-y-2">
              {availableExams > 0 && (
                <div
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
                  )}
                >
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Exams Available
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    You have {availableExams} exam(s) ready to take
                  </p>
                </div>
              )}
              {recentGrades.length > 0 && (
                <div
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    isDarkMode ? "bg-green-500/10" : "bg-green-50",
                  )}
                >
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    New Grade Published
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {recentGrades[0].exam} - {recentGrades[0].score}%
                  </p>
                </div>
              )}
              {activeExams.length > 0 && (
                <div
                  className={cn(
                    "p-3 rounded-lg text-sm",
                    isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
                  )}
                >
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Upcoming Exam
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {upcomingExams[0]?.title} - {upcomingExams[0]?.date}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
