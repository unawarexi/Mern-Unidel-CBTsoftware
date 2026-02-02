import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import useThemeStore from "../store/theme-store";
import { cn } from "../core/lib/cn";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isLoading = false,
}) => {
  const { isDarkMode } = useThemeStore();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200 border",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-100",
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-xl",
                isDarkMode ? "bg-red-500/10" : "bg-red-50",
              )}
            >
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3
              className={cn(
                "text-lg font-bold",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "p-1 rounded-lg transition-colors disabled:opacity-50",
              isDarkMode
                ? "text-slate-500 hover:text-white"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          {itemName ? (
            <p
              className={cn(
                "text-sm leading-relaxed",
                isDarkMode ? "text-slate-400" : "text-slate-600",
              )}
            >
              {message.split(itemName)[0]}
              <span
                className={cn(
                  "font-bold mx-1",
                  isDarkMode ? "text-white" : "text-slate-900",
                )}
              >
                "{itemName}"
              </span>
              {message.split(itemName)[1] || "? This action cannot be undone."}
            </p>
          ) : (
            <p
              className={cn(
                "text-sm leading-relaxed",
                isDarkMode ? "text-slate-400" : "text-slate-600",
              )}
            >
              {message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              isDarkMode
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
