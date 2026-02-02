import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  FileText,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Filter,
} from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../store/user-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";
import { motion, AnimatePresence } from "framer-motion";

const AssignedCourses = () => {
  const { courses = [], isLoading } = useGetLecturerCoursesAction();
  const { isDarkMode } = useThemeStore();

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");

  // Helper function to get department names from course
  const getDepartmentNames = (course) => {
    if (!course.department) return "N/A";
    if (Array.isArray(course.department)) {
      return course.department
        .map((dept) => {
          if (typeof dept === "object" && dept.departmentName) {
            return dept.departmentName;
          }
          return dept;
        })
        .join(", ");
    }
    if (
      typeof course.department === "object" &&
      course.department.departmentName
    ) {
      return course.department.departmentName;
    }
    return course.department;
  };

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const deptNames = getDepartmentNames(course).toLowerCase();
      const matchesSearch =
        (course.courseCode || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (course.courseTitle || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        deptNames.includes(searchTerm.toLowerCase());
      const matchesDept =
        filterDepartment === "All" ||
        deptNames.includes(filterDepartment.toLowerCase());
      return matchesSearch && matchesDept;
    });
  }, [courses, searchTerm, filterDepartment]);

  // Get unique departments for filter dropdown
  const departmentOptions = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.department) {
        if (Array.isArray(c.department)) {
          c.department.forEach((dept) => {
            const deptName =
              typeof dept === "object" && dept.departmentName
                ? dept.departmentName
                : dept;
            if (deptName) set.add(deptName);
          });
        } else {
          const deptName =
            typeof c.department === "object" && c.department.departmentName
              ? c.department.departmentName
              : c.department;
          if (deptName) set.add(deptName);
        }
      }
    });
    return Array.from(set);
  }, [courses]);

  return (
    <LecturerPage
      title="Assigned Courses"
      subtitle="Examine pedagogical structures and track curriculum impact across your portfolio"
      icon={LecturerIcons.Courses}
    >
      <div className="space-y-8">
        {/* Statistics Overview */}
        {!isLoading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Total Courses",
                value: courses.length,
                icon: BookOpen,
                color: "orange",
              },
              {
                label: "Active Students",
                value: courses.reduce(
                  (acc, c) => acc + (c.students?.length || 0),
                  0,
                ),
                icon: Users,
                color: "blue",
              },
              {
                label: "Avg. Students/Course",
                value: Math.round(
                  courses.reduce(
                    (acc, c) => acc + (c.students?.length || 0),
                    0,
                  ) / courses.length,
                ),
                icon: GraduationCap,
                color: "emerald",
              },
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all hover:scale-[1.02]",
                  isDarkMode
                    ? "bg-slate-800/40 border-slate-700/50"
                    : "bg-white border-slate-100 shadow-sm",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      stat.color === "orange" &&
                        (isDarkMode
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-orange-50 text-orange-600"),
                      stat.color === "blue" &&
                        (isDarkMode
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-blue-50 text-blue-600"),
                      stat.color === "emerald" &&
                        (isDarkMode
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-emerald-50 text-emerald-600"),
                    )}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        isDarkMode ? "text-slate-500" : "text-slate-400",
                      )}
                    >
                      {stat.label}
                    </p>
                    <p
                      className={cn(
                        "text-2xl font-black mt-0.5",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Global Controls */}
        <div
          className={cn(
            "rounded-2xl p-4 border-2 transition-all",
            isDarkMode
              ? "bg-slate-800/30 border-slate-700/50 backdrop-blur-md"
              : "bg-white border-slate-100 shadow-sm",
          )}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
              <Search
                className={cn(
                  "absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors",
                  isDarkMode
                    ? "text-slate-500 group-focus-within:text-orange-500"
                    : "text-slate-400 group-focus-within:text-orange-500",
                )}
                size={18}
              />
              <input
                type="text"
                placeholder="Query course registry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:ring-orange-500/10 focus:border-orange-500/50"
                    : "bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 focus:ring-orange-500/10 focus:border-orange-200",
                )}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-8 py-3 border-2 rounded-xl appearance-none font-bold transition-all focus:outline-none",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200",
                  )}
                >
                  <option value="All">All Disciplines</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Registry Table */}
        <div
          className={cn(
            "rounded-2xl border-2 overflow-hidden transition-all",
            isDarkMode
              ? "bg-slate-800/20 border-slate-700/50 shadow-black/20"
              : "bg-white border-slate-100 shadow-xl shadow-slate-200/50",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className={cn(
                    "border-b-2",
                    isDarkMode
                      ? "border-slate-700 bg-slate-800/30"
                      : "border-slate-50 bg-slate-50/50",
                  )}
                >
                  <th
                    className={cn(
                      "px-6 py-5 font-bold text-xs uppercase tracking-widest",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Identifier & Title
                  </th>
                  <th
                    className={cn(
                      "px-6 py-5 font-bold text-xs uppercase tracking-widest hidden md:table-cell",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Academic Department
                  </th>
                  <th
                    className={cn(
                      "px-6 py-5 font-bold text-xs uppercase tracking-widest hidden sm:table-cell",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Enrollment
                  </th>
                  <th
                    className={cn(
                      "px-6 py-5 font-bold text-xs uppercase tracking-widest text-right",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Strategic Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/10">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-20 text-center text-slate-500"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                          <span className="font-bold tracking-widest text-xs uppercase">
                            Synchronizing Registry...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-50">
                          <Search className="w-12 h-12 text-slate-500" />
                          <p className="font-bold text-slate-500">
                            No matching courses found in the current registry
                            view.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course, idx) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={course._id}
                        className={cn(
                          "transition-colors group",
                          isDarkMode
                            ? "hover:bg-orange-500/5"
                            : "hover:bg-orange-50/30",
                        )}
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-orange-500 font-black tracking-tighter text-lg leading-tight">
                              {course.courseCode}
                            </span>
                            <span
                              className={cn(
                                "font-bold text-sm tracking-tight line-clamp-1",
                                isDarkMode ? "text-white" : "text-slate-900",
                              )}
                            >
                              {course.courseTitle}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <div
                            className={cn(
                              "inline-flex px-3 py-1 rounded-full text-xs font-bold",
                              isDarkMode
                                ? "bg-slate-700/50 text-slate-300"
                                : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {getDepartmentNames(course)}
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                isDarkMode ? "bg-slate-800" : "bg-slate-100",
                              )}
                            >
                              <Users className="w-4 h-4 text-slate-500" />
                            </div>
                            <span
                              className={cn(
                                "font-black",
                                isDarkMode ? "text-white" : "text-slate-900",
                              )}
                            >
                              {course.students?.length || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              className={cn(
                                "p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 group/btn",
                                isDarkMode
                                  ? "bg-slate-800 text-slate-400 hover:text-orange-400"
                                  : "bg-slate-50 text-slate-400 hover:text-orange-600 shadow-sm",
                              )}
                            >
                              <FileText className="w-5 h-5" />
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-orange-600/20 active:scale-95">
                              <span>Details</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LecturerPage>
  );
};

export default AssignedCourses;
