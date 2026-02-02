import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Upload,
  Download,
  FileUp,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  X,
  FileSpreadsheet,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard, AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
// TODO: Add bulk upload hooks to user-store once backend is ready
// import {
//   useUploadBulkStudentsAction,
//   useUploadBulkLecturersAction,
// } from "../../../store/user-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

// Temporary mock hooks until backend integration is complete
const useUploadBulkStudentsAction = () => ({
  uploadBulkStudents: async (file) => {
    console.log("TODO: Implement uploadBulkStudents", file);
    return { success: 0, failed: 0, errors: [] };
  },
});

const useUploadBulkLecturersAction = () => ({
  uploadBulkLecturers: async (file) => {
    console.log("TODO: Implement uploadBulkLecturers", file);
    return { success: 0, failed: 0, errors: [] };
  },
});

const BulkUpload = () => {
  const { isDarkMode } = useThemeStore();
  const [uploadType, setUploadType] = useState("students");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const { uploadBulkStudents } = useUploadBulkStudentsAction();
  const { uploadBulkLecturers } = useUploadBulkLecturersAction();

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
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid Excel or CSV file");
      return;
    }
    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const result =
        uploadType === "students"
          ? await uploadBulkStudents(formData)
          : await uploadBulkLecturers(formData);

      setUploadResult({
        success: true,
        total: result.total || 0,
        created: result.created || 0,
        updated: result.updated || 0,
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
    // In production, this would download an actual template file
    const headers =
      uploadType === "students"
        ? ["fullname", "email", "matricNumber", "department", "level"]
        : ["fullname", "email", "staffId", "department", "faculty"];

    const csvContent =
      headers.join(",") +
      "\n" +
      "John Doe,john@example.com,STD001,Computer Science,100";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${uploadType}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      title="Bulk Upload"
      subtitle="Import students and lecturers from spreadsheet"
      icon={AdminIcons.Upload}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Upload Type Selection */}
        <div
          className={cn(
            "flex gap-4 p-2 rounded-2xl",
            isDarkMode ? "bg-slate-800/50" : "bg-gray-100",
          )}
        >
          <button
            onClick={() => {
              setUploadType("students");
              setSelectedFile(null);
              setUploadResult(null);
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all",
              uploadType === "students"
                ? "bg-orange-500 text-white"
                : isDarkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-700",
            )}
          >
            <Users className="w-5 h-5" />
            Students
          </button>
          <button
            onClick={() => {
              setUploadType("lecturers");
              setSelectedFile(null);
              setUploadResult(null);
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all",
              uploadType === "lecturers"
                ? "bg-orange-500 text-white"
                : isDarkMode
                  ? "text-slate-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-700",
            )}
          >
            <Users className="w-5 h-5" />
            Lecturers
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 transition-all text-center",
            dragActive
              ? "border-orange-500 bg-orange-500/10"
              : isDarkMode
                ? "border-slate-700 hover:border-slate-600"
                : "border-gray-200 hover:border-gray-300",
          )}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) =>
              e.target.files[0] && handleFileSelect(e.target.files[0])
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
              <FileUp className="w-8 h-8" />
            </div>

            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-green-500" />
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
                  Drop your file here, or click to browse
                </p>
                <p
                  className={cn(
                    "text-sm mt-2",
                    isDarkMode ? "text-slate-400" : "text-gray-500",
                  )}
                >
                  Supports CSV, XLS, and XLSX files
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upload Button */}
        {selectedFile && !uploadResult && (
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
            {uploading ? "Uploading..." : `Upload ${uploadType}`}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                          Total Rows
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
                        <p className="text-2xl font-bold text-orange-500">
                          {uploadResult.updated}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          Updated
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
                              Row {err.row}: {err.message}
                            </li>
                          ))}
                          {uploadResult.errors.length > 5 && (
                            <li className="text-red-400">
                              ...and {uploadResult.errors.length - 5} more
                              errors
                            </li>
                          )}
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
                  Upload Another File
                </button>
              </AdminCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <AdminCard title="Instructions" icon={FileText}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
                  "bg-blue-100 text-blue-600",
                )}
              >
                1
              </div>
              <p className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
                Download the template file using the button above
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
                  "bg-blue-100 text-blue-600",
                )}
              >
                2
              </div>
              <p className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
                Fill in the template with {uploadType} data (do not modify
                column headers)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
                  "bg-blue-100 text-blue-600",
                )}
              >
                3
              </div>
              <p className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
                Save as CSV or Excel format and upload using the drop zone above
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
};

export default BulkUpload;
