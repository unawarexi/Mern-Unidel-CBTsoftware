import React from "react";
import {
  BookOpen,
  Users,
  User,
  Building2,
  MapPin,
  Info,
  Globe,
} from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../store/user-store";
import { useGetDepartmentsByEntityAction } from "../../../store/department-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

const DepartmentLevel = () => {
  const { courses = [] } = useGetLecturerCoursesAction();
  const { departments = [], isLoading } = useGetDepartmentsByEntityAction({
    lecturerId: "me",
  });
  const { isDarkMode } = useThemeStore();
  const department = departments[0];

  const deptCourses = courses;

  if (isLoading) {
    return (
      <LecturerPage
        title="Departmental Intelligence"
        subtitle="Aggregating pedagogical data across your assigned academic unit"
        icon={LecturerIcons.Department}
      >
        <div className="space-y-6">
          <Skeleton
            height={200}
            borderRadius={16}
            baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
            highlightColor={isDarkMode ? "#334155" : "#ffffff"}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton
              height={300}
              borderRadius={16}
              baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
            />
            <Skeleton
              height={300}
              borderRadius={16}
              baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
            />
          </div>
        </div>
      </LecturerPage>
    );
  }

  return (
    <LecturerPage
      title="Departmental Intelligence"
      subtitle="Comprehensive overview of structural academic assets and faculty distribution"
      icon={LecturerIcons.Department}
    >
      <div className="space-y-8">
        {department && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-3xl p-8 border-2 relative overflow-hidden group transition-all",
              isDarkMode
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-white border-slate-100 shadow-xl shadow-slate-200/50",
            )}
          >
            {/* Background Accent */}
            <div
              className={cn(
                "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-10 transition-transform group-hover:scale-110",
                isDarkMode ? "bg-orange-500" : "bg-orange-400",
              )}
            />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                      isDarkMode
                        ? "bg-slate-900/50 text-orange-400"
                        : "bg-orange-50 text-orange-600",
                    )}
                  >
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2
                      className={cn(
                        "text-2xl font-black tracking-tight",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {department.departmentName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded">
                        {department.departmentCode}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold flex items-center gap-1",
                          isDarkMode ? "text-slate-500" : "text-slate-400",
                        )}
                      >
                        <Globe className="w-3 h-3" />
                        {department.faculty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Unit Description
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium leading-relaxed italic",
                      isDarkMode ? "text-slate-300" : "text-slate-600",
                    )}
                  >
                    "
                    {department.description ||
                      "Synthesizing academic excellence through interdisciplinary collaboration and innovative research."}
                    "
                  </p>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {[
                    {
                      label: "Faculty Hub",
                      value: department.faculty,
                      icon: MapPin,
                    },
                    {
                      label: "Managed Courses",
                      value: deptCourses.length,
                      icon: BookOpen,
                    },
                    { label: "Active Cohorts", value: "Q1-2024", icon: Info },
                  ].map((item, i) => (
                    <div key={i}>
                      <p
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest mb-1",
                          isDarkMode ? "text-slate-500" : "text-slate-400",
                        )}
                      >
                        {item.label}
                      </p>
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-orange-500" />
                        <span
                          className={cn(
                            "text-sm font-black",
                            isDarkMode ? "text-white" : "text-slate-900",
                          )}
                        >
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deptCourses.map((course, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={course._id}
              className={cn(
                "rounded-2xl border-2 p-6 transition-all hover:border-orange-500/30",
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-white border-slate-100 shadow-lg shadow-slate-200/40",
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      isDarkMode
                        ? "bg-slate-700 text-orange-400"
                        : "bg-orange-50 text-orange-600",
                    )}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-orange-500 font-black text-xs tracking-widest block">
                      {course.courseCode}
                    </span>
                    <h3
                      className={cn(
                        "font-black text-lg tracking-tight",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {course.courseTitle}
                    </h3>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "grid grid-cols-2 gap-4 pt-6 border-t-2",
                  isDarkMode ? "border-slate-700/50" : "border-slate-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50",
                    )}
                  >
                    <Users className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-18px font-black",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {course.students?.length || 0}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest text-slate-500",
                      )}
                    >
                      Students
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50",
                    )}
                  >
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-18px font-black",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {course.lecturers?.length || 0}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest text-slate-500",
                      )}
                    >
                      Faculty
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-2 text-slate-500",
                  )}
                >
                  Active Instructors
                </p>
                <div className="flex flex-wrap gap-2">
                  {course.lecturers?.map((l, i) => (
                    <span
                      key={i}
                      className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold",
                        isDarkMode
                          ? "bg-slate-700/50 text-slate-300"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {l.fullname || "Anonymous Faculty"}
                    </span>
                  )) || (
                    <span className="text-xs text-slate-400 italic">
                      No faculty assigned
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </LecturerPage>
  );
};

export default DepartmentLevel;
