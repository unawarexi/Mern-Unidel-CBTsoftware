/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  CheckCircle,
  AlertCircle,
  Loader,
  Sparkles,
  Settings,
  Clock,
} from "lucide-react";
import {
  useExtractTextAction,
  useGenerateQuestionsAction,
  useCreateQuestionBankAction,
} from "../../../store/exam-store.js";
import ProgressBar from "../../../components/ui/ProgressBar";
import { useGetLecturerCoursesAction } from "../../../store/user-store";
import useExamStore from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";
const ImportExport = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  const { isDarkMode } = useThemeStore();

  const [activeTab, setActiveTab] = useState("import");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [importConfig, setImportConfig] = useState({
    numberOfQuestions: 10,
    difficulty: "medium",
    includeExplanations: false,
    randomizeOptions: true,
  });

  const [exportConfig, setExportConfig] = useState({
    format: "pdf",
    includeAnswers: true,
    includeMetadata: true,
  });

  const [showImportModal, setShowImportModal] = useState(false);
  const [importMeta, setImportMeta] = useState({
    title: "",
    description: "",
    courseId: "",
  });
  const [importError, setImportError] = useState("");

  const fileInputRef = useRef(null);

  const { extractText, isLoading: isExtracting } = useExtractTextAction();
  const {
    generateQuestions,
    cancelGeneration,
    isLoading: isGenerating,
  } = useGenerateQuestionsAction();
  const { createQuestionBank, isLoading: isCreatingBank } =
    useCreateQuestionBankAction();
  const { showToast } = useExamStore.getState();
  const { courses: lecturerCourses = [] } = useGetLecturerCoursesAction();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    // Only allow PDF and DOCX for extraction/generation
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert(
        "Only PDF and Word (.docx) files are supported for extraction and question generation. Please do not upload TXT, XLS, XLSX, or DOC files.",
      );
    }
  };

  const handleExtractText = async () => {
    if (!file) return;
    try {
      const result = await extractText(file);
      setExtractedText(result.text || "");
      setShowPreview(true);
      showToast("Text extracted successfully", "success");
    } catch (error) {
      setExtractedText("");
      setShowPreview(false);
      showToast(
        error?.message ||
          "Failed to extract text from file. Only PDF and DOCX are supported.",
        "error",
      );
      // Show a more helpful error for PDFs
      if (
        error?.message?.includes("scanned") ||
        error?.message?.includes("image-based") ||
        error?.message?.includes("Failed to parse PDF")
      ) {
        alert(
          "Failed to extract text from PDF. This PDF may be scanned or image-based. Please upload a text-based PDF or use DOCX.",
        );
      } else {
        alert(
          error?.message ||
            "Failed to extract text from file. Only PDF and DOCX are supported.",
        );
      }
      console.error("Error extracting text:", error);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!file) return;
    setShowPreview(true); // Ensure preview area is visible for loading state
    try {
      const result = await generateQuestions({
        file,
        numberOfQuestions: importConfig.numberOfQuestions,
        difficulty: importConfig.difficulty,
      });
      setGeneratedQuestions(result.questions || []);
      if (result.history) {
        setHistory(result.history);
      }
      showToast("Questions generated successfully", "success");
      // Route to create questions page with generated questions
      navigate("/lecturer/questions/manage", {
        state: { generatedQuestions: result.questions },
      });
    } catch (error) {
      setGeneratedQuestions([]);
      showToast(
        error?.message ||
          "Failed to generate questions. Only PDF and DOCX are supported.",
        "error",
      );
      console.error("Error generating questions:", error);
    }
  };

  const handleImportQuestions = () => {
    if (generatedQuestions.length > 0) {
      setShowImportModal(true);
      showToast("Ready to import questions", "success");
    }
  };

  const handleConfirmImport = async () => {
    setImportError("");
    if (!importMeta.title.trim()) {
      setImportError("Title is required");
      showToast("Title is required", "error");
      return;
    }
    if (!importMeta.courseId) {
      setImportError("Course is required");
      showToast("Course is required", "error");
      return;
    }
    try {
      await createQuestionBank({
        title: importMeta.title,
        description: importMeta.description,
        courseId: importMeta.courseId,
        questions: generatedQuestions,
        sourceType: "file_upload",
      });
      showToast(
        "Questions imported and question bank created successfully!",
        "success",
      );
      setShowImportModal(false);
      handleClose();
    } catch (err) {
      setImportError(err.message || "Failed to import questions");
      showToast(err.message || "Failed to import questions", "error");
    }
  };

  const handleExport = (format) => {
    // This would integrate with your backend export functionality
    showToast(
      `Export as ${format.toUpperCase()} functionality will be implemented with backend integration`,
      "info",
    );
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes("pdf"))
      return <FileText className="w-8 h-8 text-red-500" />;
    if (fileType?.includes("word"))
      return <FileText className="w-8 h-8 text-blue-500" />;
    if (fileType?.includes("sheet") || fileType?.includes("excel"))
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    return <File className="w-8 h-8 text-slate-500" />;
  };

  const handleClose = () => {
    navigate("/lecturer/questions/manage");
  };

  return (
    <LecturerPage
      title="Import & Export Questions"
      subtitle="Import from documents or export your question banks"
      icon={LecturerIcons.ImportExport}
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div
          className={cn(
            "flex border-b",
            isDarkMode ? "border-slate-700" : "border-slate-200",
          )}
        >
          <button
            onClick={() => setActiveTab("import")}
            className={cn(
              "flex-1 px-6 py-4 font-semibold transition-all",
              activeTab === "import"
                ? isDarkMode
                  ? "text-orange-400 border-b-2 border-orange-400 bg-orange-500/10"
                  : "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                : isDarkMode
                  ? "text-slate-400 hover:bg-slate-800"
                  : "text-slate-600 hover:bg-slate-50",
            )}
          >
            <Upload className="inline-block w-5 h-5 mr-2" />
            Import
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={cn(
              "flex-1 px-6 py-4 font-semibold transition-all",
              activeTab === "export"
                ? isDarkMode
                  ? "text-orange-400 border-b-2 border-orange-400 bg-orange-500/10"
                  : "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                : isDarkMode
                  ? "text-slate-400 hover:bg-slate-800"
                  : "text-slate-600 hover:bg-slate-50",
            )}
          >
            <Download className="inline-block w-5 h-5 mr-2" />
            Export
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "import" ? (
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 transition-all",
                  dragActive
                    ? "border-orange-500 bg-orange-50"
                    : isDarkMode
                      ? "border-slate-700 hover:border-orange-500/50"
                      : "border-slate-300 hover:border-orange-400",
                )}
              >
                <div className="text-center">
                  {file ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-center gap-4">
                        {getFileIcon(file.type)}
                        <div className="text-left">
                          <p
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-white" : "text-slate-800",
                            )}
                          >
                            {file.name}
                          </p>
                          <p
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove File
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <Upload
                        className={cn(
                          "w-16 h-16 mx-auto mb-4",
                          isDarkMode ? "text-slate-600" : "text-slate-400",
                        )}
                      />
                      <p
                        className={cn(
                          "text-lg font-semibold mb-2",
                          isDarkMode ? "text-white" : "text-slate-700",
                        )}
                      >
                        Drop your file here or click to browse
                      </p>
                      <p
                        className={cn(
                          "text-sm mb-4",
                          isDarkMode ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        Supported formats: PDF, Word, Excel, Text
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileSelect(e.target.files[0])
                        }
                        accept=".pdf,.docx"
                        className="hidden"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
                      >
                        Select File
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* History Section - Highlighted */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-xl p-6 space-y-4 border-2 shadow-sm relative overflow-hidden",
                    isDarkMode
                      ? "bg-slate-800 border-indigo-500/30"
                      : "bg-indigo-50/50 border-indigo-100",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-1 h-full",
                      isDarkMode ? "bg-indigo-500" : "bg-indigo-400",
                    )}
                  />
                  <h3
                    className={cn(
                      "font-bold text-lg flex items-center gap-2",
                      isDarkMode ? "text-white" : "text-indigo-900",
                    )}
                  >
                    <Clock className="w-5 h-5 text-indigo-500" />
                    Previous Answers (Cache)
                  </h3>
                  <p
                    className={cn(
                      "text-sm mb-4",
                      isDarkMode ? "text-indigo-300" : "text-indigo-700",
                    )}
                  >
                    You can restore these previously generated questions
                    (Available for 30 mins)
                  </p>
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "p-4 rounded-lg flex items-center justify-between border transition-all hover:shadow-md",
                          isDarkMode
                            ? "bg-slate-900 border-slate-700 hover:border-indigo-500/50"
                            : "bg-white border-indigo-100 hover:border-indigo-300",
                        )}
                      >
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "font-semibold",
                              isDarkMode ? "text-white" : "text-slate-800",
                            )}
                          >
                            {item.filename ||
                              `Questions - ${new Date(item.timestamp || Date.now()).toLocaleTimeString()}`}
                          </span>
                          <span
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            {item.questions?.length || 0} questions
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setGeneratedQuestions(item.questions);
                            showToast(
                              "Restored questions from history",
                              "success",
                            );
                          }}
                          className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Import Configuration */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg p-6 space-y-4",
                    isDarkMode ? "bg-slate-800" : "bg-slate-50",
                  )}
                >
                  <h3
                    className={cn(
                      "font-semibold flex items-center gap-2",
                      isDarkMode ? "text-white" : "text-slate-800",
                    )}
                  >
                    <Settings className="w-5 h-5 text-orange-500" />
                    Import Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={cn(
                          "block text-sm font-semibold mb-2",
                          isDarkMode ? "text-slate-300" : "text-slate-700",
                        )}
                      >
                        Number of Questions
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={importConfig.numberOfQuestions}
                        onChange={(e) =>
                          setImportConfig((prev) => ({
                            ...prev,
                            numberOfQuestions: parseInt(e.target.value),
                          }))
                        }
                        className={cn(
                          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
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
                        Difficulty Level
                      </label>
                      <select
                        value={importConfig.difficulty}
                        onChange={(e) =>
                          setImportConfig((prev) => ({
                            ...prev,
                            difficulty: e.target.value,
                          }))
                        }
                        className={cn(
                          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                          isDarkMode
                            ? "bg-slate-900 border-slate-700 text-white"
                            : "bg-white border-slate-300 text-slate-900",
                        )}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={importConfig.includeExplanations}
                        onChange={(e) =>
                          setImportConfig((prev) => ({
                            ...prev,
                            includeExplanations: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-300" : "text-slate-700",
                        )}
                      >
                        Include explanations for answers
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={importConfig.randomizeOptions}
                        onChange={(e) =>
                          setImportConfig((prev) => ({
                            ...prev,
                            randomizeOptions: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-300" : "text-slate-700",
                        )}
                      >
                        Randomize answer options
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExtractText}
                      disabled={isExtracting}
                      className={cn(
                        "flex-1 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-500"
                          : "bg-blue-900 hover:bg-blue-800",
                      )}
                    >
                      {isExtracting ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          Extract Text
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerateQuestions}
                      disabled={isGenerating}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate Questions
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Preview */}
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "border rounded-lg p-6",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200",
                  )}
                >
                  <h3
                    className={cn(
                      "font-semibold mb-4",
                      isDarkMode ? "text-white" : "text-slate-800",
                    )}
                  >
                    Preview
                  </h3>

                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "rounded-xl p-6 mb-6 text-center border-2",
                        isDarkMode
                          ? "bg-slate-800 border-blue-500/50"
                          : "bg-white border-blue-100",
                      )}
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full animate-pulse"></div>
                          <Sparkles className="w-12 h-12 text-blue-500 animate-spin-slow" />
                        </div>
                        <h3
                          className={cn(
                            "text-xl font-bold",
                            isDarkMode ? "text-white" : "text-slate-800",
                          )}
                        >
                          AI is crafting your questions...
                        </h3>
                        <p
                          className={cn(
                            "text-sm max-w-sm mx-auto",
                            isDarkMode ? "text-slate-400" : "text-slate-500",
                          )}
                        >
                          This process involves deep analysis of your content.
                          For large documents, this might take a minute.
                        </p>

                        <div className="w-full max-w-md space-y-2">
                          <ProgressBar
                            value={85} // Simulated indefinite progress
                            color="gradient"
                            size="md"
                            className="w-full"
                            showLabel={false}
                          />
                          <p className="text-xs text-blue-500 font-medium animate-pulse">
                            Processing content & generating options...
                          </p>
                        </div>

                        <button
                          onClick={cancelGeneration}
                          className="mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
                        >
                          <X className="w-4 h-4" />
                          Cancel Request
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {extractedText && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isDarkMode ? "text-slate-300" : "text-slate-700",
                          )}
                        >
                          Extracted Text:
                        </p>
                      </div>
                      <div
                        className={cn(
                          "rounded-lg p-4 max-h-64 overflow-y-auto",
                          isDarkMode ? "bg-slate-900" : "bg-slate-50",
                        )}
                      >
                        <p
                          className={cn(
                            "text-sm whitespace-pre-wrap",
                            isDarkMode ? "text-slate-400" : "text-slate-600",
                          )}
                        >
                          {extractedText}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerateQuestions}
                        disabled={isGenerating}
                        className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Use AI to Generate Questions
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}

                  {generatedQuestions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isDarkMode ? "text-slate-300" : "text-slate-700",
                          )}
                        >
                          Generated Questions ({generatedQuestions.length}):
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleImportQuestions}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Import These Questions
                        </motion.button>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {generatedQuestions.map((q, index) => (
                          <div
                            key={index}
                            className={cn(
                              "rounded-lg p-4 border",
                              isDarkMode
                                ? "bg-slate-900 border-slate-700"
                                : "bg-slate-50 border-slate-200",
                            )}
                          >
                            <p
                              className={cn(
                                "font-medium mb-2",
                                isDarkMode ? "text-white" : "text-slate-800",
                              )}
                            >
                              Q{index + 1}. {q.question}
                            </p>
                            <div className="space-y-1 ml-4">
                              {q.options?.map((opt, i) => (
                                <p
                                  key={i}
                                  className={`text-sm ${opt === q.correctAnswer ? "text-green-600 font-semibold" : isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                >
                                  {String.fromCharCode(65 + i)}. {opt}
                                  {opt === q.correctAnswer && " ✓"}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Export Options */}
              <div
                className={cn(
                  "rounded-lg p-6 space-y-4",
                  isDarkMode ? "bg-slate-800" : "bg-slate-50",
                )}
              >
                <h3
                  className={cn(
                    "font-semibold flex items-center gap-2",
                    isDarkMode ? "text-white" : "text-slate-800",
                  )}
                >
                  <Settings
                    className={cn(
                      "w-5 h-5",
                      isDarkMode ? "text-blue-400" : "text-blue-900",
                    )}
                  />
                  Export Settings
                </h3>

                <div>
                  <label
                    className={cn(
                      "block text-sm font-semibold mb-2",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Export Format
                  </label>
                  <select
                    value={exportConfig.format}
                    onChange={(e) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        format: e.target.value,
                      }))
                    }
                    className={cn(
                      "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent",
                      isDarkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900",
                    )}
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="word">Word Document (.docx)</option>
                    <option value="excel">Excel Spreadsheet (.xlsx)</option>
                    <option value="json">JSON Format</option>
                    <option value="csv">CSV Format</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeAnswers}
                      onChange={(e) =>
                        setExportConfig((prev) => ({
                          ...prev,
                          includeAnswers: e.target.checked,
                        }))
                      }
                      className={cn(
                        "w-4 h-4 rounded focus:ring-blue-900",
                        isDarkMode ? "text-blue-400" : "text-blue-900",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Include correct answers
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportConfig.includeMetadata}
                      onChange={(e) =>
                        setExportConfig((prev) => ({
                          ...prev,
                          includeMetadata: e.target.checked,
                        }))
                      }
                      className={cn(
                        "w-4 h-4 rounded focus:ring-blue-900",
                        isDarkMode ? "text-blue-400" : "text-blue-900",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Include metadata (difficulty, marks, topics)
                    </span>
                  </label>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport("pdf")}
                  className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Export as PDF</p>
                  <p className="text-xs text-red-100 mt-1">
                    Formatted document with questions
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport("word")}
                  className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Export as Word</p>
                  <p className="text-xs text-blue-100 mt-1">
                    Editable .docx document
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport("excel")}
                  className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Export as Excel</p>
                  <p className="text-xs text-green-100 mt-1">
                    Spreadsheet format for analysis
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport("json")}
                  className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <File className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Export as JSON</p>
                  <p className="text-xs text-purple-100 mt-1">
                    Raw data for developers
                  </p>
                </motion.button>
              </div>

              {/* Info Box */}
              <div
                className={cn(
                  "border rounded-lg p-4 flex gap-3 mt-6",
                  isDarkMode
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-blue-50 border-blue-200",
                )}
              >
                <AlertCircle
                  className={cn(
                    "w-5 h-5 flex-shrink-0 mt-0.5",
                    isDarkMode ? "text-blue-400" : "text-blue-600",
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isDarkMode ? "text-blue-400" : "text-blue-900",
                    )}
                  >
                    Export Information
                  </p>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      isDarkMode ? "text-blue-300" : "text-blue-700",
                    )}
                  >
                    Your question bank will be exported with all selected
                    options. The file will be downloaded to your device
                    automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            "border-t p-4 flex justify-end",
            isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className={cn(
              "px-6 py-2 rounded-lg font-semibold transition-all",
              isDarkMode
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-300 text-slate-700 hover:bg-slate-400",
            )}
          >
            Close
          </motion.button>
        </div>

        {/* Import Modal */}
        <AnimatePresence>
          {showImportModal && (
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
                className={cn(
                  "rounded-xl p-6 w-full max-w-md border shadow-xl",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200",
                )}
              >
                <h2
                  className={cn(
                    "text-xl font-bold mb-4",
                    isDarkMode ? "text-white" : "text-slate-800",
                  )}
                >
                  Create Question Bank
                </h2>
                <div className="space-y-4">
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
                      value={importMeta.title}
                      onChange={(e) =>
                        setImportMeta((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900",
                      )}
                      placeholder="e.g., Imported Questions"
                    />
                  </div>
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Course *
                    </label>
                    <select
                      value={importMeta.courseId}
                      onChange={(e) =>
                        setImportMeta((prev) => ({
                          ...prev,
                          courseId: e.target.value,
                        }))
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900",
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
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-semibold mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Description
                    </label>
                    <textarea
                      value={importMeta.description}
                      onChange={(e) =>
                        setImportMeta((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white"
                          : "bg-white border-slate-300 text-slate-900",
                      )}
                      placeholder="Optional description"
                    />
                  </div>
                  {importError && (
                    <p className="text-red-500 text-sm">{importError}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmImport}
                      disabled={isCreatingBank}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isCreatingBank ? "Importing..." : "Import"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowImportModal(false)}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                        isDarkMode
                          ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          : "bg-gray-200 text-slate-900 hover:bg-gray-300",
                      )}
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
    </LecturerPage>
  );
};

export default ImportExport;
