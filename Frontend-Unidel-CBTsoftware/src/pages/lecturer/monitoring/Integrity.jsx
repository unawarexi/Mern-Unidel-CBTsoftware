import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  FileText,
  Camera,
  Monitor,
  Wifi,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Integrity = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedExam, setSelectedExam] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch,
  } = useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 100 });

  // Mock integrity data for submissions
  const integrityData = submissions.map((s) => ({
    ...s,
    integrityScore: Math.floor(Math.random() * 40) + 60,
    flags:
      Math.random() > 0.7
        ? [
            { type: "tab_switch", count: Math.floor(Math.random() * 5) + 1 },
            { type: "copy_paste", count: Math.floor(Math.random() * 3) },
          ].filter((f) => f.count > 0)
        : [],
    reviewed: Math.random() > 0.5,
  }));

  // Filter
  const filteredData = integrityData.filter((d) => {
    if (statusFilter === "flagged") return d.flags.length > 0;
    if (statusFilter === "clean") return d.flags.length === 0;
    if (statusFilter === "pending") return !d.reviewed && d.flags.length > 0;
    return true;
  });

  // Stats
  const totalFlagged = integrityData.filter((d) => d.flags.length > 0).length;
  const pendingReview = integrityData.filter(
    (d) => d.flags.length > 0 && !d.reviewed,
  ).length;
  const avgScore =
    integrityData.length > 0
      ? integrityData.reduce((acc, d) => acc + d.integrityScore, 0) /
        integrityData.length
      : 100;

  const getFlagIcon = (type) => {
    switch (type) {
      case "tab_switch":
        return Monitor;
      case "copy_paste":
        return FileText;
      case "webcam":
        return Camera;
      case "connection":
        return Wifi;
      default:
        return AlertTriangle;
    }
  };

  const getFlagLabel = (type) => {
    switch (type) {
      case "tab_switch":
        return "Tab Switches";
      case "copy_paste":
        return "Copy/Paste";
      case "webcam":
        return "Webcam Issue";
      case "connection":
        return "Connection Lost";
      default:
        return "Unknown";
    }
  };

  return (
    <LecturerPage
      title="Academic Integrity"
      subtitle="Monitor and review integrity flags"
      icon={LecturerIcons.Integrity}
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
                  label: "Total Submissions",
                  value: submissions.length,
                  icon: Eye,
                  color: "text-blue-500",
                },
                {
                  label: "Flagged",
                  value: totalFlagged,
                  icon: AlertTriangle,
                  color: "text-red-500",
                },
                {
                  label: "Pending Review",
                  value: pendingReview,
                  icon: Clock,
                  color: "text-amber-500",
                },
                {
                  label: "Avg Integrity",
                  value: `${avgScore.toFixed(0)}%`,
                  icon: Shield,
                  color: "text-emerald-500",
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

            {/* Filter */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "All" },
                { value: "flagged", label: "Flagged" },
                { value: "pending", label: "Pending Review" },
                { value: "clean", label: "Clean" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-all",
                    statusFilter === filter.value
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                        ? "bg-slate-800 text-slate-400 hover:text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {submissionsLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} height={100} className="rounded-2xl" />
                  ))
              ) : filteredData.length > 0 ? (
                filteredData.map((sub, idx) => (
                  <motion.div
                    key={sub._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "p-5 rounded-2xl border",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-white border-gray-100",
                      sub.flags.length > 0 && !sub.reviewed && "border-red-500",
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                            sub.integrityScore >= 80
                              ? "bg-emerald-500/20 text-emerald-500"
                              : sub.integrityScore >= 60
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-red-500/20 text-red-500",
                          )}
                        >
                          {sub.integrityScore}%
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
                      <div className="flex items-center gap-2">
                        {sub.reviewed ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Reviewed
                          </span>
                        ) : sub.flags.length > 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Clean
                          </span>
                        )}
                      </div>
                    </div>

                    {sub.flags.length > 0 && (
                      <div
                        className={cn(
                          "p-3 rounded-xl mb-4",
                          isDarkMode ? "bg-red-500/10" : "bg-red-50",
                        )}
                      >
                        <p
                          className={cn(
                            "text-xs font-medium mb-2",
                            isDarkMode ? "text-red-400" : "text-red-600",
                          )}
                        >
                          Integrity Flags:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sub.flags.map((flag, fidx) => {
                            const FlagIcon = getFlagIcon(flag.type);
                            return (
                              <span
                                key={fidx}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-500"
                              >
                                <FlagIcon className="w-3 h-3" />
                                {getFlagLabel(flag.type)} ({flag.count}x)
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        className={cn(
                          "flex-1 py-2 rounded-xl font-medium transition-all",
                          isDarkMode
                            ? "bg-slate-700 text-white hover:bg-slate-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                        )}
                      >
                        <Eye className="w-4 h-4 inline mr-2" />
                        View Details
                      </button>
                      {!sub.reviewed && sub.flags.length > 0 && (
                        <button className="px-4 py-2 rounded-xl font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Mark Reviewed
                        </button>
                      )}
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
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No submissions match filter</p>
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
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Select an exam to review integrity</p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Integrity;
