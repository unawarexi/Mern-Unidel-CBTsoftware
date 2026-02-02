import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, Save, Trash2, Plus, AlertCircle, CheckCircle, Send, Sparkles, Eye, EyeOff } from "lucide-react";
import { useGetQuestionBankByIdAction, useUpdateQuestionBankAction, useAddQuestionToBankAction, useUpdateQuestionInBankAction, useDeleteQuestionFromBankAction, useSubmitForApprovalAction, useDeleteQuestionBankAction, useImproveQuestionsAction } from "../../../../store/exam-store.js";

const EditQuestions = ({ questionBankId, onClose }) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
    difficulty: "medium",
    topic: "",
  });

  const [errors, setErrors] = useState({});

  const { questionBank, isLoading, refetch } = useGetQuestionBankByIdAction(questionBankId);
  const { updateQuestionBank } = useUpdateQuestionBankAction();
  const { addQuestion } = useAddQuestionToBankAction();
  const { updateQuestion } = useUpdateQuestionInBankAction();
  const { deleteQuestion } = useDeleteQuestionFromBankAction();
  const { submitForApproval } = useSubmitForApprovalAction();
  const { deleteQuestionBank } = useDeleteQuestionBankAction();
  const { improveQuestions, isLoading: isImproving } = useImproveQuestionsAction();

  useEffect(() => {
    if (questionBank) {
      setFormData({
        title: questionBank.title || "",
        description: questionBank.description || "",
        courseId: questionBank.courseId || "",
      });
    }
  }, [questionBank]);

  const validateQuestion = (question) => {
    const newErrors = {};

    if (!question.question.trim()) {
      newErrors.question = "Question text is required";
    }

    const filledOptions = question.options.filter((opt) => opt.trim());
    if (filledOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    if (!question.correctAnswer.trim()) {
      newErrors.correctAnswer = "Please select the correct answer";
    } else if (!question.options.includes(question.correctAnswer)) {
      newErrors.correctAnswer = "Correct answer must be one of the options";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateBankInfo = async () => {
    try {
      await updateQuestionBank(questionBankId, formData);
      refetch();
    } catch (error) {
      console.error("Error updating question bank:", error);
    }
  };

  const handleAddNewQuestion = async () => {
    if (validateQuestion(currentQuestion)) {
      try {
        await addQuestion(questionBankId, currentQuestion);
        setCurrentQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
          difficulty: "medium",
          topic: "",
        });
        setIsAddingNew(false);
        refetch();
      } catch (error) {
        console.error("Error adding question:", error);
      }
    }
  };

  const handleEditQuestion = (index) => {
    const question = questionBank.questions[index];
    setCurrentQuestion({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      marks: question.marks,
      difficulty: question.difficulty,
      topic: question.topic || "",
    });
    setEditingQuestionIndex(index);
    setIsAddingNew(false);
  };

  const handleUpdateQuestion = async () => {
    if (validateQuestion(currentQuestion)) {
      try {
        const questionId = questionBank.questions[editingQuestionIndex]._id;
        await updateQuestion(questionBankId, questionId, currentQuestion);
        setEditingQuestionIndex(null);
        setCurrentQuestion({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
          difficulty: "medium",
          topic: "",
        });
        refetch();
      } catch (error) {
        console.error("Error updating question:", error);
      }
    }
  };

  const handleDeleteQuestion = async () => {
    if (questionToDelete !== null) {
      try {
        const questionId = questionBank.questions[questionToDelete]._id;
        await deleteQuestion(questionBankId, questionId);
        setShowDeleteConfirm(false);
        setQuestionToDelete(null);
        refetch();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      await submitForApproval(questionBankId);
      refetch();
    } catch (error) {
      console.error("Error submitting for approval:", error);
    }
  };

  const handleDeleteBank = async () => {
    try {
      await deleteQuestionBank(questionBankId);
      onClose();
    } catch (error) {
      console.error("Error deleting question bank:", error);
    }
  };

  const handleImproveQuestions = async () => {
    try {
      await improveQuestions(questionBankId);
      refetch();
    } catch (error) {
      console.error("Error improving questions:", error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading question bank...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Edit Question Bank</h2>
            <p className="text-orange-100 text-sm mt-1">
              {questionBank?.questions?.length || 0} questions • Status: {questionBank?.status}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bank Information */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Edit className="w-5 h-5 text-orange-500" />
              Question Bank Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Course ID</label>
                <input type="text" value={formData.courseId} onChange={(e) => setFormData((prev) => ({ ...prev, courseId: e.target.value }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpdateBankInfo} className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" />
              Update Information
            </motion.button>
          </div>

          {/* Add/Edit Question Form */}
          {(isAddingNew || editingQuestionIndex !== null) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">{isAddingNew ? "Add New Question" : "Edit Question"}</h3>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingQuestionIndex(null);
                    setCurrentQuestion({
                      question: "",
                      options: ["", "", "", ""],
                      correctAnswer: "",
                      marks: 1,
                      difficulty: "medium",
                      topic: "",
                    });
                  }}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Question *</label>
                <textarea value={currentQuestion.question} onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))} rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                {errors.question && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.question}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Options *</label>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">{String.fromCharCode(65 + index)}</span>
                      <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                    </div>
                  ))}
                </div>
                {errors.options && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.options}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Correct Answer *</label>
                <select value={currentQuestion.correctAnswer} onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">Select correct answer</option>
                  {currentQuestion.options.map(
                    (option, index) =>
                      option.trim() && (
                        <option key={index} value={option}>
                          {String.fromCharCode(65 + index)}: {option}
                        </option>
                      )
                  )}
                </select>
                {errors.correctAnswer && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.correctAnswer}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Marks</label>
                  <input type="number" min="1" value={currentQuestion.marks} onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, marks: parseInt(e.target.value) }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                  <select value={currentQuestion.difficulty} onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, difficulty: e.target.value }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Topic</label>
                  <input type="text" value={currentQuestion.topic} onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, topic: e.target.value }))} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={isAddingNew ? handleAddNewQuestion : handleUpdateQuestion}
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isAddingNew ? "Add Question" : "Update Question"}
              </motion.button>
            </motion.div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Questions ({questionBank?.questions?.length || 0})</h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleImproveQuestions}
                  disabled={isImproving}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isImproving ? "Improving..." : "AI Improve"}
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddingNew(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Question
                </motion.button>
              </div>
            </div>

            {questionBank?.questions?.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No questions yet. Add your first question!</div>
            ) : (
              <div className="space-y-3">
                {questionBank?.questions?.map((q, index) => (
                  <motion.div key={q._id || index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-orange-300 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 font-semibold text-slate-600">Q{index + 1}.</span>
                          <p className="font-medium text-slate-800">{q.question}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditQuestion(index)} className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setQuestionToDelete(index);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 ml-6 mb-3">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`flex items-center gap-2 text-sm ${opt === q.correctAnswer ? "text-green-600 font-semibold" : "text-slate-600"}`}>
                          <span className="flex-shrink-0 w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs">{String.fromCharCode(65 + i)}</span>
                          <span>{opt}</span>
                          {opt === q.correctAnswer && <CheckCircle className="w-4 h-4 ml-1" />}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 ml-6">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">Marks: {q.marks}</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs capitalize">{q.difficulty}</span>
                      {q.topic && <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{q.topic}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm("bank")} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Bank
          </motion.button>

          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-semibold hover:bg-slate-400 transition-all">
              Close
            </motion.button>

            {questionBank?.status === "draft" && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmitForApproval} className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit for Approval
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowDeleteConfirm(false);
              setQuestionToDelete(null);
            }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Confirm Deletion</h3>
                  <p className="text-sm text-slate-600">{showDeleteConfirm === "bank" ? "This will permanently delete the entire question bank." : "This will permanently delete this question."}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setQuestionToDelete(null);
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm === "bank") {
                      handleDeleteBank();
                    } else {
                      handleDeleteQuestion();
                    }
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditQuestions;
