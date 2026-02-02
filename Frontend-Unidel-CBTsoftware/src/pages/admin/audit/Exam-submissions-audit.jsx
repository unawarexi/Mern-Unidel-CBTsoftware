import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  Download,
  FileText,
  Clock,
  AlertTriangle,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Users,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetAllSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ExamSubmissionsAudit = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFlagged, setFilterFlagged] = useState("all");
  const [page, setPage] = useState(1);

  const {
    submissions = [],
    pagination,
    isLoading,
    refetch,
  } = useGetAllSubmissionsAction({
    page,
    limit: 25,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      !searchTerm ||
      sub.studentId?.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sub.studentId?.matricNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sub.examId?.courseId?.courseCode
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFlagged =
      filterFlagged === "all" ||
      (filterFlagged === "flagged" &&
        (sub.flagged || (sub.violationCount || 0) > 0)) ||
      (filterFlagged === "clean" &&
        !sub.flagged &&
        (sub.violationCount || 0) === 0);

    return matchesSearch && matchesFlagged;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Stats
  const totalSubmissions = pagination?.totalItems || submissions.length;
  const flaggedCount = submissions.filter(
    (s) => s.flagged || (s.violationCount || 0) > 0,
  ).length;
  const autoSubmitted = submissions.filter(
    (s) => s.autoSubmitted || s.submissionType === "auto",
  ).length;

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
      title="Submission Audit"
      subtitle="Review and audit exam submissions"
      icon={AdminIcons.Clipboard}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Submissions"
            value={totalSubmissions}
            subtitle="All submissions"
            icon={FileText}
            color="blue"
          />
          <AdminStatCard
            label="Flagged"
            value={flaggedCount}
            subtitle="With violations"
            icon={Flag}
            color="red"
          />
          <AdminStatCard
            label="Auto-Submitted"
            value={autoSubmitted}
            subtitle="Time expired"
            icon={Clock}
            color="orange"
          />
          <AdminStatCard
            label="Clean"
            value={totalSubmissions - flaggedCount}
            subtitle="No issues"
            icon={CheckCircle}
            color="green"
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
              placeholder="Search by student, course..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border transition-all text-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
              )}
            />
          </div>
          <select
            value={filterFlagged}
            onChange={(e) => setFilterFlagged(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-xl border text-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-900",
            )}
          >
            <option value="all">All Submissions</option>
            <option value="flagged">Flagged Only</option>
            <option value="clean">Clean Only</option>
          </select>
        </div>

        {/* Submissions List */}
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
          ) : filteredSubmissions.length === 0 ? (
            <div
              className={cn(
                "text-center py-16 rounded-2xl",
                isDarkMode ? "bg-slate-800/30" : "bg-gray-50",
              )}
            >
              <FileText
                className={cn(
                  "w-12 h-12 mx-auto mb-4",
                  isDarkMode ? "text-slate-600" : "text-gray-300",
                )}
              />
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                No submissions found
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission, idx) => {
              const hasFlagged =
                submission.flagged || (submission.violationCount || 0) > 0;

              return (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all",
                    hasFlagged
                      ? isDarkMode
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-red-50 border-red-200"
                      : isDarkMode
                        ? "bg-slate-800/30 border-slate-700/50"
                        : "bg-white border-gray-100",
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          hasFlagged
                            ? "bg-red-500/20 text-red-500"
                            : isDarkMode
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-emerald-100 text-emerald-600",
                        )}
                      >
                        {hasFlagged ? (
                          <Flag className="w-6 h-6" />
                        ) : (
                          <CheckCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {submission.studentId?.fullname || "Unknown Student"}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          {submission.studentId?.matricNumber} •{" "}
                          {submission.examId?.courseId?.courseCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-center">
                        <p
                          className={cn(
                            "text-lg font-bold",
                            (submission.percentage || 0) >= 50
                              ? "text-emerald-500"
                              : "text-red-500",
                          )}
                        >
                          {Math.round(submission.percentage || 0)}%
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          Score
                        </p>
                      </div>

                      <div className="text-center">
                        <p
                          className={cn(
                            "text-lg font-bold",
                            isDarkMode ? "text-slate-300" : "text-gray-700",
                          )}
                        >
                          {formatDuration(submission.timeSpent)}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          Duration
                        </p>
                      </div>

                      <div className="text-center">
                        <p
                          className={cn(
                            "text-lg font-bold",
                            (submission.violationCount || 0) > 0
                              ? "text-red-500"
                              : isDarkMode
                                ? "text-slate-400"
                                : "text-gray-400",
                          )}
                        >
                          {submission.violationCount || 0}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          Violations
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-1 text-xs rounded-full font-medium",
                            submission.autoSubmitted ||
                              submission.submissionType === "auto"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-blue-100 text-blue-600",
                          )}
                        >
                          {submission.autoSubmitted ||
                          submission.submissionType === "auto"
                            ? "Auto"
                            : "Manual"}
                        </span>
                        <button
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isDarkMode
                              ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
                          )}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {hasFlagged &&
                    submission.violations &&
                    submission.violations.length > 0 && (
                      <div
                        className={cn(
                          "mt-3 pt-3 border-t",
                          isDarkMode ? "border-red-500/20" : "border-red-200",
                        )}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-red-400" : "text-red-600",
                            )}
                          >
                            Violations:
                          </span>
                          {submission.violations.slice(0, 3).map((v, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full"
                            >
                              {v.type || v}
                            </span>
                          ))}
                          {submission.violations.length > 3 && (
                            <span className="text-xs text-red-500">
                              +{submission.violations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </motion.div>
              );
            })
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

export default ExamSubmissionsAudit;
