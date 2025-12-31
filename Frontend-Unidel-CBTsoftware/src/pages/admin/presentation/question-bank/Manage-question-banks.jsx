/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useGetPendingApprovalsAction, useApproveQuestionBankAction, useRejectQuestionBankAction, useGetQuestionBankByIdAction } from "../../../../store/exam-store";
import { BadgeCheck, XCircle, Eye, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ManageQuestionBanks = () => {
  const { pendingApprovals = [], isLoading, refetch } = useGetPendingApprovalsAction();
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
    <div className="min-h-screen bg-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Question Bank Management</h1>
          <p className="text-gray-600">Review and approve question banks submitted by lecturers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div whileHover={{ y: -4 }} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-slate-900">{pendingApprovals.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Banks</p>
                <p className="text-3xl font-bold text-slate-900">{pendingApprovals.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-900" />
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Action Required</p>
                <p className="text-3xl font-bold text-slate-900">{pendingApprovals.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
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
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Lecturer</th>
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
                ) : pendingApprovals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-400 font-medium">No question banks found</p>
                        <p className="text-gray-400 text-sm">All submissions have been reviewed</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {pendingApprovals.map((qb, index) => (
                      <motion.tr key={qb._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-900 font-medium">{qb.title}</td>
                        <td className="px-6 py-4 text-slate-600">{qb.courseId?.courseCode || qb.courseId?.code || "-"}</td>
                        <td className="px-6 py-4 text-slate-600">{qb.lecturerId?.fullname || "-"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Pending Review
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors" onClick={() => setSelectedBank(qb)}>
                            <Eye className="w-4 h-4" />
                            Review
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBank(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl w-full max-w-4xl border border-slate-200 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-slate-50">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{questionBank.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">Review and approve question bank</p>
                </div>
                <button onClick={() => setSelectedBank(null)} className="text-gray-400 hover:text-slate-900 transition-colors p-2 hover:bg-white rounded-lg">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {/* Course Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Course</p>
                      <p className="text-sm text-slate-900 font-semibold">{questionBank.courseId?.courseCode || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">Total Questions</p>
                      <p className="text-sm text-slate-900 font-semibold">{questionBank.questions?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Questions</h4>
                  <div className="space-y-4">
                    {questionBank.questions?.map((q, idx) => (
                      <motion.div key={q._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white border border-slate-200 rounded-lg p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                          <p className="flex-1 text-slate-900 font-medium">{q.question}</p>
                        </div>
                        <div className="ml-11 space-y-2">
                          {q.options?.map((opt, i) => (
                            <div key={i} className={`px-4 py-2.5 rounded-lg border transition-colors ${opt === q.correctAnswer ? "bg-green-50 border-green-300 text-green-900" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs">{String.fromCharCode(65 + i)}.</span>
                                <span className="text-sm">{opt}</span>
                                {opt === q.correctAnswer && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Admin Comment */}
                <div className="mb-6">
                  <label className="block text-slate-900 font-semibold mb-2">Admin Comment</label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors resize-none"
                    placeholder="Add your feedback or comments here (optional for approval, required for rejection)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-8 py-6 border-t border-slate-200 bg-slate-50">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors" onClick={handleApprove}>
                  <BadgeCheck className="w-5 h-5" />
                  Approve Question Bank
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors" onClick={handleReject}>
                  <XCircle className="w-5 h-5" />
                  Reject Question Bank
                </motion.button>
                <button className="px-6 py-3 bg-white hover:bg-gray-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors" onClick={() => setSelectedBank(null)}>
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
