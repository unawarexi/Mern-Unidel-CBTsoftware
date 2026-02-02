import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileSpreadsheet,
  Clock,
  Calendar,
  Users,
  Play,
  Pause,
  Eye,
  Edit,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Timer,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Exams = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);

  const { exams = [], isLoading, refetch } = useGetLecturerExamsAction();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Categorize exams
  const activeExams = exams.filter((e) => e.status === "active");
  const scheduledExams = exams.filter(
    (e) => e.status === "pending" || e.status === "scheduled",
  );
  const completedExams = exams.filter(
    (e) => e.status === "completed" || e.status === "ended",
  );

  const stats = [
    {
      label: "Active",
      value: activeExams.length,
      color: "text-emerald-500",
      icon: Play,
    },
    {
      label: "Scheduled",
      value: scheduledExams.length,
      color: "text-amber-500",
      icon: Clock,
    },
    {
      label: "Completed",
      value: completedExams.length,
      color: "text-blue-500",
      icon: CheckCircle,
    },
    {
      label: "Total",
      value: exams.length,
      color: "text-purple-500",
      icon: FileSpreadsheet,
    },
  ];

  const actions = (
    <div className="flex items-center gap-2">
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
        onClick={() => navigate("/lecturer/exams/create")}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
      >
        Create Exam
      </button>
    </div>
  );

  return (
    <LecturerPage
      title="My Exams"
      subtitle="Manage and monitor your exams"
      icon={LecturerIcons.Exams}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
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
              <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
              <p
                className={cn(
                  "text-2xl font-bold",
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
            </motion.div>
          ))}
        </div>

        {/* Active Exams */}
        {activeExams.length > 0 && (
          <div>
            <h3
              className={cn(
                "font-bold mb-4 flex items-center gap-2",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              <Play className="w-5 h-5 text-emerald-500" />
              Active Exams
            </h3>
            <div className="space-y-3">
              {activeExams.slice(0, 5).map((exam, idx) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/lecturer/exams/manage`)}
                  className={cn(
                    "p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md",
                    isDarkMode
                      ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500"
                      : "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={cn(
                          "font-semibold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {exam.courseId?.courseCode || "Unknown"} -{" "}
                        {exam.courseId?.courseTitle || "Exam"}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span
                          className={cn(
                            "flex items-center gap-1",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          <Users className="w-4 h-4" />
                          {exam.totalSubmissions || 0} submissions
                        </span>
                        <span
                          className={cn(
                            "flex items-center gap-1",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          <Timer className="w-4 h-4" />
                          {exam.duration} mins
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/lecturer/monitoring/live");
                        }}
                        className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <ChevronRight
                        className={cn(
                          "w-5 h-5",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Exams */}
        {scheduledExams.length > 0 && (
          <div>
            <h3
              className={cn(
                "font-bold mb-4 flex items-center gap-2",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              <Clock className="w-5 h-5 text-amber-500" />
              Scheduled Exams
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduledExams.slice(0, 4).map((exam, idx) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-4 rounded-2xl border",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-white border-gray-100",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className={cn(
                          "font-semibold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {exam.courseId?.courseCode || "Unknown"}
                      </h4>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        {exam.courseId?.courseTitle}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        isDarkMode
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-amber-100 text-amber-600",
                      )}
                    >
                      Scheduled
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-3 text-sm flex items-center gap-2",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    <Calendar className="w-4 h-4" />
                    {exam.startTime
                      ? new Date(exam.startTime).toLocaleString()
                      : "Not scheduled"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && exams.length === 0 && (
          <div
            className={cn(
              "text-center py-20 rounded-2xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No exams created yet</p>
            <p className="text-sm mt-1">
              Click &quot;Create Exam&quot; to get started
            </p>
          </div>
        )}

        {/* View All Link */}
        {exams.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => navigate("/lecturer/exams/manage")}
              className={cn(
                "text-sm font-medium hover:underline",
                isDarkMode ? "text-blue-400" : "text-blue-600",
              )}
            >
              View All Exams →
            </button>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Exams;
