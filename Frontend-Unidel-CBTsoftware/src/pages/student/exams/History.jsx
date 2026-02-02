import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  History as HistoryIcon,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";
import ExportButton from "../../../components/ExportButton";

const History = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch all submissions
  const {
    submissions = [],
    isLoading,
    refetch,
  } = useGetMySubmissionsAction({});

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and sort
  const filteredSubmissions = submissions
    .filter((sub) => {
      const matchesSearch =
        sub.examId?.courseId?.courseTitle
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        sub.examId?.courseId?.courseCode
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "passed" && sub.passed) ||
        (statusFilter === "failed" && !sub.passed) ||
        (statusFilter === "graded" && sub.status === "graded") ||
        (statusFilter === "pending" && sub.status !== "graded");
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0);
          break;
        case "score":
          comparison = (a.percentage || 0) - (b.percentage || 0);
          break;
        case "course":
          comparison = (a.examId?.courseId?.courseCode || "").localeCompare(
            b.examId?.courseId?.courseCode || "",
          );
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / pageSize);
  const paginatedSubmissions = filteredSubmissions.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // Stats
  const totalAttempts = submissions.length;
  const passedAttempts = submissions.filter((s) => s.passed).length;
  const failedAttempts = totalAttempts - passedAttempts;
  const avgScore =
    totalAttempts > 0
      ? (
          submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
          totalAttempts
        ).toFixed(1)
      : 0;

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const actions = (
    <div className="flex items-center gap-2">
      <ExportButton
        type="semester-summary"
        title="Exam History Report"
        filters={{ status: statusFilter, search: searchQuery }}
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
    <StudentPage
      title="Exam History"
      subtitle="View all your past exam attempts and results"
      icon={StudentIcons.History}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Attempts",
              value: totalAttempts,
              icon: FileText,
              color: "text-blue-500",
            },
            {
              label: "Passed",
              value: passedAttempts,
              icon: CheckCircle,
              color: "text-emerald-500",
            },
            {
              label: "Failed",
              value: failedAttempts,
              icon: XCircle,
              color: "text-red-500",
            },
            {
              label: "Average Score",
              value: `${avgScore}%`,
              icon: Target,
              color: "text-orange-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <div>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {isLoading ? <Skeleton width={30} /> : stat.value}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search by course name or code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-400",
              )}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-700",
            )}
          >
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="graded">Graded</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-700",
            )}
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
            <option value="course">Sort by Course</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className={cn(
              "p-3 rounded-xl border transition-all",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
            )}
          >
            {sortOrder === "desc" ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* History List */}
        <div
          className={cn(
            "rounded-3xl border overflow-hidden",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} height={80} borderRadius={12} />
                ))}
            </div>
          ) : paginatedSubmissions.length === 0 ? (
            <div
              className={cn(
                "text-center py-16",
                isDarkMode ? "text-slate-500" : "text-gray-500",
              )}
            >
              <HistoryIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No History Found</h3>
              <p className="text-sm">
                {searchQuery || statusFilter !== "all"
                  ? "No exams match your filter criteria"
                  : "You haven't taken any exams yet"}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div
                className={cn(
                  "hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-medium uppercase tracking-wider border-b",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700 text-slate-500"
                    : "bg-gray-50 border-gray-100 text-gray-500",
                )}
              >
                <div className="col-span-4">Course</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-2">Grade</div>
                <div className="col-span-2">Status</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {paginatedSubmissions.map((submission, idx) => (
                  <motion.div
                    key={submission._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all",
                      isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-gray-50",
                    )}
                    onClick={() => navigate("/student/exams/completed")}
                  >
                    {/* Course */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          submission.passed
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-red-500/20 text-red-500",
                        )}
                      >
                        {submission.passed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "font-semibold truncate",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {submission.examId?.courseId?.courseCode}
                        </p>
                        <p
                          className={cn(
                            "text-sm truncate",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          {submission.examId?.courseId?.courseTitle}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="md:col-span-2 flex items-center">
                      <span
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="md:col-span-2 flex items-center">
                      <span
                        className={cn(
                          "text-lg font-bold",
                          submission.passed
                            ? "text-emerald-500"
                            : "text-red-500",
                        )}
                      >
                        {submission.percentage}%
                      </span>
                    </div>

                    {/* Grade */}
                    <div className="md:col-span-2 flex items-center">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          submission.passed
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-red-500/20 text-red-500",
                        )}
                      >
                        {submission.grade || "N/A"}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2 flex items-center">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium uppercase",
                          submission.passed
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
                        )}
                      >
                        {submission.passed ? "Passed" : "Failed"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className={cn(
                    "flex items-center justify-between px-6 py-4 border-t",
                    isDarkMode ? "border-slate-700" : "border-gray-100",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    Showing {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, filteredSubmissions.length)} of{" "}
                    {filteredSubmissions.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        page === 1
                          ? "opacity-50 cursor-not-allowed"
                          : isDarkMode
                            ? "bg-slate-700 text-white hover:bg-slate-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        page === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "bg-orange-500 text-white hover:bg-orange-600",
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StudentPage>
  );
};

export default History;
