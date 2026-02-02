import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Calendar,
  Clock,
  RefreshCw,
  Star,
  ChevronRight,
  X,
  Pin,
  BookOpen,
  Bell,
  ExternalLink,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Announcements = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [filter, setFilter] = useState("all");

  // Mock announcements (would come from API)
  const [announcements] = useState([
    {
      id: "1",
      title: "End of Semester Examinations Schedule",
      content:
        "The end of semester examinations will commence on December 15th, 2025. Students are advised to check their dashboard for specific exam schedules. Ensure you arrive at least 30 minutes before your scheduled exam time. All examinations will be conducted online through the CBT platform.",
      category: "academic",
      pinned: true,
      author: "Academic Office",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "New CBT Platform Features",
      content:
        "We are excited to announce new features on the CBT platform including dark mode, improved exam interface, real-time progress tracking, and enhanced security measures. Please explore these features and provide feedback through the support section.",
      category: "system",
      pinned: false,
      author: "IT Department",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      title: "Academic Integrity Policy Update",
      content:
        "Please be informed that the academic integrity policy has been updated. All students are required to read and acknowledge the new policy before their next examination. Violations will result in automatic exam submission and potential disciplinary action.",
      category: "policy",
      pinned: true,
      author: "Dean of Students",
      timestamp: new Date(Date.now() - 259200000),
    },
    {
      id: "4",
      title: "Library Resources Available Online",
      content:
        "Students now have access to an expanded collection of online library resources including e-books, journals, and research databases. Access these resources through your student portal to enhance your exam preparation.",
      category: "academic",
      pinned: false,
      author: "Library Services",
      timestamp: new Date(Date.now() - 604800000),
    },
  ]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "academic":
        return "bg-blue-500/20 text-blue-500";
      case "system":
        return "bg-purple-500/20 text-purple-500";
      case "policy":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const filteredAnnouncements =
    filter === "all"
      ? announcements
      : filter === "pinned"
        ? announcements.filter((a) => a.pinned)
        : announcements.filter((a) => a.category === filter);

  // Sort: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.timestamp - a.timestamp;
  });

  const actions = (
    <div className="flex items-center gap-2">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={cn(
          "px-3 py-2 text-sm rounded-xl border outline-none",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-700",
        )}
      >
        <option value="all">All Announcements</option>
        <option value="pinned">Pinned</option>
        <option value="academic">Academic</option>
        <option value="system">System</option>
        <option value="policy">Policy</option>
      </select>
    </div>
  );

  return (
    <StudentPage
      title="Announcements"
      subtitle="Stay updated with important announcements"
      icon={StudentIcons.Notifications}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total",
              value: announcements.length,
              icon: Megaphone,
              color: "text-orange-500",
            },
            {
              label: "Pinned",
              value: announcements.filter((a) => a.pinned).length,
              icon: Pin,
              color: "text-red-500",
            },
            {
              label: "Academic",
              value: announcements.filter((a) => a.category === "academic")
                .length,
              icon: BookOpen,
              color: "text-blue-500",
            },
            {
              label: "This Week",
              value: announcements.filter(
                (a) => a.timestamp > Date.now() - 604800000,
              ).length,
              icon: Calendar,
              color: "text-emerald-500",
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
                    {stat.value}
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

        {/* Announcements List */}
        {sortedAnnouncements.length === 0 ? (
          <div
            className={cn(
              "text-center py-16 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Announcements</h3>
            <p className="text-sm">No announcements to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAnnouncements.map((announcement, idx) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-lg",
                  announcement.pinned
                    ? isDarkMode
                      ? "bg-orange-500/10 border-orange-500/30"
                      : "bg-orange-50 border-orange-200"
                    : isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-white border-gray-100",
                )}
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      announcement.pinned
                        ? "bg-orange-500/20 text-orange-500"
                        : isDarkMode
                          ? "bg-slate-700 text-slate-400"
                          : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {announcement.pinned ? (
                      <Pin className="w-6 h-6" />
                    ) : (
                      <Megaphone className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={cn(
                          "font-bold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {announcement.title}
                      </h4>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                          getCategoryColor(announcement.category),
                        )}
                      >
                        {announcement.category}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm line-clamp-2 mb-3",
                        isDarkMode ? "text-slate-400" : "text-gray-600",
                      )}
                    >
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className={cn(
                          "flex items-center gap-1",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        <Calendar className="w-3 h-3" />
                        {announcement.timestamp.toLocaleDateString()}
                      </span>
                      <span
                        className={cn(
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        By: {announcement.author}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isDarkMode ? "text-slate-500" : "text-gray-400",
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Announcement Detail Modal */}
        <AnimatePresence>
          {selectedAnnouncement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedAnnouncement(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full max-w-lg rounded-3xl p-6 shadow-xl max-h-[80vh] overflow-y-auto",
                  isDarkMode ? "bg-slate-800" : "bg-white",
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {selectedAnnouncement.pinned && (
                      <Pin className="w-5 h-5 text-orange-500" />
                    )}
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                        getCategoryColor(selectedAnnouncement.category),
                      )}
                    >
                      {selectedAnnouncement.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isDarkMode
                        ? "hover:bg-slate-700 text-slate-400"
                        : "hover:bg-gray-100 text-gray-500",
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold mb-4",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {selectedAnnouncement.title}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed mb-6",
                    isDarkMode ? "text-slate-300" : "text-gray-600",
                  )}
                >
                  {selectedAnnouncement.content}
                </p>
                <div
                  className={cn(
                    "pt-4 border-t flex items-center justify-between",
                    isDarkMode ? "border-slate-700" : "border-gray-100",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    <p>By: {selectedAnnouncement.author}</p>
                    <p>{selectedAnnouncement.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StudentPage>
  );
};

export default Announcements;
