/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  Target,
  Award,
  Activity,
  Zap,
  BookMarked,
  GraduationCap,
  Eye,
  ShieldCheck,
  BarChart3,
  PieChart as PieChartIcon,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  Star,
  Percent,
  Brain,
  FileCheck,
  Clock3,
  AlertTriangle,
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
import { useGetLecturerDashboardStatsAction } from "../../../../store/statistics-store";
import { useGetLecturerExamsAction, useGetLecturerQuestionBanksAction } from "../../../../store/exam-store";
import { useGetLecturerCoursesAction, useGetLecturerStudentsAction } from "../../../../store/user-store";
import { useGetExamSubmissionsAction } from "../../../../store/submission-store";
import useAuthStore from "../../../../store/auth-store";

const LecturerOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [timeFilter, setTimeFilter] = useState("month");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Fetch lecturer dashboard statistics
  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetLecturerDashboardStatsAction({
    period: timeFilter,
  });

  // Fetch lecturer's exams
  const {
    exams = [],
    isLoading: examsLoading,
    refetch: refetchExams,
  } = useGetLecturerExamsAction();

  // Fetch lecturer's question banks
  const {
    questionBanks = [],
    isLoading: banksLoading,
    refetch: refetchBanks,
  } = useGetLecturerQuestionBanksAction();

  // Fetch lecturer's courses
  const {
    courses = [],
    isLoading: coursesLoading,
    refetch: refetchCourses,
  } = useGetLecturerCoursesAction();

  // Fetch lecturer's students
  const {
    students = [],
    isLoading: studentsLoading,
    refetch: refetchStudents,
  } = useGetLecturerStudentsAction();

  // Fetch submissions for a selected exam
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 50 });

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        refetchExams(),
        refetchBanks(),
        refetchCourses(),
        refetchStudents(),
      ]);
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate statistics from API data
  const totalCourses = dashboardStats?.overview?.courses || courses.length || 0;
  const totalExams = dashboardStats?.overview?.totalExams || exams.length || 0;
  const activeExams = dashboardStats?.overview?.activeExams || exams.filter((e) => e.status === "active").length || 0;
  const pendingExams = dashboardStats?.overview?.pendingExams || exams.filter((e) => e.status === "pending").length || 0;
  const completedExams = totalExams - activeExams - pendingExams;

  const totalQuestionBanks = dashboardStats?.overview?.totalQuestionBanks || questionBanks.length || 0;
  const approvedQuestionBanks = dashboardStats?.overview?.approvedQuestionBanks || questionBanks.filter((q) => q.status === "approved").length || 0;
  
  // Calculate pending approval banks from lecturer's own question banks (not all pending approvals)
  const pendingApprovalBanks = questionBanks.filter((q) => q.status === "pending_approval").length || 0;
  const draftQuestionBanks = questionBanks.filter((q) => q.status === "draft").length || 0;

  const totalStudents = dashboardStats?.overview?.totalStudents || students.length || 0;
  const totalSubmissions = dashboardStats?.submissions?.totalSubmissions || 0;
  const gradedSubmissions = dashboardStats?.submissions?.gradedSubmissions || 0;
  const pendingGrading = totalSubmissions - gradedSubmissions;
  const averageScore = parseFloat(dashboardStats?.submissions?.averageScore || 0);

  // Calculate pass/fail rates
  const passedSubmissions = submissions.filter((s) => s.passed && s.status === "graded").length;
  const failedSubmissions = submissions.filter((s) => !s.passed && s.status === "graded").length;
  const passRate = submissions.length > 0 ? ((passedSubmissions / submissions.length) * 100).toFixed(1) : 0;
  const failRate = submissions.length > 0 ? ((failedSubmissions / submissions.length) * 100).toFixed(1) : 0;

  // Calculate growth metrics
  const examGrowth = dashboardStats?.examGrowth || 8.5;
  const studentGrowth = dashboardStats?.studentGrowth || 12.3;
  const submissionGrowth = dashboardStats?.submissionGrowth || 15.7;

  // Enhanced quick stats cards
  const quickStats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: "Courses Assigned",
      value: totalCourses,
      subtitle: `${totalStudents} students enrolled`,
      color: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
      trend: studentGrowth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
      link: "/lecturer/courses",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: "Question Banks",
      value: totalQuestionBanks,
      subtitle: `${approvedQuestionBanks} approved, ${pendingApprovalBanks} pending`,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/lecturer/question-bank",
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      label: "Exams Created",
      value: totalExams,
      subtitle: `${activeExams} active, ${pendingExams} scheduled`,
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
      trend: examGrowth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
      link: "/lecturer/exams",
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "Average Score",
      value: `${averageScore}%`,
      subtitle: `${totalSubmissions} submissions`,
      color: "bg-purple-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
      trend: averageScore >= 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
      link: "/lecturer/exams/results",
    },
  ];

  // Performance metrics cards
  const performanceMetrics = [
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      label: "Submissions Graded",
      value: gradedSubmissions,
      total: totalSubmissions,
      percentage: totalSubmissions > 0 ? ((gradedSubmissions / totalSubmissions) * 100).toFixed(1) : 0,
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Pending Grading",
      value: pendingGrading,
      total: totalSubmissions,
      percentage: totalSubmissions > 0 ? ((pendingGrading / totalSubmissions) * 100).toFixed(1) : 0,
      color: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "Pass Rate",
      value: `${passRate}%`,
      count: passedSubmissions,
      total: submissions.length,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: "Active Students",
      value: totalStudents,
      count: totalStudents,
      color: "bg-purple-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  // Activity trend data from API
  const activityTrend =
    dashboardStats?.trends?.activity?.length > 0
      ? dashboardStats.trends.activity.map((item) => ({
          period: item._id,
          logins: item.count || 0,
          examsCreated: item.examsCreated || 0,
          banksCreated: item.banksCreated || 0,
        }))
      : [];

  // Exam performance by course from API
  const examPerformance = (dashboardStats?.performance?.examPerformance || []).slice(0, 6).map((exam) => ({
    course: exam._id || "Unknown",
    courseTitle: exam.courseTitle || "",
    avgScore: Math.round(exam.avgScore || 0),
    submissions: exam.submissions || 0,
  }));

  // Question bank status distribution
  const questionBankStatus = [
    { name: "Approved", value: approvedQuestionBanks, color: "#22c55e" },
    { name: "Pending", value: pendingApprovalBanks, color: "#f59e0b" },
    { name: "Draft", value: draftQuestionBanks, color: "#64748b" },
    { name: "Rejected", value: questionBanks.filter((q) => q.status === "rejected").length, color: "#ef4444" },
  ];

  // Exam status distribution
  const examStatusData = [
    { name: "Active", value: activeExams, color: "#22c55e" },
    { name: "Scheduled", value: pendingExams, color: "#f59e0b" },
    { name: "Completed", value: completedExams, color: "#2563eb" },
  ];

  // Submission performance data
  const submissionPerformanceData = [
    { name: "Passed", value: passedSubmissions, color: "#22c55e" },
    { name: "Failed", value: failedSubmissions, color: "#ef4444" },
    { name: "Pending", value: pendingGrading, color: "#f59e0b" },
  ];

  // Performance radar (metrics across different dimensions)
  const performanceRadar = [
    { metric: "Avg Score", value: Math.round(averageScore) },
    { metric: "Pass Rate", value: Math.round(parseFloat(passRate)) },
    { metric: "Grading Speed", value: totalSubmissions > 0 ? Math.round((gradedSubmissions / totalSubmissions) * 100) : 0 },
    { metric: "Bank Quality", value: totalQuestionBanks > 0 ? Math.round((approvedQuestionBanks / totalQuestionBanks) * 100) : 0 },
    { metric: "Student Engagement", value: 85 }, // Mock - could be calculated from activity logs
  ];

  // Recent exams
  const recentExams = exams.slice(0, 5).map((exam) => ({
    id: exam._id,
    title: exam.courseId?.courseTitle || "Unknown Course",
    status: exam.status,
    startTime: exam.startTime,
    duration: exam.duration,
    submissions: exam.totalSubmissions || 0,
    avgScore: exam.averageScore || 0,
  }));

  // Recent question banks
  const recentBanks = questionBanks.slice(0, 5).map((bank) => ({
    id: bank._id,
    title: bank.title,
    status: bank.status,
    questionsCount: bank.questions?.length || 0,
    course: bank.courseId?.courseTitle || "Unknown",
    createdAt: bank.createdAt,
  }));

  // Students performance overview
  const studentsPerformance = students.slice(0, 10).map((student) => {
    const studentSubmissions = submissions.filter((s) => s.studentId?._id === student._id);
    const avgScore =
      studentSubmissions.length > 0
        ? studentSubmissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / studentSubmissions.length
        : 0;

    return {
      id: student._id,
      name: student.fullname,
      matricNumber: student.matricNumber,
      submissions: studentSubmissions.length,
      avgScore: Math.round(avgScore),
      passed: studentSubmissions.filter((s) => s.passed).length,
    };
  });

  // Pending tasks for lecturer
  const pendingTasks = [
    {
      title: "Submissions to Grade",
      count: pendingGrading,
      priority: pendingGrading > 10 ? "high" : "medium",
      icon: <Clock className="w-5 h-5" />,
      link: "/lecturer/exams/submissions",
    },
    {
      title: "My Question Banks Pending Approval", // Change title to clarify it's lecturer's own banks
      count: pendingApprovalBanks,
      priority: "medium",
      icon: <FileCheck className="w-5 h-5" />,
      link: "/lecturer/question-bank",
    },
    {
      title: "Active Exams to Monitor",
      count: activeExams,
      priority: activeExams > 0 ? "high" : "low",
      icon: <Eye className="w-5 h-5" />,
      link: "/lecturer/exams/active",
    },
    {
      title: "Scheduled Exams",
      count: pendingExams,
      priority: "low",
      icon: <Calendar className="w-5 h-5" />,
      link: "/lecturer/exams",
    },
  ];

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
                Welcome, {user?.fullname?.split(" ")[0] || "Lecturer"}! 👋
              </h1>
              <p className="text-gray-600">Manage your courses, exams, and track student performance</p>
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

              {/* Create Exam Button */}
              <button
                onClick={() => navigate("/lecturer/exams/create")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Exam
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsLoading || coursesLoading || examsLoading || banksLoading
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
                      {metric.count || metric.value} / {metric.total}
                      {metric.percentage && ` (${metric.percentage}%)`}
                    </div>
                  )}
                </motion.div>
              ))}
        </div>

        {/* Row 1: Activity Trend & Exam Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Activity Trend */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
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
                  <Bar dataKey="examsCreated" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="banksCreated" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">No activity data available</div>
            )}
          </motion.div>

          {/* Performance Radar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-5 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Performance Metrics</h3>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            {statsLoading ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={performanceRadar}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" style={{ fontSize: "11px" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Row 2: Exam Performance by Course */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Course Performance Overview</h3>
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </div>
          {statsLoading ? (
            <LoadingSkeleton />
          ) : examPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={examPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="course" stroke="#9ca3af" style={{ fontSize: "11px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" fill="#f97316" radius={[8, 8, 0, 0]} name="Average Score" />
                <Bar dataKey="submissions" fill="#2563eb" radius={[8, 8, 0, 0]} name="Submissions" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-8 text-sm">No course performance data available</div>
          )}
        </motion.div>

        {/* Row 3: Status Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Question Bank Status */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Question Banks</h3>
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            {banksLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={questionBankStatus}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {questionBankStatus.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {questionBankStatus.map((item, idx) => (
                    <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">{item.name}</div>
                      <div className="text-lg font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Exam Status */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Exam Status</h3>
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
            </div>
            {examsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={examStatusData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {examStatusData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-1 mt-2">
                  {examStatusData.map((item, idx) => (
                    <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">{item.name}</div>
                      <div className="text-lg font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Submission Performance */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Submissions</h3>
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            {submissionsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={submissionPerformanceData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {submissionPerformanceData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-1 mt-2">
                  {submissionPerformanceData.map((item, idx) => (
                    <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">{item.name}</div>
                      <div className="text-lg font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Row 4: Recent Exams & Question Banks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Recent Exams */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Exams</h3>
              <button
                onClick={() => navigate("/lecturer/exams")}
                className="text-sm text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {examsLoading ? (
                <LoadingSkeleton />
              ) : recentExams.length === 0 ? (
                <div className="text-center text-gray-500 py-8 text-sm">No exams created yet</div>
              ) : (
                recentExams.map((exam, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/lecturer/exams/${exam.id}`)}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        exam.status === "active"
                          ? "bg-green-100 text-green-600"
                          : exam.status === "pending"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{exam.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {exam.submissions} submissions
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {exam.avgScore}% avg
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(exam.startTime).toLocaleDateString()} • {Math.floor(exam.duration / 60)} hours
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.status === "active"
                          ? "bg-green-100 text-green-600"
                          : exam.status === "pending"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {exam.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Question Banks */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Question Banks</h3>
              <button
                onClick={() => navigate("/lecturer/question-bank")}
                className="text-sm text-orange-500 font-medium hover:text-orange-600 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {banksLoading ? (
                <LoadingSkeleton />
              ) : recentBanks.length === 0 ? (
                <div className="text-center text-gray-500 py-8 text-sm">No question banks created yet</div>
              ) : (
                recentBanks.map((bank, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/lecturer/question-bank/${bank.id}`)}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        bank.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : bank.status === "pending_approval"
                          ? "bg-orange-100 text-orange-600"
                          : bank.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Brain className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{bank.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {bank.questionsCount} questions
                        </span>
                        <span>{bank.course}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(bank.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bank.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : bank.status === "pending_approval"
                          ? "bg-orange-100 text-orange-600"
                          : bank.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {bank.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Row 5: Top Students & Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Top Students Performance */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Top Students</h3>
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {studentsLoading ? (
                <LoadingSkeleton />
              ) : studentsPerformance.length === 0 ? (
                <div className="text-center text-gray-500 py-8 text-sm">No student data available</div>
              ) : (
                studentsPerformance
                  .sort((a, b) => b.avgScore - a.avgScore)
                  .map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.matricNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            student.avgScore >= 70 ? "text-green-600" : student.avgScore >= 50 ? "text-orange-600" : "text-red-600"
                          }`}
                        >
                          {student.avgScore}%
                        </div>
                        <div className="text-xs text-gray-500">{student.submissions} exams</div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </motion.div>

          {/* Pending Tasks */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Pending Tasks</h3>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => task.link && navigate(task.link)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : task.priority === "medium"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {task.icon}
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

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => navigate("/lecturer/exams/create")}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Create Exam</span>
            </button>
            <button
              onClick={() => navigate("/lecturer/question-bank/create")}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2"
            >
              <Brain className="w-6 h-6" />
              <span className="text-sm font-medium">New Bank</span>
            </button>
            <button
              onClick={() => navigate("/lecturer/exams/submissions")}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-sm font-medium">Grade Exams</span>
            </button>
            <button
              onClick={() => navigate("/lecturer/students")}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg transition-all flex flex-col items-center gap-2"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">View Students</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LecturerOverview;
