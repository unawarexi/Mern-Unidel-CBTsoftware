import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Upload,
  Download,
  FileUp,
  FileQuestion,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  BookOpen,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard, AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import { useBulkUploadQuestionsAction } from "../../../store/exam-store";
import { useGetAllCoursesAction } from "../../../store/course-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const QuestionUploads = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { courses = [], isLoading: loadingCourses } = useGetAllCoursesAction();
  const { bulkUpload: uploadBulkQuestions } = useBulkUploadQuestionsAction();

  const filteredCourses = courses.filter((course) => {
    if (!searchTerm) return true;
    return (
      course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/json",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".json")) {
      alert("Please upload a valid Excel, CSV, or JSON file");
      return;
    }
    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCourse) {
      alert("Please select a course and a file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("courseId", selectedCourse);

      const result = await uploadBulkQuestions(formData);

      setUploadResult({
        success: true,
        total: result.total || 0,
        created: result.created || 0,
        failed: result.failed || 0,
        errors: result.errors || [],
      });
    } catch (error) {
      setUploadResult({
        success: false,
        message: error.message || "Upload failed",
        errors: error.errors || [],
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        question: "What is the capital of France?",
        type: "multiple_choice",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
        marks: 2,
        explanation: "Paris is the capital and largest city of France.",
      },
      {
        question: "Water boils at 100 degrees Celsius at sea level.",
        type: "true_false",
        correctAnswer: "true",
        marks: 1,
      },
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedCourseData = courses.find((c) => c._id === selectedCourse);

  const actions = (
    <button
      onClick={handleDownloadTemplate}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
        isDarkMode
          ? "bg-slate-800 text-slate-300 hover:text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
      )}
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download Template</span>
    </button>
  );

  return (
    <AdminPage
      title="Question Uploads"
      subtitle="Import questions from spreadsheet or JSON"
      icon={AdminIcons.Question}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Course Selection */}
        <AdminCard title="Select Course" icon={BookOpen}>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-xl border transition-all",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
                )}
              />
            </div>

            {loadingCourses ? (
              <Skeleton
                height={50}
                borderRadius={12}
                baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                {filteredCourses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => setSelectedCourse(course._id)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all",
                      selectedCourse === course._id
                        ? "bg-orange-500 text-white border-orange-500"
                        : isDarkMode
                          ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white"
                          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900",
                    )}
                  >
                    <p className="font-medium text-sm truncate">
                      {course.courseCode}
                    </p>
                    <p
                      className={cn(
                        "text-xs truncate",
                        selectedCourse === course._id
                          ? "text-orange-100"
                          : isDarkMode
                            ? "text-slate-400"
                            : "text-gray-500",
                      )}
                    >
                      {course.courseTitle}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {selectedCourseData && (
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
                )}
              >
                <CheckCircle className="w-5 h-5 text-orange-500" />
                <span
                  className={isDarkMode ? "text-orange-400" : "text-orange-600"}
                >
                  Selected: <strong>{selectedCourseData.courseCode}</strong> -{" "}
                  {selectedCourseData.courseTitle}
                </span>
              </div>
            )}
          </div>
        </AdminCard>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 transition-all text-center",
            !selectedCourse && "opacity-50 pointer-events-none",
            dragActive
              ? "border-orange-500 bg-orange-500/10"
              : isDarkMode
                ? "border-slate-700 hover:border-slate-600"
                : "border-gray-200 hover:border-gray-300",
          )}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={(e) =>
              e.target.files[0] && handleFileSelect(e.target.files[0])
            }
            disabled={!selectedCourse}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="pointer-events-none">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                dragActive
                  ? "bg-orange-500/20 text-orange-500"
                  : isDarkMode
                    ? "bg-slate-800 text-slate-400"
                    : "bg-gray-100 text-gray-400",
              )}
            >
              <FileQuestion className="w-8 h-8" />
            </div>

            {!selectedCourse ? (
              <p className={isDarkMode ? "text-slate-500" : "text-gray-400"}>
                Please select a course first
              </p>
            ) : selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <span
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {selectedFile.name}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-400" : "text-gray-500",
                  )}
                >
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <>
                <p
                  className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Drop your questions file here, or click to browse
                </p>
                <p
                  className={cn(
                    "text-sm mt-2",
                    isDarkMode ? "text-slate-400" : "text-gray-500",
                  )}
                >
                  Supports CSV, Excel, and JSON files
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upload Button */}
        {selectedFile && selectedCourse && !uploadResult && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all",
              "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50",
            )}
          >
            {uploading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {uploading ? "Uploading..." : "Upload Questions"}
          </button>
        )}

        {/* Upload Results */}
        <AnimatePresence>
          {uploadResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminCard
                title={
                  uploadResult.success ? "Upload Complete" : "Upload Failed"
                }
                icon={uploadResult.success ? CheckCircle : XCircle}
              >
                {uploadResult.success ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className={cn(
                          "p-4 rounded-xl text-center",
                          isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                        )}
                      >
                        <p className="text-2xl font-bold text-blue-500">
                          {uploadResult.total}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          Total Questions
                        </p>
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-xl text-center",
                          isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                        )}
                      >
                        <p className="text-2xl font-bold text-green-500">
                          {uploadResult.created}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          Created
                        </p>
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-xl text-center",
                          isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                        )}
                      >
                        <p className="text-2xl font-bold text-red-500">
                          {uploadResult.failed}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          Failed
                        </p>
                      </div>
                    </div>

                    {uploadResult.errors.length > 0 && (
                      <div
                        className={cn(
                          "p-4 rounded-xl",
                          isDarkMode ? "bg-red-500/10" : "bg-red-50",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-500">
                            Errors
                          </span>
                        </div>
                        <ul className="space-y-1 ml-7 text-sm">
                          {uploadResult.errors.slice(0, 5).map((err, idx) => (
                            <li key={idx} className="text-red-500">
                              Question {err.index + 1}: {err.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "p-4 rounded-xl",
                      isDarkMode ? "bg-red-500/10" : "bg-red-50",
                    )}
                  >
                    <p className="text-red-500">{uploadResult.message}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadResult(null);
                  }}
                  className={cn(
                    "mt-4 w-full py-2 rounded-xl font-medium transition-colors",
                    isDarkMode
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  Upload More Questions
                </button>
              </AdminCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Format Guide */}
        <AdminCard title="JSON Format Guide" icon={FileText}>
          <pre
            className={cn(
              "p-4 rounded-xl text-sm overflow-x-auto",
              isDarkMode
                ? "bg-slate-800/50 text-slate-300"
                : "bg-gray-50 text-gray-700",
            )}
          >
            {`[
  {
    "question": "Your question text",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "marks": 2,
    "explanation": "Optional explanation"
  }
]`}
          </pre>
        </AdminCard>
      </div>
    </AdminPage>
  );
};

export default QuestionUploads;
