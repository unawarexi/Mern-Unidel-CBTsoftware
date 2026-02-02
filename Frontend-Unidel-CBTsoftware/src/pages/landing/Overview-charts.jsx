import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, BarChart3 } from "../../constants/icons";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "../../constants/charts";
import useThemeStore from "../../store/theme-store";
import { usePublicStatsAction } from "../../store/public-store";

const ChartSkeleton = () => (
  <div className="w-full h-[240px] bg-gray-200/50 dark:bg-dark-700/50 animate-pulse rounded-lg flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
  </div>
);

const HighlightSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="h-20 bg-gray-200/50 dark:bg-dark-700/50 animate-pulse rounded-lg border border-gray-200 dark:border-dark-700"
      ></div>
    ))}
  </div>
);

const OverviewCharts = () => {
  const { isDarkMode } = useThemeStore();
  const {
    examSuccessData,
    departmentData,
    monthlyPerformanceData,
    transparencyHighlights,
    isLoading,
  } = usePublicStatsAction();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Fallbacks for empty data
  const hasData =
    examSuccessData.length > 0 ||
    departmentData.length > 0 ||
    monthlyPerformanceData.length > 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-6 md:space-y-8"
    >
      {/* Section Header */}
      <motion.div variants={itemVariants} className="text-center mb-6 md:mb-8">
        <h3
          className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2 md:mb-3`}
        >
          Performance Analytics & Transparency
        </h3>
        <p
          className={`text-xs md:text-sm lg:text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto`}
        >
          Real-time data and comprehensive insights into examination success
          rates and student performance across all departments.
        </p>
      </motion.div>

      {/* Charts Grid */}
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="inline-flex lg:grid lg:grid-cols-3 gap-4 md:gap-8 min-w-full lg:min-w-0">
          {/* Exam Success Rate - Pie Chart */}
          <motion.div
            variants={itemVariants}
            className={`${isDarkMode ? "bg-dark-800/50 border-dark-700" : "bg-white border-gray-200"} rounded-lg border p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow min-w-[280px] sm:min-w-[360px] lg:min-w-0 flex-shrink-0`}
          >
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
              <h4
                className={`text-base md:text-base lg:text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Exam Success Rate
              </h4>
            </div>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={examSuccessData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {examSuccessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <p
              className={`text-xs sm:text-xs md:text-xs lg:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} text-center mt-3 md:mt-4`}
            >
              {examSuccessData.find((d) => d.name === "Passed")?.value || 0}% of
              students successfully pass their exams on the UNIDEL CBT platform
            </p>
          </motion.div>

          {/* Monthly Performance - Line Chart */}
          <motion.div
            variants={itemVariants}
            className={`${isDarkMode ? "bg-dark-800/50 border-dark-700" : "bg-white border-gray-200"} rounded-lg border p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow min-w-[280px] sm:min-w-[360px] lg:min-w-0 flex-shrink-0`}
          >
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
              <h4
                className={`text-base md:text-base lg:text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Monthly Performance Trend
              </h4>
            </div>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyPerformanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#f0f0f0"}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 12,
                      fill: isDarkMode ? "#9ca3af" : "#4b5563",
                    }}
                    stroke={isDarkMode ? "#4b5563" : "#9ca3af"}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: isDarkMode ? "#9ca3af" : "#4b5563",
                    }}
                    stroke={isDarkMode ? "#4b5563" : "#9ca3af"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1f2937" : "white",
                      border: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: isDarkMode ? "#f3f4f6" : "#111827",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="exams"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Exams Conducted"
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="success"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Success Rate (%)"
                    dot={{ fill: "#f97316", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            <p
              className={`text-xs sm:text-xs md:text-xs lg:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} text-center mt-3 md:mt-4`}
            >
              Consistent upward trend in both exam volume and success rates
            </p>
          </motion.div>

          {/* Department Participation - Bar Chart */}
          <motion.div
            variants={itemVariants}
            className={`${isDarkMode ? "bg-dark-800/50 border-dark-700" : "bg-white border-gray-200"} rounded-lg border p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow min-w-[280px] sm:min-w-[360px] lg:min-w-0 flex-shrink-0`}
          >
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
              <h4
                className={`text-base md:text-base lg:text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Department Participation
              </h4>
            </div>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={departmentData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#f0f0f0"}
                  />
                  <XAxis
                    dataKey="dept"
                    tick={{
                      fontSize: 10,
                      fill: isDarkMode ? "#9ca3af" : "#4b5563",
                    }}
                    stroke={isDarkMode ? "#4b5563" : "#9ca3af"}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: isDarkMode ? "#9ca3af" : "#4b5563",
                    }}
                    stroke={isDarkMode ? "#4b5563" : "#9ca3af"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1f2937" : "white",
                      border: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: isDarkMode ? "#f3f4f6" : "#111827",
                    }}
                  />
                  <Bar
                    dataKey="students"
                    fill="#f97316"
                    radius={[8, 8, 0, 0]}
                    name="Active Students"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            <p
              className={`text-xs sm:text-xs md:text-xs lg:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} text-center mt-3 md:mt-4`}
            >
              Data reflecting active students across all major departments
              utilizing the CBT platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Only visible on mobile */}
      <div className="lg:hidden text-center text-xs md:text-sm text-gray-500 -mt-2 md:-mt-4">
        <p className="flex items-center justify-center gap-2">
          <span>←</span>
          <span>Swipe to see more charts</span>
          <span>→</span>
        </p>
      </div>

      {/* Key Highlights */}
      <motion.div
        variants={itemVariants}
        className={`${isDarkMode ? "bg-gradient-to-br from-primary-500/10 to-dark-800/50 border-primary-500/30" : "bg-gradient-to-br from-primary-50 to-white border-primary-100"} rounded-lg border p-4 md:p-8`}
      >
        <h4
          className={`text-lg md:text-lg lg:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-3 md:mb-4 text-center`}
        >
          Key Transparency Highlights
        </h4>

        {isLoading ? (
          <HighlightSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {transparencyHighlights.map((highlight, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 md:gap-3 ${isDarkMode ? "bg-dark-800/50 border-dark-700" : "bg-white border-gray-200"} rounded-lg p-3 md:p-4 border`}
              >
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div
                    className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} text-xs md:text-xs lg:text-sm`}
                  >
                    {highlight.label}
                  </div>
                  <div
                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-1`}
                  >
                    {highlight.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OverviewCharts;
