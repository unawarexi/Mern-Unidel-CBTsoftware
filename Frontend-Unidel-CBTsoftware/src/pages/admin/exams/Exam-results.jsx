import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  Download,
  Filter,
  Eye,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard, AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetAllSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import ExportButton from "../../../components/ExportButton";

const ExamResults = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const {
    submissions = [],
    pagination,
    isLoading,
    refetch,
  } = useGetAllSubmissionsAction({
    page,
    limit: 20,
    status: filterStatus !== "all" ? filterStatus : undefined,
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
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      sub.studentId?.fullname?.toLowerCase().includes(searchLower) ||
      sub.studentId?.matricNumber?.toLowerCase().includes(searchLower) ||
      sub.examId?.courseId?.courseCode?.toLowerCase().includes(searchLower) ||
      sub.examId?.courseId?.courseTitle?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 70) return "text-emerald-500";
    if (percentage >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getStatusBadge = (submission) => {
    if (submission.status === "graded") {
      const passed = (submission.percentage || 0) >= 50;
      return (
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            passed
              ? "bg-emerald-100 text-emerald-600"
              : "bg-red-100 text-red-600",
          )}
        >
          {passed ? "Passed" : "Failed"}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600">
        {submission.status || "Pending"}
      </span>
    );
  };

  // Stats
  const totalSubmissions = pagination?.totalItems || submissions.length;
  const passedCount = submissions.filter(
    (s) => (s.percentage || 0) >= 50,
  ).length;
  const failedCount = submissions.filter(
    (s) => (s.percentage || 0) < 50 && s.status === "graded",
  ).length;
  const avgScore =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
            submissions.length,
        )
      : 0;

  const actions = (
    <div className="flex items-center gap-2">
      <ExportButton
        type="exam-result"
        title="Admin Exam Results Report"
        filters={{ status: filterStatus, search: searchTerm }}
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
      title="Exam Results"
      subtitle="View and manage all exam submissions and grades"
      icon={AdminIcons.Results}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Results"
            value={totalSubmissions}
            subtitle="All submissions"
            icon={FileText}
            color="blue"
          />
          <AdminStatCard
            label="Passed"
            value={passedCount}
            subtitle="50%+ score"
            icon={CheckCircle}
            color="green"
          />
          <AdminStatCard
            label="Failed"
            value={failedCount}
            subtitle="Below 50%"
            icon={XCircle}
            color="red"
          />
          <AdminStatCard
            label="Avg Score"
            value={`${avgScore}%`}
            subtitle="Overall average"
            icon={Award}
            trend={avgScore >= 60 ? "+5%" : "-3%"}
            trendUp={avgScore >= 60}
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
            <option value="graded">Graded</option>
            <option value="submitted">Submitted</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        {/* Results Table */}
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
                    Student
                  </th>
                  <th
                    className={cn(
                      "text-left px-4 py-3 font-semibold text-sm hidden md:table-cell",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Course
                  </th>
                  <th
                    className={cn(
                      "text-left px-4 py-3 font-semibold text-sm hidden lg:table-cell",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Submitted
                  </th>
                  <th
                    className={cn(
                      "text-center px-4 py-3 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Score
                  </th>
                  <th
                    className={cn(
                      "text-center px-4 py-3 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Status
                  </th>
                  <th
                    className={cn(
                      "text-center px-4 py-3 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="p-2">
                          <Skeleton
                            height={50}
                            baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                            highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                          />
                        </td>
                      </tr>
                    ))
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <FileText
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
                        No results found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission, idx) => (
                    <motion.tr
                      key={submission._id}
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
                        <div>
                          <p
                            className={cn(
                              "font-medium",
                              isDarkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            {submission.studentId?.fullname || "Unknown"}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            {submission.studentId?.matricNumber}
                          </p>
                        </div>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 hidden md:table-cell",
                          isDarkMode ? "text-slate-300" : "text-gray-600",
                        )}
                      >
                        <p className="text-sm">
                          {submission.examId?.courseId?.courseCode}
                        </p>
                        <p
                          className={cn(
                            "text-xs truncate max-w-[150px]",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        >
                          {submission.examId?.courseId?.courseTitle}
                        </p>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-sm hidden lg:table-cell",
                          isDarkMode ? "text-slate-400" : "text-gray-500",
                        )}
                      >
                        {formatDate(
                          submission.submittedAt || submission.createdAt,
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "text-lg font-bold",
                            getGradeColor(submission.percentage || 0),
                          )}
                        >
                          {Math.round(submission.percentage || 0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(submission)}
                      </td>
                      <td className="px-4 py-3 text-center">
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

export default ExamResults;
