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

// Import stores
import { useGetStudentDashboardStatsAction } from "../../../../store/statistics-store";
import { useGetMySubmissionsAction } from "../../../../store/submission-store";
import { useGetActiveExamsForStudentAction } from "../../../../store/exam-store";
import useAuthStore from "../../../../store/auth-store";

const StudentDashboard = () => {
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
  const completedSubmissions = dashboardStats?.overview?.completedSubmissions || 0;
  const passedExams = dashboardStats?.overview?.passedExams || 0;
  const failedExams = dashboardStats?.overview?.failedExams || 0;
  const averageScore = parseFloat(dashboardStats?.overview?.averageScore || 0);

  // Calculate rates
  const passRate = totalSubmissions > 0 ? ((passedExams / totalSubmissions) * 100).toFixed(1) : 0;
  const failRate = totalSubmissions > 0 ? ((failedExams / totalSubmissions) * 100).toFixed(1) : 0;
  const completionRate = availableExams > 0 ? ((completedSubmissions / availableExams) * 100).toFixed(1) : 0;

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
      trend: averageScore >= 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
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
  const coursePerformance = (dashboardStats?.performance?.byCourse || []).slice(0, 6).map((course) => ({
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
    { subject: "Participation", value: Math.round((completedSubmissions / (availableExams || 1)) * 100) },
  ];

  // Recent grades from API
  const recentGrades = (dashboardStats?.performance?.recentGrades || []).slice(0, 4).map((grade) => ({
    exam: grade.examId?.courseId?.courseTitle || "Unknown Exam",
    score: Math.round(grade.percentage || 0),
    status: grade.percentage >= 80 ? "excellent" : grade.percentage >= 60 ? "good" : "fair",
    date: new Date(grade.gradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    grade: grade.grade,
  }));

  // Upcoming exams (from active exams)
  const upcomingExams = activeExams.slice(0, 3).map((exam) => ({
    id: exam._id,
    title: exam.courseId?.courseTitle || "Unknown Course",
    date: new Date(exam.startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    time: new Date(exam.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
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
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Mark exam dates on calendar
  const examDates = activeExams.map((exam) => new Date(exam.startTime).getDate());

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-2">
      <Skeleton height={20} />
      <Skeleton height={20} width="80%" />
      <Skeleton height={20} width="60%" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, {user?.fullname?.split(" ")[0] || "Student"}! 👋
              </h1>
              <p className="text-gray-600">Here's your academic overview and upcoming activities</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Filter */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <Skeleton height={120} />
                  </div>
                ))
            : quickStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => stat.link && navigate(stat.link)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.lightBg} p-3 rounded-lg`}>
                      <div className={stat.color + " text-white rounded-lg p-2"}>{stat.icon}</div>
                    </div>
                    {stat.trend && <div className={`flex items-center gap-1 ${stat.textColor} text-sm font-medium`}>{stat.trend}</div>}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  {stat.total && <div className="text-sm text-gray-500 mb-2">of {stat.total} total</div>}
                  <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                  <div className={`text-xs ${stat.textColor} mt-1`}>{stat.subtitle}</div>
                </motion.div>
              ))}
        </div>

        {/* Performance Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <Skeleton height={60} />
                  </div>
                ))
            : performanceMetrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${metric.lightBg} p-2 rounded-lg ${metric.textColor}`}>{metric.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{metric.label}</div>
                  {metric.total !== undefined && (
                    <div className="text-xs text-gray-500">
                      {metric.count} / {metric.total}
                    </div>
                  )}
                </motion.div>
              ))}
        </div>

        {/* Row 1: Activity & Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Activity Trend */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Activity Trend</h3>
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            {statsLoading ? (
              <LoadingSkeleton />
            ) : activityTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={activityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="logins" fill="#fed7aa" stroke="#f97316" />
                  <Bar dataKey="examsStarted" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="examsSubmitted" fill="#34d399" radius={[8, 8, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">No activity data available</div>
            )}
          </motion.div>

          {/* Performance Trend */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Performance Trend</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            {statsLoading ? (
              <LoadingSkeleton />
            ) : performanceTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">No performance data available</div>
            )}
          </motion.div>
        </div>

        {/* Row 2: Course Performance, Skills Radar, Exam Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Course Performance */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Course Performance</h3>
              <BarChart3 className="w-5 h-5 text-orange-500" />
            </div>
            {statsLoading ? (
              <LoadingSkeleton />
            ) : coursePerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={coursePerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
                  <YAxis dataKey="course" type="category" width={80} stroke="#9ca3af" style={{ fontSize: "11px" }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#f97316" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">No course performance data available</div>
            )}
          </motion.div>

          {/* Skills Radar & Exam Status */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 grid grid-cols-2 gap-4">
            {/* Skills Radar */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Skills</h3>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              {statsLoading ? (
                <Skeleton height={140} />
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <RadarChart data={performanceSkills}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" style={{ fontSize: "9px" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Exam Status */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Exam Status</h3>
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              {statsLoading ? (
                <Skeleton height={140} />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={examStatusData} dataKey="value" cx="50%" cy="50%" outerRadius={45} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {examStatusData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    {examStatusData.map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-xs text-gray-600">{item.name}</div>
                        <div className="text-sm font-bold" style={{ color: item.color }}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Exam Schedule</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
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
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      isSelected ? "bg-orange-500 text-white" : hasExam ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming Exams */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-5 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Upcoming Exams</h3>
              <button onClick={() => navigate("/student/exams/active")} className="text-sm text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {examsLoading ? (
                <LoadingSkeleton />
              ) : upcomingExams.length === 0 ? (
                <div className="text-center text-gray-500 py-8 text-sm">No upcoming exams</div>
              ) : (
                upcomingExams.map((exam, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/student/exams/take/${exam.id}`)}
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{exam.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exam.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exam.time}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {exam.venue} • {exam.duration}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Scores */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-3 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Scores</h3>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {statsLoading ? (
                <LoadingSkeleton />
              ) : recentGrades.length === 0 ? (
                <div className="text-center text-gray-500 py-8 text-sm">No grades yet</div>
              ) : (
                recentGrades.map((score, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-2xl font-bold ${score.status === "excellent" ? "text-green-600" : score.status === "good" ? "text-blue-600" : "text-orange-600"}`}
                      >
                        {score.score}%
                      </span>
                      <span className="text-xs text-gray-500">{score.date}</span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium truncate">{score.exam}</p>
                    <span className="text-xs text-gray-500">Grade: {score.grade || "N/A"}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Row 4: Quick Actions & Study Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Study Resources */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Study Resources</h3>
              <BookMarked className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100"
                onClick={() => navigate("/student/courses/materials")}
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Course Materials</div>
                  <div className="text-xs text-gray-600">Study documents</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100"
                onClick={() => navigate("/student/exams/history")}
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Past Questions</div>
                  <div className="text-xs text-gray-600">Review history</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100"
                onClick={() => navigate("/student/results/analytics")}
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Performance Analytics</div>
                  <div className="text-xs text-gray-600">Track progress</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100"
                onClick={() => navigate("/student/courses/lecturers")}
              >
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Contact Lecturers</div>
                  <div className="text-xs text-gray-600">Get help</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Submissions</h3>
              <button onClick={() => navigate("/student/results/all")} className="text-sm text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {submissionsLoading ? (
                <LoadingSkeleton />
              ) : submissions.length === 0 ? (
                <div className="text-center text-gray-500 py-8 text-sm">No submissions yet</div>
              ) : (
                submissions.slice(0, 4).map((submission, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        submission.status === "graded"
                          ? submission.passed
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {submission.status === "graded" ? submission.passed ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{submission.examId?.courseId?.courseTitle || "Unknown Course"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            submission.status === "graded"
                              ? submission.passed
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {submission.status === "graded" ? `${submission.percentage}%` : submission.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
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

            <h3 className="text-lg font-bold text-gray-900 mb-3">Notifications</h3>
            <div className="space-y-2">
              {availableExams > 0 && (
                <div className="p-3 bg-orange-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-900">Exams Available</p>
                  <p className="text-xs text-gray-600 mt-1">You have {availableExams} exam(s) ready to take</p>
                </div>
              )}
              {recentGrades.length > 0 && (
                <div className="p-3 bg-green-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-900">New Grade Published</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {recentGrades[0].exam} - {recentGrades[0].score}%
                  </p>
                </div>
              )}
              {activeExams.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-900">Upcoming Exam</p>
                  <p className="text-xs text-gray-600 mt-1">
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

export default StudentDashboard;
