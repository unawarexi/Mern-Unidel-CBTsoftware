import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Calendar,
  Clock,
  Pin,
  Bell,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Announcements = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Mock announcements data
  const announcements = [
    {
      id: 1,
      title: "End of Semester Exam Schedule Released",
      content:
        "The examination timetable for the 2024/2025 academic session has been released. Please check your assigned courses and ensure exam venues are confirmed.",
      date: "2024-12-15",
      category: "exam",
      pinned: true,
      author: "Academic Affairs",
    },
    {
      id: 2,
      title: "Question Bank Submission Deadline",
      content:
        "All lecturers are reminded to submit their exam questions to the question bank by December 20th for review and approval.",
      date: "2024-12-10",
      category: "deadline",
      pinned: true,
      author: "Examination Office",
    },
    {
      id: 3,
      title: "New Proctoring Features Available",
      content:
        "Enhanced proctoring features including AI-powered gaze detection and audio monitoring are now available for online exams.",
      date: "2024-12-05",
      category: "update",
      pinned: false,
      author: "IT Department",
    },
    {
      id: 4,
      title: "Faculty Meeting - December 18th",
      content:
        "An important faculty meeting has been scheduled for December 18th at 2:00 PM. Attendance is mandatory for all teaching staff.",
      date: "2024-12-03",
      category: "meeting",
      pinned: false,
      author: "Dean's Office",
    },
    {
      id: 5,
      title: "System Maintenance Notice",
      content:
        "The CBT system will undergo scheduled maintenance on December 22nd from 12:00 AM to 6:00 AM. Please plan accordingly.",
      date: "2024-12-01",
      category: "system",
      pinned: false,
      author: "IT Department",
    },
  ];

  // Filter announcements
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || ann.category === filter;
    return matchesSearch && matchesFilter;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.pinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.pinned);

  const getCategoryColor = (category) => {
    switch (category) {
      case "exam":
        return "text-blue-500 bg-blue-500/20";
      case "deadline":
        return "text-red-500 bg-red-500/20";
      case "update":
        return "text-emerald-500 bg-emerald-500/20";
      case "meeting":
        return "text-purple-500 bg-purple-500/20";
      case "system":
        return "text-amber-500 bg-amber-500/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  return (
    <LecturerPage
      title="Announcements"
      subtitle="Stay updated with latest news and notices"
      icon={LecturerIcons.Announcements}
      actions={
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
          }}
          className={cn(
            "p-2 rounded-xl transition-all",
            isDarkMode
              ? "bg-slate-800 text-slate-400 hover:text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
        </button>
      }
    >
      <div className="space-y-6">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-3 rounded-xl border outline-none",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
              )}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-900",
            )}
          >
            <option value="all">All Categories</option>
            <option value="exam">Exams</option>
            <option value="deadline">Deadlines</option>
            <option value="update">Updates</option>
            <option value="meeting">Meetings</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div>
            <h3
              className={cn(
                "font-bold mb-4 flex items-center gap-2",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              <Pin className="w-4 h-4 text-blue-500" />
              Pinned
            </h3>
            <div className="space-y-4">
              {pinnedAnnouncements.map((ann, idx) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md",
                    isDarkMode
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-blue-50 border-blue-200",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getCategoryColor(ann.category),
                        )}
                      >
                        {ann.category.charAt(0).toUpperCase() +
                          ann.category.slice(1)}
                      </span>
                      <Pin className="w-4 h-4 text-blue-500" />
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      {new Date(ann.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4
                    className={cn(
                      "font-semibold mb-2",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {ann.title}
                  </h4>
                  <p
                    className={cn(
                      "text-sm line-clamp-2",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {ann.content}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-3",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    By {ann.author}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div>
          {pinnedAnnouncements.length > 0 && (
            <h3
              className={cn(
                "font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Recent
            </h3>
          )}
          {loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} height={120} className="rounded-2xl" />
                ))}
            </div>
          ) : regularAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {regularAnnouncements.map((ann, idx) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-white border-gray-100",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getCategoryColor(ann.category),
                      )}
                    >
                      {ann.category.charAt(0).toUpperCase() +
                        ann.category.slice(1)}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      {new Date(ann.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4
                    className={cn(
                      "font-semibold mb-2",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {ann.title}
                  </h4>
                  <p
                    className={cn(
                      "text-sm line-clamp-2",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {ann.content}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-3",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    By {ann.author}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "text-center py-12 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No announcements found</p>
            </div>
          )}
        </div>
      </div>
    </LecturerPage>
  );
};

export default Announcements;
