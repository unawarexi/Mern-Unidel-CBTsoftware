/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useGetLecturerExamsAction, useDeleteExamAction, useUpdateExamAction } from "../../../../store/exam-store";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, Edit2, XCircle, Clock, CheckCircle2, Save, AlertCircle } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-slate-100 text-slate-700",
};

const ManageExams = () => {
  const { exams = [], isLoading, refetch } = useGetLecturerExamsAction();
  const { deleteExam } = useDeleteExamAction();
  const { updateExam } = useUpdateExamAction();
  const [selectedExam, setSelectedExam] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    await deleteExam(id);
    refetch();
  };

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setEditForm({
      duration: exam.duration,
      startTime: exam.startTime ? exam.startTime.slice(0, 16) : "",
      endTime: exam.endTime ? exam.endTime.slice(0, 16) : "",
    });
    setEditMode(true);
    setError("");
  };

  const handleUpdate = async () => {
    setError("");
    if (!editForm.duration || !editForm.startTime || !editForm.endTime) {
      setError("All fields are required.");
      return;
    }
    try {
      await updateExam(selectedExam._id, {
        duration: editForm.duration,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
      });
      setEditMode(false);
      setSelectedExam(null);
      refetch();
    } catch (err) {
      setError(err.message || "Failed to update exam.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Exams</h1>
          <p className="text-slate-600">View, update, or delete your published exams.</p>
        </motion.div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-4 text-slate-700 font-semibold">Course</th>
                <th className="text-left px-6 py-4 text-slate-700 font-semibold">Duration</th>
                <th className="text-left px-6 py-4 text-slate-700 font-semibold">Start Time</th>
                <th className="text-left px-6 py-4 text-slate-700 font-semibold">End Time</th>
                <th className="text-left px-6 py-4 text-slate-700 font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-slate-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No exams found.
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-orange-600">{exam.courseId?.courseCode || "-"}</td>
                    <td className="px-6 py-4">{exam.duration} min</td>
                    <td className="px-6 py-4">{exam.startTime ? new Date(exam.startTime).toLocaleString() : "-"}</td>
                    <td className="px-6 py-4">{exam.endTime ? new Date(exam.endTime).toLocaleString() : "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[exam.status]}`}>
                        {exam.status === "active" ? <CheckCircle2 className="w-4 h-4" /> : exam.status === "pending" ? <Clock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors"
                          onClick={() => setSelectedExam(exam)}
                          title="Read"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 hover:bg-green-100 rounded-lg text-green-700 transition-colors"
                          onClick={() => handleEdit(exam)}
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          onClick={() => handleDelete(exam._id)}
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Exam Details Modal */}
        <AnimatePresence>
          {selectedExam && !editMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              onClick={() => setSelectedExam(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 w-full max-w-lg border border-slate-200 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-6 h-6 text-blue-900" />
                  <h3 className="text-lg font-bold text-slate-900">Exam Details</h3>
                </div>
                <div className="mb-2">
                  <strong>Course:</strong> {selectedExam.courseId?.courseCode || "-"}
                </div>
                <div className="mb-2">
                  <strong>Duration:</strong> {selectedExam.duration} min
                </div>
                <div className="mb-2">
                  <strong>Start Time:</strong> {selectedExam.startTime ? new Date(selectedExam.startTime).toLocaleString() : "-"}
                </div>
                <div className="mb-2">
                  <strong>End Time:</strong> {selectedExam.endTime ? new Date(selectedExam.endTime).toLocaleString() : "-"}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong> {selectedExam.status}
                </div>
                <div className="mb-2">
                  <strong>Questions:</strong>
                  <ul className="ml-6 list-decimal text-slate-700 text-sm">
                    {selectedExam.questions.map((q, idx) => (
                      <li key={q._id || idx}>
                        {q.question} <span className="text-xs text-slate-500">(Marks: {q.marks})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full mt-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
                  onClick={() => setSelectedExam(null)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Exam Modal */}
        <AnimatePresence>
          {selectedExam && editMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              onClick={() => {
                setEditMode(false);
                setSelectedExam(null);
                setError("");
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 w-full max-w-lg border border-slate-200 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Edit2 className="w-6 h-6 text-green-700" />
                  <h3 className="text-lg font-bold text-green-900">Edit Exam</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      min={10}
                      max={300}
                      value={editForm.duration}
                      onChange={(e) => setEditForm((f) => ({ ...f, duration: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
                    <input
                      type="datetime-local"
                      value={editForm.startTime}
                      onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
                    <input
                      type="datetime-local"
                      value={editForm.endTime}
                      onChange={(e) => setEditForm((f) => ({ ...f, endTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdate}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-5 h-5" /> Update Exam
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setEditMode(false);
                        setSelectedExam(null);
                        setError("");
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
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

export default ManageExams;
