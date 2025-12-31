/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { UploadCloud, CheckCircle, AlertCircle, Info, FileText, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBulkUploadQuestionsAction, useCreateQuestionBankAction } from "../../../../store/exam-store";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";

const BulkUpload = ({ onQuestionsParsed, metaFieldsFilled, metaValues }) => {
  const fileInputRef = useRef();
  const { bulkUpload, isLoading, error } = useBulkUploadQuestionsAction();
  const { createQuestionBank, isLoading: isCreating } = useCreateQuestionBankAction();
  const { courses: lecturerCourses = [], isLoading: lecturerCoursesLoading } = useGetLecturerCoursesAction();

  const [success, setSuccess] = useState("");
  const [count, setCount] = useState(0);
  const [showFormatGuide, setShowFormatGuide] = useState(false);

  // Bulk upload state
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [meta, setMeta] = useState({ title: "", description: "", courseId: "" });
  const [metaError, setMetaError] = useState("");

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSuccess("");
    setCount(0);
    setUploadedQuestions([]);
    setShowSaveModal(false);

    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload CSV, Excel, PDF, or DOCX files only.");
      e.target.value = "";
      return;
    }

    try {
      const result = await bulkUpload(file);
      const questionCount = result.questions?.length || 0;
      setCount(questionCount);

      if (questionCount > 0) {
        setSuccess(`✓ Imported ${questionCount} question${questionCount !== 1 ? "s" : ""} from ${file.name}`);
        setUploadedQuestions(result.questions || []);
        if (onQuestionsParsed) {
          onQuestionsParsed(result.questions || []);
        }
      } else {
        setSuccess("⚠️ No questions found in file. Please check the format.");
        setUploadedQuestions([]);
      }
    } catch (err) {
      setUploadedQuestions([]);
      console.error("Bulk upload error:", err);
    }

    e.target.value = "";
  };

  const handleOpenSaveModal = () => {
    setMeta({ title: "", description: "", courseId: "" });
    setMetaError("");
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    setMetaError("");
  };

  const handleMetaChange = (field, value) => {
    setMeta((prev) => ({ ...prev, [field]: value }));
    setMetaError("");
  };

  const handleSaveQuestions = async () => {
    setMetaError("");
    // Use metaValues from parent if provided and filled
    const metaToUse = metaFieldsFilled ? metaValues : meta;
    if (!metaToUse.title?.trim()) {
      setMetaError("Title is required");
      return;
    }
    if (!metaToUse.courseId) {
      setMetaError("Course is required");
      return;
    }
    if (!uploadedQuestions.length) {
      setMetaError("No questions to save");
      return;
    }
    try {
      await createQuestionBank({
        title: metaToUse.title,
        description: metaToUse.description,
        courseId: metaToUse.courseId,
        questions: uploadedQuestions,
        sourceType: "file_upload",
      });
      setShowSaveModal(false);
      setUploadedQuestions([]);
      setSuccess("Question bank saved successfully!");
      setMeta({ title: "", description: "", courseId: "" });
      setCount(0);
    } catch (err) {
      setMetaError(err.message || "Failed to save question bank");
    }
  };

  // Show Save Modal only if meta fields are not filled in parent
  const shouldShowSaveModal = showSaveModal && !metaFieldsFilled;

  return (
    <div className="mb-6 space-y-4">
      {/* Main Upload Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
        <label className="flex items-center gap-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold shadow-md transition-all hover:shadow-lg">
          <UploadCloud className="w-5 h-5" />
          <span>Upload Questions File</span>
          <input type="file" accept=".csv, .xlsx, .xls, .docx, .pdf" onChange={handleBulkUpload} ref={fileInputRef} className="hidden" disabled={isLoading} />
        </label>

        <div className="flex-1 space-y-2">
          <p className="text-sm text-slate-700 font-medium">Upload a file with multiple questions to auto-fill the form</p>
          <p className="text-xs text-slate-500">Supported: CSV, Excel, PDF, DOCX • After upload, review and edit questions before saving</p>
        </div>

        <button onClick={() => setShowFormatGuide(!showFormatGuide)} className="flex items-center gap-1 text-sm text-orange-700 hover:text-orange-800 font-medium transition-colors">
          <Info className="w-4 h-4" />
          Format Guide
        </button>
      </div>

      {/* Format Guide Dropdown */}
      <AnimatePresence>
        {showFormatGuide && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white border border-slate-200 rounded-lg p-6 shadow-lg overflow-hidden">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Question Format Guide</h3>
                <p className="text-sm text-slate-600 mb-4">Format your questions in PDF or DOCX files as follows:</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm mb-4">
              <pre className="text-slate-700 whitespace-pre-wrap">
                {`1. What is the capital of France?
                A. London
                B. Berlin
                C. Paris
                D. Madrid
                Answer: C

                2. Which language is used for web development?
                A. Python
                B. JavaScript
                C. Java
                D. C++
                Answer: B`}
              </pre>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>
                  <strong>Number questions</strong> sequentially (1., 2., 3., etc.)
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>
                  <strong>Options</strong> should use letters A., B., C., D.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>
                  <strong>Answer format:</strong> "Answer: C" or "Answer: Paris"
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>
                  Provide at least <strong>2 options</strong> per question
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="w-5 h-5 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-orange-700 font-medium">Processing file...</span>
          </motion.div>
        )}

        {success && !isLoading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`flex items-center gap-2 rounded-lg p-3 ${count > 0 ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
            {count > 0 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-yellow-600" />}
            <span className={count > 0 ? "text-green-700" : "text-yellow-700"}>{success}</span>
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-red-700 font-medium">{typeof error === "string" ? error : error?.message || "An error occurred"}</p>
              <p className="text-xs text-red-600 mt-1">Make sure your file follows the correct format. Click "Format Guide" above for details.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Save Button if questions are uploaded */}
      {uploadedQuestions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (metaFieldsFilled) {
                handleSaveQuestions();
              } else {
                handleOpenSaveModal();
              }
            }}
            className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition-all"
          >
            <Save className="w-5 h-5" />
            Save All Questions
          </motion.button>
        </motion.div>
      )}

      {/* Save Modal */}
      <AnimatePresence>
        {shouldShowSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4 text-slate-800">Save Question Bank</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={meta.title}
                    onChange={e => handleMetaChange("title", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="e.g., Imported Questions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Course *</label>
                  <select
                    value={meta.courseId}
                    onChange={e => handleMetaChange("courseId", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Select course</option>
                    {lecturerCourses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.courseCode} - {course.courseTitle}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={meta.description}
                    onChange={e => handleMetaChange("description", e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="Optional description"
                  />
                </div>
                {metaError && <p className="text-red-500 text-sm">{metaError}</p>}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveQuestions}
                    disabled={isCreating}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isCreating ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseSaveModal}
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
  );
};

export default BulkUpload;
