/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  FileText,
  Award,
  Timer,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  X,
} from "lucide-react";
import { useGetMySubmissionsAction } from "../../../../store/submission-store";
import { formatDate, hasExamEnded } from "../../../../core/utils/time-laspe.util";

const CompletedExams = () => {
  const navigate = useNavigate();
  const { submissions = [], isLoading, refetch } = useGetMySubmissionsAction({ status: "graded" });
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Only allow review if exam time is up
  const canReview = (submission) => {
    return hasExamEnded(submission.examId?.endTime);
  };

  // Count passed/failed
  const passedCount = submissions.filter((s) => s.passed).length;
  const failedCount = submissions.length - passedCount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Completed Exams</h1>
              <p className="text-gray-600 mt-1">
                View your completed exams, scores, and review your answers.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Timer className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">{passedCount}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-700">{failedCount}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border flex items-center gap-3">
            <Award className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-700">{submissions.length}</div>
              <div className="text-sm text-gray-600">Total Completed</div>
            </div>
          </div>
        </div>

        {/* Completed Exams Grid */}
        {isLoading ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Timer className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading completed exams...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Exams</h3>
            <p className="text-gray-600 mb-4">You haven't completed any exams yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {submissions.map((submission, idx) => {
                const exam = submission.examId;
                const passed = submission.passed;
                const ended = hasExamEnded(exam?.endTime);
                const canOpen = ended;
                return (
                  <motion.div
                    key={submission._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all cursor-pointer ${
                      passed
                        ? "border-green-200"
                        : "border-red-200"
                    } ${!canOpen ? "opacity-60 pointer-events-none" : "hover:shadow-md"}`}
                    onClick={() => canOpen && setSelectedSubmission(submission)}
                  >
                    <div className="p-6 flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2">
                        {passed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {passed ? "Passed" : "Failed"}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">
                          {formatDate(exam?.endTime, "MMM D, YYYY")}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {exam?.courseId?.courseCode || "N/A"} - {exam?.courseId?.courseTitle || "No title"}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <span>
                          Score:{" "}
                          <span className={`font-bold ${passed ? "text-green-700" : "text-red-700"}`}>
                            {submission.percentage || 0}/100
                          </span>
                        </span>
                        <span>
                          Grade: <span className="font-bold">{submission.grade || "-"}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          {submission.answers?.length || 0} answered
                        </span>
                        <span>
                          {submission.score} marks
                        </span>
                        <span>
                          {submission.passed ? "Congratulations!" : "Keep trying!"}
                        </span>
                      </div>
                      {/* Add review info for users */}
                      {!canOpen && (
                        <div className="mt-2 text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
                          You can review your answers after the exam time is over - CLICK HERE.
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Exam Review Modal */}
        <AnimatePresence>
          {selectedSubmission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedSubmission(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl w-full max-w-3xl border border-gray-200 shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gray-50">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Exam Review
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedSubmission.examId?.courseId?.courseCode} - {selectedSubmission.examId?.courseId?.courseTitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-white rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                  {/* Score Summary */}
                  <div className="flex items-center gap-4 mb-6">
                    {selectedSubmission.passed ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <div className={`text-2xl font-bold ${selectedSubmission.passed ? "text-green-700" : "text-red-700"}`}>
                        {selectedSubmission.percentage}/100
                      </div>
                      <div className="text-sm text-gray-700">
                        {selectedSubmission.passed ? "Passed" : "Failed"}
                      </div>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      Grade: <span className="font-bold">{selectedSubmission.grade}</span>
                    </div>
                  </div>

                  {/* Questions Review */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Questions & Answers</h4>
                    <div className="space-y-4">
                      {selectedSubmission.examId?.questions?.map((q, idx) => {
                        const userAnswerObj = selectedSubmission.answers?.find(a => a.questionId === q._id);
                        const userAnswer = userAnswerObj?.answer;
                        const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                        return (
                          <motion.div
                            key={q._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="bg-white border border-gray-200 rounded-lg p-5"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                {idx + 1}
                              </span>
                              <p className="flex-1 text-gray-900 font-medium">{q.question}</p>
                            </div>
                            <div className="ml-11 space-y-2">
                              {q.options?.map((opt, i) => {
                                const isUser = userAnswer === String.fromCharCode(65 + i);
                                const isRight = opt === q.correctAnswer;
                                return (
                                  <div
                                    key={i}
                                    className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-colors
                                      ${isRight ? "bg-green-50 border-green-300 text-green-900" : "bg-gray-50 border-gray-200 text-gray-700"}
                                      ${isUser && !isRight ? "border-red-300 bg-red-50 text-red-900" : ""}
                                    `}
                                  >
                                    <span className="font-semibold text-xs">{String.fromCharCode(65 + i)}.</span>
                                    <span className="text-sm">{opt}</span>
                                    {isRight && (
                                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                    )}
                                    {isUser && !isRight && (
                                      <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                                    )}
                                    {isUser && isRight && (
                                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompletedExams;
