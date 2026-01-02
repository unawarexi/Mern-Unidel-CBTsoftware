/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Calendar, BookOpen, Lock, Unlock, Play, 
  AlertCircle, CheckCircle, Timer, Award, Users,
  TrendingUp, FileText, ChevronRight, RefreshCw, GraduationCap
} from "lucide-react";
import { useGetActiveExamsForStudentAction } from "../../../../store/exam-store";
import { 
  getTimeRemaining, 
  getTimeUntil, 
  hasExamStarted, 
  hasExamEnded,
  formatDate,
  createCountdownTimer
} from "../../../../core/utils/time-laspe.util";

const ActiveExams = () => {
  const navigate = useNavigate();
  const { activeExams = [], isLoading, error, refetch } = useGetActiveExamsForStudentAction();
  const [examTimers, setExamTimers] = useState({});

  // Update countdowns every second
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
        1000
      );
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
    };
  }, [activeExams]);

  const getExamStatus = (exam) => {
    if (!exam.startTime || !exam.endTime) {
      return { status: "unknown", color: "gray", icon: AlertCircle };
    }

    const started = hasExamStarted(exam.startTime);
    const ended = hasExamEnded(exam.endTime);

    if (ended) return { status: "ended", color: "gray", icon: CheckCircle };
    if (!started) return { status: "upcoming", color: "blue", icon: Lock };
    return { status: "active", color: "green", icon: Unlock };
  };

  const handleStartExam = (examId) => {
    navigate(`/student/exams/take/${examId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading active exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Exams</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Active Exams</h1>
              <p className="text-gray-600 mt-1">
                View and take your scheduled examinations
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {activeExams.length}
                </div>
                <div className="text-sm text-gray-600">Total Exams</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Unlock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {activeExams.filter(e => e.startTime && e.endTime && hasExamStarted(e.startTime) && !hasExamEnded(e.endTime)).length}
                </div>
                <div className="text-sm text-gray-600">Active Now</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {activeExams.filter(e => e.startTime && !hasExamStarted(e.startTime)).length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {activeExams.filter(e => e.endTime && hasExamEnded(e.endTime)).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Exams Grid */}
        {!activeExams || activeExams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100"
          >
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Active Exams
            </h3>
            <p className="text-gray-600 mb-4">
              You don't have any scheduled exams at the moment.
            </p>
            <p className="text-sm text-gray-500">
              Make sure you are enrolled in courses to see available exams.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {activeExams.map((exam, index) => {
                if (!exam || !exam._id) return null;
                
                const { status, color, icon: StatusIcon } = getExamStatus(exam);
                const isLocked = status === "upcoming";
                const isEnded = status === "ended";
                const timer = examTimers[exam._id];
                
                const courseCode = exam.courseId?.courseCode || "N/A";
                const courseTitle = exam.courseId?.courseTitle || "No title";
                const department = exam.courseId?.department || "Unknown";

                return (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-sm border transition-all ${
                      isLocked || isEnded
                        ? "border-gray-200 opacity-75"
                        : "border-green-200 hover:shadow-md"
                    }`}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                color === "green" ? "bg-green-100" :
                                color === "blue" ? "bg-blue-100" : "bg-gray-100"
                              }`}
                            >
                              <StatusIcon className={`w-5 h-5 ${
                                color === "green" ? "text-green-600" :
                                color === "blue" ? "text-blue-600" : "text-gray-600"
                              }`} />
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                color === "green" ? "bg-green-100 text-green-700" :
                                color === "blue" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {status === "upcoming" ? "Upcoming" : status === "active" ? "Active" : "Ended"}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {courseCode}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {courseTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {department}
                          </p>
                        </div>
                      </div>

                      {/* Exam Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {exam.startTime ? formatDate(exam.startTime, "MMM D, YYYY") : "Not scheduled"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {exam.startTime && exam.endTime
                              ? `${formatDate(exam.startTime, "h:mm A")} - ${formatDate(exam.endTime, "h:mm A")}`
                              : "Time not set"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Timer className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{exam.duration || 0} minutes</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {exam.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>

                      {/* Countdown / Status */}
                      {isLocked && timer && !timer.expired && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              Starts in
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {timer.formatted}
                          </div>
                        </div>
                      )}

                      {!isLocked && !isEnded && (
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Unlock className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">
                              Exam Available
                            </span>
                          </div>
                          <div className="text-sm text-green-700">
                            Click below to begin your examination
                          </div>
                        </div>
                      )}

                      {isEnded && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">
                              Exam has ended
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => handleStartExam(exam._id)}
                        disabled={isLocked || isEnded}
                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          isLocked || isEnded
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4" />
                            Locked
                          </>
                        ) : isEnded ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Ended
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Begin Exam
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveExams;
