import React, { useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  Save,
  X,
  FileUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useBulkUploadQuestionsAction,
  useCreateQuestionBankAction,
} from "../../../store/exam-store";
import { useGetLecturerCoursesAction } from "../../../store/user-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const BulkUpload = ({ onQuestionsParsed, metaFieldsFilled, metaValues }) => {
  const fileInputRef = useRef();
  const { bulkUpload, isLoading, error } = useBulkUploadQuestionsAction();
  const { createQuestionBank, isLoading: isCreating } =
    useCreateQuestionBankAction();
  const { courses: lecturerCourses = [], isLoading: lecturerCoursesLoading } =
    useGetLecturerCoursesAction();
  const { isDarkMode } = useThemeStore();

  const [success, setSuccess] = useState("");
  const [count, setCount] = useState(0);
  const [showFormatGuide, setShowFormatGuide] = useState(false);

  // Bulk upload state
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    courseId: "",
  });
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
      alert(
        "Invalid file type. Please upload CSV, Excel, PDF, or DOCX files only.",
      );
      e.target.value = "";
      return;
    }

    try {
      const result = await bulkUpload(file);
      const questionCount = result.questions?.length || 0;
      setCount(questionCount);

      if (questionCount > 0) {
        setSuccess(
          `✓ Imported ${questionCount} question${questionCount !== 1 ? "s" : ""} from ${file.name}`,
        );
        setUploadedQuestions(result.questions || []);
        if (onQuestionsParsed) {
          onQuestionsParsed(result.questions || []);
        }
      } else {
        setSuccess("️ No questions found in file. Please check the format.");
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
      <div
        className={cn(
          "flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl border-2 transition-all",
          isDarkMode
            ? "bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30"
            : "bg-white border-slate-100 shadow-sm hover:border-orange-100",
        )}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105",
            isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
          )}
        >
          <FileUp
            className={cn(
              "w-8 h-8",
              isDarkMode ? "text-orange-400" : "text-orange-600",
            )}
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <h3
            className={cn(
              "text-lg font-bold",
              isDarkMode ? "text-white" : "text-slate-900",
            )}
          >
            Bulk Import Questions
          </h3>
          <p
            className={cn(
              "text-sm leading-relaxed",
              isDarkMode ? "text-slate-400" : "text-slate-500",
            )}
          >
            Instantly convert your existing documents into a structured question
            bank. Supported: PDF, DOCX, CSV, Excel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFormatGuide(!showFormatGuide)}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all w-full sm:w-auto",
              isDarkMode
                ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                : "bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100",
            )}
          >
            <Info className="w-4 h-4" />
            View Template
          </button>

          <label
            className={cn(
              "flex items-center justify-center gap-2 cursor-pointer bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto",
              isLoading && "opacity-50 pointer-events-none",
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
            <span>{isLoading ? "Analyzing..." : "Choose File"}</span>
            <input
              type="file"
              accept=".csv, .xlsx, .xls, .docx, .pdf"
              onChange={handleBulkUpload}
              ref={fileInputRef}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {/* Format Guide Dropdown */}
      <AnimatePresence>
        {showFormatGuide && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "border-2 rounded-2xl p-8 shadow-2xl relative overflow-hidden",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <button
              onClick={() => setShowFormatGuide(false)}
              className={cn(
                "absolute top-4 right-4 p-2 rounded-lg transition-colors",
                isDarkMode
                  ? "hover:bg-slate-800 text-slate-500 hover:text-white"
                  : "hover:bg-white text-slate-400 hover:text-slate-600",
              )}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4
                    className={cn(
                      "text-lg font-bold",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    Structural Standard
                  </h4>
                </div>
                <div
                  className={cn(
                    "p-6 rounded-xl border-2 font-mono text-xs leading-relaxed",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700/50 text-slate-300"
                      : "bg-white border-slate-200 text-slate-600",
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <span className="text-orange-500">1.</span> What is the
                      primary loop in Node.js?
                      <br />
                      {"   "}
                      <span className="text-blue-500">A.</span> Event Loop
                      <br />
                      {"   "}
                      <span className="text-blue-500">B.</span> Service Loop
                      <br />
                      {"   "}
                      <span className="text-blue-500">C.</span> Worker Thread
                      <br />
                      {"   "}
                      <span className="text-blue-500">D.</span> Kernel Loop
                      <br />
                      {"   "}
                      <span className="font-bold">Answer: A</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-slate-700">
                      <span className="text-orange-500">2.</span> React uses a
                      Virtual DOM for optimization.
                      <br />
                      {"   "}
                      <span className="text-blue-500">A.</span> True
                      <br />
                      {"   "}
                      <span className="text-blue-500">B.</span> False
                      <br />
                      {"   "}
                      <span className="font-bold">Answer: True</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h5
                    className={cn(
                      "text-sm font-bold uppercase tracking-wider mb-4",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Processing Rules
                  </h5>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Sequential Numbering",
                        desc: "Questions must start with a number followed by a period (e.g., 1.)",
                      },
                      {
                        title: "Option Labels",
                        desc: "Use A, B, C, D followed by a period or parenthesis for choices.",
                      },
                      {
                        title: "Key Assignment",
                        desc: 'Start the answer line with "Answer:" followed by the label or text.',
                      },
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "text-sm font-bold",
                              isDarkMode ? "text-slate-200" : "text-slate-700",
                            )}
                          >
                            {item.title}
                          </p>
                          <p
                            className={cn(
                              "text-xs mt-0.5",
                              isDarkMode ? "text-slate-500" : "text-slate-500",
                            )}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {success && !isLoading && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={cn(
              "flex items-center justify-between gap-4 p-4 rounded-xl border-2 transition-all",
              count > 0
                ? isDarkMode
                  ? "bg-green-500/5 border-green-500/20 text-green-400"
                  : "bg-green-50 border-green-100 text-green-700"
                : isDarkMode
                  ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-500"
                  : "bg-yellow-50 border-yellow-100 text-yellow-700",
            )}
          >
            <div className="flex items-center gap-3">
              {count > 0 ? (
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isDarkMode ? "bg-green-500/20" : "bg-green-100",
                  )}
                >
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isDarkMode ? "bg-yellow-500/20" : "bg-yellow-100",
                  )}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              <span className="text-sm font-bold">{success}</span>
            </div>

            {uploadedQuestions.length > 0 && (
              <button
                onClick={() => {
                  if (metaFieldsFilled) handleSaveQuestions();
                  else handleOpenSaveModal();
                }}
                disabled={isCreating}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm",
                  isCreating
                    ? "opacity-50 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-green-600 text-white hover:bg-green-500"
                      : "bg-green-600 text-white hover:bg-green-700",
                )}
              >
                {isCreating ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {isCreating ? "Saving..." : "Save to Bank"}
              </button>
            )}
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2",
              isDarkMode
                ? "bg-red-500/5 border-red-500/20 text-red-400"
                : "bg-red-50 border-red-100 text-red-700",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                isDarkMode ? "bg-red-500/20" : "bg-red-100",
              )}
            >
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold">Import Failed</p>
              <p className="text-xs opacity-80 mt-0.5">
                {typeof error === "string"
                  ? error
                  : error?.message || "Verify file content and try again."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Save Area (if metadata is already provided) */}
      {uploadedQuestions.length > 0 && metaFieldsFilled && !success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-xl border-2 flex items-center justify-between",
            isDarkMode
              ? "bg-blue-500/5 border-blue-500/10"
              : "bg-blue-50 border-blue-100",
          )}
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-500" />
            <p
              className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-blue-400" : "text-blue-700",
              )}
            >
              Found {uploadedQuestions.length} questions. You can now save them
              to the current bank.
            </p>
          </div>
          <button
            onClick={handleSaveQuestions}
            disabled={isCreating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isCreating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Questions
          </button>
        </motion.div>
      )}

      {/* Save Modal */}
      <AnimatePresence>
        {shouldShowSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={cn(
                "rounded-2xl p-8 w-full max-w-lg border-2 shadow-2xl relative",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 shadow-black/50"
                  : "bg-white border-slate-100",
              )}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Save className="w-8 h-8 text-orange-500" />
                </div>
                <h2
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  Create Question Bank
                </h2>
                <p
                  className={cn(
                    "text-sm mt-2",
                    isDarkMode ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  Provide final details to store yours{" "}
                  {uploadedQuestions.length} questions.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className={cn(
                      "block text-xs font-bold uppercase tracking-widest mb-2",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Question Bank Title
                  </label>
                  <input
                    type="text"
                    value={meta.title}
                    onChange={(e) => handleMetaChange("title", e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-orange-500/20 outline-none",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600"
                        : "bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400",
                    )}
                    placeholder="e.g., Final Year Projects"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      className={cn(
                        "block text-xs font-bold uppercase tracking-widest mb-2",
                        isDarkMode ? "text-slate-500" : "text-slate-400",
                      )}
                    >
                      Assign to Course
                    </label>
                    <select
                      value={meta.courseId}
                      onChange={(e) =>
                        handleMetaChange("courseId", e.target.value)
                      }
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-orange-500/20 outline-none appearance-none",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-slate-50 border-slate-100 text-slate-900",
                      )}
                    >
                      <option value="">Select course</option>
                      {lecturerCourses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.courseCode} - {course.courseTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className={cn(
                      "block text-xs font-bold uppercase tracking-widest mb-2",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Strategic Description (Optional)
                  </label>
                  <textarea
                    value={meta.description}
                    onChange={(e) =>
                      handleMetaChange("description", e.target.value)
                    }
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2 focus:ring-orange-500/20 outline-none resize-none",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600"
                        : "bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400",
                    )}
                    placeholder="Context for this question bank..."
                  />
                </div>

                <AnimatePresence>
                  {metaError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-red-500 text-xs font-bold flex items-center gap-2 bg-red-500/5 p-3 rounded-lg border border-red-500/20"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {metaError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCloseSaveModal}
                    className={cn(
                      "flex-1 px-6 py-3 rounded-xl font-bold transition-all",
                      isDarkMode
                        ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveQuestions}
                    disabled={isCreating}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Save Bank"
                    )}
                  </button>
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
