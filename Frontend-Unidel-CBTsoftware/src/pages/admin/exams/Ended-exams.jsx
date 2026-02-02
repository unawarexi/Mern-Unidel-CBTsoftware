import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  CheckCircle,
  Users,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  BarChart3,
  Calendar,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const EndedExams = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    exams = [],
    isLoading,
    refetch,
  } = useGetLecturerExamsAction({ status: "ended" });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const endedExams = exams.filter(
    (exam) => exam.status === "ended" || exam.status === "completed",
  );

  const filteredExams = endedExams.filter((exam) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      exam.courseId?.courseTitle?.toLowerCase().includes(searchLower) ||
      exam.courseId?.courseCode?.toLowerCase().includes(searchLower) ||
      exam.title?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const actions = (
    <div className="flex items-center gap-2">
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
          isDarkMode
            ? "bg-slate-800 text-slate-300 hover:text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        )}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>
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

  // Calculate statistics
  const totalSubmissions = endedExams.reduce(
    (sum, e) => sum + (e.submissionCount || e.submissions?.length || 0),
    0,
  );
  const avgPassRate =
    endedExams.length > 0
      ? Math.round(
          endedExams.reduce((sum, e) => sum + (e.passRate || 0), 0) /
            endedExams.length,
        )
      : 0;

  return (
    <AdminPage
      title="Ended Exams"
      subtitle="View completed exams and their results"
      icon={AdminIcons.Success}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Completed"
            value={endedExams.length}
            subtitle="Exams finished"
            icon={CheckCircle}
            color="green"
          />
          <AdminStatCard
            label="Total Submissions"
            value={totalSubmissions}
            subtitle="Across all exams"
            icon={Users}
            color="blue"
          />
          <AdminStatCard
            label="Avg Pass Rate"
            value={`${avgPassRate}%`}
            subtitle="Overall performance"
            icon={Award}
            trend={avgPassRate >= 70 ? "+2%" : "-3%"}
            trendUp={avgPassRate >= 70}
            color={avgPassRate >= 70 ? "green" : "orange"}
          />
          <AdminStatCard
            label="This Month"
            value={
              endedExams.filter((e) => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return new Date(e.endTime) >= monthAgo;
              }).length
            }
            subtitle="Recently completed"
            icon={Calendar}
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
              placeholder="Search ended exams..."
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
                  height={100}
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
              <CheckCircle
                className={cn(
                  "w-12 h-12 mx-auto mb-4",
                  isDarkMode ? "text-slate-600" : "text-gray-300",
                )}
              />
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                No ended exams found
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
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                        isDarkMode ? "bg-emerald-500/20" : "bg-emerald-100",
                      )}
                    >
                      <CheckCircle className="w-7 h-7 text-emerald-500" />
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
                        {exam.courseId?.courseCode} • Ended{" "}
                        {formatDate(exam.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-xl font-bold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {exam.submissionCount || exam.submissions?.length || 0}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        submissions
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <p
                          className={cn(
                            "text-xl font-bold",
                            (exam.passRate || 0) >= 70
                              ? "text-emerald-500"
                              : "text-orange-500",
                          )}
                        >
                          {exam.passRate || 0}%
                        </p>
                        {(exam.passRate || 0) >= 70 ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        pass rate
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
                        title="View Results"
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
                        title="View Analytics"
                      >
                        <BarChart3 className="w-5 h-5" />
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

export default EndedExams;
