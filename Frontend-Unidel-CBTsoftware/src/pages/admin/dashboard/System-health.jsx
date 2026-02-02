import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminCard, AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetSystemAnalyticsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const SystemHealth = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("week");

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

  // Health metrics
  const healthMetrics = [
    {
      metric: "Server Uptime",
      value: 99.8,
      status: "excellent",
      icon: Server,
    },
    {
      metric: "Database Load",
      value: systemAnalytics?.databaseLoad || 65,
      status: systemAnalytics?.databaseLoad > 80 ? "warning" : "good",
      icon: Database,
    },
    {
      metric: "API Response Time",
      value: 98,
      status: "excellent",
      icon: Zap,
    },
    {
      metric: "Storage Usage",
      value: systemAnalytics?.storageUsage || 72,
      status: systemAnalytics?.storageUsage > 85 ? "warning" : "good",
      icon: HardDrive,
    },
    {
      metric: "Active Sessions",
      value: systemAnalytics?.activeSessions || 85,
      status: "good",
      icon: Wifi,
    },
    {
      metric: "CPU Usage",
      value: systemAnalytics?.cpuUsage || 45,
      status: systemAnalytics?.cpuUsage > 70 ? "warning" : "excellent",
      icon: Cpu,
    },
  ];

  // Peak hours data
  const peakHours = (systemAnalytics?.peakHours || [])
    .slice(0, 12)
    .map((hour) => ({
      hour: `${hour._id}:00`,
      usage: hour.count,
    }));

  // Activity by role
  const activityByRole = systemAnalytics?.activityByRole || [
    { role: "student", activityCount: 450, uniqueUsers: 120 },
    { role: "lecturer", activityCount: 280, uniqueUsers: 35 },
    { role: "admin", activityCount: 150, uniqueUsers: 8 },
  ];

  // Top actions
  const topActions = (systemAnalytics?.topActions || [])
    .slice(0, 8)
    .map((action) => ({
      action: action._id?.replace(/_/g, " ") || "Unknown",
      count: action.count,
    }));

  // System errors count
  const systemErrors = systemAnalytics?.systemErrors || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "text-emerald-500";
      case "good":
        return "text-blue-500";
      case "warning":
        return "text-amber-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "excellent":
        return "bg-emerald-500";
      case "good":
        return "bg-blue-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
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
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
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
      title="System Health"
      subtitle="Monitor system performance and resource usage"
      icon={AdminIcons.Server}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Active Users"
            value={activityByRole.reduce((sum, r) => sum + r.uniqueUsers, 0)}
            subtitle="Currently online"
            icon={Users}
            color="blue"
          />
          <AdminStatCard
            label="API Requests"
            value={systemAnalytics?.totalRequests || "2.4K"}
            subtitle="Last hour"
            icon={Zap}
            trend="+12%"
            trendUp
            color="green"
          />
          <AdminStatCard
            label="System Errors"
            value={systemErrors}
            subtitle="This period"
            icon={AlertTriangle}
            color={systemErrors > 10 ? "red" : "orange"}
          />
          <AdminStatCard
            label="Avg Response"
            value={`${systemAnalytics?.avgResponseTime || 125}ms`}
            subtitle="API latency"
            icon={Clock}
            color="purple"
          />
        </div>

        {/* Health Metrics Grid */}
        <AdminCard title="Resource Metrics" icon={Activity}>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    height={80}
                    borderRadius={12}
                    baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                    highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {healthMetrics.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-4 rounded-xl border",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700/50"
                      : "bg-gray-50 border-gray-100",
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isDarkMode ? "bg-slate-700" : "bg-white",
                      )}
                    >
                      <item.icon
                        className={cn("w-5 h-5", getStatusColor(item.status))}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xl font-bold",
                        getStatusColor(item.status),
                      )}
                    >
                      {item.value}%
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-medium mb-2",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    {item.metric}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        getStatusBg(item.status),
                      )}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peak Usage Hours */}
          <AdminCard title="Peak Usage Hours" icon={Clock}>
            {isLoading ? (
              <Skeleton
                height={250}
                borderRadius={12}
                baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
              />
            ) : peakHours.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={peakHours}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                    fontSize={11}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                      borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="usage" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </AdminCard>

          {/* Activity by Role */}
          <AdminCard title="Activity by Role" icon={Users}>
            {isLoading ? (
              <Skeleton
                height={250}
                borderRadius={12}
                baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
              />
            ) : (
              <div className="space-y-4">
                {activityByRole.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl",
                      isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          item.role === "admin"
                            ? "bg-orange-100 text-orange-600"
                            : item.role === "lecturer"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600",
                        )}
                      >
                        {item.role === "admin" ? (
                          <AdminIcons.Admin className="w-5 h-5" />
                        ) : item.role === "lecturer" ? (
                          <AdminIcons.Lecturer className="w-5 h-5" />
                        ) : (
                          <AdminIcons.Users className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-semibold capitalize",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {item.role}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          {item.uniqueUsers} active users
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-xl font-bold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {item.activityCount}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-400" : "text-gray-500",
                        )}
                      >
                        actions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Top Actions */}
        <AdminCard title="Top Actions" icon={Zap}>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array(8)
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
          ) : topActions.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {topActions.map((action, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-4 rounded-xl border text-center",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700/50"
                      : "bg-gray-50 border-gray-100",
                  )}
                >
                  <p
                    className={cn(
                      "text-2xl font-bold mb-1",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {action.count}
                  </p>
                  <p
                    className={cn(
                      "text-xs capitalize truncate",
                      isDarkMode ? "text-slate-400" : "text-gray-500",
                    )}
                  >
                    {action.action}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No action data available
            </div>
          )}
        </AdminCard>

        {/* System Status Footer */}
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-2xl",
            isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                systemErrors > 10 ? "bg-red-500" : "bg-emerald-500",
              )}
            />
            <span className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
              System Status:{" "}
              <strong>
                {systemErrors > 10
                  ? "Issues Detected"
                  : "All Systems Operational"}
              </strong>
            </span>
          </div>
          <span
            className={cn(
              "text-sm",
              isDarkMode ? "text-slate-400" : "text-gray-500",
            )}
          >
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </AdminPage>
  );
};

export default SystemHealth;
