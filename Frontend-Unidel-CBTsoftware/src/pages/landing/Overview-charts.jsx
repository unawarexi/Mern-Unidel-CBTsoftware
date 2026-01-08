import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";

const OverviewCharts = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Chart data
  const examSuccessData = [
    { name: "Passed", value: 94, color: "#f97316" },
    { name: "Failed", value: 6, color: "#e5e7eb" },
  ];

  const monthlyPerformanceData = [
    { month: "Jan", exams: 45, success: 92 },
    { month: "Feb", exams: 52, success: 93 },
    { month: "Mar", exams: 48, success: 91 },
    { month: "Apr", exams: 55, success: 94 },
    { month: "May", exams: 60, success: 95 },
    { month: "Jun", exams: 58, success: 94 },
  ];

  const departmentData = [
    { dept: "Engineering", students: 320 },
    { dept: "Sciences", students: 280 },
    { dept: "Arts", students: 240 },
    { dept: "Management", students: 200 },
  ];

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
      {/* Section Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Performance Analytics & Transparency</h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Real-time data and comprehensive insights into examination success rates and student performance across all departments.</p>
      </motion.div>

      {/* Charts Grid - Horizontally Scrollable on Mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex lg:grid lg:grid-cols-3 gap-6 md:gap-8 min-w-full lg:min-w-0">
          {/* Exam Success Rate - Pie Chart */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow min-w-[320px] sm:min-w-[360px] lg:min-w-0 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Exam Success Rate</h4>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={examSuccessData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={90} fill="#8884d8" dataKey="value">
                  {examSuccessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs sm:text-sm text-gray-600 text-center mt-4">94% of students successfully pass their exams on the UNIDEL CBT platform</p>
          </motion.div>

          {/* Monthly Performance - Line Chart */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow min-w-[320px] sm:min-w-[360px] lg:min-w-0 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Monthly Performance Trend</h4>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="exams" stroke="#3b82f6" strokeWidth={2} name="Exams Conducted" dot={{ fill: "#3b82f6", r: 4 }} />
                <Line type="monotone" dataKey="success" stroke="#f97316" strokeWidth={2} name="Success Rate (%)" dot={{ fill: "#f97316", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs sm:text-sm text-gray-600 text-center mt-4">Consistent upward trend in both exam volume and success rates</p>
          </motion.div>

          {/* Department Participation - Bar Chart */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow min-w-[320px] sm:min-w-[360px] lg:min-w-0 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Department Participation</h4>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dept" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="students" fill="#f97316" radius={[8, 8, 0, 0]} name="Active Students" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs sm:text-sm text-gray-600 text-center mt-4">Over 1,000 active students across all major departments utilizing the CBT platform</p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Only visible on mobile */}
      <div className="lg:hidden text-center text-sm text-gray-500 -mt-4">
        <p className="flex items-center justify-center gap-2">
          <span>←</span>
          <span>Swipe to see more charts</span>
          <span>→</span>
        </p>
      </div>

      {/* Key Highlights */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100 p-6 md:p-8">
        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Key Transparency Highlights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Real-Time Monitoring", value: "100% of exams tracked live" },
            { label: "Automated Grading", value: "Zero human bias in scoring" },
            { label: "Secure Platform", value: "Bank-grade encryption" },
            { label: "Instant Results", value: "Available within minutes" },
            { label: "Question Randomization", value: "Prevents exam malpractice" },
            { label: "Audit Trail", value: "Complete exam history logs" },
          ].map((highlight, index) => (
            <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-200">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">{highlight.label}</div>
                <div className="text-xs text-gray-600 mt-1">{highlight.value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewCharts;
