import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  BookOpen,
  Clock,
  MapPin,
  Search,
  RefreshCw,
  GraduationCap,
  Award,
  ChevronRight,
  Building,
  Calendar,
  Star,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetAllCoursesAction } from "../../../store/course-store";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Lecturers = () => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  // Fetch courses
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

  // Extract unique lecturers with their courses
  const lecturersMap = new Map();
  enrolledCourses.forEach((course) => {
    (course.lecturers || []).forEach((lecturer) => {
      const id = lecturer._id || lecturer;
      if (!lecturersMap.has(id)) {
        lecturersMap.set(id, {
          ...lecturer,
          courses: [],
        });
      }
      lecturersMap.get(id).courses.push({
        _id: course._id,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        department: course.department,
      });
    });
  });

  const lecturers = Array.from(lecturersMap.values());

  // Filter lecturers
  const filteredLecturers = lecturers.filter((lecturer) => {
    const matchesSearch =
      lecturer.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.courses?.some(
        (c) =>
          c.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesSearch;
  });

  // Stats
  const totalLecturers = lecturers.length;
  const totalCourses = enrolledCourses.length;
  const departments = new Set(
    lecturers.map((l) => l.department).filter(Boolean),
  ).size;

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
      title="Course Lecturers"
      subtitle="View information about your course lecturers"
      icon={StudentIcons.Lecturers}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Your Lecturers",
              value: totalLecturers,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Enrolled Courses",
              value: totalCourses,
              icon: BookOpen,
              color: "text-orange-500",
            },
            {
              label: "Departments",
              value: departments,
              icon: Building,
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
            placeholder="Search lecturers by name, email, or course..."
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

        {/* Lecturers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={200} borderRadius={16} />
              ))
          ) : filteredLecturers.length === 0 ? (
            <div
              className={cn(
                "col-span-full text-center py-16 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Lecturers Found</h3>
              <p className="text-sm">
                {searchQuery
                  ? "No lecturers match your search"
                  : "No lecturers assigned to your courses yet"}
              </p>
            </div>
          ) : (
            filteredLecturers.map((lecturer, idx) => (
              <motion.div
                key={lecturer._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "rounded-2xl border overflow-hidden transition-all hover:shadow-lg",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-white border-gray-100",
                )}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                      {lecturer.fullname?.charAt(0) || "L"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate">
                        {lecturer.fullname || "Lecturer"}
                      </h3>
                      <p className="text-sm text-white/80 truncate">
                        {lecturer.title || "Lecturer"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {lecturer.email && (
                      <div className="flex items-center gap-3">
                        <Mail
                          className={cn(
                            "w-4 h-4",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        />
                        <a
                          href={`mailto:${lecturer.email}`}
                          className={cn(
                            "text-sm hover:underline truncate",
                            isDarkMode ? "text-slate-300" : "text-gray-700",
                          )}
                        >
                          {lecturer.email}
                        </a>
                      </div>
                    )}
                    {lecturer.phone && (
                      <div className="flex items-center gap-3">
                        <Phone
                          className={cn(
                            "w-4 h-4",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        />
                        <a
                          href={`tel:${lecturer.phone}`}
                          className={cn(
                            "text-sm hover:underline",
                            isDarkMode ? "text-slate-300" : "text-gray-700",
                          )}
                        >
                          {lecturer.phone}
                        </a>
                      </div>
                    )}
                    {lecturer.department && (
                      <div className="flex items-center gap-3">
                        <Building
                          className={cn(
                            "w-4 h-4",
                            isDarkMode ? "text-slate-500" : "text-gray-400",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {lecturer.department}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Courses Taught */}
                  <div
                    className={cn(
                      "pt-4 border-t",
                      isDarkMode ? "border-slate-700" : "border-gray-100",
                    )}
                  >
                    <p
                      className={cn(
                        "text-xs font-medium mb-2",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      TEACHING YOUR COURSES
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lecturer.courses?.map((course, i) => (
                        <span
                          key={i}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            isDarkMode
                              ? "bg-slate-700 text-slate-300"
                              : "bg-orange-100 text-orange-700",
                          )}
                        >
                          {course.courseCode}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Office Hours (Mock) */}
                  <div
                    className={cn(
                      "p-3 rounded-xl flex items-center gap-3",
                      isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                    )}
                  >
                    <Clock
                      className={cn(
                        "w-4 h-4",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          "text-xs font-medium",
                          isDarkMode ? "text-slate-400" : "text-gray-600",
                        )}
                      >
                        Office Hours
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {lecturer.officeHours || "Mon-Fri, 9:00 AM - 4:00 PM"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </StudentPage>
  );
};

export default Lecturers;
