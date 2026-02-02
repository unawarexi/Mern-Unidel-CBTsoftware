import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Search,
  Users,
  Award,
  TrendingUp,
  Clock,
  Eye,
  RefreshCw,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AutoGraded = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch,
  } = useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 100 });

  // Filter auto-graded submissions only
  const autoGraded = submissions.filter(
    (s) => s.status === "graded" && s.autoGraded !== false,
  );

  const filteredSubmissions = autoGraded.filter(
    (sub) =>
      sub.studentId?.fullname
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      sub.studentId?.matricNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Stats
  const passed = autoGraded.filter((s) => s.passed).length;
  const failed = autoGraded.length - passed;
  const avgScore =
    autoGraded.length > 0
      ? autoGraded.reduce((acc, s) => acc + (s.percentage || 0), 0) /
        autoGraded.length
      : 0;

  return (
    <LecturerPage
      title="Auto-Graded Submissions"
      subtitle="View automatically graded MCQ submissions"
      icon={LecturerIcons.Approved}
      actions={
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
      }
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
                  label: "Auto-Graded",
                  value: autoGraded.length,
                  icon: CheckCircle,
                  color: "text-emerald-500",
                },
                {
                  label: "Passed",
                  value: passed,
                  icon: TrendingUp,
                  color: "text-blue-500",
                },
                {
                  label: "Failed",
                  value: failed,
                  icon: Users,
                  color: "text-red-500",
                },
                {
                  label: "Avg Score",
                  value: `${avgScore.toFixed(1)}%`,
                  icon: Award,
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

            {/* Search */}
            <div className="relative">
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

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissionsLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} height={100} className="rounded-2xl" />
                  ))
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, idx) => (
                  <motion.div
                    key={sub._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "p-4 rounded-2xl border",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                            sub.passed
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-red-500/20 text-red-500",
                          )}
                        >
                          {sub.percentage?.toFixed(0) || 0}%
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
                            {sub.studentId?.matricNumber}
                          </p>
                        </div>
                      </div>
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
                    </div>
                    <div
                      className={cn(
                        "mt-3 pt-3 border-t flex items-center justify-between text-sm",
                        isDarkMode ? "border-slate-700" : "border-gray-100",
                      )}
                    >
                      <span
                        className={cn(
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        Score: {sub.score || 0}/{sub.totalMarks || 0}
                      </span>
                      <span
                        className={cn(
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div
                  className={cn(
                    "col-span-2 text-center py-12 rounded-2xl border",
                    isDarkMode
                      ? "bg-slate-800/30 border-slate-800 text-slate-500"
                      : "bg-gray-50 border-gray-100 text-gray-500",
                  )}
                >
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">
                    No auto-graded submissions found
                  </p>
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
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">
              Select an exam to view auto-graded submissions
            </p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default AutoGraded;
