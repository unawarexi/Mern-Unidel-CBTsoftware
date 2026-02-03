import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  useAgentStudents,
  useAgentExams,
  useAgentSubscription,
} from "../../../hooks/useAgent";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AgentOverview = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: students = [],
    isLoading: studentsLoading,
    refetch: refetchStudents,
  } = useAgentStudents();
  const {
    data: exams = [],
    isLoading: examsLoading,
    refetch: refetchExams,
  } = useAgentExams();
  const {
    data: subscription,
    isLoading: subLoading,
    refetch: refetchSub,
  } = useAgentSubscription();

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await Promise.all([refetchStudents(), refetchExams(), refetchSub()]);
    setRefreshing(false);
  };

  const totalStudents = students.length;
  const activeExams = exams.filter((e) => e.status === "active").length;
  const pendingExams = exams.filter((e) => e.status === "pending").length;
  const totalExams = exams.length;

  const quickStats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "My Students",
      value: totalStudents,
      color: "bg-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: "Active Exams",
      value: activeExams,
      color: "bg-green-600",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Pending Exams",
      value: pendingExams,
      color: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      label: "Subscription",
      value: subscription?.plan || "Basic",
      color: "bg-purple-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const examStatusData = [
    { name: "Active", value: activeExams, color: "#16a34a" },
    { name: "Pending", value: pendingExams, color: "#f59e0b" },
    {
      name: "Ended",
      value: totalExams - activeExams - pendingExams,
      color: "#2563eb",
    },
  ];

  const studentGrowthData = [
    { name: "Mon", count: 4 },
    { name: "Tue", count: 7 },
    { name: "Wed", count: 5 },
    { name: "Thu", count: 9 },
    { name: "Fri", count: 12 },
    { name: "Sat", count: 8 },
    { name: "Sun", count: 6 },
  ];

  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className={cn(
                "text-2xl sm:text-3xl font-bold mb-1",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Agent Dashboard
            </h1>
            <p
              className={cn(
                "text-sm sm:text-base",
                isDarkMode ? "text-slate-400" : "text-gray-600",
              )}
            >
              Manage your recruits and exams performance.
            </p>
          </div>
          <button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <RefreshCw
              className={cn("w-4 h-4", refreshing && "animate-spin")}
            />
            Refresh
          </button>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {studentsLoading || examsLoading || subLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl p-5 border shadow-sm",
                      isDarkMode
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <Skeleton
                      height={80}
                      baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                      highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                    />
                  </div>
                ))
            : quickStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "rounded-xl p-5 shadow-sm border transition-all",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-gray-100",
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={cn(
                        "p-3 rounded-lg",
                        isDarkMode ? "bg-slate-800" : stat.lightBg,
                        stat.textColor,
                      )}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-2xl sm:text-3xl font-bold mb-1",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-slate-400" : "text-gray-700",
                    )}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-8 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Recruitment Trend
              </h3>
              <TrendingUp className="text-blue-500 w-5 h-5" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentGrowthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#1e293b" : "#f0f0f0"}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDarkMode ? "#475569" : "#9ca3af"}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke={isDarkMode ? "#475569" : "#9ca3af"}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#0f172a" : "#fff",
                    borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                    color: isDarkMode ? "#fff" : "#000",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "lg:col-span-4 rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Exam Status
              </h3>
              <Activity className="text-green-500 w-5 h-5" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={examStatusData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {examStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className={cn(
              "rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "font-bold text-lg",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Subscription Info
              </h3>
              <CreditCard className="text-purple-500 w-5 h-5" />
            </div>
            {subLoading ? (
              <Skeleton height={100} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5" />
                    <div>
                      <p
                        className={cn(
                          "text-sm font-bold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        Current Plan: {subscription?.plan || "Basic"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {subscription?.status || "Active"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">Expires</p>
                    <p className="text-xs text-gray-500">
                      {subscription?.expiryDate
                        ? new Date(subscription.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Upgrade Plan
                </button>
              </div>
            )}
          </div>

          <div
            className={cn(
              "rounded-xl p-5 shadow-sm border",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "font-bold text-lg",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Quick Help
              </h3>
              <HelpCircle className="text-gray-500 w-5 h-5" />
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "How to recruit students?",
                  icon: <Users size={16} />,
                },
                {
                  label: "Creating your first exam",
                  icon: <FileText size={16} />,
                },
                {
                  label: "Understanding billing",
                  icon: <CreditCard size={16} />,
                },
              ].map((item, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                    isDarkMode
                      ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentOverview;
