import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Search,
  Calendar,
  Filter,
  Users,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Download,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerDashboardStatsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const SubmissionHistory = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const { dashboardStats, isLoading } = useGetLecturerDashboardStatsAction({});

  // Get all submissions from stats
  const allSubmissions = dashboardStats?.recentSubmissions || [];

  // Filter by search and date
  const filteredSubmissions = allSubmissions.filter((sub) => {
    const matchesSearch =
      sub.studentId?.fullname
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      sub.examId?.courseId?.courseCode
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== "all") {
      const subDate = new Date(sub.submittedAt);
      const now = new Date();
      if (dateFilter === "today") {
        matchesDate = subDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = subDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = subDate >= monthAgo;
      }
    }

    return matchesSearch && matchesDate;
  });

  // Stats
  const total = dashboardStats?.submissions?.totalSubmissions || 0;
  const graded = dashboardStats?.submissions?.gradedSubmissions || 0;
  const avgScore = dashboardStats?.submissions?.averageScore || 0;
  const passRate = dashboardStats?.submissions?.passRate || 0;

  return (
    <LecturerPage
      title="Submission History"
      subtitle="View all past exam submissions"
      icon={LecturerIcons.History}
      actions={
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
            isDarkMode
              ? "bg-slate-800 text-white hover:bg-slate-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Submissions",
              value: total,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Graded",
              value: graded,
              icon: CheckCircle,
              color: "text-emerald-500",
            },
            {
              label: "Average Score",
              value: `${avgScore.toFixed(1)}%`,
              icon: Award,
              color: "text-purple-500",
            },
            {
              label: "Pass Rate",
              value: `${passRate.toFixed(1)}%`,
              icon: History,
              color: "text-orange-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
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
                {isLoading ? <Skeleton width={40} /> : stat.value}
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-3 rounded-xl border outline-none",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
              )}
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-900",
            )}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* History Table */}
        <div
          className={cn(
            "rounded-2xl border overflow-hidden",
            isDarkMode ? "border-slate-700" : "border-gray-200",
          )}
        >
          <div
            className={cn(
              "overflow-x-auto",
              isDarkMode ? "bg-slate-800/50" : "bg-white",
            )}
          >
            <table className="w-full">
              <thead
                className={cn(
                  "border-b",
                  isDarkMode ? "border-slate-700" : "border-gray-200",
                )}
              >
                <tr>
                  {["Student", "Course", "Score", "Status", "Date"].map(
                    (header) => (
                      <th
                        key={header}
                        className={cn(
                          "px-4 py-3 text-left text-sm font-medium",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody
                className={cn(
                  "divide-y",
                  isDarkMode ? "divide-slate-700" : "divide-gray-100",
                )}
              >
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <tr key={idx}>
                        {Array(5)
                          .fill(0)
                          .map((__, cidx) => (
                            <td key={cidx} className="px-4 py-3">
                              <Skeleton width={80} />
                            </td>
                          ))}
                      </tr>
                    ))
                ) : filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub) => (
                    <tr
                      key={sub._id}
                      className={cn(
                        "transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-700/50"
                          : "hover:bg-gray-50",
                      )}
                    >
                      <td
                        className={cn(
                          "px-4 py-3 font-medium",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {sub.studentId?.fullname || "Unknown"}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-sm",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        {sub.examId?.courseId?.courseCode || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-bold",
                            sub.percentage >= 70
                              ? "text-emerald-500"
                              : sub.percentage >= 50
                                ? "text-amber-500"
                                : "text-red-500",
                          )}
                        >
                          {sub.percentage?.toFixed(1) || 0}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            sub.passed
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-red-500/20 text-red-500",
                          )}
                        >
                          {sub.passed ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-sm",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className={cn(
                        "px-4 py-8 text-center",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      No submissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LecturerPage>
  );
};

export default SubmissionHistory;
