import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Lock,
  Timer,
  ChevronRight,
  GraduationCap,
  FileText,
  Bell,
  Target,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetActiveExamsForStudentAction } from "../../../store/exam-store";
import {
  formatDate,
  hasExamStarted,
  hasExamEnded,
  createCountdownTimer,
} from "../../../core/utils/time-laspe.util";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";

const Upcoming = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [examTimers, setExamTimers] = useState({});

  // Fetch active exams
  const {
    activeExams = [],
    isLoading,
    refetch,
  } = useGetActiveExamsForStudentAction();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Filter upcoming exams (not started yet)
  const upcomingExams = activeExams.filter(
    (exam) => exam.startTime && !hasExamStarted(exam.startTime),
  );

  // Update countdowns
  useEffect(() => {
    if (!upcomingExams || upcomingExams.length === 0) return;

    const cleanupFunctions = upcomingExams.map((exam) => {
      if (!exam.startTime) return () => {};

      return createCountdownTimer(
        exam.startTime,
        (timeData) => {
          setExamTimers((prev) => ({
            ...prev,
            [exam._id]: timeData,
          }));
        },
        1000,
      );
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
    };
  }, [upcomingExams.length]);

  // Group exams by date
  const groupedExams = upcomingExams.reduce((groups, exam) => {
    const date = new Date(exam.startTime).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(exam);
    return groups;
  }, {});

  // Stats
  const totalUpcoming = upcomingExams.length;
  const todayCount = upcomingExams.filter((exam) => {
    const today = new Date().toDateString();
    return new Date(exam.startTime).toDateString() === today;
  }).length;
  const thisWeekCount = upcomingExams.filter((exam) => {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const examDate = new Date(exam.startTime);
    return examDate <= weekEnd;
  }).length;

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
    <StudentPage
      title="Upcoming Exams"
      subtitle="View and prepare for your scheduled examinations"
      icon={StudentIcons.Exams}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Upcoming",
              value: totalUpcoming,
              icon: Calendar,
              color: "text-blue-500",
            },
            {
              label: "Today",
              value: todayCount,
              icon: Clock,
              color: "text-orange-500",
            },
            {
              label: "This Week",
              value: thisWeekCount,
              icon: Target,
              color: "text-emerald-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <div>
                  <p
                    className={cn(
                      "text-xl font-bold",
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Exams List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={140} borderRadius={16} />
              ))}
          </div>
        ) : upcomingExams.length === 0 ? (
          <div
            className={cn(
              "text-center py-20 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Exams</h3>
            <p className="text-sm">
              You don't have any scheduled exams at the moment.
            </p>
            <button
              onClick={() => navigate("/student/exams/active")}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all"
            >
              View Active Exams
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedExams).map(([date, exams]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar
                    className={cn(
                      "w-5 h-5",
                      isDarkMode ? "text-orange-400" : "text-orange-500",
                    )}
                  />
                  <h3
                    className={cn(
                      "font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                </div>
                <div className="space-y-4">
                  {exams.map((exam, idx) => {
                    const timer = examTimers[exam._id];

                    return (
                      <motion.div
                        key={exam._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "p-5 rounded-2xl border transition-all",
                          isDarkMode
                            ? "bg-slate-800/50 border-slate-700"
                            : "bg-white border-gray-100",
                        )}
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Exam Info */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={cn(
                                  "font-bold text-lg mb-1",
                                  isDarkMode ? "text-white" : "text-gray-900",
                                )}
                              >
                                {exam.courseId?.courseCode} -{" "}
                                {exam.courseId?.courseTitle}
                              </h4>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span
                                  className={cn(
                                    "flex items-center gap-1",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-gray-600",
                                  )}
                                >
                                  <Clock className="w-4 h-4" />
                                  {formatDate(exam.startTime, "h:mm A")} -{" "}
                                  {formatDate(exam.endTime, "h:mm A")}
                                </span>
                                <span
                                  className={cn(
                                    "flex items-center gap-1",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-gray-600",
                                  )}
                                >
                                  <Timer className="w-4 h-4" />
                                  {exam.duration} minutes
                                </span>
                                <span
                                  className={cn(
                                    "flex items-center gap-1",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-gray-600",
                                  )}
                                >
                                  <FileText className="w-4 h-4" />
                                  {exam.questions?.length || 0} questions
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Countdown */}
                          <div
                            className={cn(
                              "p-4 rounded-xl text-center min-w-[180px]",
                              isDarkMode ? "bg-blue-500/20" : "bg-blue-50",
                            )}
                          >
                            <p
                              className={cn(
                                "text-xs font-medium mb-1",
                                isDarkMode ? "text-blue-300" : "text-blue-600",
                              )}
                            >
                              STARTS IN
                            </p>
                            <p
                              className={cn(
                                "text-2xl font-bold font-mono",
                                isDarkMode ? "text-blue-400" : "text-blue-700",
                              )}
                            >
                              {timer?.formatted || "--:--:--"}
                            </p>
                          </div>
                        </div>

                        {/* Preparation Tips */}
                        <div
                          className={cn(
                            "mt-4 p-3 rounded-xl flex items-start gap-3",
                            isDarkMode ? "bg-slate-700/50" : "bg-amber-50",
                          )}
                        >
                          <Bell
                            className={cn(
                              "w-5 h-5 flex-shrink-0 mt-0.5",
                              isDarkMode ? "text-amber-400" : "text-amber-600",
                            )}
                          />
                          <div>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                isDarkMode
                                  ? "text-amber-300"
                                  : "text-amber-800",
                              )}
                            >
                              Preparation Tip
                            </p>
                            <p
                              className={cn(
                                "text-xs mt-1",
                                isDarkMode
                                  ? "text-amber-400/70"
                                  : "text-amber-700",
                              )}
                            >
                              Ensure you have a stable internet connection and
                              avoid switching browser tabs during the exam.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentPage>
  );
};

export default Upcoming;
