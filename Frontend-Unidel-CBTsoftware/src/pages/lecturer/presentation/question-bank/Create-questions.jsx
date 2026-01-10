/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, FileText, AlertCircle, CheckCircle, Trash2, Sparkles, Eye, BookOpen } from "lucide-react";
import { useCreateQuestionBankAction, useGetLecturerQuestionBanksAction, useGenerateQuestionsAction, useImproveQuestionsAction } from "../../../../store/exam-store.js";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";
import useAuthStore from "../../../../store/auth-store";
import EditQuestions from "./Edit-questions.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import useExamStore from "../../../../store/exam-store";
import BulkUpload from "./Bulk-upload.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schema for question bank meta
const questionBankSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
});

const CreateQuestions = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    questions: [],
  });

  // Get only courses assigned to this lecturer
  const { courses: lecturerCourses = [], isLoading: lecturerCoursesLoading } = useGetLecturerCoursesAction();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Add separate state for manual question validation errors
  const [questionErrors, setQuestionErrors] = useState({});

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
    difficulty: "medium",
    topic: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const { createQuestionBank, isLoading: isCreating } = useCreateQuestionBankAction();
  const { questionBanks, refetch } = useGetLecturerQuestionBanksAction();
  const { generateQuestions, isLoading: isGenerating } = useGenerateQuestionsAction();
  const { improveQuestions, isLoading: isImproving } = useImproveQuestionsAction();
  const { showToast } = useExamStore.getState();

  // React Hook Form for meta fields
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
  } = useForm({
    resolver: zodResolver(questionBankSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
    },
  });

  // Pre-fill questions if navigated from import/export
  useEffect(() => {
    if (location.state && location.state.generatedQuestions) {
      setFormData((prev) => ({
        ...prev,
        questions: location.state.generatedQuestions,
      }));
      setActiveTab("create");
    }
  }, [location.state]);

  // Sync formData meta with react-hook-form
  useEffect(() => {
    setValue("title", formData.title || "");
    setValue("description", formData.description || "");
    setValue("courseId", formData.courseId || "");
    // eslint-disable-next-line
  }, [formData.title, formData.description, formData.courseId]);

  // Validation for manual question - FIXED
  const validateQuestion = () => {
    const newErrors = {};

    if (!currentQuestion.question.trim()) {
      newErrors.question = "Question text is required";
    }

    const filledOptions = currentQuestion.options.filter((opt) => opt.trim());
    if (filledOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    if (!currentQuestion.correctAnswer.trim()) {
      newErrors.correctAnswer = "Please select the correct answer";
    } else if (!currentQuestion.options.includes(currentQuestion.correctAnswer)) {
      newErrors.correctAnswer = "Correct answer must be one of the options";
    }

    setQuestionErrors(newErrors); // Fixed: Use setQuestionErrors instead of errors()
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    if (validateQuestion()) {
      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion }],
      }));

      // Reset current question
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
        difficulty: "medium",
        topic: "",
      });

      // Clear question errors
      setQuestionErrors({});

      setSuccessMessage("Question added successfully!");
      showToast("Question added successfully!", "success");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      showToast("Failed to add question. Please check your inputs.", "error");
    }
  };

  const handleRemoveQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
    showToast("Question removed.", "success");
  };

  // Save handler for both manual and bulk-uploaded questions
  const onSaveQuestionBank = async (data) => {
    // Use questions from formData (manual or bulk-uploaded)
    const questions = formData.questions;
    if (!questions.length) {
      showToast("At least one question is required", "error");
      return;
    }
    try {
      await createQuestionBank({
        ...data,
        questions,
        sourceType: "manual",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        courseId: "",
        questions: [],
      });
      setValue("title", "");
      setValue("description", "");
      setValue("courseId", "");

      refetch();
      setActiveTab("view");
      showToast("Question bank saved successfully!", "success");
    } catch (error) {
      console.error("Error saving question bank:", error);
      showToast(error?.message || "Failed to save question bank", "error");
    }
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  // --- Bulk Upload Handler (now handled in BulkUpload component) ---
  const handleBulkUploadParsed = (parsedQuestions) => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, ...(parsedQuestions || [])],
    }));
  };

  // Pass meta fields to BulkUpload so it can decide whether to show modal
  const metaFieldsFilled = !!(getValues("title") && getValues("courseId"));

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Question Bank Management</h1>
          <p className="text-slate-600">Create, edit, and manage your exam questions</p>
        </motion.div>

        {/* Bulk Upload Feature */}
        <BulkUpload
          onQuestionsParsed={handleBulkUploadParsed}
          metaFieldsFilled={metaFieldsFilled}
          metaValues={{
            title: getValues("title"),
            description: getValues("description"),
            courseId: getValues("courseId"),
          }}
        />

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "create" ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            <Plus className="inline-block w-5 h-5 mr-2" />
            Create Questions
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("view")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "view" ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            <Eye className="inline-block w-5 h-5 mr-2" />
            View Question Banks
          </motion.button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Tab Content */}
        {activeTab === "create" && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" onSubmit={handleSubmit(onSaveQuestionBank)}>
            {/* Question Bank Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                Question Bank Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                  <input
                    type="text"
                    {...register("title")}
                    value={getValues("title")}
                    onChange={e => {
                      setValue("title", e.target.value, { shouldValidate: true });
                      setFormData((prev) => ({ ...prev, title: e.target.value }));
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="e.g., Database Systems Mid-term Questions"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Fixed Course selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Course *</label>
                  <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                    {lecturerCoursesLoading ? (
                      <span className="text-xs text-gray-400 italic block p-2">Loading courses...</span>
                    ) : lecturerCourses.length > 0 ? (
                      lecturerCourses.map((course) => (
                        <label key={course._id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                          <input
                            type="radio"
                            name="courseId"
                            value={course._id}
                            checked={getValues("courseId") === course._id}
                            onChange={() => {
                              setValue("courseId", course._id, { shouldValidate: true });
                              setFormData((prev) => ({ ...prev, courseId: course._id }));
                            }}
                            className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                          />
                          <span className="text-sm text-slate-700">
                            <BookOpen className="inline-block w-4 h-4 mr-1 text-blue-900" />
                            {course.courseCode} - {course.courseTitle}
                          </span>
                        </label>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic block p-2">No courses assigned to you. {user?.courses?.length > 0 ? `(Found ${user.courses.length} course IDs but couldn't match with available courses)` : ""}</span>
                    )}
                  </div>
                  {errors.courseId && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.courseId.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    {...register("description")}
                    value={getValues("description")}
                    onChange={e => {
                      setValue("description", e.target.value, { shouldValidate: true });
                      setFormData((prev) => ({ ...prev, description: e.target.value }));
                    }}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Brief description of this question bank..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Add Question Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Question</h2>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Question *</label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter your question here..."
                  />
                  {questionErrors.question && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {questionErrors.question}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Answer Options * (minimum 2)</label>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold">{String.fromCharCode(65 + index)}</span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                      </div>
                    ))}
                  </div>
                  {questionErrors.options && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {questionErrors.options}
                    </p>
                  )}
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Correct Answer *</label>
                  <select 
                    value={currentQuestion.correctAnswer} 
                    onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))} 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
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
                  {questionErrors.correctAnswer && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {questionErrors.correctAnswer}
                    </p>
                  )}
                </div>

                {/* Additional Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Marks</label>
                    <input
                      type="number"
                      min="1"
                      value={currentQuestion.marks}
                      onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, marks: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                    <select value={currentQuestion.difficulty} onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, difficulty: e.target.value }))} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Topic</label>
                    <input
                      type="text"
                      value={currentQuestion.topic}
                      onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="e.g., Normalization"
                    />
                  </div>
                </div>

                {/* Add Question Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={handleAddQuestion} 
                  type="button"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Question to Bank
                </motion.button>
              </div>
            </div>

            {/* Questions List */}
            {formData.questions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Questions Added ({formData.questions.length})</h2>

                <div className="space-y-4">
                  {formData.questions.map((q, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 border border-slate-200 rounded-lg hover:border-orange-300 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-800">
                          Q{index + 1}. {q.question}
                        </h3>
                        <button onClick={() => handleRemoveQuestion(index)} className="text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
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
                    </motion.div>
                  ))}
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isCreating}
                  className="w-full mt-6 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isCreating ? "Saving..." : "Save Question Bank"}
                </motion.button>
              </div>
            )}
          </motion.form>
        )}

        {/* View Tab Content */}
        {activeTab === "view" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Question Banks</h2>

            {questionBanks.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No question banks yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questionBanks.map((bank) => (
                  <motion.div
                    key={bank._id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-slate-200 rounded-lg hover:border-orange-300 transition-all cursor-pointer"
                    onClick={() => navigate(`/lecturer/questions/types/${bank._id}`)}
                  >
                    <h3 className="font-semibold text-slate-800 mb-2">{bank.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{bank.description}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">{bank.questions?.length || 0} Questions</span>
                      <span className={`px-2 py-1 rounded capitalize ${bank.status === "approved" ? "bg-green-100 text-green-700" : bank.status === "pending_approval" ? "bg-yellow-100 text-yellow-700" : bank.status === "rejected" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
                        {bank.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedBankId && (
          <EditQuestions
            questionBankId={selectedBankId}
            onClose={() => {
              setShowEditModal(false);
              setSelectedBankId(null);
              refetch();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateQuestions;
