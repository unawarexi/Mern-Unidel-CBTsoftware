import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronRight,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  BarChart3,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetMySubmissionsAction } from "../../../store/submission-store";
import { useGetAllCoursesAction } from "../../../store/course-store";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";

const CourseResults = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Fetch submissions
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetMySubmissionsAction({ status: "graded" });

  // Fetch courses
  const {
    courses = [],
    isLoading: coursesLoading,
    refetch: refetchCourses,
  } = useGetAllCoursesAction();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchSubmissions(), refetchCourses()]);
    } finally {
      setRefreshing(false);
    }
  };

  // Get enrolled courses
  const enrolledCourses = courses.filter((course) =>
    course.students?.some((s) => s._id === user?._id || s === user?._id),
  );

  // Group submissions by course
  const courseResults = enrolledCourses
    .map((course) => {
      const courseSubmissions = submissions.filter(
        (s) =>
          s.examId?.courseId?._id === course._id ||
          s.examId?.courseId === course._id,
      );
      const passed = courseSubmissions.filter((s) => s.passed).length;
      const failed = courseSubmissions.length - passed;
      const avgScore =
        courseSubmissions.length > 0
          ? courseSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
            courseSubmissions.length
          : 0;
      const highestScore = Math.max(
        ...courseSubmissions.map((s) => s.percentage || 0),
        0,
      );
      const lowestScore =
        courseSubmissions.length > 0
          ? Math.min(...courseSubmissions.map((s) => s.percentage || 0))
          : 0;

      return {
        ...course,
        submissions: courseSubmissions,
        stats: {
          total: courseSubmissions.length,
          passed,
          failed,
          avgScore: avgScore.toFixed(1),
          highestScore,
          lowestScore,
          passRate:
            courseSubmissions.length > 0
              ? ((passed / courseSubmissions.length) * 100).toFixed(0)
              : 0,
        },
      };
    })
    .filter((c) => c.stats.total > 0);

  // Filter courses
  const filteredCourses = courseResults.filter(
    (course) =>
      course.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Overall stats
  const totalCourses = courseResults.length;
  const totalExams = submissions.length;
  const overallAvg =
    totalExams > 0
      ? (
          submissions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
          totalExams
        ).toFixed(1)
      : 0;

  const isLoading = submissionsLoading || coursesLoading;

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
      title="Results by Course"
      subtitle="View your performance breakdown by course"
      icon={StudentIcons.Results}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Courses Attempted",
              value: totalCourses,
              icon: BookOpen,
              color: "text-blue-500",
            },
            {
              label: "Total Exams",
              value: totalExams,
              icon: Target,
              color: "text-orange-500",
            },
            {
              label: "Overall Average",
              value: `${overallAvg}%`,
              icon: BarChart3,
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
            placeholder="Search courses..."
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

        {/* Course Cards */}
        <div className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={200} borderRadius={16} />
              ))
          ) : filteredCourses.length === 0 ? (
            <div
              className={cn(
                "text-center py-16 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/30 border-slate-800 text-slate-500"
                  : "bg-gray-50 border-gray-100 text-gray-500",
              )}
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Course Results</h3>
              <p className="text-sm">
                {searchQuery
                  ? "No courses match your search"
                  : "You don't have any course results yet"}
              </p>
            </div>
          ) : (
            filteredCourses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "rounded-2xl border overflow-hidden",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-white border-gray-100",
                )}
              >
                {/* Course Header */}
                <div
                  className={cn(
                    "p-5 cursor-pointer transition-all",
                    isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-gray-50",
                  )}
                  onClick={() =>
                    setExpandedCourse(
                      expandedCourse === course._id ? null : course._id,
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg",
                          parseFloat(course.stats.avgScore) >= 70
                            ? "bg-emerald-500/20 text-emerald-500"
                            : parseFloat(course.stats.avgScore) >= 50
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-red-500/20 text-red-500",
                        )}
                      >
                        {course.stats.avgScore}%
                      </div>
                      <div>
                        <h4
                          className={cn(
                            "font-bold text-lg",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {course.courseCode}
                        </h4>
                        <p
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {course.courseTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-emerald-500 font-bold">
                            {course.stats.passed}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            Passed
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-red-500 font-bold">
                            {course.stats.failed}
                          </p>
                          <p
                            className={cn(
                              "text-xs",
                              isDarkMode ? "text-slate-500" : "text-gray-500",
                            )}
                          >
                            Failed
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-5 h-5 transition-transform",
                          expandedCourse === course._id && "rotate-90",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedCourse === course._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className={cn(
                      "border-t",
                      isDarkMode ? "border-slate-700" : "border-gray-100",
                    )}
                  >
                    <div className="p-5 space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Total Exams", value: course.stats.total },
                          {
                            label: "Pass Rate",
                            value: `${course.stats.passRate}%`,
                          },
                          {
                            label: "Highest",
                            value: `${course.stats.highestScore}%`,
                          },
                          {
                            label: "Lowest",
                            value: `${course.stats.lowestScore}%`,
                          },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className={cn(
                              "p-3 rounded-xl text-center",
                              isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                            )}
                          >
                            <p
                              className={cn(
                                "text-lg font-bold",
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
                        ))}
                      </div>

                      {/* Exam List */}
                      <div className="space-y-2">
                        <h5
                          className={cn(
                            "text-sm font-medium",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          Exam History
                        </h5>
                        {course.submissions.slice(0, 5).map((sub) => (
                          <div
                            key={sub._id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl",
                              isDarkMode ? "bg-slate-700/30" : "bg-gray-50",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {sub.passed ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span
                                className={cn(
                                  "text-sm",
                                  isDarkMode
                                    ? "text-slate-300"
                                    : "text-gray-700",
                                )}
                              >
                                {new Date(sub.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "font-bold",
                                sub.passed
                                  ? "text-emerald-500"
                                  : "text-red-500",
                              )}
                            >
                              {sub.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </StudentPage>
  );
};

export default CourseResults;
