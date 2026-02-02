/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useGetLecturerQuestionBanksAction, useSubmitForApprovalAction } from "../../../../store/exam-store";
import { BadgeCheck, Clock, XCircle, Send, FileText, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  approved: {
    label: "Approved",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: BadgeCheck,
    dotColor: "bg-green-500",
  },
  pending_approval: {
    label: "Pending Review",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Clock,
    dotColor: "bg-orange-500",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    dotColor: "bg-red-500",
  },
  draft: {
    label: "Draft",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: FileText,
    dotColor: "bg-slate-400",
  },
};

const Approval = () => {
  const { questionBanks = [], isLoading, refetch } = useGetLecturerQuestionBanksAction();
  const { submitForApproval, isLoading: submitting } = useSubmitForApprovalAction();
  const [showComment, setShowComment] = useState(null); // holds the question bank id for which comment is shown
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [qbToSubmit, setQbToSubmit] = useState(null);

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

  // Calculate stats
  const stats = {
    total: questionBanks.length,
    draft: questionBanks.filter((qb) => qb.status === "draft").length,
    pending: questionBanks.filter((qb) => qb.status === "pending_approval").length,
    approved: questionBanks.filter((qb) => qb.status === "approved").length,
    rejected: questionBanks.filter((qb) => qb.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Question Banks</h1>
          <p className="text-gray-600">Manage and submit your question banks for approval</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ y: -4 }} className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Banks</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-900" />
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-700">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Draft</p>
                <p className="text-3xl font-bold text-slate-700">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Title</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Course</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Questions</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Status</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500">Loading question banks...</p>
                      </div>
                    </td>
                  </tr>
                ) : questionBanks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-400 font-medium">No question banks found</p>
                        <p className="text-gray-400 text-sm">Create your first question bank to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {questionBanks.map((qb, index) => {
                      const config = statusConfig[qb.status] || statusConfig.draft;
                      const IconComponent = config.icon;
                      const hasAdminComment = qb.status === "rejected" && qb.adminReview?.comments;

                      return (
                        <motion.tr key={qb._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-900 font-medium">{qb.title}</td>
                          <td className="px-6 py-4 text-slate-600">{qb.courseId?.courseCode || qb.courseId?.code || "-"}</td>
                          <td className="px-6 py-4 text-slate-600">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium">
                              <FileText className="w-3.5 h-3.5" />
                              {qb.questions?.length || 0} questions
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
                              <IconComponent className="w-3.5 h-3.5" />
                              {config.label}
                              {hasAdminComment && (
                                <button
                                  type="button"
                                  className="ml-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                                  title="View admin comment"
                                  onClick={() => setShowComment(qb._id)}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </button>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {qb.status === "draft" || qb.status === "rejected" ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting}
                                onClick={() => handleSubmitForApproval(qb)}
                              >
                                <Send className="w-4 h-4" />
                                {submitting ? "Submitting..." : "Submit for Approval"}
                              </motion.button>
                            ) : qb.status === "pending_approval" ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2 text-orange-700 text-sm font-medium">
                                <Clock className="w-4 h-4" />
                                Under Review
                              </span>
                            ) : qb.status === "approved" ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2 text-green-700 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                Approved
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">No action available</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Admin Comment Modal */}
        <AnimatePresence>
          {showComment && (() => {
            const qb = questionBanks.find((q) => q._id === showComment);
            if (!qb) return null;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                onClick={() => setShowComment(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl p-6 w-full max-w-md border-2 border-red-200 shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-bold text-red-700">Admin Feedback</h3>
                  </div>
                  <div className="mb-4 text-red-800 bg-red-50 border border-red-200 rounded-lg p-4 whitespace-pre-line">
                    {qb.adminReview?.comments || "No comment provided."}
                  </div>
                  <button
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
                    onClick={() => setShowComment(null)}
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Info Card */}
        {questionBanks.some((qb) => qb.status === "rejected") && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-900 mb-1">Rejected Question Banks</h3>
                <p className="text-sm text-red-700">You have rejected question banks. Please review the admin comments, make necessary changes, and resubmit for approval.</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Send className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Submit for Approval</h3>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setQbToSubmit(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-slate-600 text-sm mb-2">
                  Are you sure you want to submit{" "}
                  <span className="font-semibold text-slate-900">"{qbToSubmit?.title}"</span> for admin approval?
                </p>
                <p className="text-slate-500 text-xs">
                  Once submitted, you won't be able to edit this question bank until it's reviewed.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setQbToSubmit(null);
                  }}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitConfirm}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
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

export default Approval;
