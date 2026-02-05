/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Save,
  FileText,
  AlertCircle,
  CheckCircle,
  Trash2,
  Sparkles,
  Eye,
  BookOpen,
} from "lucide-react";
import {
  useCreateQuestionBankAction,
  useGetLecturerQuestionBanksAction,
  useGenerateQuestionsAction,
  useImproveQuestionsContentAction,
  useImproveQuestionsAction,
  useGenerateImageForQuestionAction,
} from "../../../store/exam-store.js";
import { useGetLecturerCoursesAction } from "../../../store/user-store";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import EditQuestions from "./Edit-questions.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import useExamStore from "../../../store/exam-store";
import BulkUpload from "./Bulk-upload.jsx";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Zod schema for question bank meta
const questionBankSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
});

const CreateQuestions = () => {
  const { isDarkMode } = useThemeStore();
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
  const { courses: lecturerCourses = [], isLoading: lecturerCoursesLoading } =
    useGetLecturerCoursesAction();
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

  const { createQuestionBank, isLoading: isCreating } =
    useCreateQuestionBankAction();
  const {
    questionBanks,
    refetch,
    isLoading: banksLoading,
  } = useGetLecturerQuestionBanksAction();
  const { generateQuestions, isLoading: isGenerating } =
    useGenerateQuestionsAction();
  const { improveQuestions, isLoading: isImproving } =
    useImproveQuestionsAction();
  const { improveContent, isLoading: isImprovingContent } =
    useImproveQuestionsContentAction();
  const { generateImage, isLoading: isImageGenerating } =
    useGenerateImageForQuestionAction();
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
    } else if (
      !currentQuestion.options.includes(currentQuestion.correctAnswer)
    ) {
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

  // Handler for improving draft questions
  const handleImproveDraft = async () => {
    if (formData.questions.length === 0) return;

    try {
      const result = await improveContent(formData.questions);
      if (result && result.questions) {
        setFormData((prev) => ({ ...prev, questions: result.questions }));
      }
    } catch (error) {
      console.error("Improve draft failed", error);
    }
  };

  const [generatingImages, setGeneratingImages] = useState({});

  // ... (previous code)

  // Handler for AI Image Generation
  const handleGenerateImage = async (index, questionObj) => {
    setGeneratingImages((prev) => ({ ...prev, [index]: true }));

    try {
      const data = await generateImage({
        question: questionObj.question,
        questionBankId: selectedBankId,
        questionId: questionObj._id,
        oldPublicId: questionObj.attachment?.publicId,
      });

      // Update question with new attachment
      const newQuestions = [...formData.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        attachment: data.attachment, // Backend returns { attachment: { url, publicId, type } }
      };

      setFormData((prev) => ({ ...prev, questions: newQuestions }));
    } catch (error) {
      console.error("Image generation failed", error);
      // Toast is handled by store
    } finally {
      setGeneratingImages((prev) => ({ ...prev, [index]: false }));
    }
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
    <LecturerPage
      title="Question Bank Management"
      subtitle="Create, edit, and manage your exam questions"
      icon={LecturerIcons.Questions}
    >
      <div className="space-y-6">
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
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              activeTab === "create"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            <Plus className="inline-block w-5 h-5 mr-2" />
            Create Questions
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("view")}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              activeTab === "view"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            <Eye className="inline-block w-5 h-5 mr-2" />
            View Question Banks
          </motion.button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "mb-4 p-4 border rounded-lg flex items-center gap-2",
                isDarkMode
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-green-50 border-green-200 text-green-700",
              )}
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Tab Content */}
        {activeTab === "create" && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
            onSubmit={handleSubmit(onSaveQuestionBank)}
          >
            {/* Question Bank Details */}
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
                  "text-2xl font-bold mb-6 flex items-center gap-2",
                  isDarkMode ? "text-white" : "text-slate-800",
                )}
              >
                <FileText className="w-6 h-6 text-orange-500" />
                Question Bank Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={cn(
                      "block text-sm font-semibold mb-2",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    value={getValues("title")}
                    onChange={(e) => {
                      setValue("title", e.target.value, {
                        shouldValidate: true,
                      });
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                      isDarkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900",
                    )}
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
                  <label
                    className={cn(
                      "block text-sm font-semibold mb-2",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Course *
                  </label>
                  <div
                    className={cn(
                      "max-h-40 overflow-y-auto border rounded-lg p-2",
                      isDarkMode
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-300 bg-slate-50",
                    )}
                  >
                    {lecturerCoursesLoading ? (
                      <span
                        className={cn(
                          "text-xs italic block p-2",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      >
                        Loading courses...
                      </span>
                    ) : lecturerCourses.length > 0 ? (
                      lecturerCourses.map((course) => (
                        <label
                          key={course._id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded cursor-pointer",
                            isDarkMode
                              ? "hover:bg-slate-800"
                              : "hover:bg-white",
                          )}
                        >
                          <input
                            type="radio"
                            name="courseId"
                            value={course._id}
                            checked={getValues("courseId") === course._id}
                            onChange={() => {
                              setValue("courseId", course._id, {
                                shouldValidate: true,
                              });
                              setFormData((prev) => ({
                                ...prev,
                                courseId: course._id,
                              }));
                            }}
                            className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                          />
                          <span
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-slate-300" : "text-slate-700",
                            )}
                          >
                            <BookOpen
                              className={cn(
                                "inline-block w-4 h-4 mr-1",
                                isDarkMode ? "text-blue-400" : "text-blue-900",
                              )}
                            />
                            {course.courseCode} - {course.courseTitle}
                          </span>
                        </label>
                      ))
                    ) : (
                      <span
                        className={cn(
                          "text-xs italic block p-2",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      >
                        No courses assigned to you.{" "}
                        {user?.courses?.length > 0
                          ? `(Found ${user.courses.length} course IDs but couldn't match with available courses)`
                          : ""}
                      </span>
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
                  <label
                    className={cn(
                      "block text-sm font-semibold mb-2",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    value={getValues("description")}
                    onChange={(e) => {
                      setValue("description", e.target.value, {
                        shouldValidate: true,
                      });
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                      isDarkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900",
                    )}
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
                Add New Question
              </h2>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label
                    className={cn(
                      "block text-sm font-semibold mb-2",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Question *
                  </label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                      isDarkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900",
                    )}
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
                  <label
                    className={cn(
                      "block text-sm font-semibold mb-2",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Answer Options * (minimum 2)
                  </label>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <span
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white",
                            isDarkMode ? "bg-blue-600" : "bg-blue-900",
                          )}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          className={cn(
                            "flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                            isDarkMode
                              ? "bg-slate-900 border-slate-700 text-white"
                              : "bg-white border-slate-300 text-slate-900",
                          )}
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
                  <label
                    className={cn(
                      "block text-sm font-semibold mb-2",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Correct Answer *
                  </label>
                  <select
                    value={currentQuestion.correctAnswer}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        correctAnswer: e.target.value,
                      }))
                    }
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                      isDarkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900",
                    )}
                  >
                    <option value="">Select correct answer</option>
                    {currentQuestion.options.map(
                      (option, index) =>
                        option.trim() && (
                          <option key={index} value={option}>
                            {String.fromCharCode(65 + index)}: {option}
                          </option>
                        ),
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
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={currentQuestion.marks}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          marks: parseInt(e.target.value),
                        }))
                      }
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900",
                      )}
                    />
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Difficulty
                    </label>
                    <select
                      value={currentQuestion.difficulty}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900",
                      )}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Topic
                    </label>
                    <input
                      type="text"
                      value={currentQuestion.topic}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900",
                      )}
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
                  Questions Added ({formData.questions.length})
                </h2>

                <button
                  type="button"
                  onClick={handleImproveDraft}
                  disabled={
                    isImprovingContent || formData.questions.length === 0
                  }
                  className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isImprovingContent ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Improving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Improve Questions with AI
                    </>
                  )}
                </button>

                <div className="space-y-4">
                  {formData.questions.map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-4 border rounded-lg transition-all",
                        isDarkMode
                          ? "border-slate-700 hover:border-orange-500/50"
                          : "border-slate-200 hover:border-orange-300",
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={cn(
                            "font-semibold",
                            isDarkMode ? "text-white" : "text-slate-800",
                          )}
                        >
                          Q{index + 1}.
                        </h3>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(index)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <p
                        className={cn(
                          "font-medium mb-3 text-lg",
                          isDarkMode ? "text-slate-200" : "text-slate-700",
                        )}
                      >
                        {q.question}
                      </p>

                      {/* AI Image Generation Section */}
                      <div className="mb-4">
                        {q.attachment?.url ? (
                          <div className="relative group inline-block">
                            <img
                              src={q.attachment.url}
                              alt="Question Illustration"
                              className="h-48 w-auto rounded-lg border shadow-sm object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleGenerateImage(index, q)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 text-blue-600"
                                title="Regenerate Image"
                              >
                                <Sparkles className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newQuestions = [...formData.questions];
                                  newQuestions[index].attachment = null;
                                  setFormData((prev) => ({
                                    ...prev,
                                    questions: newQuestions,
                                  }));
                                }}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 text-red-600"
                                title="Remove Image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-center mt-1 text-slate-500 italic">
                              "Use the image to answer the question"
                            </p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleGenerateImage(index, q)}
                            disabled={generatingImages[index]}
                            className={cn(
                              "text-xs flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all",
                              isDarkMode
                                ? "border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                                : "border-indigo-200 text-indigo-600 hover:bg-indigo-50",
                            )}
                          >
                            {generatingImages[index] ? (
                              <>
                                <span className="animate-spin w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full"></span>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3" />
                                Generate AI Illustration
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
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
                    </motion.div>
                  ))}
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isCreating}
                  className={cn(
                    "w-full mt-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                    isDarkMode
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-900 text-white hover:bg-blue-800",
                  )}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              Your Question Banks
            </h2>

            {banksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton
                      key={idx}
                      height={120}
                      className="rounded-lg"
                      baseColor={isDarkMode ? "#334155" : "#e2e8f0"}
                      highlightColor={isDarkMode ? "#475569" : "#f1f5f9"}
                    />
                  ))}
              </div>
            ) : questionBanks.length === 0 ? (
              <div className="text-center py-12">
                <FileText
                  className={cn(
                    "w-16 h-16 mx-auto mb-4",
                    isDarkMode ? "text-slate-600" : "text-slate-300",
                  )}
                />
                <p
                  className={cn(
                    isDarkMode ? "text-slate-500" : "text-slate-500",
                  )}
                >
                  No question banks yet. Create your first one!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questionBanks.map((bank) => (
                  <motion.div
                    key={bank._id}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "p-4 border rounded-lg transition-all cursor-pointer",
                      isDarkMode
                        ? "border-slate-700 hover:border-orange-500/50"
                        : "border-slate-200 hover:border-orange-300",
                    )}
                    onClick={() =>
                      navigate(`/lecturer/questions/types/${bank._id}`)
                    }
                  >
                    <h3
                      className={cn(
                        "font-semibold mb-2",
                        isDarkMode ? "text-white" : "text-slate-800",
                      )}
                    >
                      {bank.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm mb-2",
                        isDarkMode ? "text-slate-400" : "text-slate-600",
                      )}
                    >
                      {bank.description}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {bank.questions?.length || 0} Questions
                      </span>
                      <span
                        className={`px-2 py-1 rounded capitalize ${bank.status === "approved" ? "bg-green-100 text-green-700" : bank.status === "pending_approval" ? "bg-yellow-100 text-yellow-700" : bank.status === "rejected" ? "bg-red-100 text-red-700" : isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"}`}
                      >
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
    </LecturerPage>
  );
};

export default CreateQuestions;
