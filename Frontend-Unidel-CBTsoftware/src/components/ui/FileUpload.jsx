import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "../../core/lib/cn";
import { motion, AnimatePresence } from "framer-motion";

const FileUpload = ({
  onFileSelect,
  selectedFile,
  accept = {
    "image/*": [".jpeg", ".png", ".jpg"],
    "application/pdf": [".pdf"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  label = "Click or drag file to upload",
  subLabel = "PDF, JPG, PNG (max 5MB)",
  className,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  const getPreview = (file) => {
    if (!file) return null;
    // Handle File object
    if (file instanceof File) {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    }
    // Handle existing URL (string)
    if (typeof file === "string") return file;
    // Handle object with url property
    if (file.url) return file.url;
    return null;
  };

  const isImage = (file) => {
    if (!file) return false;
    if (file instanceof File) return file.type.startsWith("image/");
    if (typeof file === "string")
      return file.match(/\.(jpeg|jpg|gif|png)$/) != null;
    if (file.url) return file.url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    return false;
  };

  const previewUrl = getPreview(selectedFile);
  const isImg = isImage(selectedFile);

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[160px] group overflow-hidden",
          isDragActive
            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
            : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-orange-400 hover:bg-orange-50",
          fileRejections.length > 0 &&
            "border-red-500 bg-red-50 dark:bg-red-900/10",
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full flex flex-col items-center justify-center z-10"
            >
              {isImg && previewUrl ? (
                <div className="relative w-32 h-32 mb-2 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText className="w-10 h-10" />
                </div>
              )}

              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                {selectedFile instanceof File
                  ? selectedFile.name
                  : "File Attached"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(selectedFile instanceof File
                  ? (selectedFile.size / 1024 / 1024).toFixed(2)
                  : "0") + " MB"}
              </p>

              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-20"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 z-10"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive ? "Drop file here" : label}
                </p>
                <p className="text-xs text-gray-400 mt-1">{subLabel}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rejection Errors */}
        {fileRejections.length > 0 && (
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 py-1 px-2 rounded inline-block">
              {fileRejections[0].errors[0].message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
