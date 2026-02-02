import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetAllCoursesAction } from "../../../store/course-store";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";

const Enrollments = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch courses
  const {
    courses = [],
    isLoading: coursesLoading,
    refetch: refetchCourses,
  } = useGetAllCoursesAction();

  // Fetch submissions to calculate progress
  const { submissions = [], isLoading: submissionsLoading } =
    useGetMySubmissionsAction({});

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchCourses();
    } finally {
      setRefreshing(false);
    }
  };

  // Filter enrolled courses (courses that have the student enrolled)
  const enrolledCourses = courses.filter((course) =>
    course.students?.some((s) => s._id === user?._id || s === user?._id),
  );

  // Filter and search
  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      course.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate course stats
  const getCourseProgress = (courseId) => {
    const courseSubmissions = submissions.filter(
      (s) =>
        s.examId?.courseId?._id === courseId || s.examId?.courseId === courseId,
    );
    const totalExams = courseSubmissions.length;
    const passedExams = courseSubmissions.filter((s) => s.passed).length;
    const avgScore =
      totalExams > 0
        ? courseSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
          totalExams
        : 0;
    return { totalExams, passedExams, avgScore: avgScore.toFixed(1) };
  };

  // Stats
  const totalCourses = enrolledCourses.length;
  const totalLecturers = new Set(
    enrolledCourses.flatMap((c) => c.lecturers?.map((l) => l._id || l) || []),
  ).size;
  const activeCourses = enrolledCourses.filter(
    (c) => c.status === "active" || !c.status,
  ).length;

  const isLoading = coursesLoading || submissionsLoading;

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
      title="My Courses"
      subtitle="View your enrolled courses and track your progress"
      icon={StudentIcons.Courses}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Enrolled Courses",
              value: totalCourses,
              icon: BookOpen,
              color: "from-orange-500/20 to-amber-600/20",
              accent: "text-orange-500",
            },
            {
              label: "Course Lecturers",
              value: totalLecturers,
              icon: Users,
              color: "from-blue-500/20 to-indigo-600/20",
              accent: "text-blue-500",
            },
            {
              label: "Active Courses",
              value: activeCourses,
              icon: CheckCircle,
              color: "from-emerald-500/20 to-teal-600/20",
              accent: "text-emerald-500",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-5 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                    stat.color,
                    stat.accent,
                  )}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {isLoading ? <Skeleton width={40} /> : stat.value}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-500",
                    )}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
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
              placeholder="Search courses by name, code, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500"
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-orange-500",
              )}
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <Skeleton height={280} borderRadius={16} />
                </div>
              ))
          ) : filteredCourses.length === 0 ? (
            <div
              className={cn(
                "col-span-full text-center py-16 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
              <p className="text-sm">
                {searchQuery
                  ? "No courses match your search criteria"
                  : "You are not enrolled in any courses yet"}
              </p>
            </div>
          ) : (
            filteredCourses.map((course, idx) => {
              const progress = getCourseProgress(course._id);
              const primaryLecturer = course.lecturers?.[0];

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "rounded-2xl border overflow-hidden transition-all hover:shadow-lg group cursor-pointer",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700 hover:border-orange-500/50"
                      : "bg-white border-gray-100 hover:border-orange-500/50",
                  )}
                  onClick={() =>
                    navigate(`/student/courses/materials?course=${course._id}`)
                  }
                >
                  {/* Course Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                          {course.courseCode}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1 line-clamp-2">
                          {course.courseTitle}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Course Body */}
                  <div className="p-4 space-y-4">
                    {/* Department */}
                    <div className="flex items-center gap-2">
                      <GraduationCap
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
                        {course.department || "Department not set"}
                      </span>
                    </div>

                    {/* Lecturer */}
                    {primaryLecturer && (
                      <div className="flex items-center gap-2">
                        <Users
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
                          {primaryLecturer.fullname || "Lecturer"}
                          {course.lecturers?.length > 1 &&
                            ` +${course.lecturers.length - 1} more`}
                        </span>
                      </div>
                    )}

                    {/* Progress Stats */}
                    <div
                      className={cn(
                        "p-3 rounded-xl",
                        isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                      )}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span
                          className={cn(
                            isDarkMode ? "text-slate-400" : "text-gray-500",
                          )}
                        >
                          Exam Performance
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            parseFloat(progress.avgScore) >= 70
                              ? "text-emerald-500"
                              : parseFloat(progress.avgScore) >= 50
                                ? "text-amber-500"
                                : "text-red-500",
                          )}
                        >
                          {progress.avgScore}% avg
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <FileText
                            className={cn(
                              "w-3 h-3",
                              isDarkMode ? "text-slate-500" : "text-gray-400",
                            )}
                          />
                          <span
                            className={cn(
                              isDarkMode ? "text-slate-400" : "text-gray-600",
                            )}
                          >
                            {progress.totalExams} exams
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">
                            {progress.passedExams} passed
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Materials Count */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {course.materials?.length || 0} materials available
                      </span>
                      <ChevronRight
                        className={cn(
                          "w-5 h-5 transition-transform group-hover:translate-x-1",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      />
                    </div>
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

export default Enrollments;
