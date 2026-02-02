/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  useGetPendingApprovalsAction,
  useApproveQuestionBankAction,
  useRejectQuestionBankAction,
} from "../../../store/exam-store";
import { BadgeCheck, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const PendingApprovals = () => {
  const { isDarkMode } = useThemeStore();
  const {
    pendingApprovals = [],
    isLoading,
    refetch,
  } = useGetPendingApprovalsAction();
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
    <div
      className={cn(
        "min-h-screen p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      <h2
        className={cn(
          "text-2xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-slate-900",
        )}
      >
        Pending Question Bank Approvals
      </h2>

      <div
        className={cn(
          "bg-white rounded-xl border overflow-hidden shadow-sm transition-colors",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200",
        )}
      >
        <table className="w-full">
          <thead>
            <tr
              className={cn(
                "transition-colors",
                isDarkMode ? "bg-slate-800/50" : "bg-slate-50",
              )}
            >
              <th
                className={cn(
                  "py-3 px-4 text-left font-semibold",
                  isDarkMode ? "text-slate-300" : "text-slate-700",
                )}
              >
                Title
              </th>
              <th
                className={cn(
                  "py-3 px-4 text-left font-semibold",
                  isDarkMode ? "text-slate-300" : "text-slate-700",
                )}
              >
                Course
              </th>
              <th
                className={cn(
                  "py-3 px-4 text-left font-semibold",
                  isDarkMode ? "text-slate-300" : "text-slate-700",
                )}
              >
                Lecturer
              </th>
              <th
                className={cn(
                  "py-3 px-4 text-left font-semibold",
                  isDarkMode ? "text-slate-300" : "text-slate-700",
                )}
              >
                Status
              </th>
              <th
                className={cn(
                  "py-3 px-4 text-left font-semibold",
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
                <td
                  colSpan={5}
                  className={cn(
                    "text-center py-8",
                    isDarkMode ? "text-slate-400" : "text-gray-500",
                  )}
                >
                  Loading...
                </td>
              </tr>
            ) : pendingApprovals.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className={cn(
                    "text-center py-8",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                >
                  No pending approvals.
                </td>
              </tr>
            ) : (
              pendingApprovals.map((qb) => (
                <tr
                  key={qb._id}
                  className={cn(
                    "border-t transition-colors",
                    isDarkMode
                      ? "border-slate-800 hover:bg-slate-800/30"
                      : "hover:bg-slate-50 border-slate-100",
                  )}
                >
                  <td
                    className={cn(
                      "py-3 px-4",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    {qb.title}
                  </td>
                  <td
                    className={cn(
                      "py-3 px-4",
                      isDarkMode ? "text-slate-400" : "text-slate-600",
                    )}
                  >
                    {qb.courseId?.courseCode || qb.courseId?.code || "-"}
                  </td>
                  <td
                    className={cn(
                      "py-3 px-4",
                      isDarkMode ? "text-slate-400" : "text-slate-600",
                    )}
                  >
                    {qb.lecturerId?.fullname || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-colors",
                        isDarkMode
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200",
                      )}
                    >
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {selectedId === qb._id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          className={cn(
                            "border rounded p-2 text-sm focus:outline-none focus:ring-2 transition-colors",
                            isDarkMode
                              ? "bg-slate-800 border-slate-700 text-white focus:border-orange-500 focus:ring-orange-500/20"
                              : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                          )}
                          placeholder="Add comment for approval/rejection"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium"
                            onClick={() => handleApprove(qb._id)}
                          >
                            <BadgeCheck className="w-4 h-4" /> Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium"
                            onClick={() => handleReject(qb._id)}
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </motion.button>
                          <button
                            className={cn(
                              "text-xs transition-colors",
                              isDarkMode
                                ? "text-slate-400 hover:text-white"
                                : "text-gray-400 hover:text-slate-600",
                            )}
                            onClick={() => {
                              setSelectedId(null);
                              setComment("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className={cn(
                          "underline text-xs transition-colors",
                          isDarkMode
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-800",
                        )}
                        onClick={() => setSelectedId(qb._id)}
                      >
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
    </div>
  );
};

export default PendingApprovals;
