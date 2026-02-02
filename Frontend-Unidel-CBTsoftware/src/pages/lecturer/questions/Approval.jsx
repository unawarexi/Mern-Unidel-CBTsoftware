import React, { useEffect, useState } from "react";
import {
  useGetLecturerQuestionBanksAction,
  useSubmitForApprovalAction,
} from "../../../store/exam-store";
import {
  BadgeCheck,
  Clock,
  XCircle,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";

const Approval = () => {
  const {
    questionBanks = [],
    isLoading,
    refetch,
  } = useGetLecturerQuestionBanksAction();
  const { submitForApproval, isLoading: submitting } =
    useSubmitForApprovalAction();
  const { isDarkMode } = useThemeStore();
  const [showComment, setShowComment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [qbToSubmit, setQbToSubmit] = useState(null);

  const statusConfig = {
    approved: {
      label: "Approved",
      color: isDarkMode
        ? "bg-green-500/20 text-green-400 border-green-500/30"
        : "bg-green-50 text-green-700 border-green-200",
      icon: BadgeCheck,
      dotColor: "bg-green-500",
    },
    pending_approval: {
      label: "Pending Review",
      color: isDarkMode
        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
        : "bg-orange-50 text-orange-700 border-orange-200",
      icon: Clock,
      dotColor: "bg-orange-500",
    },
    rejected: {
      label: "Rejected",
      color: isDarkMode
        ? "bg-red-500/20 text-red-400 border-red-500/30"
        : "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
      dotColor: "bg-red-500",
    },
    draft: {
      label: "Draft",
      color: isDarkMode
        ? "bg-slate-700 text-slate-300 border-slate-600"
        : "bg-slate-100 text-slate-700 border-slate-200",
      icon: FileText,
      dotColor: isDarkMode ? "bg-slate-500" : "bg-slate-400",
    },
  };

  useEffect(() => {
    if (refetch) refetch();
  }, [refetch]);

  const handleSubmitForApproval = async (qb) => {
    setQbToSubmit(qb);
    setShowSubmitModal(true);
  };

  const handleSubmitConfirm = async () => {
    if (!qbToSubmit) return;
    try {
      await submitForApproval(qbToSubmit._id);
      refetch();
      setShowSubmitModal(false);
      setQbToSubmit(null);
    } catch (err) {
      console.error(err);
      setShowSubmitModal(false);
      setQbToSubmit(null);
    }
  };

  const stats = {
    total: questionBanks.length,
    draft: questionBanks.filter((qb) => qb.status === "draft").length,
    pending: questionBanks.filter((qb) => qb.status === "pending_approval")
      .length,
    approved: questionBanks.filter((qb) => qb.status === "approved").length,
    rejected: questionBanks.filter((qb) => qb.status === "rejected").length,
  };

  return (
    <LecturerPage
      title="Question Bank Approvals"
      subtitle="Track and manage the status of your question bank submissions"
      icon={LecturerIcons.Questions}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className={cn(
              "border rounded-xl p-6 transition-all",
              isDarkMode
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white border-slate-200 shadow-sm",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm font-medium mb-1",
                    isDarkMode ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  Total Banks
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {stats.total}
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
                )}
              >
                <FileText
                  className={cn(
                    "w-6 h-6",
                    isDarkMode ? "text-blue-400" : "text-blue-600",
                  )}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={cn(
              "border rounded-xl p-6 transition-all",
              isDarkMode
                ? "bg-green-500/10 border-green-500/20"
                : "bg-green-50 border-green-100 shadow-sm",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm font-medium mb-1",
                    isDarkMode ? "text-green-400" : "text-green-600",
                  )}
                >
                  Approved
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-green-300" : "text-green-700",
                  )}
                >
                  {stats.approved}
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isDarkMode ? "bg-green-500/20" : "bg-green-100",
                )}
              >
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={cn(
              "border rounded-xl p-6 transition-all",
              isDarkMode
                ? "bg-orange-500/10 border-orange-500/20"
                : "bg-orange-50 border-orange-100 shadow-sm",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm font-medium mb-1",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                >
                  Pending
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-orange-300" : "text-orange-700",
                  )}
                >
                  {stats.pending}
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isDarkMode ? "bg-orange-500/20" : "bg-orange-100",
                )}
              >
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={cn(
              "border rounded-xl p-6 transition-all",
              isDarkMode
                ? "bg-slate-700/50 border-slate-700"
                : "bg-slate-50 border-slate-200 shadow-sm",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm font-medium mb-1",
                    isDarkMode ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  Draft
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-slate-300" : "text-slate-700",
                  )}
                >
                  {stats.draft}
                </p>
              </div>
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isDarkMode ? "bg-slate-700" : "bg-slate-100",
                )}
              >
                <FileText
                  className={cn(
                    "w-6 h-6",
                    isDarkMode ? "text-slate-400" : "text-slate-400",
                  )}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Table */}
        <div
          className={cn(
            "rounded-xl border overflow-hidden transition-all",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700 shadow-xl shadow-black/20"
              : "bg-white border-slate-200 shadow-sm",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={cn(
                    "border-b transition-colors",
                    isDarkMode
                      ? "border-slate-700 bg-slate-800/80"
                      : "border-slate-200 bg-slate-50/50",
                  )}
                >
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-slate-600",
                    )}
                  >
                    Question Bank Title
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-slate-600",
                    )}
                  >
                    Course
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-slate-600",
                    )}
                  >
                    Questions
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-slate-600",
                    )}
                  >
                    Status
                  </th>
                  <th
                    className={cn(
                      "text-right px-6 py-4 font-semibold text-sm",
                      isDarkMode ? "text-slate-300" : "text-slate-600",
                    )}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-500" : "text-slate-400",
                          )}
                        >
                          Searching for question banks...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : questionBanks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center",
                            isDarkMode ? "bg-slate-800" : "bg-slate-50",
                          )}
                        >
                          <FileText
                            className={cn(
                              "w-8 h-8",
                              isDarkMode ? "text-slate-700" : "text-slate-200",
                            )}
                          />
                        </div>
                        <div className="max-w-xs mx-auto">
                          <p
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            No question banks yet
                          </p>
                          <p
                            className={cn(
                              "text-sm mt-1",
                              isDarkMode ? "text-slate-500" : "text-slate-400",
                            )}
                          >
                            Go to the Create section to build your first
                            question bank.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {questionBanks.map((qb, index) => {
                      const config =
                        statusConfig[qb.status] || statusConfig.draft;
                      const IconComponent = config.icon;
                      const hasAdminComment =
                        qb.status === "rejected" && qb.adminReview?.comments;

                      return (
                        <motion.tr
                          key={qb._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "group transition-colors",
                            isDarkMode
                              ? "hover:bg-slate-700/30"
                              : "hover:bg-slate-50",
                          )}
                        >
                          <td className="px-6 py-4">
                            <p
                              className={cn(
                                "font-semibold text-sm",
                                isDarkMode ? "text-white" : "text-slate-800",
                              )}
                            >
                              {qb.title}
                            </p>
                            {qb.description && (
                              <p
                                className={cn(
                                  "text-xs truncate max-w-[200px] mt-0.5",
                                  isDarkMode
                                    ? "text-slate-500"
                                    : "text-slate-400",
                                )}
                              >
                                {qb.description}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "text-sm",
                                isDarkMode
                                  ? "text-slate-400"
                                  : "text-slate-600",
                              )}
                            >
                              {qb.courseId?.courseCode ||
                                qb.courseId?.code ||
                                "General"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-md text-xs font-bold",
                                  isDarkMode
                                    ? "bg-slate-700 text-slate-300"
                                    : "bg-slate-100 text-slate-600",
                                )}
                              >
                                {qb.questions?.length || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 transition-colors",
                                  config.color,
                                )}
                              >
                                <IconComponent className="w-3.5 h-3.5" />
                                {config.label}
                                {hasAdminComment && (
                                  <button
                                    type="button"
                                    className={cn(
                                      "ml-1.5 p-0.5 rounded-full transition-colors",
                                      isDarkMode
                                        ? "bg-red-500/20 hover:bg-red-500/40 text-red-400"
                                        : "bg-red-100 hover:bg-red-200 text-red-600",
                                    )}
                                    title="View admin comment"
                                    onClick={() => setShowComment(qb._id)}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {qb.status === "draft" ||
                            qb.status === "rejected" ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
                                disabled={submitting}
                                onClick={() => handleSubmitForApproval(qb)}
                              >
                                <Send className="w-3.5 h-3.5" />
                                {submitting ? "Processing..." : "Submit"}
                              </motion.button>
                            ) : qb.status === "pending_approval" ? (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-lg border",
                                  isDarkMode
                                    ? "border-orange-500/30 text-orange-400 bg-orange-500/5"
                                    : "border-orange-100 text-orange-600 bg-orange-50",
                                )}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                Processing
                              </span>
                            ) : qb.status === "approved" ? (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-lg border",
                                  isDarkMode
                                    ? "border-green-500/30 text-green-400 bg-green-500/5"
                                    : "border-green-100 text-green-600 bg-green-50",
                                )}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Active
                              </span>
                            ) : null}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Comment Modal */}
        <AnimatePresence>
          {showComment &&
            (() => {
              const qb = questionBanks.find((q) => q._id === showComment);
              if (!qb) return null;
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
                  onClick={() => setShowComment(null)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "rounded-2xl p-8 w-full max-w-lg border-2 shadow-2xl overflow-hidden relative",
                      isDarkMode
                        ? "bg-slate-900 border-red-500/30 shadow-red-500/10"
                        : "bg-white border-red-100 shadow-xl",
                    )}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center",
                          isDarkMode ? "bg-red-500/20" : "bg-red-50",
                        )}
                      >
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "text-xl font-bold",
                            isDarkMode ? "text-white" : "text-slate-900",
                          )}
                        >
                          Submission Feedback
                        </h3>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-slate-500",
                          )}
                        >
                          Review from administrative department
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "mb-8 border rounded-xl p-6 whitespace-pre-line text-sm leading-relaxed",
                        isDarkMode
                          ? "text-red-300 bg-red-500/5 border-red-500/20"
                          : "text-red-800 bg-red-50/50 border-red-100",
                      )}
                    >
                      {qb.adminReview?.comments ||
                        "No specific feedback provided."}
                    </div>
                    <button
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
                      onClick={() => setShowComment(null)}
                    >
                      Understood, I'll Fix It
                    </button>
                  </motion.div>
                </motion.div>
              );
            })()}
        </AnimatePresence>

        {/* Global Warning for Rejected Items */}
        {questionBanks.some((qb) => qb.status === "rejected") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-8 border-2 rounded-xl p-6 relative overflow-hidden",
              isDarkMode
                ? "bg-red-500/10 border-red-500/20"
                : "bg-red-50 border-red-100 shadow-sm",
            )}
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3
                  className={cn(
                    "font-bold mb-1",
                    isDarkMode ? "text-red-400" : "text-red-900",
                  )}
                >
                  Revision Required
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    isDarkMode ? "text-red-300/80" : "text-red-700/80",
                  )}
                >
                  One or more of your question banks have been sent back for
                  revision. Please check the feedback and resubmit as soon as
                  possible to ensure the current session proceeds as scheduled.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "rounded-2xl shadow-2xl max-w-md w-full p-8 overflow-hidden",
                isDarkMode
                  ? "bg-slate-900 border border-slate-700"
                  : "bg-white",
              )}
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                    isDarkMode ? "bg-orange-500/20" : "bg-orange-50",
                  )}
                >
                  <Send
                    className={cn(
                      "w-8 h-8",
                      isDarkMode ? "text-orange-400" : "text-orange-600",
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    "text-2xl font-bold mb-2",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  Confirm Submission
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed px-4",
                    isDarkMode ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  You are about to submit{" "}
                  <span className="font-bold text-orange-500">
                    "{qbToSubmit?.title}"
                  </span>{" "}
                  for administrative review.
                </p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-xl mb-8 flex items-start gap-3",
                  isDarkMode ? "bg-slate-800" : "bg-slate-50",
                )}
              >
                <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p
                  className={cn(
                    "text-xs leading-relaxed",
                    isDarkMode ? "text-slate-500" : "text-slate-500",
                  )}
                >
                  Once submitted, permissions for this bank will become
                  Read-Only until an administrator has reviewed and responded.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setQbToSubmit(null);
                  }}
                  disabled={submitting}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleSubmitConfirm}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Yes, Submit Now"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LecturerPage>
  );
};

export default Approval;
