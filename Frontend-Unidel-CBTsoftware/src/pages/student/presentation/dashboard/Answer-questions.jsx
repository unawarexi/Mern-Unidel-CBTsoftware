/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock, ChevronLeft, ChevronRight, Check, AlertTriangle,
  Flag, Save, Send, FileText, Timer, BarChart3, LogOut
} from "lucide-react";
import { useGetExamByIdAction } from "../../../../store/exam-store";
import {
  useStartExamAction,
  useSaveAnswerAction,
  useSubmitExamAction,
  useGetStudentSubmissionAction,
} from "../../../../store/submission-store";
import { getTimeRemaining } from "../../../../core/utils/time-laspe.util";
import { debounce } from "../../../../core/services/debounce-throttle";

const AnswerQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  // Exam and submission data
  const { exam, isLoading: examLoading } = useGetExamByIdAction(examId);
  const { submission: existingSubmission, timeRemaining: serverTimeRemaining } = useGetStudentSubmissionAction(examId);
  const { startExam, isLoading: starting } = useStartExamAction();
  const { saveAnswer } = useSaveAnswerAction();
  const { submitExam, isLoading: submitting } = useSubmitExamAction();

  // UI State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [submission, setSubmission] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

  // Initialize exam
  useEffect(() => {
    const initializeExam = async () => {
      if (existingSubmission) {
        setSubmission(existingSubmission);
        setTimeRemaining(serverTimeRemaining);
        
        // Load existing answers
        const existingAnswers = {};
        existingSubmission.answers?.forEach((ans) => {
          existingAnswers[ans.questionId] = ans.answer;
        });
        setAnswers(existingAnswers);
      } else if (exam && !submission) {
        // Start new exam
        try {
          const result = await startExam(examId);
          setSubmission(result.submission);
          setTimeRemaining(result.timeRemaining);
        } catch (error) {
          console.error("Failed to start exam:", error);
        }
      }
    };

    initializeExam();
  }, [exam, existingSubmission, serverTimeRemaining]);

  // Countdown timer
  useEffect(() => {
    if (!exam) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(exam.endTime);
      setTimeRemaining(remaining);

      if (remaining.expired && submission) {
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam, submission]);

  // Auto-save with debounce
  const debouncedSave = useCallback(
    debounce(async (questionId, answer) => {
      if (!submission) return;
      
      setAutoSaving(true);
      try {
        await saveAnswer(submission._id, questionId, answer);
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setAutoSaving(false);
      }
    }, 2000),
    [submission, saveAnswer]
  );

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    debouncedSave(questionId, answer);
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleQuestionNavigate = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAutoSubmit = async () => {
    if (!submission) return;
    
    try {
      await submitExam(submission._id);
      navigate("/student/exams/completed");
    } catch (error) {
      console.error("Auto-submit failed:", error);
    }
  };

  const handleManualSubmit = async () => {
    if (!submission) return;
    
    try {
      await submitExam(submission._id);
      setShowSubmitModal(false);
      navigate("/student/exams/completed");
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter((k) => answers[k]).length;
  };

  const getTimeWarningColor = () => {
    if (!timeRemaining) return "text-gray-600";
    const { totalSeconds } = timeRemaining;
    if (totalSeconds > 600) return "text-green-600";
    if (totalSeconds > 300) return "text-orange-600";
    return "text-red-600";
  };

  if (examLoading || !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Timer className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!submission || !timeRemaining) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Timer className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Initializing exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {exam.courseId?.courseCode} Exam
                </h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Auto-save indicator */}
              {autoSaving && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Save className="w-4 h-4 animate-pulse" />
                  Saving...
                </div>
              )}

              {/* Timer */}
              <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimeWarningColor()}`}>
                <Clock className="w-5 h-5" />
                {timeRemaining.formatted}
              </div>

              {/* Submit button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-600">
                      Question {currentQuestionIndex + 1}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {currentQuestion.marks || 1} mark{currentQuestion.marks > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleFlagQuestion(currentQuestion._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion._id)
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <p className="text-lg text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const optionKey = String.fromCharCode(65 + index);
                  const isSelected = answers[currentQuestion._id] === optionKey;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerChange(currentQuestion._id, optionKey)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {optionKey}
                        </div>
                        <span className={`flex-1 ${isSelected ? "text-blue-900 font-medium" : "text-gray-700"}`}>
                          {option}
                        </span>
                        {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="text-sm text-gray-600">
                  {getAnsweredCount()} of {exam.questions.length} answered
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Question Overview</h3>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {getAnsweredCount()}
                  </div>
                  <div className="text-xs text-green-700">Answered</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {flaggedQuestions.size}
                  </div>
                  <div className="text-xs text-orange-700">Flagged</div>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((q, index) => {
                  const isAnswered = !!answers[q._id];
                  const isFlagged = flaggedQuestions.has(q._id);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={q._id}
                      onClick={() => handleQuestionNavigate(index)}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2"
                          : isAnswered
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : isFlagged
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 bg-orange-100 rounded"></div>
                  <span className="text-gray-600">Flagged</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-gray-600">Not answered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Submit Exam?
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to submit your exam? This action cannot be undone.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold text-gray-900">{exam.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-semibold text-green-600">{getAnsweredCount()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Unanswered:</span>
                  <span className="font-semibold text-red-600">
                    {exam.questions.length - getAnsweredCount()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Flagged:</span>
                  <span className="font-semibold text-orange-600">{flaggedQuestions.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Review Again
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Timer className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnswerQuestions;
