import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Monitor,
  Play,
  Pause,
  MessageCircle,
  Shield,
  Activity,
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

const Live = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedExam, setSelectedExam] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch,
  } = useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 100 });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh && selectedExam) {
      const interval = setInterval(() => refetch(), 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedExam, refetch]);

  // Get active exams only
  const activeExams = exams.filter((e) => e.status === "active");

  // Calculate live stats
  const inProgress = submissions.filter(
    (s) => s.status === "in_progress",
  ).length;
  const completed = submissions.filter(
    (s) => s.status === "graded" || s.status === "submitted",
  ).length;
  const flagged = submissions.filter(
    (s) => s.flags?.length > 0 || s.integrity?.flagged,
  ).length;

  // Mock active students
  const activeStudents = submissions
    .filter((s) => s.status === "in_progress")
    .map((s) => ({
      ...s,
      timeRemaining: Math.floor(Math.random() * 60) + 1,
      progress: Math.floor(Math.random() * 100),
      flagged: Math.random() > 0.8,
    }));

  return (
    <LecturerPage
      title="Live Monitoring"
      subtitle="Monitor exams in real-time"
      icon={LecturerIcons.Live}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
              autoRefresh
                ? "bg-emerald-500 text-white"
                : isDarkMode
                  ? "bg-slate-800 text-white"
                  : "bg-gray-100 text-gray-700",
            )}
          >
            {autoRefresh ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}
          </button>
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
        </div>
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
            Select Active Exam
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
              {activeExams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.courseId?.courseCode} - {exam.courseId?.courseTitle}{" "}
                  (Active)
                </option>
              ))}
              {exams
                .filter((e) => e.status !== "active")
                .map((exam) => (
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
            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "In Progress",
                  value: inProgress,
                  icon: Activity,
                  color: "text-blue-500",
                  pulse: true,
                },
                {
                  label: "Completed",
                  value: completed,
                  icon: CheckCircle,
                  color: "text-emerald-500",
                },
                {
                  label: "Flagged",
                  value: flagged,
                  icon: AlertTriangle,
                  color: "text-red-500",
                  alert: flagged > 0,
                },
                {
                  label: "Total",
                  value: submissions.length,
                  icon: Users,
                  color: "text-purple-500",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-4 rounded-2xl border text-center relative",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-white border-gray-100",
                    stat.pulse && inProgress > 0 && "animate-pulse",
                    stat.alert && "border-red-500",
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

            {/* Active Students */}
            <div>
              <h3
                className={cn(
                  "font-bold mb-4 flex items-center gap-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                <Activity className="w-5 h-5 text-blue-500" />
                Students Taking Exam ({inProgress})
              </h3>
              {submissionsLoading ? (
                <Skeleton count={5} height={70} className="mb-2" />
              ) : activeStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeStudents.map((student, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "p-4 rounded-2xl border",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700"
                          : "bg-white border-gray-100",
                        student.flagged && "border-red-500",
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              isDarkMode ? "bg-blue-500/20" : "bg-blue-50",
                            )}
                          >
                            <Monitor className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-medium",
                                isDarkMode ? "text-white" : "text-gray-900",
                              )}
                            >
                              {student.studentId?.fullname || "Unknown"}
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-slate-500" : "text-gray-500",
                              )}
                            >
                              {student.studentId?.matricNumber}
                            </p>
                          </div>
                        </div>
                        {student.flagged && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Flagged
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span
                            className={
                              isDarkMode ? "text-slate-400" : "text-gray-600"
                            }
                          >
                            {student.timeRemaining} mins left
                          </span>
                        </div>
                        <span
                          className={
                            isDarkMode ? "text-slate-400" : "text-gray-600"
                          }
                        >
                          {student.progress}% complete
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "text-center py-12 rounded-2xl border",
                    isDarkMode
                      ? "bg-slate-800/30 border-slate-800 text-slate-500"
                      : "bg-gray-50 border-gray-100 text-gray-500",
                  )}
                >
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">
                    No students currently taking the exam
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedExam && activeExams.length > 0 && (
          <div
            className={cn(
              "p-6 rounded-2xl border text-center",
              isDarkMode
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-emerald-50 border-emerald-200",
            )}
          >
            <Play className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <p
              className={cn(
                "font-medium",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              {activeExams.length} Active Exam
              {activeExams.length > 1 ? "s" : ""}
            </p>
            <p
              className={cn(
                "text-sm mt-1",
                isDarkMode ? "text-slate-400" : "text-gray-600",
              )}
            >
              Select an exam above to monitor
            </p>
          </div>
        )}

        {!selectedExam && activeExams.length === 0 && !examsLoading && (
          <div
            className={cn(
              "text-center py-20 rounded-2xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No active exams</p>
            <p className="text-sm mt-1">
              Exams will appear here when they are in progress
            </p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Live;
