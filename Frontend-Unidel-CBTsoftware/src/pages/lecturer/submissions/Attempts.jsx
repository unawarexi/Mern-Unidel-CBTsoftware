import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Calendar,
  ChevronDown,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Attempts = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch,
  } = useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 100 });

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentId?.fullname
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      sub.studentId?.matricNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && sub.status === "graded") ||
      (statusFilter === "in-progress" && sub.status === "in_progress") ||
      (statusFilter === "pending" && sub.status === "pending");
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalAttempts = submissions.length;
  const completed = submissions.filter((s) => s.status === "graded").length;
  const inProgress = submissions.filter(
    (s) => s.status === "in_progress",
  ).length;
  const pending = submissions.filter((s) => s.status === "pending").length;

  const actions = (
    <button
      onClick={() => refetch()}
      className={cn(
        "p-2 rounded-xl transition-all",
        isDarkMode
          ? "bg-slate-800 text-slate-400 hover:text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
      )}
    >
      <RefreshCw className="w-5 h-5" />
    </button>
  );

  return (
    <LecturerPage
      title="Submission Attempts"
      subtitle="View all student exam attempts"
      icon={LecturerIcons.Submissions}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Exam Selector */}
        <div
          className={cn(
            "p-4 rounded-2xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <label
            className={cn(
              "text-sm font-medium mb-2 block",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Select Exam
          </label>
          <div className="relative">
            <select
              value={selectedExam?._id || ""}
              onChange={(e) =>
                setSelectedExam(
                  exams.find((ex) => ex._id === e.target.value) || null,
                )
              }
              className={cn(
                "w-full px-4 py-3 rounded-xl border appearance-none outline-none",
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-200 text-gray-900",
              )}
            >
              <option value="">-- Select an exam --</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.courseId?.courseCode} - {exam.courseId?.courseTitle}
                </option>
              ))}
            </select>
            <ChevronDown
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
          </div>
        </div>

        {selectedExam && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Attempts",
                  value: totalAttempts,
                  icon: Users,
                  color: "text-blue-500",
                },
                {
                  label: "Completed",
                  value: completed,
                  icon: CheckCircle,
                  color: "text-emerald-500",
                },
                {
                  label: "In Progress",
                  value: inProgress,
                  icon: Clock,
                  color: "text-amber-500",
                },
                {
                  label: "Pending",
                  value: pending,
                  icon: ClipboardCheck,
                  color: "text-purple-500",
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
                  <stat.icon
                    className={cn("w-5 h-5 mx-auto mb-2", stat.color)}
                  />
                  <p
                    className={cn(
                      "text-xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {submissionsLoading ? <Skeleton width={30} /> : stat.value}
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
                  placeholder="Search by student name or matric..."
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={cn(
                  "px-4 py-3 rounded-xl border outline-none",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-200 text-gray-900",
                )}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Attempts List */}
            <div className="space-y-3">
              {submissionsLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} height={80} className="rounded-2xl" />
                  ))
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, idx) => (
                  <motion.div
                    key={sub._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "p-4 rounded-2xl border flex items-center justify-between",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                          sub.status === "graded"
                            ? sub.passed
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-red-500/20 text-red-500"
                            : "bg-amber-500/20 text-amber-500",
                        )}
                      >
                        {sub.status === "graded" ? (
                          `${sub.percentage?.toFixed(0) || 0}%`
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {sub.studentId?.fullname || "Unknown"}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          {sub.studentId?.matricNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          sub.status === "graded"
                            ? sub.passed
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-red-500/20 text-red-500"
                            : sub.status === "in_progress"
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-blue-500/20 text-blue-500",
                        )}
                      >
                        {sub.status === "graded"
                          ? sub.passed
                            ? "Passed"
                            : "Failed"
                          : sub.status === "in_progress"
                            ? "In Progress"
                            : "Pending"}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {new Date(
                          sub.submittedAt || sub.startedAt,
                        ).toLocaleDateString()}
                      </span>
                      <button
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          isDarkMode
                            ? "hover:bg-slate-600 text-slate-400"
                            : "hover:bg-gray-100 text-gray-500",
                        )}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div
                  className={cn(
                    "text-center py-12 rounded-2xl border",
                    isDarkMode
                      ? "bg-slate-800/30 border-slate-800 text-slate-500"
                      : "bg-gray-50 border-gray-100 text-gray-500",
                  )}
                >
                  <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No attempts found</p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedExam && !examsLoading && (
          <div
            className={cn(
              "text-center py-20 rounded-2xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <ClipboardCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Select an exam to view attempts</p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Attempts;
