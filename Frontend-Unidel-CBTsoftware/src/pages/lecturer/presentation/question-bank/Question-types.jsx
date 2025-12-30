/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, ArrowLeft, Save, X, Plus } from "lucide-react";
import { useGetQuestionBankByIdAction, useUpdateQuestionBankAction, useDeleteQuestionFromBankAction } from "../../../../store/exam-store";
import useExamStore from "../../../../store/exam-store";

const QuestionTypes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Only fetch once per id
  const { questionBank, isLoading, error, refetch } = useGetQuestionBankByIdAction(id);
  const { updateQuestionBank, isLoading: isUpdating } = useUpdateQuestionBankAction();
  const { deleteQuestion, isLoading: isDeleting } = useDeleteQuestionFromBankAction();
  const { showToast } = useExamStore.getState();

  const [editIndex, setEditIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);

  // Memoize questionBank to prevent unnecessary renders
  const memoizedBank = useMemo(() => questionBank, [questionBank?._id]);

  if (isLoading) return <div className="p-8 text-center text-lg">Loading question bank...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error?.message || "Failed to load question bank"}</div>;
  if (!memoizedBank) return <div className="p-8 text-center text-gray-500">No question bank found.</div>;

  const handleEdit = (q, idx) => {
    setEditIndex(idx);
    setEditQuestion({ ...q });
  };

  const handleSaveEdit = async () => {
    const updatedQuestions = [...memoizedBank.questions];
    updatedQuestions[editIndex] = editQuestion;
    try {
      await updateQuestionBank(memoizedBank._id, { questions: updatedQuestions });
      showToast("Question updated successfully", "success");
      setEditIndex(null);
      setEditQuestion(null);
      refetch();
    } catch (error) {
      showToast(error?.message || "Failed to update question", "error");
    }
  };

  const handleDelete = async (questionId) => {
    if (window.confirm("Delete this question?")) {
      try {
        await deleteQuestion(memoizedBank._id, questionId);
        showToast("Question deleted successfully", "success");
        refetch();
      } catch (error) {
        showToast(error?.message || "Failed to delete question", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">{memoizedBank.title}</h1>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 mb-6">
          <div className="mb-2 text-slate-700">{memoizedBank.description}</div>
          <div className="mb-2 text-sm text-slate-500">
            Course: <span className="font-semibold">{memoizedBank.courseId?.courseCode} - {memoizedBank.courseId?.courseTitle}</span>
          </div>
          <div className="mb-2 text-xs text-slate-500 capitalize">
            Status: <span className={`px-2 py-1 rounded ${memoizedBank.status === "approved" ? "bg-green-100 text-green-700" : memoizedBank.status === "pending_approval" ? "bg-yellow-100 text-yellow-700" : memoizedBank.status === "rejected" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>{memoizedBank.status}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Questions ({memoizedBank.questions?.length || 0})</h2>
          <div className="space-y-6">
            {memoizedBank.questions && memoizedBank.questions.length > 0 ? (
              memoizedBank.questions.map((q, idx) => (
                <motion.div key={q._id || idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 border border-slate-200 rounded-lg hover:border-orange-300 transition-all">
                  {editIndex === idx ? (
                    <div>
                      <textarea
                        value={editQuestion.question}
                        onChange={e => setEditQuestion(prev => ({ ...prev, question: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
                        rows={2}
                      />
                      <div className="space-y-2 mb-2">
                        {editQuestion.options.map((opt, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const newOpts = [...editQuestion.options];
                                newOpts[i] = e.target.value;
                                setEditQuestion(prev => ({ ...prev, options: newOpts }));
                              }}
                              className="flex-1 px-2 py-1 border border-slate-300 rounded"
                            />
                            <input
                              type="radio"
                              checked={editQuestion.correctAnswer === opt}
                              onChange={() => setEditQuestion(prev => ({ ...prev, correctAnswer: opt }))}
                            />
                            <span className="text-xs text-slate-500">Correct</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="number"
                          min="1"
                          value={editQuestion.marks}
                          onChange={e => setEditQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                          className="w-20 px-2 py-1 border border-slate-300 rounded"
                          placeholder="Marks"
                        />
                        <select
                          value={editQuestion.difficulty}
                          onChange={e => setEditQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="px-2 py-1 border border-slate-300 rounded"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                        <input
                          type="text"
                          value={editQuestion.topic || ""}
                          onChange={e => setEditQuestion(prev => ({ ...prev, topic: e.target.value }))}
                          className="flex-1 px-2 py-1 border border-slate-300 rounded"
                          placeholder="Topic"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSaveEdit} disabled={isUpdating} className="bg-green-500 text-white px-4 py-1 rounded flex items-center gap-1">
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button onClick={() => { setEditIndex(null); setEditQuestion(null); }} className="bg-gray-200 text-slate-700 px-4 py-1 rounded flex items-center gap-1">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-800">
                          Q{idx + 1}. {q.question}
                        </h3>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(q, idx)} className="text-blue-900 hover:text-blue-700 transition-colors">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(q._id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 ml-4">
                        {q.options.map((opt, i) => (
                          <p key={i} className={`text-sm ${opt === q.correctAnswer ? "text-green-600 font-semibold" : "text-slate-600"}`}>
                            {String.fromCharCode(65 + i)}. {opt}
                            {opt === q.correctAnswer && " ✓"}
                          </p>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded">Marks: {q.marks}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded capitalize">Difficulty: {q.difficulty}</span>
                        {q.topic && <span className="bg-slate-100 px-2 py-1 rounded">Topic: {q.topic}</span>}
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 italic">No questions in this bank.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionTypes;
