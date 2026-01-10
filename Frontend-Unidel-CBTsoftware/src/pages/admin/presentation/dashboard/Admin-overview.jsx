/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  UserCheck,
  UserX,
  Award,
  Target,
  Zap,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ChevronRight,
  XCircle,
  TrendingDown as TrendingDownIcon,
  Percent,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ComposedChart } from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetAdminDashboardStatsAction } from "../../../../store/statistics-store";
import { useGetAllStudentsAction, useGetAllLecturersAction } from "../../../../store/user-store";
import { useGetAllCoursesAction } from "../../../../store/course-store";
import { useGetAllDepartmentsAction } from "../../../../store/department-store";
import { useGetSystemAnalyticsAction, useGetActivityLogsAction } from "../../../../store/statistics-store";

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState("week");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard stats
  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetAdminDashboardStatsAction({
    period: timeFilter,
  });

  // Fetch users data
  const { students = [], isLoading: studentsLoading, refetch: refetchStudents } = useGetAllStudentsAction();
  const { lecturers = [], isLoading: lecturersLoading, refetch: refetchLecturers } = useGetAllLecturersAction();

  // Fetch courses and departments
  const { courses = [], isLoading: coursesLoading, refetch: refetchCourses } = useGetAllCoursesAction();
  const { departments = [], isLoading: deptLoading, refetch: refetchDepartments } = useGetAllDepartmentsAction();

  // Fetch system analytics
  const {
    systemAnalytics,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useGetSystemAnalyticsAction({
    period: timeFilter,
  });

  // Fetch recent activity logs
  const {
    activityLogs = [],
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useGetActivityLogsAction({
    limit: 10,
    page: 1,
  });

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchStudents(), refetchLecturers(), refetchCourses(), refetchDepartments(), refetchAnalytics(), refetchLogs()]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate statistics from fetched data
  const totalStudents = students.length || 0;
  const totalLecturers = lecturers.length || 0;
  const totalCourses = courses.length || 0;
  const totalDepartments = departments.length || 0;

  // Enhanced stats from dashboardStats
  const newStudents = dashboardStats?.overview?.users?.newStudents || 0;
  const newLecturers = dashboardStats?.overview?.users?.newLecturers || 0;
  const activeExams = dashboardStats?.overview?.exams?.activeExams || 0;
  const completedExams = dashboardStats?.overview?.exams?.completedExams || 0;
  const totalExams = dashboardStats?.overview?.exams?.totalExams || 0;

  // Submission statistics
  const totalSubmissions = dashboardStats?.overview?.submissions?.totalSubmissions || 0;
  const passedSubmissions = dashboardStats?.overview?.submissions?.passedSubmissions || 0;
  const failedSubmissions = totalSubmissions - passedSubmissions;
  const passRate = parseFloat(dashboardStats?.overview?.submissions?.passRate || 0);
  const failRate = totalSubmissions > 0 ? ((failedSubmissions / totalSubmissions) * 100).toFixed(2) : 0;

  const pendingApprovals = dashboardStats?.pendingApprovals || 0;

  // Calculate trends
  const studentGrowth = dashboardStats?.studentGrowth || 5.2;
  const lecturerGrowth = dashboardStats?.lecturerGrowth || 3.1;
  const examGrowth = dashboardStats?.examGrowth || 12.5;

  // Enhanced quick stats cards
  const quickStats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "Total Students",
      value: totalStudents,
      change: `+${newStudents} new`,
      trend: <TrendingUp className="w-4 h-4" />,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/admin/users/students",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      label: "Total Lecturers",
      value: totalLecturers,
      change: `+${newLecturers} new`,
      trend: <TrendingUp className="w-4 h-4" />,
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
      link: "/admin/users/lecturers",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: "Total Courses",
      value: totalCourses,
      change: `${totalDepartments} departments`,
      color: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
      link: "/admin/courses/create",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: "Active Exams",
      value: activeExams,
      change: `${totalExams} total`,
      trend: <TrendingUp className="w-4 h-4" />,
      color: "bg-purple-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/admin/exams/active",
    },
  ];

  // Performance metrics cards
  const performanceMetrics = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Pass Rate",
      value: `${passRate}%`,
      count: passedSubmissions,
      total: totalSubmissions,
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      label: "Fail Rate",
      value: `${failRate}%`,
      count: failedSubmissions,
      total: totalSubmissions,
      color: "bg-red-600",
      lightBg: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "Completion Rate",
      value: totalExams > 0 ? `${((completedExams / totalExams) * 100).toFixed(1)}%` : "0%",
      count: completedExams,
      total: totalExams,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "System Errors",
      value: systemAnalytics?.systemErrors || 0,
      count: systemAnalytics?.systemErrors || 0,
      color: systemAnalytics?.systemErrors > 10 ? "bg-red-600" : "bg-gray-600",
      lightBg: systemAnalytics?.systemErrors > 10 ? "bg-red-50" : "bg-gray-50",
      textColor: systemAnalytics?.systemErrors > 10 ? "text-red-600" : "text-gray-600",
    },
  ];

  // User distribution data
  const userDistribution = [
    { name: "Students", value: totalStudents, color: "#2563eb" },
    { name: "Lecturers", value: totalLecturers, color: "#16a34a" },
    { name: "Admins", value: dashboardStats?.overview?.users?.totalAdmins || 5, color: "#f97316" },
  ];

  // Department enrollment data with actual data from API
  const departmentData = (dashboardStats?.distribution?.studentsByDepartment || departments.slice(0, 6)).map((dept) => ({
    name: dept.departmentName || dept.departmentCode || dept._id,
    students: dept.count || dept.students?.length || 0,
    courses: dept.courses?.length || 0,
  }));

  // Enhanced weekly activity with actual trends data
  const weeklyActivity =
    dashboardStats?.trends?.activity?.length > 0
      ? dashboardStats.trends.activity.map((item) => ({
          day: item._id,
          logins: item.logins || 0,
          activity: item.count || 0,
        }))
      : [
          { day: "Mon", logins: 245, activity: 34 },
          { day: "Tue", logins: 312, activity: 45 },
          { day: "Wed", logins: 289, activity: 38 },
          { day: "Thu", logins: 334, activity: 52 },
          { day: "Fri", logins: 298, activity: 41 },
          { day: "Sat", logins: 156, activity: 19 },
          { day: "Sun", logins: 189, activity: 23 },
        ];

  // Exam status distribution
  const examStatusData = [
    { name: "Active", value: activeExams, color: "#16a34a" },
    { name: "Completed", value: completedExams, color: "#2563eb" },
    { name: "Scheduled", value: dashboardStats?.scheduledExams || totalExams - activeExams - completedExams, color: "#f59e0b" },
  ];

  // Submission performance data
  const submissionPerformanceData = [
    { name: "Passed", value: passedSubmissions, color: "#16a34a" },
    { name: "Failed", value: failedSubmissions, color: "#ef4444" },
  ];

  // Activity by role from systemAnalytics
  const activityByRole = systemAnalytics?.activityByRole || [
    { role: "student", activityCount: 450, uniqueUsers: 120 },
    { role: "lecturer", activityCount: 280, uniqueUsers: 35 },
    { role: "admin", activityCount: 150, uniqueUsers: 8 },
  ];

  // Top actions from systemAnalytics
  const topActions = (systemAnalytics?.topActions || []).slice(0, 5).map((action) => ({
    action: action._id?.replace(/_/g, " ") || "Unknown",
    count: action.count,
  }));

  // Peak usage hours
  const peakHours = (systemAnalytics?.peakHours || []).slice(0, 12).map((hour) => ({
    hour: `${hour._id}:00`,
    usage: hour.count,
  }));

  // System health metrics
  const systemHealth = [
    { metric: "Server Uptime", value: 99.8, status: "excellent" },
    { metric: "Database Load", value: 65, status: "good" },
    { metric: "API Response", value: 98, status: "excellent" },
    { metric: "Storage Usage", value: 72, status: "good" },
    { metric: "Active Sessions", value: 85, status: "good" },
  ];

  // Recent activities
  const recentActivities = activityLogs.slice(0, 6).map((log) => ({
    id: log._id,
    action: log.action,
    user: log.userId?.fullname || "Unknown User",
    role: log.role,
    timestamp: new Date(log.createdAt).toLocaleString(),
    status: log.status,
  }));

  // Enhanced pending tasks
  const pendingTasks = [
    {
      title: "Question Banks Pending Approval",
      count: pendingApprovals,
      priority: "high",
      link: "/admin/question-bank/approvals",
    },
    {
      title: "Failed Submissions to Review",
      count: failedSubmissions,
      priority: failedSubmissions > 10 ? "high" : "medium",
      link: "/admin/exams/results",
    },
    {
      title: "System Errors",
      count: systemAnalytics?.systemErrors || 0,
      priority: systemAnalytics?.systemErrors > 10 ? "high" : "low",
      link: "/admin/audit/security",
    },
    {
      title: "New User Registrations",
      count: newStudents + newLecturers,
      priority: "medium",
      link: "/admin/users/students",
    },
  ];

  const LoadingSkeleton = () => (
    <div className="space-y-2">
      <Skeleton height={20} />
      <Skeleton height={20} width="80%" />
      <Skeleton height={20} width="60%" />
    </div>
  );

  // Security/Fraud data from dashboardStats
  const securityOverview = dashboardStats?.security?.overview || {};
  const totalViolations = securityOverview.totalViolations || 0;
  const autoSubmittedExams = securityOverview.autoSubmittedExams || 0;
  const violationRate = parseFloat(securityOverview.violationRate || 0);

  const violationsByType = dashboardStats?.security?.violationsByType || [];
  const topViolators = dashboardStats?.security?.highRisk?.students || [];
  const highRiskCourses = dashboardStats?.security?.highRisk?.courses || [];
  const highRiskDepartments = dashboardStats?.security?.highRisk?.departments || [];

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-3 sm:mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">Admin Dashboard</h1>
              <p className="text-xs sm:text-base text-gray-600">System overview and real-time analytics</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Time Filter */}
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              {/* Refresh Button */}
              <button onClick={handleRefreshAll} disabled={refreshing} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Export Button */}
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6">
          {statsLoading || studentsLoading || lecturersLoading || coursesLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                    <Skeleton height={80} />
                  </div>
                ))
            : quickStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => stat.link && (window.location.href = stat.link)}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-4">
                    <div className={`${stat.lightBg} p-2 sm:p-3 rounded-lg`}>
                      <div className={stat.color + " text-white rounded-lg p-1 sm:p-2"}>{React.cloneElement(stat.icon, { className: "w-4 h-4 sm:w-6 sm:h-6" })}</div>
                    </div>
                    {stat.trend && <div className={`flex items-center gap-1 ${stat.textColor} text-xs sm:text-sm font-medium`}>{React.cloneElement(stat.trend, { className: "w-3 h-3 sm:w-4 sm:h-4" })}</div>}
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">{stat.label}</div>
                  <div className={`text-xs ${stat.textColor} mt-0.5 sm:mt-1`}>{stat.change}</div>
                </motion.div>
              ))}
        </div>

        {/* Performance Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6">
          {statsLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                    <Skeleton height={60} />
                  </div>
                ))
            : performanceMetrics.map((metric, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + idx * 0.1 }} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <div className={`${metric.lightBg} p-1.5 sm:p-2 rounded-lg ${metric.textColor}`}>{React.cloneElement(metric.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{metric.value}</div>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">{metric.label}</div>
                  {metric.total !== undefined && (
                    <div className="text-xs text-gray-500">
                      {metric.count} / {metric.total} submissions
                    </div>
                  )}
                </motion.div>
              ))}
        </div>

        {/* Row 1: Weekly Activity & User Distribution & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 mb-2 sm:mb-4">
          {/* Weekly Activity Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">System Activity</h3>
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            {analyticsLoading || statsLoading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="logins" fill="#dbeafe" stroke="#2563eb" />
                  <Bar dataKey="activity" fill="#16a34a" radius={[8, 8, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* User Distribution */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-3 bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">User Distribution</h3>
              <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            {studentsLoading || lecturersLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={userDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                      {userDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {userDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* System Health */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-3 bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">System Health</h3>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="space-y-2 sm:space-y-3">
              {systemHealth.map((item, idx) => (
                <div key={idx} className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{item.metric}</span>
                    <span className={`font-bold ${item.status === "excellent" ? "text-green-600" : item.status === "good" ? "text-blue-600" : "text-orange-600"}`}>{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
                    <div className={`h-1 sm:h-1.5 rounded-full ${item.status === "excellent" ? "bg-green-600" : item.status === "good" ? "bg-blue-600" : "bg-orange-600"}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 2: Department Performance & Exam/Submission Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 mb-2 sm:mb-4">
          {/* Department Performance */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">Department Overview</h3>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            {deptLoading || statsLoading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "11px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="courses" fill="#16a34a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Exam & Submission Status */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 grid grid-cols-2 gap-2 sm:gap-4">
            {/* Exam Status */}
            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Exam Status</h3>
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              {statsLoading ? (
                <Skeleton height={120} />
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
                  <div className="grid grid-cols-1 gap-1 mt-2">
                    {examStatusData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Submission Performance */}
            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Submissions</h3>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              {statsLoading ? (
                <Skeleton height={120} />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={submissionPerformanceData} dataKey="value" cx="50%" cy="50%" outerRadius={45} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {submissionPerformanceData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-center p-1 bg-green-50 rounded">
                      <div className="text-xs text-green-600">Passed</div>
                      <div className="text-sm font-bold text-green-700">{passRate}%</div>
                    </div>
                    <div className="text-center p-1 bg-red-50 rounded">
                      <div className="text-xs text-red-600">Failed</div>
                      <div className="text-sm font-bold text-red-700">{failRate}%</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Row 3: Activity by Role & Top Actions & Peak Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4">
          {/* Activity by Role */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">Activity by Role</h3>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            {analyticsLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-3">
                {activityByRole.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 capitalize">{item.role}</div>
                      <div className="text-xs text-gray-500">{item.uniqueUsers} active users</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{item.activityCount}</div>
                      <div className="text-xs text-gray-500">actions</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Top Actions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">Top Actions</h3>
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            {analyticsLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-2">
                {topActions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700 capitalize">{action.action}</span>
                    <span className="text-sm font-bold text-gray-900">{action.count}</span>
                  </div>
                ))}
                {topActions.length === 0 && <div className="text-center text-gray-500 py-4 text-sm">No data available</div>}
              </div>
            )}
          </motion.div>

          {/* Peak Usage Hours */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">Peak Hours</h3>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            {analyticsLoading ? (
              <LoadingSkeleton />
            ) : peakHours.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#9ca3af" style={{ fontSize: "10px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "10px" }} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">No data available</div>
            )}
          </motion.div>
        </div>

        {/* Row 4: Recent Activity & Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">Recent Activity</h3>
              <button className="text-xs sm:text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {logsLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {recentActivities.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No recent activity</div>
                ) : (
                  recentActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.role === "admin" ? "bg-orange-100 text-orange-600" : activity.role === "lecturer" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                        {activity.role === "admin" ? <Users className="w-5 h-5" /> : activity.role === "lecturer" ? <GraduationCap className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user} <span className="text-gray-500 font-normal">{activity.action.replace(/_/g, " ")}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${activity.status === "success" ? "bg-green-100 text-green-600" : activity.status === "failed" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>{activity.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>

          {/* Pending Tasks */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">Pending Tasks</h3>
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => task.link && (window.location.href = task.link)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.priority === "high" ? "bg-red-100 text-red-600" : task.priority === "medium" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                      {task.priority === "high" ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{task.priority} priority</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{task.count}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security/Fraud Analytics Section - Add after Row 4 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-2 sm:mb-4"
        >
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-3 sm:p-6 shadow-lg mb-2 sm:mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Security & Fraud Detection</h2>
                <p className="text-xs sm:text-base text-white text-opacity-90">Monitor exam integrity violations across the system</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-2 sm:p-4 backdrop-blur">
                <ShieldAlert className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Security Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-2 sm:mb-4">
            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="bg-red-50 p-2 sm:p-3 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{totalViolations}</div>
                  <div className="text-xs text-gray-500">Total Violations</div>
                </div>
              </div>
              <div className="text-xs text-red-600">{violationRate}% of submissions</div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="bg-orange-50 p-2 sm:p-3 rounded-lg">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{autoSubmittedExams}</div>
                  <div className="text-xs text-gray-500">Auto-Submitted</div>
                </div>
              </div>
              <div className="text-xs text-orange-600">Due to violations</div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{topViolators.length}</div>
                  <div className="text-xs text-gray-500">High-Risk Students</div>
                </div>
              </div>
              <div className="text-xs text-blue-600">3+ violations</div>
            </div>

            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{highRiskCourses.length}</div>
                  <div className="text-xs text-gray-500">High-Risk Courses</div>
                </div>
              </div>
              <div className="text-xs text-purple-600">High violation rates</div>
            </div>
          </div>

          {/* Detailed Fraud Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
            {/* Top Violators */}
            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-bold text-gray-900">Top Violators</h3>
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {statsLoading ? (
                  <LoadingSkeleton />
                ) : topViolators.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 text-sm">No violations detected</div>
                ) : (
                  topViolators.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{student.studentName}</p>
                        <p className="text-xs text-gray-600">{student.matricNumber}</p>
                        <p className="text-xs text-gray-500">{student.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{student.violationCount}</div>
                        <div className="text-xs text-gray-500">violations</div>
                        {student.autoSubmits > 0 && (
                          <div className="text-xs text-orange-600">{student.autoSubmits} auto-submits</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* High-Risk Courses */}
            <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-bold text-gray-900">High-Risk Courses</h3>
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {statsLoading ? (
                  <LoadingSkeleton />
                ) : highRiskCourses.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 text-sm">No high-risk courses</div>
                ) : (
                  highRiskCourses.map((course, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">{course.courseCode}</p>
                        <div className="text-lg font-bold text-orange-600">{Math.round(course.riskScore)}</div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{course.courseTitle}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{course.violationCount} violations</span>
                        <span>{course.studentCount} students</span>
                        {course.autoSubmits > 0 && (
                          <span className="text-red-600">{course.autoSubmits} auto</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Violation Types & Departments */}
            <div className="space-y-4">
              {/* Violation Types */}
              <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Violation Types</h3>
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                {statsLoading ? (
                  <Skeleton height={100} />
                ) : (
                  <div className="space-y-2">
                    {violationsByType.slice(0, 4).map((type, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1">
                        <span className="text-xs text-gray-700 capitalize">{type._id.replace(/_/g, " ")}</span>
                        <span className="text-sm font-bold text-gray-900">{type.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* High-Risk Departments */}
              <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Departments</h3>
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                {statsLoading ? (
                  <Skeleton height={100} />
                ) : (
                  <div className="space-y-2">
                    {highRiskDepartments.slice(0, 3).map((dept, idx) => (
                      <div key={idx} className="p-2 bg-purple-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-900">{dept.departmentCode}</span>
                          <span className="text-sm font-bold text-purple-600">{Math.round(dept.riskScore)}</span>
                        </div>
                        <div className="text-xs text-gray-500">{dept.violationCount} violations</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-3 sm:p-6 shadow-lg">
          <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <button onClick={() => (window.location.href = "/admin/users/students")} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Manage Users</span>
            </button>
            <button onClick={() => (window.location.href = "/admin/courses/create")} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-medium">Create Course</span>
            </button>
            <button onClick={() => (window.location.href = "/admin/question-bank/approvals")} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm font-medium">Approvals</span>
            </button>
            <button onClick={() => (window.location.href = "/admin/audit/security")} className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2">
              <Eye className="w-6 h-6" />
              <span className="text-sm font-medium">Audit Logs</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
