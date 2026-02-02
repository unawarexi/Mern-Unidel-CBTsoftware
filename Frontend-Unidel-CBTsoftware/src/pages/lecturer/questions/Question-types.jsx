/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, ArrowLeft, Save, X, Plus } from "lucide-react";
import {
  useGetQuestionBankByIdAction,
  useUpdateQuestionBankAction,
  useDeleteQuestionFromBankAction,
} from "../../../store/exam-store";
import useExamStore from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";

const QuestionTypes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  // Only fetch once per id
  const { questionBank, isLoading, error, refetch } =
    useGetQuestionBankByIdAction(id);
  const { updateQuestionBank, isLoading: isUpdating } =
    useUpdateQuestionBankAction();
  const { deleteQuestion, isLoading: isDeleting } =
    useDeleteQuestionFromBankAction();
  const { showToast } = useExamStore.getState();

  const [editIndex, setEditIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);

  // Memoize questionBank to prevent unnecessary renders
  const memoizedBank = useMemo(() => questionBank, [questionBank?._id]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return isDarkMode
          ? "bg-green-500/20 text-green-400"
          : "bg-green-100 text-green-700";
      case "pending_approval":
        return isDarkMode
          ? "bg-yellow-500/20 text-yellow-400"
          : "bg-yellow-100 text-yellow-700";
      case "rejected":
        return isDarkMode
          ? "bg-red-500/20 text-red-400"
          : "bg-red-100 text-red-700";
      default:
        return isDarkMode
          ? "bg-slate-700 text-slate-300"
          : "bg-slate-100 text-slate-700";
    }
  };

  if (isLoading)
    return (
      <LecturerPage
        title="Question Bank Details"
        subtitle="Manage questions in this bank"
        icon={LecturerIcons.Questions}
      >
        <div
          className={cn(
            "p-8 text-center text-lg",
            isDarkMode ? "text-slate-300" : "text-slate-700",
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Loading question bank...</p>
          </div>
        </div>
      </LecturerPage>
    );

  if (error)
    return (
      <LecturerPage
        title="Question Bank Details"
        subtitle="Manage questions in this bank"
        icon={LecturerIcons.Questions}
      >
        <div className="p-8 text-center text-red-500">
          <div className="flex flex-col items-center justify-center space-y-4">
            <X className="w-12 h-12 text-red-500" />
            <p>Error: {error?.message || "Failed to load question bank"}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </LecturerPage>
    );

  if (!memoizedBank)
    return (
      <LecturerPage
        title="Question Bank Details"
        subtitle="Manage questions in this bank"
        icon={LecturerIcons.Questions}
      >
        <div
          className={cn(
            "p-8 text-center",
            isDarkMode ? "text-slate-500" : "text-gray-500",
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <LecturerIcons.Questions className="w-12 h-12 opacity-20" />
            <p>No question bank found.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </LecturerPage>
    );

  const handleEdit = (q, idx) => {
    setEditIndex(idx);
    setEditQuestion({ ...q });
  };

  const handleSaveEdit = async () => {
    const updatedQuestions = [...memoizedBank.questions];
    updatedQuestions[editIndex] = editQuestion;
    try {
      await updateQuestionBank(memoizedBank._id, {
        questions: updatedQuestions,
      });
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
    <LecturerPage
      title={memoizedBank.title}
      subtitle="Manage and edit individual questions in this bank"
      icon={LecturerIcons.Questions}
      showBackButton
    >
      <div className="space-y-6">
        <div
          className={cn(
            "rounded-xl shadow-lg p-6 border mb-6",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-slate-200",
          )}
        >
          <div
            className={cn(
              "mb-2",
              isDarkMode ? "text-slate-300" : "text-slate-700",
            )}
          >
            {memoizedBank.description}
          </div>
          <div
            className={cn(
              "mb-2 text-sm",
              isDarkMode ? "text-slate-400" : "text-slate-500",
            )}
          >
            Course:{" "}
            <span className="font-semibold">
              {memoizedBank.courseId?.courseCode} -{" "}
              {memoizedBank.courseId?.courseTitle}
            </span>
          </div>
          <div
            className={cn(
              "mb-2 text-xs capitalize",
              isDarkMode ? "text-slate-400" : "text-slate-500",
            )}
          >
            Status:{" "}
            <span
              className={`px-2 py-1 rounded ${getStatusStyles(memoizedBank.status)}`}
            >
              {memoizedBank.status}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl shadow-lg p-6 border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-slate-200",
          )}
        >
          <h2
            className={cn(
              "text-2xl font-bold mb-6",
              isDarkMode ? "text-white" : "text-slate-800",
            )}
          >
            Questions ({memoizedBank.questions?.length || 0})
          </h2>
          <div className="space-y-6">
            {memoizedBank.questions && memoizedBank.questions.length > 0 ? (
              memoizedBank.questions.map((q, idx) => (
                <motion.div
                  key={q._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "p-4 border rounded-lg transition-all",
                    isDarkMode
                      ? "border-slate-700 hover:border-orange-500/50"
                      : "border-slate-200 hover:border-orange-300",
                  )}
                >
                  {editIndex === idx ? (
                    <div>
                      <textarea
                        value={editQuestion.question}
                        onChange={(e) =>
                          setEditQuestion((prev) => ({
                            ...prev,
                            question: e.target.value,
                          }))
                        }
                        className={cn(
                          "w-full px-3 py-2 border rounded mb-2",
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "bg-white border-slate-300 text-slate-900",
                        )}
                        rows={2}
                      />
                      <div className="space-y-2 mb-2">
                        {editQuestion.options.map((opt, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...editQuestion.options];
                                newOpts[i] = e.target.value;
                                setEditQuestion((prev) => ({
                                  ...prev,
                                  options: newOpts,
                                }));
                              }}
                              className={cn(
                                "flex-1 px-2 py-1 border rounded",
                                isDarkMode
                                  ? "bg-slate-700 border-slate-600 text-white"
                                  : "bg-white border-slate-300 text-slate-900",
                              )}
                            />
                            <input
                              type="radio"
                              checked={editQuestion.correctAnswer === opt}
                              onChange={() =>
                                setEditQuestion((prev) => ({
                                  ...prev,
                                  correctAnswer: opt,
                                }))
                              }
                            />
                            <span
                              className={cn(
                                "text-xs",
                                isDarkMode
                                  ? "text-slate-400"
                                  : "text-slate-500",
                              )}
                            >
                              Correct
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="number"
                          min="1"
                          value={editQuestion.marks}
                          onChange={(e) =>
                            setEditQuestion((prev) => ({
                              ...prev,
                              marks: parseInt(e.target.value),
                            }))
                          }
                          className={cn(
                            "w-20 px-2 py-1 border rounded",
                            isDarkMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-slate-300 text-slate-900",
                          )}
                          placeholder="Marks"
                        />
                        <select
                          value={editQuestion.difficulty}
                          onChange={(e) =>
                            setEditQuestion((prev) => ({
                              ...prev,
                              difficulty: e.target.value,
                            }))
                          }
                          className={cn(
                            "px-2 py-1 border rounded",
                            isDarkMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-slate-300 text-slate-900",
                          )}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                        <input
                          type="text"
                          value={editQuestion.topic || ""}
                          onChange={(e) =>
                            setEditQuestion((prev) => ({
                              ...prev,
                              topic: e.target.value,
                            }))
                          }
                          className={cn(
                            "flex-1 px-2 py-1 border rounded",
                            isDarkMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-slate-300 text-slate-900",
                          )}
                          placeholder="Topic"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={isUpdating}
                          className="bg-green-500 text-white px-4 py-1 rounded flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                          onClick={() => {
                            setEditIndex(null);
                            setEditQuestion(null);
                          }}
                          className={cn(
                            "px-4 py-1 rounded flex items-center gap-1",
                            isDarkMode
                              ? "bg-slate-700 text-slate-300"
                              : "bg-gray-200 text-slate-700",
                          )}
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={cn(
                            "font-semibold",
                            isDarkMode ? "text-white" : "text-slate-800",
                          )}
                        >
                          Q{idx + 1}. {q.question}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(q, idx)}
                            className={cn(
                              "transition-colors",
                              isDarkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-900 hover:text-blue-700",
                            )}
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(q._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 ml-4">
                        {q.options.map((opt, i) => (
                          <p
                            key={i}
                            className={`text-sm ${opt === q.correctAnswer ? "text-green-600 font-semibold" : isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                            {opt === q.correctAnswer && " ✓"}
                          </p>
                        ))}
                      </div>
                      <div
                        className={cn(
                          "flex gap-4 mt-2 text-xs",
                          isDarkMode ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        <span
                          className={cn(
                            "px-2 py-1 rounded",
                            isDarkMode ? "bg-slate-700" : "bg-slate-100",
                          )}
                        >
                          Marks: {q.marks}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-1 rounded capitalize",
                            isDarkMode ? "bg-slate-700" : "bg-slate-100",
                          )}
                        >
                          Difficulty: {q.difficulty}
                        </span>
                        {q.topic && (
                          <span
                            className={cn(
                              "px-2 py-1 rounded",
                              isDarkMode ? "bg-slate-700" : "bg-slate-100",
                            )}
                          >
                            Topic: {q.topic}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            ) : (
              <div
                className={cn(
                  "text-center italic",
                  isDarkMode ? "text-slate-500" : "text-gray-400",
                )}
              >
                No questions in this bank.
              </div>
            )}
          </div>
        </div>
      </div>
    </LecturerPage>
  );
};

export default QuestionTypes;
