import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Paperclip,
  FileText,
  Image,
  Download,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Eye,
  Folder,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetActiveExamsForStudentAction } from "../../../store/exam-store";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Attachments = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch exams
  const {
    activeExams = [],
    isLoading: examsLoading,
    refetch: refetchExams,
  } = useGetActiveExamsForStudentAction();

  // Fetch submissions
  const { submissions = [], isLoading: submissionsLoading } =
    useGetMySubmissionsAction({});

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchExams();
    } finally {
      setRefreshing(false);
    }
  };

  // Collect attachments from exams
  const allAttachments = [];

  activeExams.forEach((exam) => {
    if (exam.attachments?.length > 0) {
      exam.attachments.forEach((attachment) => {
        allAttachments.push({
          ...attachment,
          examTitle: `${exam.courseId?.courseCode} - ${exam.courseId?.courseTitle}`,
          examId: exam._id,
          source: "exam",
        });
      });
    }
    // Also check for question attachments
    exam.questions?.forEach((q) => {
      if (q.attachments?.length > 0) {
        q.attachments.forEach((att) => {
          allAttachments.push({
            ...att,
            examTitle: `${exam.courseId?.courseCode} - Question ${q.order || ""}`,
            examId: exam._id,
            source: "question",
          });
        });
      }
    });
  });

  // Filter attachments
  const filteredAttachments = allAttachments.filter(
    (att) =>
      att.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.examTitle?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get file icon
  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return Image;
    return FileText;
  };

  const getFileColor = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return "text-emerald-500 bg-emerald-500/20";
    if (["pdf"].includes(ext)) return "text-red-500 bg-red-500/20";
    return "text-blue-500 bg-blue-500/20";
  };

  const isLoading = examsLoading || submissionsLoading;

  const actions = (
    <button
      onClick={handleRefresh}
      disabled={refreshing}
      className={cn(
        "p-2 rounded-xl transition-all",
        isDarkMode
          ? "bg-slate-800 text-slate-400 hover:text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
      )}
    >
      <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
    </button>
  );

  return (
    <StudentPage
      title="Exam Attachments"
      subtitle="View and download attachments from your exams"
      icon={StudentIcons.Documents}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total Attachments",
              value: allAttachments.length,
              icon: Paperclip,
              color: "text-blue-500",
            },
            {
              label: "From Exams",
              value: allAttachments.filter((a) => a.source === "exam").length,
              icon: BookOpen,
              color: "text-orange-500",
            },
            {
              label: "From Questions",
              value: allAttachments.filter((a) => a.source === "question")
                .length,
              icon: FileText,
              color: "text-purple-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <div>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {isLoading ? <Skeleton width={30} /> : stat.value}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
              isDarkMode ? "text-slate-500" : "text-gray-400",
            )}
          />
          <input
            type="text"
            placeholder="Search attachments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-700 placeholder-gray-400",
            )}
          />
        </div>

        {/* Attachments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={120} borderRadius={16} />
              ))
          ) : filteredAttachments.length === 0 ? (
            <div
              className={cn(
                "col-span-full text-center py-16 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <Paperclip className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                No Attachments Found
              </h3>
              <p className="text-sm">
                {searchQuery
                  ? "No attachments match your search"
                  : "No exam attachments available at this time"}
              </p>
            </div>
          ) : (
            filteredAttachments.map((attachment, idx) => {
              const FileIcon = getFileIcon(attachment.filename);
              const fileColor = getFileColor(attachment.filename);

              return (
                <motion.div
                  key={attachment._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all hover:shadow-lg",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 hover:border-orange-500/50"
                      : "bg-white border-gray-100 hover:border-orange-500/50",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        fileColor,
                      )}
                    >
                      <FileIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          "font-semibold truncate",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {attachment.filename || "Attachment"}
                      </h4>
                      <p
                        className={cn(
                          "text-sm truncate",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {attachment.examTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    {attachment.url && (
                      <>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all",
                            isDarkMode
                              ? "bg-slate-700 text-white hover:bg-slate-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                          )}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                        <a
                          href={attachment.url}
                          download
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </StudentPage>
  );
};

export default Attachments;
