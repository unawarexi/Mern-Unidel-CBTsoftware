import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  Check,
  AlertTriangle,
  Flag,
  Save,
  Send,
  FileText,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetExamByIdAction } from "../../../store/exam-store";
import {
  useStartExamAction,
  useSaveAnswerAction,
  useSubmitExamAction,
} from "../../../store/submission-store";
import { debounce } from "../../../core/services/debounce-throttle";
import { useReportViolationAction } from "../../../store/security-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { StudentIcons } from "../components/icons";

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  const {
    exam,
    isLoading: examLoading,
    error: examError,
  } = useGetExamByIdAction(examId);
  const { startExam, isLoading: starting } = useStartExamAction();
  const { saveAnswer } = useSaveAnswerAction();
  const { submitExam, isLoading: submitting } = useSubmitExamAction();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [submission, setSubmission] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Fraud detection
  const { reportViolation } = useReportViolationAction();
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");

  const getTimeRemaining = useCallback((endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diffInSeconds = Math.floor((end - now) / 1000);

    if (diffInSeconds <= 0) {
      return { expired: true, formatted: "00:00", totalSeconds: 0 };
    }

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return {
      expired: false,
      totalSeconds: diffInSeconds,
      formatted:
        hours > 0
          ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
          : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    };
  }, []);

  useEffect(() => {
    const initializeExam = async () => {
      if (
        !exam ||
        !exam.questions ||
        exam.questions.length === 0 ||
        examStarted ||
        starting ||
        submission
      )
        return;

      try {
        const result = await startExam(examId);
        setSubmission(result.submission);
        setExamStarted(true);

        if (exam.endTime) {
          setTimeRemaining(getTimeRemaining(exam.endTime));
        }

        if (result.submission?.answers) {
          const existingAnswers = {};
          result.submission.answers.forEach((ans) => {
            existingAnswers[ans.questionId] = ans.answer;
          });
          setAnswers(existingAnswers);
        }
      } catch (error) {
        console.error("Failed to start exam:", error);
      }
    };

    initializeExam();
  }, [
    exam,
    examStarted,
    starting,
    submission,
    startExam,
    examId,
    getTimeRemaining,
  ]);

  useEffect(() => {
    if (!exam?.endTime || !examStarted) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(exam.endTime);
      setTimeRemaining(remaining);

      if (remaining.expired && submission) {
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam?.endTime, examStarted, submission, getTimeRemaining]);

  const debouncedSave = useCallback(
    debounce(async (subId, questionId, answer) => {
      setAutoSaving(true);
      try {
        await saveAnswer(subId, questionId, answer);
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setAutoSaving(false);
      }
    }, 2000),
    [saveAnswer],
  );

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (submission?._id) {
      debouncedSave(submission._id, questionId, answer);
    }
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  };

  const handleAutoSubmit = async () => {
    if (!submission?._id) return;
    try {
      await submitExam(submission._id);
      navigate("/student/exams/completed");
    } catch (error) {
      console.error("Auto-submit failed:", error);
    }
  };

  const handleManualSubmit = async () => {
    if (!submission?._id) return;
    try {
      await submitExam(submission._id);
      navigate("/student/exams/completed");
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const getAnsweredCount = () =>
    Object.keys(answers).filter((k) => answers[k]).length;

  if (examLoading || (examStarted && !submission)) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          isDarkMode ? "bg-slate-950" : "bg-gray-50",
        )}
      >
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className={isDarkMode ? "text-slate-400" : "text-gray-600"}>
            Preparing your exam environment...
          </p>
        </div>
      </div>
    );
  }

  if (examError || !exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          isDarkMode ? "bg-slate-950" : "bg-gray-50",
        )}
      >
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2
            className={cn(
              "text-xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Exam Unavailable
          </h2>
          <p className="text-gray-500 mb-6">
            {examError || "This exam cannot be accessed at the moment."}
          </p>
          <button
            onClick={() => navigate("/student/exams/active")}
            className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold font-semibold"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        isDarkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900",
      )}
    >
      <AnimatePresence>
        {showViolationWarning && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white p-4 text-center font-bold shadow-lg"
          >
            {violationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors",
          isDarkMode
            ? "bg-slate-900/80 backdrop-blur-md border-slate-800"
            : "bg-white border-gray-200",
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-600/20">
              {exam.courseId?.courseCode?.slice(0, 2)}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">
                {exam.courseId?.courseTitle}
              </h1>
              <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">
                {exam.courseId?.courseCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {autoSaving && (
              <div className="flex items-center gap-2 text-xs font-bold text-orange-500 animate-pulse">
                <Save className="w-3.5 h-3.5" />
                SYSTEM AUTO-SAVING...
              </div>
            )}

            <div
              className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-3 font-mono text-xl font-black shadow-inner",
                isDarkMode
                  ? "bg-slate-800 text-orange-500"
                  : "bg-orange-50 text-orange-600",
              )}
            >
              <Timer className="w-5 h-5" />
              {timeRemaining?.formatted || "00:00"}
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:scale-105 transition-transform"
            >
              Submit Final
            </button>
          </div>
        </div>
        <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800">
          <motion.div
            className="h-full bg-orange-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-8 rounded-3xl border transition-all",
              isDarkMode
                ? "bg-slate-900 border-slate-800 shadow-slate-950/50"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/50",
            )}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center font-black">
                  {currentQuestionIndex + 1}
                </div>
                <span className="text-sm font-bold opacity-50 uppercase tracking-widest">
                  Question
                </span>
              </div>
              <button
                onClick={() => handleFlagQuestion(currentQuestion._id)}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  flaggedQuestions.has(currentQuestion._id)
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-400",
                )}
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xl md:text-2xl font-medium leading-relaxed mb-10">
              {currentQuestion.question}
            </div>

            <div className="space-y-4">
              {currentQuestion.options?.map((option, idx) => {
                const label = String.fromCharCode(65 + idx);
                const active = answers[currentQuestion._id] === label;
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      handleAnswerChange(currentQuestion._id, label)
                    }
                    className={cn(
                      "w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group",
                      active
                        ? isDarkMode
                          ? "border-orange-600 bg-orange-600/10"
                          : "border-orange-500 bg-orange-50"
                        : isDarkMode
                          ? "border-slate-800 hover:border-slate-700 bg-slate-800/50"
                          : "border-gray-100 hover:border-gray-200 bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                        active
                          ? "bg-orange-600 text-white"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-500 group-hover:bg-gray-300 dark:group-hover:bg-slate-600",
                      )}
                    >
                      {label}
                    </div>
                    <span
                      className={cn(
                        "flex-1 font-semibold",
                        active
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-700 dark:text-slate-300",
                      )}
                    >
                      {option}
                    </span>
                    {active && <Check className="w-6 h-6 text-orange-600" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-8 py-3 rounded-2xl border-2 font-black dark:border-slate-800 disabled:opacity-30 flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <div className="text-sm font-black opacity-30 tracking-widest uppercase">
              {currentQuestionIndex + 1} / {exam.questions.length}
            </div>
            <button
              onClick={() =>
                setCurrentQuestionIndex((i) =>
                  Math.min(exam.questions.length - 1, i + 1),
                )
              }
              disabled={
                currentQuestionIndex === exam.questions.length - 1 ||
                !answers[currentQuestion._id]
              }
              className="px-8 py-3 rounded-2xl bg-orange-600 text-white font-black shadow-lg shadow-orange-600/20 disabled:opacity-30 flex items-center gap-2 hover:scale-105 transition-all"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className={cn(
              "p-6 rounded-3xl border sticky top-28",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100 shadow-xl shadow-gray-200/50",
            )}
          >
            <h3 className="font-black text-sm uppercase tracking-widest mb-6 pb-4 border-b dark:border-slate-800">
              Navigator
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {exam.questions.map((q, idx) => {
                const answered = !!answers[q._id];
                const flagged = flaggedQuestions.has(q._id);
                const current = idx === currentQuestionIndex;

                let disabled = false;
                if (idx > currentQuestionIndex) {
                  for (let i = currentQuestionIndex; i < idx; i++) {
                    if (!answers[exam.questions[i]._id]) {
                      disabled = true;
                      break;
                    }
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    disabled={disabled}
                    className={cn(
                      "aspect-square rounded-xl text-xs font-black transition-all border-2",
                      current
                        ? "border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                        : answered
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                          : flagged
                            ? "border-orange-400 bg-orange-500 text-white"
                            : "border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-gray-400",
                      disabled && "opacity-20 cursor-not-allowed",
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-60">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-60">
                <div className="w-3 h-3 rounded-full bg-orange-500" /> Flagged
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest opacity-60">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-700" />{" "}
                Pending
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-sm bg-black/50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "max-w-md w-full p-8 rounded-[40px] shadow-2xl",
                isDarkMode
                  ? "bg-slate-900 border border-slate-800"
                  : "bg-white",
              )}
            >
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-600">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-center mb-2">
                Finish Exam?
              </h3>
              <p className="text-center text-gray-500 mb-8">
                You've answered {getAnsweredCount()} out of{" "}
                {exam.questions.length} questions. You cannot undo this action.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="py-4 rounded-2xl font-black bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 transition-colors"
                >
                  Review
                </button>
                <button
                  onClick={handleManualSubmit}
                  className="py-4 rounded-2xl font-black bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                >
                  Submit Final
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TakeExam;
