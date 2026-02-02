import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  TrendingUp,
  FileText,
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

const AllResults = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Fetch all submissions
  const {
    submissions = [],
    isLoading,
    refetch,
  } = useGetMySubmissionsAction({ status: "graded" });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Date filter logic
  const filterByDate = (submission) => {
    if (dateFilter === "all") return true;
    const date = new Date(submission.submittedAt);
    const now = new Date();
    switch (dateFilter) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      case "year":
        return date.getFullYear() === now.getFullYear();
      default:
        return true;
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
        (statusFilter === "failed" && !sub.passed);
      const matchesDate = filterByDate(sub);
      return matchesSearch && matchesStatus && matchesDate;
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
  const totalResults = submissions.length;
  const passedCount = submissions.filter((s) => s.passed).length;
  const failedCount = totalResults - passedCount;
  const avgScore =
    totalResults > 0
      ? (
          submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
          totalResults
        ).toFixed(1)
      : 0;
  const highestScore = Math.max(
    ...submissions.map((s) => s.percentage || 0),
    0,
  );
  const passRate =
    totalResults > 0 ? ((passedCount / totalResults) * 100).toFixed(1) : 0;

  const actions = (
    <div className="flex items-center gap-2">
      <ExportButton
        type="semester-summary"
        title="My Results Summary"
        filters={{ status: statusFilter, date: dateFilter }}
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
      title="All Results"
      subtitle="View comprehensive results from all your examinations"
      icon={StudentIcons.Results}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Total",
              value: totalResults,
              icon: FileText,
              color: "text-blue-500",
            },
            {
              label: "Passed",
              value: passedCount,
              icon: CheckCircle,
              color: "text-emerald-500",
            },
            {
              label: "Failed",
              value: failedCount,
              icon: XCircle,
              color: "text-red-500",
            },
            {
              label: "Average",
              value: `${avgScore}%`,
              icon: Target,
              color: "text-orange-500",
            },
            {
              label: "Highest",
              value: `${highestScore}%`,
              icon: Award,
              color: "text-purple-500",
            },
            {
              label: "Pass Rate",
              value: `${passRate}%`,
              icon: TrendingUp,
              color: "text-cyan-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "p-4 rounded-2xl border text-center",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <stat.icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
              <p
                className={cn(
                  "text-xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {isLoading ? (
                  <Skeleton
                    width={40}
                    baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                    highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                  />
                ) : (
                  stat.value
                )}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border outline-none",
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
          </select>
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-700",
            )}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
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
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
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

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={180}
                  borderRadius={16}
                  baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                />
              ))
          ) : paginatedSubmissions.length === 0 ? (
            <div
              className={cn(
                "col-span-full text-center py-16 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-sm">
                {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                  ? "No results match your filters"
                  : "You don't have any graded results yet"}
              </p>
            </div>
          ) : (
            paginatedSubmissions.map((submission, idx) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={cn(
                  "p-5 rounded-2xl border transition-all hover:shadow-lg cursor-pointer",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700 hover:border-orange-500/50"
                    : "bg-white border-gray-100 hover:border-orange-500/50",
                  submission.passed
                    ? "border-l-4 border-l-emerald-500"
                    : "border-l-4 border-l-red-500",
                )}
                onClick={() => navigate("/student/exams/completed")}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        "font-bold truncate",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {submission.examId?.courseId?.courseCode}
                    </h4>
                    <p
                      className={cn(
                        "text-sm truncate",
                        isDarkMode ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {submission.examId?.courseId?.courseTitle}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg",
                      submission.passed
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-red-500/20 text-red-500",
                    )}
                  >
                    {submission.grade || "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      Score
                    </span>
                    <span
                      className={cn(
                        "font-bold text-lg",
                        submission.passed ? "text-emerald-500" : "text-red-500",
                      )}
                    >
                      {submission.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        submission.passed ? "bg-emerald-500" : "bg-red-500",
                      )}
                      style={{ width: `${submission.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        "flex items-center gap-1",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      <Calendar className="w-3 h-3" />
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full font-medium uppercase",
                        submission.passed
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
                      )}
                    >
                      {submission.passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-slate-500" : "text-gray-500",
              )}
            >
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filteredSubmissions.length)} of{" "}
              {filteredSubmissions.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
      </div>
    </StudentPage>
  );
};

export default AllResults;
