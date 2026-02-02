import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  FileText,
  Award,
  Timer,
  X,
  Briefcase,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import { formatDate, hasExamEnded } from "../../../core/utils/time-laspe.util";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const CompletedExams = () => {
  const { isDarkMode } = useThemeStore();
  const {
    submissions = [],
    isLoading,
    refetch,
  } = useGetMySubmissionsAction({ status: "graded" });
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const passedCount = submissions.filter((s) => s.passed).length;
  const failedCount = submissions.length - passedCount;

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
      <Timer className={cn("w-4 h-4", isLoading && "animate-spin")} />
      <span>Refresh</span>
    </button>
  );

  return (
    <StudentPage
      title="Completed Exams"
      subtitle="View your results, scores, and review your performances."
      icon={StudentIcons.Success}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Passed",
              value: passedCount,
              icon: CheckCircle,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Failed",
              value: failedCount,
              icon: XCircle,
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
            {
              label: "Total Completed",
              value: submissions.length,
              icon: Award,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={cn(
                "p-6 rounded-3xl border flex items-center gap-4",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-800"
                  : "bg-white border-gray-100 shadow-sm",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  stat.bg,
                  stat.color,
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {submissions.map((sub, idx) => {
              const exam = sub.examId;
              const ended = hasExamEnded(exam?.endTime);
              return (
                <motion.div
                  key={sub._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => ended && setSelectedSubmission(sub)}
                  className={cn(
                    "p-6 rounded-3xl border transition-all relative overflow-hidden group cursor-pointer",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-gray-100 hover:shadow-xl shadow-gray-200/50",
                    !ended && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner",
                          sub.passed
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white",
                        )}
                      >
                        {sub.grade || "?"}
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "font-bold",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {exam?.courseId?.courseTitle || "Unknown Course"}
                        </h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                          {exam?.courseId?.courseCode || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        sub.passed
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500",
                      )}
                    >
                      {sub.passed ? "Passed" : "Failed"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold mb-6">
                    <div className="flex items-center gap-2 text-gray-500">
                      <StudentIcons.Results className="w-4 h-4" />
                      <span>
                        Score:{" "}
                        <b
                          className={
                            sub.passed ? "text-emerald-500" : "text-red-500"
                          }
                        >
                          {sub.percentage}%
                        </b>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-right justify-end">
                      <StudentIcons.Time className="w-4 h-4" />
                      <span>{formatDate(exam?.endTime, "MMM D, YYYY")}</span>
                    </div>
                  </div>

                  <button
                    className={cn(
                      "w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                      isDarkMode
                        ? "bg-slate-800 text-white hover:bg-slate-700"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <FileText className="w-4 h-4" /> Review Answers
                  </button>

                  {!ended && (
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-orange-600 shadow-xl">
                        Review Available After Exam Closes
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {submissions.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Records Found</h3>
            <p className="text-gray-500">
              You haven't completed any examinations yet.
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "max-w-4xl w-full max-h-[90vh] rounded-[40px] flex flex-col overflow-hidden shadow-2xl transition-all",
                isDarkMode
                  ? "bg-slate-900 border border-slate-800"
                  : "bg-white",
              )}
            >
              <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                <div>
                  <h2 className="text-2xl font-black">Performance Review</h2>
                  <p className="text-gray-500 font-semibold">
                    {selectedSubmission.examId?.courseId?.courseCode} •{" "}
                    {selectedSubmission.examId?.courseId?.courseTitle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-3xl font-black text-emerald-500">
                      {selectedSubmission.percentage}%
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      Accuracy
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-3xl font-black text-blue-500">
                      {selectedSubmission.score}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      Total Points
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-center">
                    <p className="text-3xl font-black text-orange-500">
                      {selectedSubmission.grade}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      Final Grade
                    </p>
                  </div>
                </div>

                <h3 className="font-black text-sm uppercase tracking-widest opacity-40 mb-4">
                  Detailed Question Analysis
                </h3>

                <div className="space-y-4">
                  {selectedSubmission.examId?.questions?.map((q, i) => {
                    const ans = selectedSubmission.answers?.find(
                      (a) => a.questionId === q._id,
                    )?.answer;
                    const correct = ans === q.correctAnswer;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "p-6 rounded-3xl border",
                          isDarkMode
                            ? "bg-slate-800/50 border-slate-800"
                            : "bg-gray-50 border-gray-100",
                        )}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="font-bold leading-relaxed">
                            {q.question}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                          {q.options?.map((opt, oIdx) => {
                            const label = String.fromCharCode(65 + oIdx);
                            const isUserAns = ans === label;
                            const isCorrectAns = q.correctAnswer === label;
                            return (
                              <div
                                key={oIdx}
                                className={cn(
                                  "px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between border-2 transition-all",
                                  isCorrectAns
                                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                                    : isUserAns
                                      ? "bg-red-500/10 border-red-500 text-red-600"
                                      : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 opacity-50",
                                )}
                              >
                                <span>
                                  {label}. {opt}
                                </span>
                                {isCorrectAns && (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                {isUserAns && !isCorrectAns && (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </StudentPage>
  );
};

export default CompletedExams;
