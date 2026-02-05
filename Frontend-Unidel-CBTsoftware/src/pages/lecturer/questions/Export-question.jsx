import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  File,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { cn } from "../../../core/lib/cn";
import useThemeStore from "../../../store/theme-store";
import useExamStore from "../../../store/exam-store";
import { useGetLecturerQuestionBanks } from "../../../hooks/useExam";
import { useGenerateReport } from "../../../hooks/useReport";

const ExportQuestion = () => {
  const { isDarkMode } = useThemeStore();
  const { showToast } = useExamStore();
  const { data: questionBanksData, isLoading: isLoadingBanks } =
    useGetLecturerQuestionBanks();
  const { mutateAsync: generateReport, isPending: isGenerating } =
    useGenerateReport();

  const [selectedBank, setSelectedBank] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);

  const [exportConfig, setExportConfig] = useState({
    includeAnswers: true,
    includeMetadata: true,
  });

  const handleExportClick = (format) => {
    setSelectedFormat(format);
    setShowModal(true);
  };

  const handleConfirmExport = async () => {
    if (!selectedBank) {
      showToast("Please select a question bank", "error");
      return;
    }

    try {
      const result = await generateReport({
        type: "question-bank-export",
        contextId: selectedBank,
        formats: [selectedFormat],
        filters: { ...exportConfig },
      });

      // Handle download
      if (result.links && result.links[selectedFormat]) {
        window.open(result.links[selectedFormat], "_blank");
        showToast("Export download started", "success");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-xl p-6 border-2",
          isDarkMode
            ? "bg-slate-800 border-blue-500/30"
            : "bg-blue-50/50 border-blue-100",
        )}
      >
        <h3
          className={cn(
            "font-semibold flex items-center gap-2 mb-4",
            isDarkMode ? "text-white" : "text-blue-900",
          )}
        >
          <FileText
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

        <div className="space-y-2 mt-4">
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
          onClick={() => handleExportClick("pdf")}
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
          onClick={() => handleExportClick("word")}
          className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FileText className="w-8 h-8 mx-auto mb-2" />
          <p className="font-semibold">Export as Word</p>
          <p className="text-xs text-blue-100 mt-1">Editable .docx document</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExportClick("excel")}
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
          onClick={() => handleExportClick("json")}
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
            Your question bank will be exported with all selected options. The
            file will be downloaded to your device automatically.
          </p>
        </div>
      </div>
      {/* Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "w-full max-w-md rounded-2xl p-6 shadow-2xl",
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white",
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={cn(
                  "text-xl font-bold",
                  isDarkMode ? "text-white" : "text-slate-900",
                )}
              >
                Select Question Bank
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X
                  className={cn(
                    "w-5 h-5",
                    isDarkMode ? "text-slate-400" : "text-slate-500",
                  )}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    isDarkMode ? "text-slate-300" : "text-slate-700",
                  )}
                >
                  Choose a Question Bank to Export as{" "}
                  {selectedFormat?.toUpperCase()}
                </label>
                {isLoadingBanks ? (
                  <div className="animate-pulse h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {questionBanksData?.questionBanks?.map((bank) => (
                      <button
                        key={bank._id}
                        onClick={() => setSelectedBank(bank._id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center group",
                          selectedBank === bank._id
                            ? isDarkMode
                              ? "bg-purple-900/20 border-purple-500 text-purple-300"
                              : "bg-purple-50 border-purple-500 text-purple-700"
                            : isDarkMode
                              ? "border-slate-700 hover:bg-slate-700 text-slate-300"
                              : "border-slate-200 hover:bg-slate-50 text-slate-700",
                        )}
                      >
                        <div className="truncate">
                          <p className="font-medium truncate">{bank.title}</p>
                          <p className="text-xs opacity-70">
                            {bank.courseId?.courseCode} •{" "}
                            {bank.questions?.length || 0} questions
                          </p>
                        </div>
                        {selectedBank === bank._id && (
                          <Check className="w-4 h-4 text-purple-500" />
                        )}
                      </button>
                    ))}
                    {questionBanksData?.questionBanks?.length === 0 && (
                      <p className="text-center text-sm text-slate-500 py-4">
                        No question banks found.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowModal(false)}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-lg border font-medium transition-colors",
                    isDarkMode
                      ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50",
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmExport}
                  disabled={!selectedBank || isGenerating}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Export File
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExportQuestion;
