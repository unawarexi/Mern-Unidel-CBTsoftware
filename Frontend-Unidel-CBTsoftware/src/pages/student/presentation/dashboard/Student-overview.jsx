/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Trophy, Calendar, Clock, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Users, Award, Target, Activity, ChevronRight, ChevronLeft, BarChart3, Zap, BookMarked, GraduationCap, Timer, Star, Flame } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const StudentDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [selectedDay, setSelectedDay] = useState(17);

  // Mock data - replace with API calls
  const stats = {
    totalCourses: 12,
    registeredCourses: 8,
    completedExams: 15,
    pendingExams: 4,
    averageScore: 78.5,
    currentStreak: 12,
    totalAttendance: 89,
    assignmentsSubmitted: 23,
  };

  const quickStats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: "Registered Courses",
      value: stats.registeredCourses,
      total: stats.totalCourses,
      subtitle: `${stats.totalCourses - stats.registeredCourses} available`,
      color: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: "Exams Completed",
      value: stats.completedExams,
      total: stats.completedExams + stats.pendingExams,
      subtitle: `${stats.pendingExams} upcoming`,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "Performance Score",
      value: `${stats.averageScore}%`,
      subtitle: "+5.2% from last sem",
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
      trend: <TrendingUp className="w-4 h-4" />,
    },
    {
      icon: <Flame className="w-6 h-6" />,
      label: "Study Streak",
      value: `${stats.currentStreak} days`,
      subtitle: "Keep it going!",
      color: "bg-amber-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  const weeklyActivity = [
    { day: "Mon", study: 8, exam: 2 },
    { day: "Tue", study: 11, exam: 1 },
    { day: "Wed", study: 9, exam: 3 },
    { day: "Thu", study: 12, exam: 1 },
    { day: "Fri", study: 10, exam: 2 },
    { day: "Sat", study: 6, exam: 0 },
    { day: "Sun", study: 9, exam: 1 },
  ];

  const coursePerformance = [
    { course: "Data Structures", score: 85, credits: 4 },
    { course: "Database Systems", score: 78, credits: 3 },
    { course: "Web Development", score: 92, credits: 4 },
    { course: "Algorithms", score: 76, credits: 3 },
    { course: "Software Eng.", score: 88, credits: 4 },
    { course: "Computer Networks", score: 82, credits: 3 },
  ];

  const examDistribution = [
    { name: "Passed", value: 15, color: "#22c55e" },
    { name: "Failed", value: 2, color: "#ef4444" },
    { name: "Pending", value: 4, color: "#f59e0b" },
  ];

  const performanceMetrics = [
    { subject: "Accuracy", value: 85 },
    { subject: "Speed", value: 78 },
    { subject: "Completion", value: 92 },
    { subject: "Consistency", value: 88 },
    { subject: "Participation", value: 76 },
  ];

  const upcomingExams = [
    {
      title: "Database Management Systems",
      date: "Wed, Jan 15",
      time: "10:00 AM",
      duration: "2 hours",
      department: "Computer Science",
      venue: "CBT Lab 3",
    },
    {
      title: "Data Structures & Algorithms",
      date: "Fri, Jan 17",
      time: "2:00 PM",
      duration: "2.5 hours",
      department: "Computer Science",
      venue: "CBT Lab 1",
    },
    {
      title: "Software Engineering Principles",
      date: "Mon, Jan 20",
      time: "9:00 AM",
      duration: "2 hours",
      department: "Computer Science",
      venue: "CBT Lab 2",
    },
  ];

  const recentScores = [
    { exam: "Web Development Mid-term", score: 92, status: "excellent", date: "Dec 28" },
    { exam: "Computer Networks Quiz", score: 78, status: "good", date: "Dec 26" },
    { exam: "Algorithms Test 2", score: 85, status: "excellent", date: "Dec 24" },
    { exam: "Database Systems Quiz", score: 65, status: "fair", date: "Dec 22" },
  ];

  const todoList = [
    { task: "Submit Software Engineering Assignment", course: "CSC 402", deadline: "08:00 AM", completed: false },
    { task: "Review Database Normalization", course: "CSC 301", deadline: "10:00 AM", completed: false },
    { task: "Prepare for Algorithms Exam", course: "CSC 305", deadline: "02:00 PM", completed: true },
    { task: "Complete Data Structures Lab", course: "CSC 303", deadline: "04:00 PM", completed: false },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const examDates = [15, 17, 20, 25]; // Days with exams

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, Student! 👋</h1>
          <p className="text-gray-600">Here's your academic overview and upcoming activities</p>
        </motion.div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.lightBg} p-3 rounded-lg`}>
                  <div className={stat.color + " text-white rounded-lg p-2"}>{stat.icon}</div>
                </div>
                {stat.trend && <div className="flex items-center gap-1 text-green-600 text-sm font-medium">{stat.trend}</div>}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              {stat.total && <div className="text-sm text-gray-500 mb-2">of {stat.total} total</div>}
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              <div className={`text-xs ${stat.textColor} mt-1`}>{stat.subtitle}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid - 4 Rows */}

        {/* Row 1: Weekly Activity, Performance Radar, Exam Distribution, Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Weekly Activity */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Weekly Activity</h3>
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip />
                <Bar dataKey="study" fill="#f97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="exam" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Radar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Skills Metrics</h3>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={performanceMetrics}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" style={{ fontSize: "10px" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Exam Distribution */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Exam Status</h3>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={examDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {examDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-around mt-2">
              {examDistribution.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-xs text-gray-600">{item.name}</div>
                  <div className="text-lg font-bold" style={{ color: item.color }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 2: Course Performance Full Width */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Course Performance Overview</h3>
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={coursePerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
              <YAxis dataKey="course" type="category" width={120} stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip />
              <Bar dataKey="score" fill="#1e40af" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

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
                  <button key={day} onClick={() => setSelectedDay(day)} className={`aspect-square rounded-lg text-sm font-medium transition-colors ${isSelected ? "bg-blue-600 text-white" : hasExam ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "hover:bg-gray-100 text-gray-700"}`}>
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
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {upcomingExams.map((exam, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
              ))}
            </div>
          </motion.div>

          {/* Recent Scores */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-3 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Scores</h3>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {recentScores.map((score, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-2xl font-bold ${score.status === "excellent" ? "text-green-600" : score.status === "good" ? "text-blue-600" : "text-orange-600"}`}>{score.score}%</span>
                    <span className="text-xs text-gray-500">{score.date}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium truncate">{score.exam}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 4: Study Resources, Todo List, Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Study Resources */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Study Resources</h3>
              <BookMarked className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Course Materials</div>
                  <div className="text-xs text-gray-600">247 documents</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Past Questions</div>
                  <div className="text-xs text-gray-600">89 available</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Video Tutorials</div>
                  <div className="text-xs text-gray-600">34 videos</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Practice Tests</div>
                  <div className="text-xs text-gray-600">12 available</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Todo List */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Today's Tasks</h3>
              <button className="text-sm text-orange-600 font-medium hover:text-orange-700">+ Add Task</button>
            </div>
            <div className="space-y-3">
              {todoList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input type="checkbox" checked={item.completed} className="mt-1 w-4 h-4 text-orange-600 rounded" readOnly />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.completed ? "line-through text-gray-400" : "text-gray-900"}`}>{item.task}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{item.course}</span>
                      <span className="text-xs text-orange-600">{item.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Notifications */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3 mb-6">
              <button className="w-full p-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Start Practice Test
              </button>
              <button className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                View Timetable
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-3">Notifications</h3>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-gray-900">New assignment posted</p>
                <p className="text-xs text-gray-600 mt-1">Software Engineering - Due Jan 20</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-sm">
                <p className="font-medium text-gray-900">Grade published</p>
                <p className="text-xs text-gray-600 mt-1">Web Development - 92/100</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-sm">
                <p className="font-medium text-gray-900">Exam reminder</p>
                <p className="text-xs text-gray-600 mt-1">Database Systems - Tomorrow 10 AM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
