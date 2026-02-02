import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Download,
  Search,
  FileText,
  Image as ImageIcon,
  File,
  Video,
  Music,
  Eye,
  ChevronDown,
  RefreshCw,
  Box,
  Binary,
  Layers,
  Archive,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Attachments = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const { exams = [], isLoading } = useGetLecturerExamsAction();

  // Collect attachments from selected exam with useMemo for performance
  const attachments = useMemo(() => {
    if (!selectedExam) return [];

    const list = [];

    // Exam-level attachments
    if (selectedExam.attachments?.length > 0) {
      selectedExam.attachments.forEach((att) => {
        list.push({
          ...att,
          source: "Core Exam",
          examTitle: `${selectedExam.courseId?.courseCode} - ${selectedExam.courseId?.courseTitle}`,
        });
      });
    }

    // Question-level attachments
    if (selectedExam.questions?.length > 0) {
      selectedExam.questions.forEach((q, idx) => {
        if (q.attachments?.length > 0) {
          q.attachments.forEach((att) => {
            list.push({
              ...att,
              source: `Unit ${idx + 1}`,
              examTitle: `${selectedExam.courseId?.courseCode}`,
            });
          });
        }
      });
    }

    return list;
  }, [selectedExam]);

  // Filter attachments
  const filteredAttachments = useMemo(() => {
    return attachments.filter((att) => {
      const matchesSearch =
        att.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.source?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "image" && att.fileType?.startsWith("image")) ||
        (typeFilter === "document" &&
          (att.fileType?.includes("pdf") || att.fileType?.includes("doc"))) ||
        (typeFilter === "video" && att.fileType?.startsWith("video")) ||
        (typeFilter === "audio" && att.fileType?.startsWith("audio"));
      return matchesSearch && matchesType;
    });
  }, [attachments, searchQuery, typeFilter]);

  const getFileConfig = (fileType) => {
    if (fileType?.startsWith("image"))
      return { icon: ImageIcon, color: "emerald", label: "Image" };
    if (fileType?.startsWith("video"))
      return { icon: Video, color: "purple", label: "Video" };
    if (fileType?.startsWith("audio"))
      return { icon: Music, color: "pink", label: "Audio" };
    if (fileType?.includes("pdf") || fileType?.includes("doc"))
      return { icon: FileText, color: "blue", label: "Document" };
    return { icon: File, color: "slate", label: "Generic" };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <LecturerPage
      title="Asset Registry"
      subtitle="Comprehensive indexing and management of examination-grade digital materials"
      icon={LecturerIcons.Upload}
    >
      <div className="max-w-7xl mx-auto pb-12 space-y-8">
        {/* Exam Selection Terminal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-8 rounded-[2.5rem] border-2 relative overflow-hidden",
            isDarkMode
              ? "bg-slate-800/40 border-slate-700/50"
              : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                  isDarkMode
                    ? "bg-slate-900/50 text-orange-400"
                    : "bg-orange-50 text-orange-600",
                )}
              >
                <Archive className="w-7 h-7" />
              </div>
              <div>
                <h2
                  className={cn(
                    "text-xl font-black italic",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  Examination Ingestion
                </h2>
                <p
                  className={cn(
                    "text-xs font-bold opacity-60 uppercase tracking-widest",
                    isDarkMode ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  Select core registry unit to extract assets
                </p>
              </div>
            </div>

            <div className="relative min-w-[300px]">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={selectedExam?._id || ""}
                onChange={(e) => {
                  const exam = exams.find((ex) => ex._id === e.target.value);
                  setSelectedExam(exam || null);
                }}
                className={cn(
                  "w-full pl-12 pr-10 py-4 rounded-2xl border-2 appearance-none font-black text-sm transition-all focus:outline-none focus:ring-4",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-white focus:ring-orange-500/10 focus:border-orange-500/50"
                    : "bg-slate-50 border-slate-100 text-slate-900 focus:ring-orange-500/10 focus:border-orange-200 shadow-inner",
                )}
              >
                <option value="">Query Registry...</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.courseId?.courseCode} - {exam.courseId?.courseTitle}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div
            className={cn(
              "absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-10",
              isDarkMode ? "bg-orange-500" : "bg-orange-400",
            )}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedExam ? (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Controls Terminal */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search binary index..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full pl-16 pr-6 py-5 rounded-3xl border-2 font-black transition-all focus:outline-none focus:ring-4",
                      isDarkMode
                        ? "bg-slate-800/40 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-500/10 focus:border-blue-500/50"
                        : "bg-white border-slate-100 text-slate-900 shadow-xl shadow-slate-200/50 focus:ring-blue-500/10 focus:border-blue-200",
                    )}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className={cn(
                        "pl-12 pr-10 py-5 rounded-3xl border-2 font-black text-sm transition-all focus:outline-none appearance-none min-w-[180px]",
                        isDarkMode
                          ? "bg-slate-800/40 border-slate-700 text-white"
                          : "bg-white border-slate-100 text-slate-900 shadow-xl shadow-slate-200/50",
                      )}
                    >
                      <option value="all">Universal View</option>
                      <option value="image">Visual Assets</option>
                      <option value="document">Scholarly Texts</option>
                      <option value="video">Motion Media</option>
                      <option value="audio">Sonic Archives</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Binary Count",
                    value: attachments.length,
                    color: "blue",
                  },
                  {
                    label: "Visual Elements",
                    value: attachments.filter((a) =>
                      a.fileType?.startsWith("image"),
                    ).length,
                    color: "emerald",
                  },
                  {
                    label: "Academic Documents",
                    value: attachments.filter(
                      (a) =>
                        a.fileType?.includes("pdf") ||
                        a.fileType?.includes("doc"),
                    ).length,
                    color: "purple",
                  },
                  {
                    label: "Auxiliary Assets",
                    value: attachments.filter(
                      (a) =>
                        !a.fileType?.startsWith("image") &&
                        !a.fileType?.includes("pdf") &&
                        !a.fileType?.includes("doc"),
                    ).length,
                    color: "orange",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className={cn(
                      "p-5 rounded-3xl border-2 transition-all relative group overflow-hidden",
                      isDarkMode
                        ? "bg-slate-800/20 border-slate-700/50"
                        : "bg-slate-50/50 border-slate-100",
                    )}
                  >
                    <p
                      className={cn(
                        "text-2xl font-black mb-1",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest opacity-60",
                        isDarkMode ? "text-slate-500" : "text-slate-400",
                      )}
                    >
                      {stat.label}
                    </p>
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-16 h-16 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity",
                        `bg-${stat.color}-500`,
                      )}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Assets Index Grid */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredAttachments.map((att, idx) => {
                    const config = getFileConfig(att.fileType);
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -5 }}
                        className={cn(
                          "p-6 rounded-[2rem] border-2 group transition-all relative overflow-hidden",
                          isDarkMode
                            ? "bg-slate-800/40 border-slate-700/50 hover:border-blue-500/30"
                            : "bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-blue-200",
                        )}
                      >
                        <div className="flex items-start gap-4 mb-6">
                          <div
                            className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform",
                              isDarkMode
                                ? `bg-slate-900/50 text-${config.color}-400`
                                : `bg-${config.color}-50 text-${config.color}-600`,
                            )}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={cn(
                                "font-black text-lg truncate mb-0.5",
                                isDarkMode ? "text-white" : "text-slate-900",
                              )}
                            >
                              {att.fileName || "Unnamed Segment"}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Binary size={10} className="text-slate-500" />
                              <span
                                className={cn(
                                  "text-[10px] font-black uppercase tracking-widest text-slate-500",
                                )}
                              >
                                {att.source} • {config.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {att.url && (
                            <>
                              <motion.a
                                whileTap={{ scale: 0.95 }}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black transition-all",
                                  isDarkMode
                                    ? "bg-slate-700 text-white hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                                )}
                              >
                                <Eye className="w-4 h-4" />
                                ANALYZE
                              </motion.a>
                              <motion.a
                                whileTap={{ scale: 0.95 }}
                                href={att.url}
                                download
                                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                              >
                                <Download className="w-5 h-5" />
                              </motion.a>
                            </>
                          )}
                        </div>
                        {/* Subtle background number */}
                        <div
                          className={cn(
                            "absolute -bottom-6 -right-2 text-6xl font-black opacity-[0.03] pointer-events-none select-none",
                            isDarkMode ? "text-white" : "text-black",
                          )}
                        >
                          #{idx + 1}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredAttachments.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div
                      className={cn(
                        "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6",
                        isDarkMode
                          ? "bg-slate-800 text-slate-700"
                          : "bg-slate-50 text-slate-200",
                      )}
                    >
                      <Search className="w-10 h-10" />
                    </div>
                    <p
                      className={cn(
                        "text-xl font-black italic",
                        isDarkMode ? "text-slate-500" : "text-slate-300",
                      )}
                    >
                      Binary lookup returned zero results
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "py-32 rounded-[3.5rem] border-4 border-dashed text-center flex flex-col items-center justify-center",
                isDarkMode
                  ? "bg-slate-800/20 border-slate-700/50"
                  : "bg-slate-50 border-slate-100",
              )}
            >
              <div
                className={cn(
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transition-transform hover:scale-105",
                  isDarkMode
                    ? "bg-slate-800 text-slate-600 shadow-slate-950"
                    : "bg-white text-slate-200 shadow-slate-200",
                )}
              >
                <Binary className="w-12 h-12" />
              </div>
              <h3
                className={cn(
                  "text-2xl font-black italic mb-2",
                  isDarkMode ? "text-slate-400" : "text-slate-900/40",
                )}
              >
                Awaiting Registry Initialization
              </h3>
              <p
                className={cn(
                  "text-sm font-bold max-w-sm opacity-60",
                  isDarkMode ? "text-slate-500" : "text-slate-400",
                )}
              >
                Identify and select a specific examination module to initiate
                the digital asset indexing protocol.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={200} borderRadius={32} />
            ))}
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Attachments;
