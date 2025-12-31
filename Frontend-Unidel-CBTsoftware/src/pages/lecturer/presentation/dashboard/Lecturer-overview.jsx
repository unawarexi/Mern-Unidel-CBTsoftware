/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area,
} from "recharts";
import {
  BookOpen, FileText, Users, FileSpreadsheet, CheckCircle2, XCircle, Clock, TrendingUp, Calendar, AlertCircle, Target, Award, Activity, Zap, BookMarked, GraduationCap, Eye, ShieldCheck,
} from "lucide-react";

const COLORS = ["#0f172a", "#f97316", "#22c55e", "#ef4444"];
const CHART_COLORS = {
  primary: "#0f172a",
  secondary: "#f97316",
  success: "#22c55e",
  warning: "#fbbf24",
  danger: "#ef4444",
  info: "#3b82f6",
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 100 },
  }),
};

const LecturerOverview = () => {
  // Dummy data for demonstration
  const dashboardData = {
    totalCourses: 5,
    totalBanks: 12,
    totalExams: 8,
    totalStudents: 180,
    activeExams: 2,
    pendingApprovals: 3,
    avgScore: 74,
    submissions: 120,
    gradingPending: 7,
    examIntegrityAlerts: 1,
    notifications: 2,
  };

  const examStatusPie = [
    { name: "Active", value: dashboardData.activeExams },
    { name: "Pending", value: dashboardData.pendingApprovals },
    { name: "Completed", value: dashboardData.totalExams - dashboardData.activeExams - dashboardData.pendingApprovals },
  ];

  const courseStats = [
    { course: "CSC101", students: 40, avg: 78 },
    { course: "MTH102", students: 35, avg: 72 },
    { course: "PHY103", students: 30, avg: 81 },
    { course: "GST104", students: 45, avg: 69 },
    { course: "CHM105", students: 30, avg: 76 },
  ];

  const gradingStats = [
    { status: "Graded", value: dashboardData.submissions - dashboardData.gradingPending },
    { status: "Pending", value: dashboardData.gradingPending },
  ];

  const performanceRadar = [
    { metric: "Avg Score", value: dashboardData.avgScore },
    { metric: "Pass Rate", value: 85 },
    { metric: "Submission Rate", value: 92 },
    { metric: "Exam Integrity", value: 98 },
    { metric: "Feedback", value: 80 },
  ];

  const statCards = [
    {
      icon: <BookOpen className="w-6 h-6 text-orange-600" />,
      label: "Courses Assigned",
      value: dashboardData.totalCourses,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      trend: "+1 this semester",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-900" />,
      label: "Question Banks",
      value: dashboardData.totalBanks,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      trend: "+2 new",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-green-600" />,
      label: "Exams Created",
      value: dashboardData.totalExams,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      trend: "2 active",
      trendIcon: <Clock className="w-3 h-3" />,
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      label: "Students",
      value: dashboardData.totalStudents,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      trend: "+10 enrolled",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-3 md:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">Lecturer Dashboard</h2>
            <p className="text-slate-600 text-sm md:text-base">Monitor your courses, exams, and student progress</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Notifications</span>
            {dashboardData.notifications > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{dashboardData.notifications}</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={card.label} custom={i} initial="hidden" animate="visible" variants={cardVariants} whileHover={{ y: -4 }} className={`${card.bg} rounded-2xl p-5 border border-slate-100`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.iconBg} p-3 rounded-xl`}>{card.icon}</div>
              <div className={`flex items-center gap-1 text-xs font-medium text-slate-600`}>
                {card.trendIcon}
                <span>{card.trend}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1 text-slate-900">{card.value}</div>
            <div className="text-sm font-medium text-slate-600">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Exam Status Pie */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Exam Status</h3>
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={examStatusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {examStatusPie.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Grading Status Pie */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Grading Status</h3>
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={gradingStats} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={60} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {gradingStats.map((entry, idx) => (
                  <Cell key={`cell-g-${idx}`} fill={idx === 0 ? CHART_COLORS.success : CHART_COLORS.warning} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Radar */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Performance Metrics</h3>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={performanceRadar}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" style={{ fontSize: "11px" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Course Stats Bar */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Course Stats</h3>
            <BookMarked className="w-5 h-5 text-blue-900" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={courseStats}>
              <XAxis dataKey="course" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="avg" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Grid - Exam Integrity & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Integrity Alerts */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-7 h-7 text-orange-600" />
            <h3 className="text-lg font-bold text-orange-900">Exam Integrity</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-orange-700">{dashboardData.examIntegrityAlerts}</div>
            <div>
              <div className="text-sm text-orange-800 font-semibold">Alerts Detected</div>
              <div className="text-xs text-orange-600">Monitor flagged activities in live exams</div>
            </div>
          </div>
        </motion.div>

        {/* Activity Area Chart */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-7 h-7 text-blue-700" />
            <h3 className="text-lg font-bold text-blue-900">Recent Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={[
              { day: "Mon", activity: 5 },
              { day: "Tue", activity: 7 },
              { day: "Wed", activity: 4 },
              { day: "Thu", activity: 8 },
              { day: "Fri", activity: 6 },
              { day: "Sat", activity: 2 },
              { day: "Sun", activity: 3 },
            ]}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.info} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={CHART_COLORS.info} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip />
              <Area type="monotone" dataKey="activity" stroke={CHART_COLORS.info} fillOpacity={1} fill="url(#colorActivity)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default LecturerOverview;
