import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  Target,
  BookOpen,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard, AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetSystemAnalyticsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ExamAnalytics = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("month");

  // Use system analytics with time period filter
  const { systemAnalytics, isLoading, refetch } = useGetSystemAnalyticsAction({
    period: timeFilter,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Sample data (will be replaced by API data)
  const scoreDistribution = systemAnalytics?.scoreDistribution || [
    { range: "0-20", count: 5, percentage: 5 },
    { range: "21-40", count: 12, percentage: 12 },
    { range: "41-60", count: 25, percentage: 25 },
    { range: "61-80", count: 38, percentage: 38 },
    { range: "81-100", count: 20, percentage: 20 },
  ];

  const performanceByDepartment = systemAnalytics?.departmentPerformance || [
    { department: "Computer Sc.", avgScore: 72, examCount: 15 },
    { department: "Engineering", avgScore: 68, examCount: 12 },
    { department: "Business", avgScore: 75, examCount: 18 },
    { department: "Sciences", avgScore: 65, examCount: 10 },
  ];

  const monthlyTrend = systemAnalytics?.monthlyTrend || [
    { month: "Jan", exams: 45, avgScore: 68 },
    { month: "Feb", exams: 52, avgScore: 70 },
    { month: "Mar", exams: 48, avgScore: 72 },
    { month: "Apr", exams: 61, avgScore: 69 },
    { month: "May", exams: 55, avgScore: 74 },
    { month: "Jun", exams: 38, avgScore: 71 },
  ];

  const passFailData = [
    {
      name: "Passed",
      value: systemAnalytics?.passRate || 72,
      color: "#10b981",
    },
    {
      name: "Failed",
      value: 100 - (systemAnalytics?.passRate || 72),
      color: "#ef4444",
    },
  ];

  const stats = {
    totalExams: systemAnalytics?.totalExams || 156,
    totalSubmissions: systemAnalytics?.totalSubmissions || 4280,
    avgScore: systemAnalytics?.averageScore || 71,
    passRate: systemAnalytics?.passRate || 72,
  };

  const actions = (
    <div className="flex items-center gap-2">
      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        className={cn(
          "px-4 py-2 rounded-xl border text-sm",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-900",
        )}
      >
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="semester">This Semester</option>
        <option value="year">This Year</option>
      </select>
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
          isDarkMode
            ? "bg-slate-800 text-slate-300 hover:text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        )}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className={cn(
          "p-2 rounded-xl transition-all",
          isDarkMode
            ? "bg-slate-800 text-slate-400 hover:text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        )}
      >
        <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
      </button>
    </div>
  );

  return (
    <AdminPage
      title="Exam Analytics"
      subtitle="Performance insights and exam statistics"
      icon={AdminIcons.Analytics}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Exams"
            value={stats.totalExams}
            subtitle="This period"
            icon={BookOpen}
            color="blue"
          />
          <AdminStatCard
            label="Submissions"
            value={stats.totalSubmissions.toLocaleString()}
            subtitle="Total attempts"
            icon={Users}
            color="purple"
          />
          <AdminStatCard
            label="Avg Score"
            value={`${stats.avgScore}%`}
            subtitle="Overall average"
            icon={Target}
            trend={stats.avgScore >= 70 ? "+3%" : "-2%"}
            trendUp={stats.avgScore >= 70}
            color="green"
          />
          <AdminStatCard
            label="Pass Rate"
            value={`${stats.passRate}%`}
            subtitle="50%+ score"
            icon={Award}
            trend="+5%"
            trendUp
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <AdminCard title="Score Distribution" icon={BarChart3}>
            {isLoading ? (
              <Skeleton
                height={280}
                borderRadius={12}
                baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
              />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                  <XAxis
                    dataKey="range"
                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                      borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </AdminCard>

          {/* Pass/Fail Ratio */}
          <AdminCard title="Pass/Fail Ratio" icon={PieChart}>
            {isLoading ? (
              <Skeleton
                height={280}
                borderRadius={12}
                baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
              />
            ) : (
              <div className="flex items-center justify-center gap-8">
                <ResponsiveContainer width="60%" height={280}>
                  <RechartsPie>
                    <Pie
                      data={passFailData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {passFailData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {passFailData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {item.name}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          {item.value}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Monthly Trend */}
        <AdminCard title="Monthly Trend" icon={TrendingUp}>
          {isLoading ? (
            <Skeleton
              height={300}
              borderRadius={12}
              baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
              highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
            />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                  fontSize={12}
                />
                <YAxis
                  yAxisId="left"
                  stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                  fontSize={12}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                    borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="exams"
                  name="Exams"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  name="Avg Score"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </AdminCard>

        {/* Department Performance */}
        <AdminCard title="Performance by Department" icon={Target}>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    height={100}
                    borderRadius={12}
                    baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                    highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {performanceByDepartment.map((dept, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-4 rounded-xl border",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700/50"
                      : "bg-gray-50 border-gray-100",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium mb-2 truncate",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    {dept.department}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        dept.avgScore >= 70
                          ? "text-emerald-500"
                          : dept.avgScore >= 50
                            ? "text-orange-500"
                            : "text-red-500",
                      )}
                    >
                      {dept.avgScore}%
                    </span>
                    {dept.avgScore >= 70 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {dept.examCount} exams
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPage>
  );
};

export default ExamAnalytics;
