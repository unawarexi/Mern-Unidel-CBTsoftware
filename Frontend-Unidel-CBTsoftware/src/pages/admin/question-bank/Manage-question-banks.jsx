/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  useGetPendingApprovalsAction,
  useApproveQuestionBankAction,
  useRejectQuestionBankAction,
  useGetQuestionBankByIdAction,
} from "../../../store/exam-store";
import {
  BadgeCheck,
  XCircle,
  Eye,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ManageQuestionBanks = () => {
  const { isDarkMode } = useThemeStore();
  const {
    pendingApprovals = [],
    isLoading,
    refetch,
  } = useGetPendingApprovalsAction();
  const { approveQuestionBank } = useApproveQuestionBankAction();
  const { rejectQuestionBank } = useRejectQuestionBankAction();
  const [selectedBank, setSelectedBank] = useState(null);
  const [comment, setComment] = useState("");
  const { questionBank } = useGetQuestionBankByIdAction(selectedBank?._id);

  useEffect(() => {
    if (refetch) refetch();
  }, [refetch]);

  const handleApprove = async () => {
    await approveQuestionBank(selectedBank._id, comment);
    setSelectedBank(null);
    setComment("");
    refetch();
  };

  const handleReject = async () => {
    if (!comment) {
      alert("Please provide a comment for rejection.");
      return;
    }
    await rejectQuestionBank(selectedBank._id, comment);
    setSelectedBank(null);
    setComment("");
    refetch();
  };

  return (
    <div
      className={cn(
        "min-h-screen p-2 sm:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-3 sm:mb-8">
          <h1
            className={cn(
              "text-lg sm:text-3xl font-bold mb-1 sm:mb-2",
              isDarkMode ? "text-white" : "text-slate-900",
            )}
          >
            Question Bank Management
          </h1>
          <p
            className={cn(
              "text-xs sm:text-base",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Review and approve question banks submitted by lecturers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <motion.div
            whileHover={{ y: -4 }}
            className={cn(
              "border rounded-lg sm:rounded-xl p-3 sm:p-6 transition-colors",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Pending Review
                </p>
                <p
                  className={cn(
                    "text-xl sm:text-3xl font-bold",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {pendingApprovals.length}
                </p>
              </div>
              <div
                className={cn(
                  "w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center",
                  isDarkMode ? "bg-orange-500/10" : "bg-orange-100",
                )}
              >
                <AlertCircle
                  className={cn(
                    "w-4 h-4 sm:w-6 sm:h-6",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={cn(
              "border rounded-lg sm:rounded-xl p-3 sm:p-6 transition-colors",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Total Banks
                </p>
                <p
                  className={cn(
                    "text-xl sm:text-3xl font-bold",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {pendingApprovals.length}
                </p>
              </div>
              <div
                className={cn(
                  "w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center",
                  isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
                )}
              >
                <FileText
                  className={cn(
                    "w-4 h-4 sm:w-6 sm:h-6",
                    isDarkMode ? "text-blue-400" : "text-blue-900",
                  )}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={cn(
              "border rounded-lg sm:rounded-xl p-3 sm:p-6 transition-colors",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Action Required
                </p>
                <p
                  className={cn(
                    "text-xl sm:text-3xl font-bold",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {pendingApprovals.length}
                </p>
              </div>
              <div
                className={cn(
                  "w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center",
                  isDarkMode ? "bg-green-500/10" : "bg-green-50",
                )}
              >
                <CheckCircle2
                  className={cn(
                    "w-4 h-4 sm:w-6 sm:h-6",
                    isDarkMode ? "text-green-400" : "text-green-600",
                  )}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "rounded-lg sm:rounded-xl border overflow-hidden shadow-sm transition-colors",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={cn(
                    "border-b transition-colors",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-slate-50 border-slate-200",
                  )}
                >
                  <th
                    className={cn(
                      "text-left px-2 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Title
                  </th>
                  <th
                    className={cn(
                      "text-left px-2 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden md:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Course
                  </th>
                  <th
                    className={cn(
                      "text-left px-2 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden lg:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Lecturer
                  </th>
                  <th
                    className={cn(
                      "text-left px-2 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden sm:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Status
                  </th>
                  <th
                    className={cn(
                      "text-left px-2 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 text-xs sm:text-base">
                          Loading question banks...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : pendingApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 sm:py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
                        <p className="text-gray-400 font-medium text-xs sm:text-base">
                          No question banks found
                        </p>
                        <p className="text-gray-400 text-[10px] sm:text-sm">
                          All submissions have been reviewed
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {pendingApprovals.map((qb, index) => (
                      <motion.tr
                        key={qb._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "border-b transition-colors",
                          isDarkMode
                            ? "border-slate-800 hover:bg-slate-800/30"
                            : "border-slate-100 hover:bg-slate-50",
                        )}
                      >
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-base">
                          <div
                            className={cn(
                              "font-medium truncate max-w-[120px] sm:max-w-none",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            {qb.title}
                          </div>
                          <div
                            className={cn(
                              "md:hidden text-[10px] mt-0.5",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            {qb.courseId?.courseCode || "-"}
                          </div>
                        </td>
                        <td
                          className={cn(
                            "px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-base hidden md:table-cell",
                            isDarkMode ? "text-slate-400" : "text-slate-600",
                          )}
                        >
                          {qb.courseId?.courseCode || qb.courseId?.code || "-"}
                        </td>
                        <td
                          className={cn(
                            "px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-base hidden lg:table-cell",
                            isDarkMode ? "text-slate-400" : "text-slate-600",
                          )}
                        >
                          <div className="truncate max-w-[120px]">
                            {qb.lecturerId?.fullname || "-"}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold border transition-colors",
                              isDarkMode
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                : "bg-orange-50 text-orange-700 border border-orange-200",
                            )}
                          >
                            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Pending
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
                            onClick={() => setSelectedBank(qb)}
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Review</span>
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal for question bank review */}
      <AnimatePresence>
        {selectedBank && questionBank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={() => setSelectedBank(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "rounded-xl w-full max-w-4xl border shadow-xl max-h-[90vh] overflow-hidden flex flex-col transition-colors",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200",
              )}
            >
              {/* Modal Header */}
              <div
                className={cn(
                  "flex items-center justify-between px-4 sm:px-8 py-3 sm:py-6 border-b transition-colors",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-slate-50 border-slate-200",
                )}
              >
                <div>
                  <h3
                    className={cn(
                      "text-lg sm:text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    {questionBank.title}
                  </h3>
                  <p
                    className={cn(
                      "text-xs sm:text-sm mt-0.5 sm:mt-1",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    Review and approve question bank
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBank(null)}
                  className={cn(
                    "transition-colors p-1 sm:p-2 rounded-lg",
                    isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-700"
                      : "text-gray-400 hover:text-slate-900 hover:bg-white",
                  )}
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-3 sm:py-6">
                {/* Course Info */}
                <div
                  className={cn(
                    "border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 transition-colors",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-slate-50 border-slate-200",
                  )}
                >
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p
                        className={cn(
                          "text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        Course
                      </p>
                      <p
                        className={cn(
                          "text-xs sm:text-sm font-semibold",
                          isDarkMode ? "text-white" : "text-slate-900",
                        )}
                      >
                        {questionBank.courseId?.courseCode || "-"}
                      </p>
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        Total Questions
                      </p>
                      <p
                        className={cn(
                          "text-xs sm:text-sm font-semibold",
                          isDarkMode ? "text-white" : "text-slate-900",
                        )}
                      >
                        {questionBank.questions?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="mb-4 sm:mb-6">
                  <h4
                    className={cn(
                      "text-base sm:text-lg font-bold mb-3 sm:mb-4",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    Questions
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {questionBank.questions?.map((q, idx) => (
                      <motion.div
                        key={q._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "border rounded-lg p-3 sm:p-5 transition-colors",
                          isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200",
                        )}
                      >
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold">
                            {idx + 1}
                          </span>
                          <p
                            className={cn(
                              "flex-1 font-medium text-xs sm:text-base",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            {q.question}
                          </p>
                        </div>
                        <div className="ml-8 sm:ml-11 space-y-1.5 sm:space-y-2">
                          {q.options?.map((opt, i) => (
                            <div
                              key={i}
                              className={cn(
                                "px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border transition-colors",
                                opt === q.correctAnswer
                                  ? isDarkMode
                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                    : "bg-green-50 border-green-300 text-green-900"
                                  : isDarkMode
                                    ? "bg-slate-700/50 border-slate-700 text-slate-300"
                                    : "bg-slate-50 border-slate-200 text-slate-700",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[10px] sm:text-xs">
                                  {String.fromCharCode(65 + i)}.
                                </span>
                                <span className="text-xs sm:text-sm">
                                  {opt}
                                </span>
                                {opt === q.correctAnswer && (
                                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 ml-auto" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Admin Comment */}
                <div className="mb-4 sm:mb-6">
                  <label
                    className={cn(
                      "block font-semibold mb-2 text-xs sm:text-base",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    Admin Comment
                  </label>
                  <textarea
                    className={cn(
                      "w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                        : "bg-white border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-900 focus:ring-blue-900/20",
                    )}
                    placeholder="Add your feedback or comments here (optional for approval, required for rejection)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={cn(
                  "flex flex-col sm:flex-row gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-6 border-t transition-colors",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-slate-50 border-slate-200",
                )}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  onClick={handleApprove}
                >
                  <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  onClick={handleReject}
                >
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Reject
                </motion.button>
                <button
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-base border rounded-lg font-semibold transition-colors",
                    isDarkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                      : "bg-white hover:bg-gray-50 text-slate-900 border-slate-300",
                  )}
                  onClick={() => setSelectedBank(null)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageQuestionBanks;
