import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  Download,
  Shield,
  ShieldAlert,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  Monitor,
  Users,
  Clock,
  Flag,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard, AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import {
  useGetFraudAnalyticsAction,
  useGetActivityLogsAction,
} from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const SecurityEvents = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const {
    fraudAnalytics,
    isLoading: loadingFraud,
    refetch: refetchFraud,
  } = useGetFraudAnalyticsAction();

  const {
    activityLogs: securityLogs = [],
    isLoading: loadingLogs,
    refetch: refetchLogs,
  } = useGetActivityLogsAction({
    type: "security",
    limit: 50,
  });

  const isLoading = loadingFraud || loadingLogs;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchFraud(), refetchLogs()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Violation types data for chart
  const violationTypes = fraudAnalytics?.violationTypes || [
    { type: "Tab Switch", count: 45 },
    { type: "Copy/Paste", count: 32 },
    { type: "Fullscreen Exit", count: 28 },
    { type: "Browser Resize", count: 15 },
    { type: "Right Click", count: 12 },
    { type: "Dev Tools", count: 8 },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityInfo = (severity) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-100 text-red-600",
          icon: <XCircle className="w-4 h-4" />,
        };
      case "high":
        return {
          bg: "bg-orange-100 text-orange-600",
          icon: <ShieldAlert className="w-4 h-4" />,
        };
      case "medium":
        return {
          bg: "bg-amber-100 text-amber-600",
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-blue-100 text-blue-600",
          icon: <Shield className="w-4 h-4" />,
        };
    }
  };

  // Stats
  const stats = {
    totalViolations:
      fraudAnalytics?.totalViolations ||
      violationTypes.reduce((sum, v) => sum + v.count, 0),
    flaggedStudents: fraudAnalytics?.flaggedStudents || 23,
    highRiskExams: fraudAnalytics?.highRiskExams || 5,
    todayViolations: fraudAnalytics?.todayViolations || 12,
  };

  const actions = (
    <div className="flex items-center gap-2">
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
      title="Security Events"
      subtitle="Monitor exam violations and security alerts"
      icon={AdminIcons.SecurityAlert}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Violations"
            value={stats.totalViolations}
            subtitle="All time"
            icon={ShieldAlert}
            color="red"
          />
          <AdminStatCard
            label="Today"
            value={stats.todayViolations}
            subtitle="Violations today"
            icon={Clock}
            color="orange"
          />
          <AdminStatCard
            label="Flagged Students"
            value={stats.flaggedStudents}
            subtitle="High risk"
            icon={Flag}
            color="purple"
          />
          <AdminStatCard
            label="High Risk Exams"
            value={stats.highRiskExams}
            subtitle="Need review"
            icon={AlertTriangle}
            color="blue"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Violation Types Chart */}
          <AdminCard title="Violation Types" icon={ShieldAlert}>
            {isLoading ? (
              <Skeleton
                height={250}
                borderRadius={12}
                baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
              />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={violationTypes} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                  <XAxis
                    type="number"
                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                    fontSize={11}
                  />
                  <YAxis
                    dataKey="type"
                    type="category"
                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                    fontSize={11}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                      borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </AdminCard>

          {/* Top Violators */}
          <AdminCard title="Top Violators" icon={Users}>
            {isLoading ? (
              <div className="space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      height={50}
                      borderRadius={12}
                      baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                      highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                    />
                  ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(
                  fraudAnalytics?.topViolators || [
                    { name: "Anonymous User 1", count: 8, exams: 3 },
                    { name: "Anonymous User 2", count: 6, exams: 2 },
                    { name: "Anonymous User 3", count: 5, exams: 2 },
                    { name: "Anonymous User 4", count: 4, exams: 1 },
                    { name: "Anonymous User 5", count: 3, exams: 1 },
                  ]
                )
                  .slice(0, 5)
                  .map((student, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                            idx === 0
                              ? "bg-red-100 text-red-600"
                              : idx === 1
                                ? "bg-orange-100 text-orange-600"
                                : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-medium text-sm",
                              isDarkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            {student.name ||
                              student.studentId?.fullname ||
                              "Unknown"}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            {student.exams || 0} exams affected
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-bold",
                          idx === 0
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {student.count}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Recent Security Events */}
        <AdminCard title="Recent Security Events" icon={Shield}>
          {isLoading ? (
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    height={60}
                    borderRadius={12}
                    baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                    highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(securityLogs.length > 0
                ? securityLogs
                : [
                    {
                      severity: "high",
                      type: "Tab Switch",
                      user: "Student A",
                      time: new Date(),
                      exam: "CSC 101",
                    },
                    {
                      severity: "critical",
                      type: "Dev Tools Opened",
                      user: "Student B",
                      time: new Date(Date.now() - 600000),
                      exam: "MTH 201",
                    },
                    {
                      severity: "medium",
                      type: "Copy Attempt",
                      user: "Student C",
                      time: new Date(Date.now() - 1200000),
                      exam: "PHY 101",
                    },
                    {
                      severity: "low",
                      type: "Right Click",
                      user: "Student D",
                      time: new Date(Date.now() - 1800000),
                      exam: "ENG 101",
                    },
                    {
                      severity: "high",
                      type: "Fullscreen Exit",
                      user: "Student E",
                      time: new Date(Date.now() - 2400000),
                      exam: "BIO 101",
                    },
                  ]
              )
                .slice(0, 10)
                .map((event, idx) => {
                  const severityInfo = getSeverityInfo(event.severity);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border",
                        isDarkMode
                          ? "bg-slate-800/30 border-slate-700/50"
                          : "bg-white border-gray-100",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            severityInfo.bg,
                          )}
                        >
                          {severityInfo.icon}
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-medium",
                              isDarkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            {event.type || event.action}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            {event.user || event.userId?.fullname || "Unknown"}{" "}
                            •{" "}
                            {event.exam ||
                              event.examId?.courseId?.courseCode ||
                              "Unknown Exam"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-xs capitalize px-2 py-1 rounded-full",
                            severityInfo.bg,
                          )}
                        >
                          {event.severity}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          {formatDate(event.time || event.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPage>
  );
};

export default SecurityEvents;
