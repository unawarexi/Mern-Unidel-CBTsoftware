import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, FileText } from "lucide-react";
import ProgressBar from "../../../components/ui/ProgressBar";
import { cn } from "../../../core/lib/cn";
import useThemeStore from "../../../store/theme-store";

const AIIndication = ({ isGenerating, isExtracting, onCancel }) => {
  const { isDarkMode } = useThemeStore();
  const isActive = isGenerating || isExtracting;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "rounded-xl p-8 text-center border-2 shadow-2xl max-w-md w-full mx-4 relative",
              isDarkMode
                ? "bg-slate-800 border-blue-500/50"
                : "bg-white border-blue-100",
            )}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full animate-pulse"></div>
                {isExtracting ? (
                  <FileText className="w-16 h-16 text-blue-500 animate-pulse" />
                ) : (
                  <Sparkles className="w-16 h-16 text-blue-500 animate-spin-slow" />
                )}
              </div>

              <div className="space-y-2">
                <h3
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-slate-800",
                  )}
                >
                  {isExtracting
                    ? "Extracting Text..."
                    : "AI is crafting your questions..."}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  {isExtracting
                    ? "We are processing your document to extract editable text."
                    : "This process involves deep analysis of your content."}
                  <br />
                  For large documents, this might take a minute.
                </p>
              </div>

              <div className="w-full space-y-3">
                <ProgressBar
                  value={85} // Simulated indefinite progress
                  color="gradient"
                  size="lg"
                  className="w-full"
                  showLabel={false}
                />
                <p className="text-xs text-blue-500 font-medium animate-pulse">
                  {isExtracting
                    ? "Parsing document structure..."
                    : "Processing content & generating options..."}
                </p>
              </div>

              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
                >
                  <X className="w-4 h-4" />
                  Cancel Request
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIIndication;
