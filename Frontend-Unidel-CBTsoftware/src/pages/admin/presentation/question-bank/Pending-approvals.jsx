/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useGetPendingApprovalsAction, useApproveQuestionBankAction, useRejectQuestionBankAction } from "../../../../store/exam-store";
import { BadgeCheck, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const PendingApprovals = () => {
  const { pendingApprovals, isLoading, refetch } = useGetPendingApprovalsAction();
  const { approveQuestionBank } = useApproveQuestionBankAction();
  const { rejectQuestionBank } = useRejectQuestionBankAction();
  const [comment, setComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleApprove = async (id) => {
    await approveQuestionBank(id, comment);
    setComment("");
    setSelectedId(null);
    refetch();
  };

  const handleReject = async (id) => {
    if (!comment) {
      alert("Please provide a comment for rejection.");
      return;
    }
    await rejectQuestionBank(id, comment);
    setComment("");
    setSelectedId(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Question Bank Approvals</h2>
      <table className="w-full bg-white border rounded-xl">
        <thead>
          <tr className="bg-slate-50">
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Course</th>
            <th className="py-3 px-4 text-left">Lecturer</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : pendingApprovals.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400">No pending approvals.</td></tr>
          ) : (
            pendingApprovals.map((qb) => (
              <tr key={qb._id} className="border-t">
                <td className="py-3 px-4">{qb.title}</td>
                <td className="py-3 px-4">{qb.courseId?.courseCode || qb.courseId?.code || "-"}</td>
                <td className="py-3 px-4">{qb.lecturerId?.fullname || "-"}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </td>
                <td className="py-3 px-4">
                  {selectedId === qb._id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        className="border rounded p-2 text-sm"
                        placeholder="Add comment for approval/rejection"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-xs"
                          onClick={() => handleApprove(qb._id)}
                        >
                          <BadgeCheck className="w-4 h-4" /> Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-xs"
                          onClick={() => handleReject(qb._id)}
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </motion.button>
                        <button className="text-xs text-gray-400" onClick={() => { setSelectedId(null); setComment(""); }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="text-blue-600 underline text-xs" onClick={() => setSelectedId(qb._id)}>
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingApprovals;
