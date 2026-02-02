import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Save,
  RefreshCw,
  ChevronDown,
  FileText,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Manual = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [gradingId, setGradingId] = useState(null);

  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch,
  } = useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 100 });

  // Filter pending/manual grading submissions
  const pendingGrading = submissions.filter(
    (s) => s.status === "pending" || s.requiresManualGrading,
  );

  const filteredSubmissions = pendingGrading.filter(
    (sub) =>
      sub.studentId?.fullname
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      sub.studentId?.matricNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <LecturerPage
      title="Manual Grading"
      subtitle="Grade essay and short answer submissions"
      icon={LecturerIcons.Pending}
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
            {/* Alert Banner */}
            {pendingGrading.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-2xl border flex items-center gap-3",
                  isDarkMode
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-amber-50 border-amber-200",
                )}
              >
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-amber-300" : "text-amber-800",
                  )}
                >
                  You have{" "}
                  <span className="font-bold">{pendingGrading.length}</span>{" "}
                  submissions awaiting manual grading.
                </p>
              </motion.div>
            )}

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

            {/* Submissions List */}
            <div className="space-y-4">
              {submissionsLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} height={120} className="rounded-2xl" />
                  ))
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, idx) => (
                  <motion.div
                    key={sub._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "p-5 rounded-2xl border",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            isDarkMode ? "bg-amber-500/20" : "bg-amber-50",
                          )}
                        >
                          <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "font-semibold",
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
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500">
                        Pending Grade
                      </span>
                    </div>

                    <div
                      className={cn(
                        "p-3 rounded-xl mb-4",
                        isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                      )}
                    >
                      <p
                        className={cn(
                          "text-xs font-medium mb-1",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        Submitted
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-300" : "text-gray-700",
                        )}
                      >
                        {new Date(
                          sub.submittedAt || sub.startedAt,
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setGradingId(sub._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                        Grade Now
                      </button>
                      <button
                        className={cn(
                          "px-4 py-3 rounded-xl transition-all",
                          isDarkMode
                            ? "bg-slate-700 text-white hover:bg-slate-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
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
                    "text-center py-16 rounded-2xl border",
                    isDarkMode
                      ? "bg-slate-800/30 border-slate-800 text-slate-500"
                      : "bg-gray-50 border-gray-100 text-gray-500",
                  )}
                >
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">All submissions graded!</p>
                  <p className="text-sm mt-1">
                    No pending manual grading for this exam.
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
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Select an exam to view pending grades</p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Manual;
