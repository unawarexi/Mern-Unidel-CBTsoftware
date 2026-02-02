import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  FileBox,
  FileCheck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateReport } from "../hooks/useReport";
import useThemeStore from "../store/theme-store";
import { cn } from "../core/lib/cn";

/**
 * Reusable Export Button with Dropdown
 * @param {string} type - Report type (exam-results, analytics, etc.)
 * @param {string} title - Report title
 * @param {string} contextId - Associated ID (examId, courseId, etc.)
 * @param {Object} filters - Search/Filter criteria
 * @param {string} className - Extra styling
 */
const ExportButton = ({ type, title, contextId, filters = {}, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDarkMode } = useThemeStore();
  const { mutate: generateReport, isLoading } = useGenerateReport();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (format) => {
    generateReport(
      {
        type,
        title,
        contextId,
        filters,
        formats: [format],
      },
      {
        onSuccess: (data) => {
          setIsOpen(false);
          // Automatically trigger download if URL is provided
          const downloadUrl =
            data.report?.links?.[format] || data.links?.[format];

          if (downloadUrl) {
            // Add fl_attachment to Cloudinary URL for raw files to force download
            const finalUrl = downloadUrl.includes("/raw/upload/")
              ? downloadUrl.replace(
                  "/raw/upload/",
                  "/raw/upload/fl_attachment/",
                )
              : downloadUrl;

            // Trigger download using a hidden anchor tag
            const link = document.createElement("a");
            link.href = finalUrl;
            link.setAttribute("download", `${title || "report"}.${format}`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        },
      },
    );
  };

  const options = [
    {
      label: "PDF Document",
      format: "pdf",
      icon: FileText,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Excel Sheet",
      format: "xlsx",
      icon: FileSpreadsheet,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "CSV File",
      format: "csv",
      icon: FileBox,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Word Doc",
      format: "docx",
      icon: FileCheck,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all border-2",
          isLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:scale-105 active:scale-95",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white hover:border-orange-500/50"
            : "bg-white border-slate-100 text-slate-900 shadow-lg shadow-slate-200/50 hover:border-orange-500/30",
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
        ) : (
          <Download className="w-4 h-4 text-orange-500" />
        )}
        <span>{isLoading ? "Generating..." : "Export"}</span>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              "absolute right-0 mt-2 w-56 rounded-2xl border-2 p-2 z-[9999] overflow-hidden",
              isDarkMode
                ? "bg-slate-900 border-slate-700 shadow-2xl"
                : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
            )}
          >
            <div className="grid gap-1">
              {options.map((opt) => (
                <button
                  key={opt.format}
                  onClick={() => handleExport(opt.format)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-bold transition-colors group text-left",
                    isDarkMode
                      ? "hover:bg-slate-800 text-slate-300 hover:text-white"
                      : "hover:bg-slate-50 text-slate-600 hover:text-slate-900",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isDarkMode ? "bg-slate-800" : opt.bg,
                    )}
                  >
                    <opt.icon className={cn("w-4 h-4", opt.color)} />
                  </div>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton;
