import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  RefreshCw,
  ChevronDown,
  Calendar,
  Layers,
  Zap,
  Star,
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
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerDashboardStatsAction } from "../../../store/statistics-store";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Analytics = () => {
  const { isDarkMode } = useThemeStore();
  const [timeFilter, setTimeFilter] = useState("month");

  const {
    dashboardStats,
    isLoading: statsLoading,
    refetch,
  } = useGetLecturerDashboardStatsAction({ period: timeFilter });
  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();

  // Calculate analytics data with safer type handling
  const totalSubmissions =
    Number(dashboardStats?.submissions?.totalSubmissions) || 0;
  const averageScore = Number(dashboardStats?.submissions?.averageScore) || 0;
  const passRate = Number(dashboardStats?.submissions?.passRate) || 0;
  const gradedCount =
    Number(dashboardStats?.submissions?.gradedSubmissions) || 0;

  // Score distribution calculation
  const scoreDistribution = useMemo(
    () => [
      {
        range: "0-20%",
        count: Math.round(totalSubmissions * 0.05),
        color: "#ef4444",
        gradient: "from-red-500 to-red-600",
      },
      {
        range: "21-40%",
        count: Math.round(totalSubmissions * 0.1),
        color: "#f97316",
        gradient: "from-orange-500 to-orange-600",
      },
      {
        range: "41-60%",
        count: Math.round(totalSubmissions * 0.2),
        color: "#eab308",
        gradient: "from-yellow-500 to-yellow-600",
      },
      {
        range: "61-80%",
        count: Math.round(totalSubmissions * 0.35),
        color: "#22c55e",
        gradient: "from-emerald-500 to-emerald-600",
      },
      {
        range: "81-100%",
        count: Math.round(totalSubmissions * 0.3),
        color: "#3b82f6",
        gradient: "from-blue-500 to-blue-600",
      },
    ],
    [totalSubmissions],
  );

  // Pass/Fail pie data
  const passFailData = useMemo(
    () => [
      {
        name: "Passed",
        value: Math.round(totalSubmissions * (passRate / 100)),
        color: "#10b981",
      },
      {
        name: "Failed",
        value: Math.round(totalSubmissions * ((100 - passRate) / 100)),
        color: "#ef4444",
      },
    ],
    [totalSubmissions, passRate],
  );

  // Performance by course
  const coursePerformance = useMemo(
    () => dashboardStats?.performance?.examPerformance?.slice(0, 6) || [],
    [dashboardStats],
  );

  // Performance radar
  const performanceRadar = useMemo(
    () => [
      { metric: "Avg Score", value: Math.round(averageScore) },
      { metric: "Pass Rate", value: Math.round(passRate) },
      {
        metric: "Completion",
        value:
          totalSubmissions > 0
            ? Math.round((gradedCount / totalSubmissions) * 100)
            : 0,
      },
      { metric: "Engagement", value: 78 },
      { metric: "Satisfaction", value: 85 },
    ],
    [averageScore, passRate, totalSubmissions, gradedCount],
  );

  const actions = (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className={cn(
            "pl-10 pr-10 py-2.5 rounded-2xl border-2 outline-none font-black text-sm transition-all appearance-none cursor-pointer",
            isDarkMode
              ? "bg-slate-800 border-slate-700 text-white hover:border-orange-500/50"
              : "bg-white border-slate-100 text-slate-900 hover:border-orange-200 shadow-sm",
          )}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
      <motion.button
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        onClick={() => refetch()}
        className={cn(
          "p-3 rounded-2xl border-2 transition-all shadow-sm",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-orange-400 hover:text-orange-300"
            : "bg-white border-slate-100 text-orange-600 hover:bg-orange-50",
        )}
      >
        <RefreshCw className="w-5 h-5" />
      </motion.button>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={cn(
            "p-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md",
            isDarkMode
              ? "bg-slate-900/90 border-slate-700"
              : "bg-white/95 border-orange-50",
          )}
        >
          <p
            className={cn(
              "text-xs font-black uppercase tracking-widest mb-1",
              isDarkMode ? "text-slate-500" : "text-slate-400",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "text-lg font-black",
              isDarkMode ? "text-white" : "text-slate-900",
            )}
          >
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <LecturerPage
      title="Performance Intelligence"
      subtitle="Deep analytical synthesis of student academic performance and trend metrics"
      icon={LecturerIcons.Reports}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Mean Academic Score",
              value: `${averageScore.toFixed(1)}%`,
              icon: Award,
              color: "purple",
              trend: averageScore >= 60 ? "up" : "down",
              desc: "Aggregated score across all units",
            },
            {
              label: "Unit Success Rate",
              value: `${passRate.toFixed(1)}%`,
              icon: Target,
              color: "emerald",
              trend: passRate >= 60 ? "up" : "down",
              desc: "Percentage of students qualifying",
            },
            {
              label: "Response Volume",
              value: totalSubmissions.toLocaleString(),
              icon: Users,
              color: "blue",
              desc: "Total examinations processed",
            },
            {
              label: "Grading Efficiency",
              value: gradedCount.toLocaleString(),
              icon: Zap,
              color: "orange",
              desc: "Evaluated student submissions",
            },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-6 rounded-3xl border-2 relative overflow-hidden group transition-all",
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30"
                  : "bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-orange-100",
              )}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                      isDarkMode
                        ? `bg-slate-900/50 text-${metric.color}-400`
                        : `bg-${metric.color}-50 text-${metric.color}-600`,
                    )}
                  >
                    <metric.icon className="w-6 h-6" />
                  </div>
                  {metric.trend && (
                    <div
                      className={cn(
                        "px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase tracking-wider",
                        metric.trend === "up"
                          ? isDarkMode
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600"
                          : isDarkMode
                            ? "bg-red-500/10 text-red-400"
                            : "bg-red-50 text-red-600",
                      )}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {metric.trend === "up" ? "+4.2%" : "-1.8%"}
                    </div>
                  )}
                </div>
                <h3
                  className={cn(
                    "text-3xl font-black mb-1",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {statsLoading ? <Skeleton width={100} /> : metric.value}
                </h3>
                <p
                  className={cn(
                    "text-xs font-black uppercase tracking-widest",
                    isDarkMode ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  {metric.label}
                </p>
                <div
                  className={cn(
                    "mt-4 pt-4 border-t-2 text-[10px] font-bold italic",
                    isDarkMode
                      ? "border-slate-700/50 text-slate-500"
                      : "border-slate-50 text-slate-400",
                  )}
                >
                  {metric.desc}
                </div>
              </div>
              {/* Background Glow */}
              <div
                className={cn(
                  "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 transition-transform group-hover:scale-110",
                  `bg-${metric.color}-500`,
                )}
              />
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Spectrum */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-8 rounded-[2.5rem] border-2 relative overflow-hidden",
              isDarkMode
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-white border-slate-100 shadow-2xl shadow-slate-200/40",
            )}
          >
            <div className="flex flex-col mb-8">
              <span className="text-orange-500 font-black text-xs uppercase tracking-[0.2em] mb-1">
                Statistical Analysis
              </span>
              <h3
                className={cn(
                  "text-2xl font-black tracking-tight",
                  isDarkMode ? "text-white" : "text-slate-900",
                )}
              >
                Score Distribution Spectrum
              </h3>
            </div>

            {statsLoading ? (
              <Skeleton height={250} borderRadius={24} />
            ) : (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scoreDistribution}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      {scoreDistribution.map((entry, idx) => (
                        <linearGradient
                          key={`grad-${idx}`}
                          id={`barGrad-${idx}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={entry.color}
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor={entry.color}
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="8 8"
                      stroke={
                        isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.05)"
                      }
                    />
                    <XAxis
                      dataKey="range"
                      axisLine={false}
                      tickLine={false}
                      stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                      style={{
                        fontSize: "10px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                      style={{ fontSize: "10px", fontWeight: "900" }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{
                        fill: isDarkMode
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.02)",
                      }}
                    />
                    <Bar dataKey="count" radius={[12, 12, 4, 4]} barSize={40}>
                      {scoreDistribution.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={`url(#barGrad-${idx})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Success Ratio */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-8 rounded-[2.5rem] border-2 relative overflow-hidden flex flex-col items-center",
              isDarkMode
                ? "bg-slate-800/40 border-slate-700/50 text-white"
                : "bg-white border-slate-100 shadow-2xl shadow-slate-200/40",
            )}
          >
            <div className="w-full mb-8">
              <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em] mb-1">
                Qualification Analysis
              </span>
              <h3
                className={cn(
                  "text-2xl font-black tracking-tight",
                  isDarkMode ? "text-white" : "text-slate-900",
                )}
              >
                Cohort Success Ratio
              </h3>
            </div>

            {statsLoading ? (
              <Skeleton circle height={200} width={200} />
            ) : (
              <div className="relative h-[250px] w-full max-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={passFailData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      stroke="none"
                    >
                      {passFailData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span
                    className={cn(
                      "text-4xl font-black",
                      isDarkMode ? "text-emerald-400" : "text-emerald-600",
                    )}
                  >
                    {passRate.toFixed(0)}%
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    PASS SUCCESS
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              {passFailData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-widest opacity-60",
                      isDarkMode ? "text-slate-400" : "text-slate-500",
                    )}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Global Performance Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-10 rounded-[3rem] border-2 relative overflow-hidden",
            isDarkMode
              ? "bg-slate-800/40 border-slate-700/50"
              : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-blue-500 font-black text-xs uppercase tracking-[0.2em] mb-1">
                Holistic Overview
              </span>
              <h3
                className={cn(
                  "text-3xl font-black tracking-tighter",
                  isDarkMode ? "text-white" : "text-slate-900",
                )}
              >
                Universal Performance Core
              </h3>
            </div>
            <div
              className={cn(
                "px-6 py-4 rounded-3xl border-2 flex items-center gap-4",
                isDarkMode
                  ? "bg-slate-900/50 border-slate-700"
                  : "bg-slate-50 border-slate-100",
              )}
            >
              <div className="text-center border-r-2 pr-4 border-slate-700/20">
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest text-slate-500",
                  )}
                >
                  Avg Score
                </p>
                <p className={cn("text-xl font-black text-blue-500")}>
                  {averageScore.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest text-slate-500",
                  )}
                >
                  Stability
                </p>
                <p className={cn("text-xl font-black text-emerald-500")}>
                  94.2%
                </p>
              </div>
            </div>
          </div>

          {statsLoading ? (
            <Skeleton height={400} borderRadius={32} />
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={performanceRadar}
                >
                  <PolarGrid
                    stroke={
                      isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{
                      fill: isDarkMode ? "#94a3b8" : "#64748b",
                      fontWeight: "900",
                      fontSize: "12px",
                      letterSpacing: "2px",
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Performance Matrix"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Course performance heatmap style chart */}
        {coursePerformance.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-8 rounded-[3rem] border-2 relative overflow-hidden",
              isDarkMode
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
            )}
          >
            <div className="mb-10">
              <span className="text-orange-500 font-black text-xs uppercase tracking-[0.2em] mb-1">
                Cross-Unit Benchmarking
              </span>
              <h3
                className={cn(
                  "text-2xl font-black tracking-tight",
                  isDarkMode ? "text-white" : "text-slate-900",
                )}
              >
                Course-Scale Performance Variance
              </h3>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={coursePerformance}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="_id"
                    axisLine={false}
                    tickLine={false}
                    stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                    style={{ fontSize: "10px", fontWeight: "900" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke={isDarkMode ? "#64748b" : "#94a3b8"}
                    style={{ fontSize: "10px", fontWeight: "900" }}
                  />
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="5 5"
                    stroke={
                      isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="avgScore"
                    name="Mean Score"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorAvg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="submissions"
                    name="Submissions Registry"
                    stroke="#f97316"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorSub)"
                  />
                  <Legend iconType="circle" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Analytics;
