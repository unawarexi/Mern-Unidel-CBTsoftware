import React, { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  BookOpen,
  FileText,
  X,
  Info,
  FileUp,
  Sparkles,
  Send,
} from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../store/user-store";
import { useUploadCourseMaterialAction } from "../../../store/course-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";
import { motion, AnimatePresence } from "framer-motion";

const UploadMaterials = () => {
  const { courses = [] } = useGetLecturerCoursesAction();
  const { uploadMaterial, isLoading: isUploading } =
    useUploadCourseMaterialAction();
  const { isDarkMode } = useThemeStore();

  const [formData, setFormData] = useState({
    courseId: "",
    description: "",
    category: "lecture-note",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.courseId || !file) {
      setError(
        "Please select a target course and provide a valid pedagogical resource.",
      );
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("courseId", formData.courseId);
      uploadData.append("description", formData.description);
      uploadData.append("category", formData.category);
      uploadData.append("material", file);

      await uploadMaterial(uploadData);
      setSuccess(true);
      setFile(null);
      setFormData({ courseId: "", description: "", category: "lecture-note" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "An unexpected error occurred during resource transmission.",
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <LecturerPage
      title="Resource Deployment"
      subtitle="Publish academic materials to your digital course repository for student synthesis"
      icon={LecturerIcons.Upload}
    >
      <div className="max-w-4xl mx-auto pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className={cn(
              "p-8 rounded-3xl border-2 relative overflow-hidden",
              isDarkMode
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-white border-slate-100 shadow-xl shadow-slate-200/50",
            )}
          >
            <div className="relative z-10 flex items-center gap-6">
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                  isDarkMode
                    ? "bg-slate-900/50 text-orange-400"
                    : "bg-orange-50 text-orange-600",
                )}
              >
                <FileUp className="w-8 h-8" />
              </div>
              <div>
                <h2
                  className={cn(
                    "text-2xl font-black italic",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  Digital Asset Distribution
                </h2>
                <p
                  className={cn(
                    "text-sm font-bold opacity-60 max-w-md",
                    isDarkMode ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  Systematically index and upload scholarly artifacts to ensure
                  universal student accessibility.
                </p>
              </div>
            </div>
            <div
              className={cn(
                "absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-10",
                isDarkMode ? "bg-orange-500" : "bg-orange-400",
              )}
            />
          </motion.div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Selection */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest ml-1",
                    isDarkMode ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  Target Academic Course
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    className={cn(
                      "w-full pl-12 pr-4 py-4 border-2 rounded-2xl appearance-none font-bold transition-all focus:outline-none focus:ring-4",
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:ring-orange-500/10 focus:border-orange-500/50"
                        : "bg-slate-50 border-slate-100 text-slate-900 focus:ring-orange-500/10 focus:border-orange-200",
                    )}
                  >
                    <option value="">Select registry entry...</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseCode} - {course.courseTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Category Selection */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest ml-1",
                    isDarkMode ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  Resource Classification
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={cn(
                      "w-full pl-12 pr-4 py-4 border-2 rounded-2xl appearance-none font-bold transition-all focus:outline-none focus:ring-4",
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:ring-orange-500/10 focus:border-orange-500/50"
                        : "bg-slate-50 border-slate-100 text-slate-900 focus:ring-orange-500/10 focus:border-orange-200",
                    )}
                  >
                    <option value="lecture-note">
                      Lecture Syllabi / Notes
                    </option>
                    <option value="assignment">Scholarly Assignments</option>
                    <option value="reading-material">
                      Supplementary Readings
                    </option>
                    <option value="other">General Academic Assets</option>
                  </select>
                </div>
              </motion.div>
            </div>

            {/* Description Area */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest ml-1",
                  isDarkMode ? "text-slate-500" : "text-slate-400",
                )}
              >
                Pedagogical context (Optional)
              </label>
              <textarea
                placeholder="Briefly describe the purpose of this resource..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className={cn(
                  "w-full p-6 border-2 rounded-3xl transition-all focus:outline-none focus:ring-4 font-medium resize-none",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:ring-orange-500/10 focus:border-orange-500/50"
                    : "bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 focus:ring-orange-500/10 focus:border-orange-200",
                )}
              />
            </motion.div>

            {/* File Dropzone */}
            <motion.div variants={itemVariants}>
              <label
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest ml-1 mb-2 block",
                  isDarkMode ? "text-slate-500" : "text-slate-400",
                )}
              >
                Binary Payload
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative group cursor-pointer border-4 border-dashed rounded-3xl p-12 text-center transition-all overflow-hidden",
                  file
                    ? isDarkMode
                      ? "bg-orange-500/10 border-orange-500/30"
                      : "bg-orange-50 border-orange-200"
                    : isDarkMode
                      ? "bg-slate-800/20 border-slate-700/50 hover:bg-slate-800/40 hover:border-orange-500/30"
                      : "bg-slate-50 border-slate-200 hover:bg-white hover:border-orange-300",
                )}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file-selected"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={cn(
                          "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6",
                          isDarkMode
                            ? "bg-slate-900/50 text-orange-400"
                            : "bg-white text-orange-600 shadow-xl",
                        )}
                      >
                        <FileText className="w-10 h-10" />
                      </div>
                      <p
                        className={cn(
                          "text-lg font-black break-all",
                          isDarkMode ? "text-white" : "text-slate-900",
                        )}
                      >
                        {file.name}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-bold mt-1 opacity-60",
                          isDarkMode ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for
                        ingestion
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="mt-4 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-file"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div
                        className={cn(
                          "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2",
                          isDarkMode
                            ? "bg-slate-900/50 text-slate-500"
                            : "bg-white text-slate-300 shadow-lg",
                        )}
                      >
                        <UploadCloud className="w-10 h-10" />
                      </div>
                      <h3
                        className={cn(
                          "text-xl font-black mb-2",
                          isDarkMode ? "text-white" : "text-slate-900",
                        )}
                      >
                        Select Academic Artifact
                      </h3>
                      <p
                        className={cn(
                          "text-sm font-bold opacity-60",
                          isDarkMode ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        Click to browse local storage or drag-and-drop file
                        here.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Ingestion Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border-2 border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 font-black text-sm"
                >
                  <AlertCircle size={20} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center gap-3 font-black text-sm"
                >
                  <CheckCircle size={20} className="shrink-0" />
                  Resource ingestion successful. Repository data has been
                  updated.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submission Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className={cn(
                  "w-full group relative overflow-hidden py-5 rounded-3xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3",
                  isUploading
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700 shadow-2xl shadow-orange-600/30",
                )}
              >
                {isUploading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Transmitting Academic Core...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <span>Initiate Deployment</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-6">
                <Info size={14} className="text-slate-500" />
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest text-slate-500",
                  )}
                >
                  Standard protocols for academic resource distribution are
                  applied by default.
                </p>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default UploadMaterials;
