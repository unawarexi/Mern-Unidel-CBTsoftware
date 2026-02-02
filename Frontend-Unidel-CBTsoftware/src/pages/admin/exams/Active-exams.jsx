import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Search,
  Eye,
  Users,
  Clock,
  Activity,
  AlertTriangle,
  PlayCircle,
  Monitor,
  TrendingUp,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ActiveExams = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    exams = [],
    isLoading,
    refetch,
  } = useGetLecturerExamsAction({ status: "active" });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const activeExams = exams.filter((exam) => exam.status === "active");

  const filteredExams = activeExams.filter((exam) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      exam.courseId?.courseTitle?.toLowerCase().includes(searchLower) ||
      exam.courseId?.courseCode?.toLowerCase().includes(searchLower) ||
      exam.title?.toLowerCase().includes(searchLower)
    );
  });

  const calculateProgress = (exam) => {
    const start = new Date(exam.startTime).getTime();
    const end = new Date(exam.endTime).getTime();
    const now = Date.now();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getTimeRemaining = (endTime) => {
    const now = Date.now();
    const end = new Date(endTime).getTime();
    const remaining = end - now;

    if (remaining <= 0) return "Ended";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

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
    </div>
  );

  return (
    <AdminPage
      title="Active Exams"
      subtitle="Monitor exams currently in progress"
      icon={AdminIcons.Play}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Active Now"
            value={activeExams.length}
            subtitle="Exams in progress"
            icon={PlayCircle}
            color="green"
          />
          <AdminStatCard
            label="Total Students"
            value={activeExams.reduce(
              (sum, e) =>
                sum +
                (e.currentParticipants || e.enrolledStudents?.length || 0),
              0,
            )}
            subtitle="Currently taking exams"
            icon={Users}
            color="blue"
          />
          <AdminStatCard
            label="Violations"
            value={activeExams.reduce(
              (sum, e) => sum + (e.violationCount || 0),
              0,
            )}
            subtitle="Detected issues"
            icon={AlertTriangle}
            color="red"
          />
          <AdminStatCard
            label="Avg Progress"
            value={`${Math.round(
              activeExams.reduce((sum, e) => sum + calculateProgress(e), 0) /
                (activeExams.length || 1),
            )}%`}
            subtitle="Overall completion"
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Search */}
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
              placeholder="Search active exams..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border transition-all text-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
              )}
            />
          </div>
        </div>

        {/* Active Exams List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={140}
                  borderRadius={16}
                  baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                />
              ))
          ) : filteredExams.length === 0 ? (
            <div
              className={cn(
                "text-center py-16 rounded-2xl",
                isDarkMode ? "bg-slate-800/30" : "bg-gray-50",
              )}
            >
              <PlayCircle
                className={cn(
                  "w-12 h-12 mx-auto mb-4",
                  isDarkMode ? "text-slate-600" : "text-gray-300",
                )}
              />
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                No active exams at the moment
              </p>
            </div>
          ) : (
            filteredExams.map((exam, idx) => {
              const progress = calculateProgress(exam);
              return (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-5 rounded-2xl border transition-all",
                    isDarkMode
                      ? "bg-slate-800/30 border-slate-700/50"
                      : "bg-white border-gray-100 shadow-sm",
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center",
                            isDarkMode ? "bg-green-500/20" : "bg-green-100",
                          )}
                        >
                          <PlayCircle className="w-7 h-7 text-green-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "font-semibold text-lg",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {exam.title || exam.courseId?.courseTitle}
                        </h3>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          {exam.courseId?.courseCode} •{" "}
                          {exam.examType?.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            isDarkMode ? "text-blue-400" : "text-blue-600",
                          )}
                        >
                          {exam.currentParticipants ||
                            exam.enrolledStudents?.length ||
                            0}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          taking now
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            (exam.violationCount || 0) > 0
                              ? "text-red-500"
                              : isDarkMode
                                ? "text-slate-400"
                                : "text-gray-400",
                          )}
                        >
                          {exam.violationCount || 0}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          violations
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/admin/exams/monitor/${exam._id}`)
                        }
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                          isDarkMode
                            ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                            : "bg-orange-100 text-orange-600 hover:bg-orange-200",
                        )}
                      >
                        <Monitor className="w-4 h-4" />
                        Monitor
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs flex items-center gap-1",
                          isDarkMode ? "text-slate-400" : "text-gray-500",
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        {getTimeRemaining(exam.endTime)}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        {Math.round(progress)}% complete
                      </span>
                    </div>
                    <div
                      className={cn(
                        "w-full h-2 rounded-full overflow-hidden",
                        isDarkMode ? "bg-slate-700" : "bg-gray-200",
                      )}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-green-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AdminPage>
  );
};

export default ActiveExams;
