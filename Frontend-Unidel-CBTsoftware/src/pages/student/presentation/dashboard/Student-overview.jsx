/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart } from "recharts";
import { BookOpen, FileText, Trophy, Bell, CheckCircle2, XCircle, Clock, TrendingUp, Calendar, AlertCircle, Target, Award, Activity, Zap, BookMarked, GraduationCap } from "lucide-react";

const COLORS = ["#f97316", "#0f172a", "#64748b", "#fbbf24"];
const CHART_COLORS = {
  primary: "#f97316",
  secondary: "#0f172a",
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

const Overview = () => {
  // Remove all store hooks and use dummy data or leave blank

  // Dummy data for demonstration
  const dashboardData = {
    totalCourses: 4,
    totalDocs: 7,
    totalExams: 10,
    totalResults: 10,
    notifications: 3,
    passedExams: 8,
    failedExams: 2,
    averageScore: 78,
    upcomingExams: 3,
    successRate: 80,
  };

  const examPerformance = [
    { name: "Passed", value: dashboardData.passedExams },
    { name: "Failed", value: dashboardData.failedExams },
  ];

  const courseScores = [
    { course: "Math", score: 85 },
    { course: "Physics", score: 78 },
    { course: "Chemistry", score: 92 },
    { course: "Biology", score: 70 },
  ];

  const weeklyActivity = [
    { day: "Mon", exams: 2, study: 4 },
    { day: "Tue", exams: 1, study: 5 },
    { day: "Wed", exams: 3, study: 3 },
    { day: "Thu", exams: 2, study: 6 },
    { day: "Fri", exams: 4, study: 4 },
    { day: "Sat", exams: 1, study: 2 },
    { day: "Sun", exams: 0, study: 3 },
  ];

  const performanceMetrics = [
    { subject: "Accuracy", value: 85 },
    { subject: "Speed", value: 75 },
    { subject: "Consistency", value: 90 },
    { subject: "Completion", value: 88 },
    { subject: "Participation", value: 82 },
  ];

  const recentExams = [
    { name: "Mathematics Test 1", score: 85, status: "passed", date: "Dec 28" },
    { name: "Physics Quiz 2", score: 72, status: "passed", date: "Dec 27" },
    { name: "Chemistry Exam", score: 45, status: "failed", date: "Dec 25" },
  ];

  const upcomingExamsList = [
    { name: "Biology Final", date: "Jan 2, 2026", time: "10:00 AM" },
    { name: "English Essay", date: "Jan 5, 2026", time: "2:00 PM" },
    { name: "History Test", date: "Jan 8, 2026", time: "9:00 AM" },
  ];

  const statCards = [
    {
      icon: <BookOpen className="w-6 h-6 text-orange-600" />,
      label: "Enrolled Courses",
      value: dashboardData.totalCourses,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      trend: "+2 this semester",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      label: "Exams Taken",
      value: dashboardData.totalExams,
      bg: "bg-slate-900",
      iconBg: "bg-slate-800",
      text: "text-white",
      trend: `${dashboardData.successRate}% success rate`,
      trendIcon: <Target className="w-3 h-3" />,
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-600" />,
      label: "Average Score",
      value: `${dashboardData.averageScore}%`,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      trend: "+5% from last month",
      trendIcon: <TrendingUp className="w-3 h-3" />,
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      label: "Upcoming Exams",
      value: dashboardData.upcomingExams,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      trend: "Next: Jan 2",
      trendIcon: <Calendar className="w-3 h-3" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-3 md:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">Welcome Back! 👋</h2>
            <p className="text-slate-600 text-sm md:text-base">Here's your academic progress at a glance</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span className="hidden sm:inline">View Notifications</span>
            {dashboardData.notifications > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{dashboardData.notifications}</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={card.label} custom={i} initial="hidden" animate="visible" variants={cardVariants} whileHover={{ y: -8, shadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }} className={`${card.bg} rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all border border-slate-100`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.iconBg} p-3 rounded-xl`}>{card.icon}</div>
              <div className={`flex items-center gap-1 text-xs font-medium ${card.text || "text-green-600"}`}>
                {card.trendIcon}
                <span>{card.trend}</span>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${card.text || "text-slate-900"}`}>{card.value}</div>
            <div className={`text-sm font-medium ${card.text || "text-slate-600"}`}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Exam Performance Pie Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Exam Results</h3>
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={examPerformance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={45} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                {examPerformance.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={idx === 0 ? CHART_COLORS.success : CHART_COLORS.danger} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-around mt-4">
            {examPerformance.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                {idx === 0 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                <div>
                  <div className="text-xs text-slate-600">{item.name}</div>
                  <div className="text-lg font-bold text-slate-900">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity Area Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Weekly Activity</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyActivity}>
              <defs>
                <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip />
              <Area type="monotone" dataKey="exams" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#colorExams)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Radar */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Performance</h3>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" style={{ fontSize: "11px" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Course Scores Bar Chart - Full Width */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Course Performance</h3>
          <BookMarked className="w-5 h-5 text-orange-500" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={courseScores}>
            <XAxis dataKey="course" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="score" fill={CHART_COLORS.primary} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom Grid - Recent & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Exams</h3>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-3">
            {recentExams.map((exam, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  {exam.status === "passed" ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{exam.name}</div>
                    <div className="text-xs text-slate-500">{exam.date}</div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${exam.status === "passed" ? "text-green-600" : "text-red-600"}`}>{exam.score}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Exams */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Upcoming Exams</h3>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {upcomingExamsList.map((exam, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{exam.name}</div>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {exam.date}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">{exam.time}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Documents Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6 bg-orange-50 rounded-2xl shadow-md p-6 border border-orange-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Your Documents</h4>
              <p className="text-slate-600 text-sm">Uploaded files for exams and assignments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{dashboardData.totalDocs}</div>
              <div className="text-xs text-slate-600">total files</div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors">
              Manage
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
