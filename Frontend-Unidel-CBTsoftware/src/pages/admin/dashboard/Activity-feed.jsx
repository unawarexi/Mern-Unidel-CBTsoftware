import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Filter,
  Search,
  Download,
  Users,
  GraduationCap,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  ChevronRight,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetActivityLogsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ActivityFeed = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const {
    activityLogs = [],
    pagination,
    isLoading,
    refetch,
  } = useGetActivityLogsAction({
    page,
    limit: 20,
    role: filterRole !== "all" ? filterRole : undefined,
    action: filterAction !== "all" ? filterAction : undefined,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-600";
      case "failed":
        return "bg-red-100 text-red-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-5 h-5 text-orange-500" />;
      case "lecturer":
        return <GraduationCap className="w-5 h-5 text-green-500" />;
      case "student":
        return <Users className="w-5 h-5 text-blue-500" />;
      default:
        return <Users className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleBg = (role) => {
    switch (role) {
      case "admin":
        return isDarkMode ? "bg-orange-500/20" : "bg-orange-100";
      case "lecturer":
        return isDarkMode ? "bg-green-500/20" : "bg-green-100";
      case "student":
        return isDarkMode ? "bg-blue-500/20" : "bg-blue-100";
      default:
        return isDarkMode ? "bg-gray-500/20" : "bg-gray-100";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredLogs = activityLogs.filter((log) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      log.userId?.fullname?.toLowerCase().includes(searchLower) ||
      log.action?.toLowerCase().includes(searchLower) ||
      log.details?.toLowerCase().includes(searchLower)
    );
  });

  const actions = (
    <div className="flex items-center gap-2 flex-wrap">
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
    </div>
  );

  return (
    <AdminPage
      title="Live Activity Feed"
      subtitle="Monitor real-time system activity and user actions"
      icon={AdminIcons.Activity}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Filters Bar */}
        <div
          className={cn(
            "flex flex-wrap gap-3 p-4 rounded-2xl",
            isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
          )}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border transition-all text-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
              )}
            />
          </div>

          {/* Role Filter */}
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

          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-xl border text-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-900",
            )}
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="exam_start">Exam Start</option>
            <option value="exam_submit">Exam Submit</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={80}
                  borderRadius={16}
                  baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                />
              ))
          ) : filteredLogs.length === 0 ? (
            <div
              className={cn(
                "text-center py-16 rounded-2xl",
                isDarkMode ? "bg-slate-800/30" : "bg-gray-50",
              )}
            >
              <AdminIcons.Activity
                className={cn(
                  "w-12 h-12 mx-auto mb-4",
                  isDarkMode ? "text-slate-600" : "text-gray-300",
                )}
              />
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                No activity logs found
              </p>
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <motion.div
                key={log._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01]",
                  isDarkMode
                    ? "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                    : "bg-white border-gray-100 hover:shadow-md",
                )}
              >
                {/* Role Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    getRoleBg(log.role),
                  )}
                >
                  {getRoleIcon(log.role)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className={cn(
                          "font-medium",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {log.userId?.fullname || "Unknown User"}
                        <span
                          className={cn(
                            "font-normal ml-1",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          {log.action?.replace(/_/g, " ")}
                        </span>
                      </p>
                      {log.details && (
                        <p
                          className={cn(
                            "text-sm mt-1 line-clamp-1",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        >
                          {log.details}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs flex-shrink-0",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    >
                      {formatTimestamp(log.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full capitalize",
                        getStatusColor(log.status),
                      )}
                    >
                      {log.status || "info"}
                    </span>
                    <span
                      className={cn(
                        "text-xs capitalize px-2 py-1 rounded-full",
                        isDarkMode
                          ? "bg-slate-700/50 text-slate-400"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {log.role}
                    </span>
                    {log.ipAddress && (
                      <span
                        className={cn(
                          "text-xs hidden sm:inline",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      >
                        IP: {log.ipAddress}
                      </span>
                    )}
                  </div>
                </div>

                {/* View Button */}
                <button
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-shrink-0",
                    isDarkMode
                      ? "hover:bg-slate-700 text-slate-400"
                      : "hover:bg-gray-100 text-gray-400",
                  )}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
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
              Showing {(page - 1) * 20 + 1} to{" "}
              {Math.min(page * 20, pagination.totalItems)} of{" "}
              {pagination.totalItems}
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
              <span
                className={cn(
                  "px-4 py-2 text-sm",
                  isDarkMode ? "text-slate-400" : "text-gray-600",
                )}
              >
                {page} / {pagination.totalPages}
              </span>
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

export default ActivityFeed;
