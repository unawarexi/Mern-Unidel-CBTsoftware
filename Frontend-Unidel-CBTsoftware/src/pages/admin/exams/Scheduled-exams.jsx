import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Eye,
  Edit2,
  Trash2,
  Play,
  MoreVertical,
  FileText,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ScheduledExams = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  const {
    exams = [],
    isLoading,
    refetch,
  } = useGetLecturerExamsAction({ status: "scheduled" });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const scheduledExams = exams.filter((exam) => exam.status === "scheduled");

  const filteredExams = scheduledExams.filter((exam) => {
    const matchesSearch =
      !searchTerm ||
      exam.courseId?.courseTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      exam.courseId?.courseCode
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      filterCourse === "all" || exam.courseId?._id === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntil = (date) => {
    const now = new Date();
    const examDate = new Date(date);
    const diffMs = examDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
    if (diffHours > 0) return `${diffHours}h`;
    return "Soon";
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
      title="Scheduled Exams"
      subtitle="View and manage upcoming scheduled exams"
      icon={AdminIcons.Calendar}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Scheduled"
            value={scheduledExams.length}
            subtitle="Upcoming exams"
            icon={Calendar}
            color="blue"
          />
          <AdminStatCard
            label="This Week"
            value={
              scheduledExams.filter((e) => {
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return new Date(e.startTime) <= weekFromNow;
              }).length
            }
            subtitle="Starting soon"
            icon={Clock}
            color="orange"
          />
          <AdminStatCard
            label="Unique Courses"
            value={new Set(scheduledExams.map((e) => e.courseId?._id)).size}
            subtitle="With scheduled exams"
            icon={BookOpen}
            color="green"
          />
          <AdminStatCard
            label="Expected Students"
            value={scheduledExams.reduce(
              (sum, e) => sum + (e.enrolledStudents?.length || 0),
              0,
            )}
            subtitle="Total participants"
            icon={Users}
            color="purple"
          />
        </div>

        {/* Filters */}
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
              placeholder="Search exams..."
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border transition-all text-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
              )}
            />
          </div>
        </div>

        {/* Exams List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={120}
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
              <Calendar
                className={cn(
                  "w-12 h-12 mx-auto mb-4",
                  isDarkMode ? "text-slate-600" : "text-gray-300",
                )}
              />
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                No scheduled exams found
              </p>
            </div>
          ) : (
            filteredExams.map((exam, idx) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-5 rounded-2xl border transition-all hover:scale-[1.01]",
                  isDarkMode
                    ? "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                    : "bg-white border-gray-100 hover:shadow-lg",
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Exam Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                        isDarkMode ? "bg-blue-500/20" : "bg-blue-100",
                      )}
                    >
                      <FileText className="w-7 h-7 text-blue-500" />
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
                      <div className="flex items-center gap-4 mt-2">
                        <span
                          className={cn(
                            "text-xs flex items-center gap-1",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDate(exam.startTime)}
                        </span>
                        <span
                          className={cn(
                            "text-xs flex items-center gap-1",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          {formatTime(exam.startTime)}
                        </span>
                        <span
                          className={cn(
                            "text-xs flex items-center gap-1",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        >
                          <Users className="w-3 h-3" />
                          {exam.enrolledStudents?.length || 0} students
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time Until & Actions */}
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "px-4 py-2 rounded-xl text-center",
                        isDarkMode ? "bg-slate-700/50" : "bg-gray-100",
                      )}
                    >
                      <p
                        className={cn(
                          "text-lg font-bold",
                          isDarkMode ? "text-orange-400" : "text-orange-600",
                        )}
                      >
                        {getTimeUntil(exam.startTime)}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        until start
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isDarkMode
                            ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
                        )}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isDarkMode
                            ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
                        )}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminPage>
  );
};

export default ScheduledExams;
