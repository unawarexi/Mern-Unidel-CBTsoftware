import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  FileText,
  File,
  CheckCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Export = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedExam, setSelectedExam] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(null);

  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();

  const exportFormats = [
    {
      id: "excel",
      name: "Excel Spreadsheet",
      description: "Export results as .xlsx file",
      icon: FileSpreadsheet,
      ext: ".xlsx",
      color: "text-emerald-500",
      bg: "bg-emerald-500/20",
    },
    {
      id: "csv",
      name: "CSV File",
      description: "Export as comma-separated values",
      icon: FileText,
      ext: ".csv",
      color: "text-blue-500",
      bg: "bg-blue-500/20",
    },
    {
      id: "pdf",
      name: "PDF Report",
      description: "Generate formatted PDF report",
      icon: File,
      ext: ".pdf",
      color: "text-red-500",
      bg: "bg-red-500/20",
    },
  ];

  const handleExport = async (format) => {
    if (!selectedExam) return;

    setExporting(format.id);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setExporting(null);
    setExportSuccess(format.id);
    setTimeout(() => setExportSuccess(null), 3000);
  };

  return (
    <LecturerPage
      title="Export Reports"
      subtitle="Download exam results and reports"
      icon={LecturerIcons.Download}
    >
      <div className="space-y-6">
        {/* Exam Selector */}
        <div
          className={cn(
            "p-4 rounded-2xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <label
            className={cn(
              "text-sm font-medium mb-2 block",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Select Exam to Export
          </label>
          <div className="relative">
            <select
              value={selectedExam?._id || ""}
              onChange={(e) =>
                setSelectedExam(
                  exams.find((ex) => ex._id === e.target.value) || null,
                )
              }
              className={cn(
                "w-full px-4 py-3 rounded-xl border appearance-none outline-none",
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-200 text-gray-900",
              )}
            >
              <option value="">-- Select an exam --</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.courseId?.courseCode} - {exam.courseId?.courseTitle}
                </option>
              ))}
            </select>
            <ChevronDown
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
          </div>
        </div>

        {/* Export Options */}
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3
              className={cn(
                "font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Export Format
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportFormats.map((format) => (
                <motion.div
                  key={format.id}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "p-6 rounded-2xl border cursor-pointer transition-all",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 hover:border-blue-500"
                      : "bg-white border-gray-100 hover:border-blue-400",
                    exporting === format.id && "border-blue-500 shadow-lg",
                  )}
                  onClick={() => handleExport(format)}
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                      format.bg,
                    )}
                  >
                    {exportSuccess === format.id ? (
                      <CheckCircle className="w-7 h-7 text-emerald-500" />
                    ) : exporting === format.id ? (
                      <RefreshCw
                        className={cn("w-7 h-7 animate-spin", format.color)}
                      />
                    ) : (
                      <format.icon className={cn("w-7 h-7", format.color)} />
                    )}
                  </div>
                  <h4
                    className={cn(
                      "font-semibold mb-1",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {format.name}
                  </h4>
                  <p
                    className={cn(
                      "text-sm mb-4",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {format.description}
                  </p>
                  <button
                    disabled={exporting !== null}
                    className={cn(
                      "w-full py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                      exportSuccess === format.id
                        ? "bg-emerald-500 text-white"
                        : exporting === format.id
                          ? isDarkMode
                            ? "bg-slate-700 text-slate-400"
                            : "bg-gray-100 text-gray-400"
                          : "bg-blue-600 text-white hover:bg-blue-700",
                    )}
                  >
                    {exportSuccess === format.id ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Exported!
                      </>
                    ) : exporting === format.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export {format.ext}
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Export History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Recent Exports
          </h3>
          <div
            className={cn(
              "text-center py-8",
              isDarkMode ? "text-slate-500" : "text-gray-500",
            )}
          >
            <Download className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent exports</p>
            <p className="text-sm mt-1">Your export history will appear here</p>
          </div>
        </motion.div>

        {!selectedExam && !examsLoading && (
          <div
            className={cn(
              "text-center py-20 rounded-2xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <Download className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Select an exam to export</p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Export;
