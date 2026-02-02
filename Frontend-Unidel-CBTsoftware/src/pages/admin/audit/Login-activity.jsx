import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  Download,
  LogIn,
  LogOut,
  Clock,
  Users,
  Shield,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Filter,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetActivityLogsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import ExportButton from "../../../components/ExportButton";

const LoginActivity = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const {
    activityLogs = [],
    pagination,
    isLoading,
    refetch,
  } = useGetActivityLogsAction({
    page,
    limit: 25,
    action: "login",
    role: filterRole !== "all" ? filterRole : undefined,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredLogs = activityLogs.filter((log) => {
    if (!searchTerm)
      return filterStatus === "all" || log.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      log.userId?.fullname?.toLowerCase().includes(searchLower) ||
      log.userId?.email?.toLowerCase().includes(searchLower) ||
      log.ipAddress?.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-orange-100 text-orange-600",
      lecturer: "bg-green-100 text-green-600",
      student: "bg-blue-100 text-blue-600",
    };
    return (
      <span
        className={cn(
          "px-2 py-1 text-xs rounded-full font-medium capitalize",
          colors[role] || "bg-gray-100 text-gray-600",
        )}
      >
        {role}
      </span>
    );
  };

  // Stats
  const successfulLogins = activityLogs.filter(
    (l) => l.status === "success",
  ).length;
  const failedLogins = activityLogs.filter((l) => l.status === "failed").length;
  const uniqueUsers = new Set(activityLogs.map((l) => l.userId?._id)).size;

  const actions = (
    <div className="flex items-center gap-2">
      <ExportButton
        type="analytics"
        title="Admin Login Activity Report"
        filters={{ role: filterRole, status: filterStatus, search: searchTerm }}
      />
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
      title="Login Activity"
      subtitle="Monitor user login attempts and sessions"
      icon={AdminIcons.Login}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Logins"
            value={activityLogs.length}
            subtitle="This period"
            icon={LogIn}
            color="blue"
          />
          <AdminStatCard
            label="Successful"
            value={successfulLogins}
            subtitle="Login success"
            icon={CheckCircle}
            color="green"
          />
          <AdminStatCard
            label="Failed"
            value={failedLogins}
            subtitle="Login failed"
            icon={XCircle}
            color="red"
          />
          <AdminStatCard
            label="Unique Users"
            value={uniqueUsers}
            subtitle="Active users"
            icon={Users}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div
          className={cn(
            "flex flex-wrap gap-3 p-4 rounded-2xl",
            isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
          )}
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or IP..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border transition-all text-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
              )}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-xl border text-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-900",
            )}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="lecturer">Lecturer</option>
            <option value="student">Student</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-xl border text-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-900",
            )}
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Logs Table */}
        <div
          className={cn(
            "rounded-2xl border overflow-hidden",
            isDarkMode ? "border-slate-700" : "border-gray-200",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-gray-50 border-gray-200",
                  )}
                >
                  <th
                    className={cn(
                      "text-left px-4 py-3 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    User
                  </th>
                  <th
                    className={cn(
                      "text-left px-4 py-3 font-semibold text-sm hidden md:table-cell",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Role
                  </th>
                  <th
                    className={cn(
                      "text-left px-4 py-3 font-semibold text-sm hidden lg:table-cell",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    IP Address
                  </th>
                  <th
                    className={cn(
                      "text-left px-4 py-3 font-semibold text-sm hidden lg:table-cell",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Time
                  </th>
                  <th
                    className={cn(
                      "text-center px-4 py-3 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="p-2">
                          <Skeleton
                            height={50}
                            baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                            highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                          />
                        </td>
                      </tr>
                    ))
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <LogIn
                        className={cn(
                          "w-12 h-12 mx-auto mb-4",
                          isDarkMode ? "text-slate-600" : "text-gray-300",
                        )}
                      />
                      <p
                        className={
                          isDarkMode ? "text-slate-400" : "text-gray-500"
                        }
                      >
                        No login activity found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, idx) => (
                    <motion.tr
                      key={log._id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        "border-b transition-colors",
                        isDarkMode
                          ? "border-slate-700/50 hover:bg-slate-800/30"
                          : "border-gray-100 hover:bg-gray-50",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              log.status === "success"
                                ? isDarkMode
                                  ? "bg-emerald-500/20"
                                  : "bg-emerald-100"
                                : isDarkMode
                                  ? "bg-red-500/20"
                                  : "bg-red-100",
                            )}
                          >
                            {log.status === "success" ? (
                              <LogIn className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <LogOut className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-medium",
                                isDarkMode ? "text-white" : "text-gray-900",
                              )}
                            >
                              {log.userId?.fullname || "Unknown User"}
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-slate-500" : "text-gray-500",
                              )}
                            >
                              {log.userId?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {getRoleBadge(log.role)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-sm hidden lg:table-cell",
                          isDarkMode ? "text-slate-400" : "text-gray-500",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {log.ipAddress || "Unknown"}
                        </div>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-sm hidden lg:table-cell",
                          isDarkMode ? "text-slate-400" : "text-gray-500",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDate(log.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(log.status)}
                          <span
                            className={cn(
                              "text-sm capitalize",
                              log.status === "success"
                                ? "text-emerald-500"
                                : "text-red-500",
                            )}
                          >
                            {log.status}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-slate-400" : "text-gray-500",
              )}
            >
              Page {page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50",
                  isDarkMode
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50",
                  isDarkMode
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
};

export default LoginActivity;
