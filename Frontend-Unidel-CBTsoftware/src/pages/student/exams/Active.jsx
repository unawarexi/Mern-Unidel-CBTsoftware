import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Calendar,
  Lock,
  Unlock,
  Play,
  AlertCircle,
  CheckCircle,
  Timer,
  RefreshCw,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import { useGetActiveExamsForStudentAction } from "../../../store/exam-store";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import {
  hasExamStarted,
  hasExamEnded,
  formatDate,
  createCountdownTimer,
} from "../../../core/utils/time-laspe.util";
import ExamWarningModal from "../components/warning-modals";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ActiveExams = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const {
    activeExams = [],
    isLoading,
    error,
    refetch,
  } = useGetActiveExamsForStudentAction();
  const { submissions = [] } = useGetMySubmissionsAction({ status: "graded" });
  const [examTimers, setExamTimers] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    if (!activeExams || activeExams.length === 0) return;

    const cleanupFunctions = activeExams.map((exam) => {
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
  }, [activeExams]);

  const getExamStatus = (exam) => {
    const started = hasExamStarted(exam.startTime);
    const ended = hasExamEnded(exam.endTime);

    if (ended) return { status: "ended", color: "gray", icon: CheckCircle };
    if (!started) return { status: "upcoming", color: "blue", icon: Lock };
    return { status: "active", color: "green", icon: Unlock };
  };

  const handleStartExam = (exam) => {
    setSelectedExam(exam);
    setShowWarningModal(true);
  };

  const handleProceedToExam = () => {
    if (selectedExam) {
      setShowWarningModal(false);
      navigate(`/student/exams/take/${selectedExam._id}`);
    }
  };

  const hasSubmitted = (examId) =>
    submissions.some((s) => s.examId?._id === examId);

  const actions = (
    <button
      onClick={() => refetch()}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
        isDarkMode
          ? "bg-slate-800 text-slate-400 hover:text-white"
          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
      )}
    >
      <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
      <span>Refresh</span>
    </button>
  );

  return (
    <StudentPage
      title="Active Examinations"
      subtitle="View and take your scheduled examinations."
      icon={StudentIcons.Exams}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Exams",
              value: activeExams.length,
              icon: StudentIcons.Exams,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Live Now",
              value: activeExams.filter(
                (e) => hasExamStarted(e.startTime) && !hasExamEnded(e.endTime),
              ).length,
              icon: Unlock,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Upcoming",
              value: activeExams.filter((e) => !hasExamStarted(e.startTime))
                .length,
              icon: Lock,
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
            {
              label: "Completed",
              value: activeExams.filter((e) => hasExamEnded(e.endTime)).length,
              icon: CheckCircle,
              color: "text-slate-500",
              bg: "bg-slate-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={cn(
                "p-4 rounded-2xl border flex items-center gap-4",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-gray-50/50 border-gray-100",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  stat.bg,
                  stat.color,
                )}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {activeExams.map((exam, index) => {
              const { status, color, icon: StatusIcon } = getExamStatus(exam);
              const timer = examTimers[exam._id];
              const submitted = hasSubmitted(exam._id);
              const isLocked = status === "upcoming";
              const isEnded = status === "ended";

              return (
                <motion.div
                  key={exam._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "p-6 rounded-3xl border transition-all",
                    isDarkMode
                      ? "bg-slate-800/20 border-slate-800"
                      : "bg-white border-gray-100 hover:shadow-lg",
                    (isEnded || submitted) && "opacity-60",
                  )}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner",
                          color === "green"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : color === "blue"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-slate-500/10 text-slate-500",
                        )}
                      >
                        {exam.courseId?.courseCode?.slice(0, 2)}
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "font-bold",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {exam.courseId?.courseTitle}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">
                          {exam.courseId?.courseCode}
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        color === "green"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : color === "blue"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-slate-500/10 text-slate-500",
                      )}
                    >
                      {status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(exam.startTime, "MMM D, YYYY")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(exam.startTime, "h:mm A")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Timer className="w-4 h-4" />
                      <span>{exam.duration} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <StatusIcon className="w-4 h-4" />
                      <span>{exam.questions?.length || 0} Questions</span>
                    </div>
                  </div>

                  {status === "upcoming" && timer && (
                    <div
                      className={cn(
                        "mb-6 p-4 rounded-2xl flex items-center justify-between",
                        isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
                      )}
                    >
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                        Starts In:
                      </span>
                      <span className="text-xl font-black text-blue-500 font-mono">
                        {timer.formatted}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleStartExam(exam)}
                    disabled={isLocked || isEnded || submitted}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                      isLocked || isEnded || submitted
                        ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                        : "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25 hover:scale-[1.02]",
                    )}
                  >
                    {submitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" /> Submitted
                      </>
                    ) : isLocked ? (
                      <>
                        <Lock className="w-5 h-5" /> Locked
                      </>
                    ) : isEnded ? (
                      <>
                        <CheckCircle className="w-5 h-5" /> Ended
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" /> Enter Examination
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {activeExams.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <StudentIcons.Exams className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Active Exams</h3>
            <p className="text-gray-500">
              You don't have any exams scheduled at the moment.
            </p>
          </div>
        )}
      </div>

      <ExamWarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onProceed={handleProceedToExam}
        exam={selectedExam}
      />
    </StudentPage>
  );
};

export default ActiveExams;
