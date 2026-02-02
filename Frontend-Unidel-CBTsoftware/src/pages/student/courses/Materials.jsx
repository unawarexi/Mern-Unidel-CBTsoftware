import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  Folder,
  File,
  Video,
  Image,
  BookOpen,
  ChevronRight,
  Clock,
  User,
  ExternalLink,
  Eye,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetAllCoursesAction } from "../../../store/course-store";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Materials = () => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch courses with materials
  const { courses = [], isLoading, refetch } = useGetAllCoursesAction();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Get enrolled courses
  const enrolledCourses = courses.filter((course) =>
    course.students?.some((s) => s._id === user?._id || s === user?._id),
  );

  // Collect all materials from enrolled courses
  const allMaterials = enrolledCourses.flatMap((course) =>
    (course.materials || []).map((material) => ({
      ...material,
      courseName: course.courseTitle,
      courseCode: course.courseCode,
      courseId: course._id,
    })),
  );

  // Filter materials
  const filteredMaterials = allMaterials.filter((material) => {
    const matchesSearch =
      material.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.courseName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse =
      selectedCourse === "all" || material.courseId === selectedCourse;
    const matchesType =
      selectedType === "all" || material.type === selectedType;
    return matchesSearch && matchesCourse && matchesType;
  });

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return Video;
      case "image":
        return Image;
      case "document":
      case "pdf":
        return FileText;
      default:
        return File;
    }
  };

  // Get file type color
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return "text-purple-500 bg-purple-500/20";
      case "image":
        return "text-emerald-500 bg-emerald-500/20";
      case "document":
      case "pdf":
        return "text-red-500 bg-red-500/20";
      default:
        return "text-blue-500 bg-blue-500/20";
    }
  };

  // Stats
  const totalMaterials = allMaterials.length;
  const documentCount = allMaterials.filter(
    (m) => m.type === "document" || m.type === "pdf",
  ).length;
  const videoCount = allMaterials.filter((m) => m.type === "video").length;
  const otherCount = totalMaterials - documentCount - videoCount;

  const actions = (
    <div className="flex items-center gap-2">
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
    </div>
  );

  return (
    <StudentPage
      title="Course Materials"
      subtitle="Access learning resources and study materials"
      icon={StudentIcons.Materials}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Materials",
              value: totalMaterials,
              icon: Folder,
              color: "text-orange-500",
            },
            {
              label: "Documents",
              value: documentCount,
              icon: FileText,
              color: "text-red-500",
            },
            {
              label: "Videos",
              value: videoCount,
              icon: Video,
              color: "text-purple-500",
            },
            {
              label: "Other Files",
              value: otherCount,
              icon: File,
              color: "text-blue-500",
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-400",
              )}
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-700",
            )}
          >
            <option value="all">All Courses</option>
            {enrolledCourses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseCode}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-700",
            )}
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="pdf">PDF</option>
            <option value="video">Videos</option>
            <option value="image">Images</option>
          </select>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={160} borderRadius={16} />
              ))
          ) : filteredMaterials.length === 0 ? (
            <div
              className={cn(
                "col-span-full text-center py-16 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Materials Found</h3>
              <p className="text-sm">
                {searchQuery
                  ? "No materials match your search"
                  : "No materials available for your courses yet"}
              </p>
            </div>
          ) : (
            filteredMaterials.map((material, idx) => {
              const FileIcon = getFileIcon(material.type);
              const typeColors = getTypeColor(material.type);

              return (
                <motion.div
                  key={material._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all hover:shadow-lg group",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 hover:border-orange-500/50"
                      : "bg-white border-gray-100 hover:border-orange-500/50",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        typeColors,
                      )}
                    >
                      <FileIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          "font-semibold truncate mb-1",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {material.title || material.filename || "Untitled"}
                      </h4>
                      <p
                        className={cn(
                          "text-xs truncate mb-2",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {material.courseCode} - {material.courseName}
                      </p>
                      {material.description && (
                        <p
                          className={cn(
                            "text-sm line-clamp-2 mb-3",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {material.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-xs flex items-center gap-1",
                            isDarkMode ? "text-slate-500" : "text-gray-500",
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          {new Date(
                            material.uploadedAt || Date.now(),
                          ).toLocaleDateString()}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full uppercase",
                            typeColors,
                          )}
                        >
                          {material.type || "file"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-slate-700">
                    {material.url && (
                      <>
                        <a
                          href={material.url}
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
                          href={material.url}
                          download
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all",
                            "bg-orange-500 text-white hover:bg-orange-600",
                          )}
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

export default Materials;
