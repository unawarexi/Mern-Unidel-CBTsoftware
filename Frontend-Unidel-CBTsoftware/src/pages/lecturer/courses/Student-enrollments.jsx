import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  User,
  Mail,
  Hash,
  Book,
  Filter,
  GraduationCap,
} from "lucide-react";
import { useGetLecturerStudentsAction } from "../../../store/user-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";

const StudentEnrollments = () => {
  const { students = [], isLoading: loadingStudents } =
    useGetLecturerStudentsAction();
  const { isDarkMode } = useThemeStore();

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        (student.fullname || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (student.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (student.matricNumber || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesLevel =
        filterLevel === "All" || String(student.level) === String(filterLevel);
      return matchesSearch && matchesLevel;
    });
  }, [students, searchTerm, filterLevel]);

  return (
    <LecturerPage
      title="Enrollment Directory"
      subtitle="Analyze and manage student participation across your active academic cohorts"
      icon={LecturerIcons.Students}
    >
      <div className="space-y-8">
        {/* Statistics Bar */}
        {!loadingStudents && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Enrolled Students",
                value: students.length,
                color: "orange",
              },
              {
                label: "Active Cohorts",
                value: [...new Set(students.map((s) => s.level))].length,
                color: "blue",
              },
              { label: "New Enrollments", value: "8+", color: "emerald" },
              { label: "Sync Status", value: "Live", color: "purple" },
            ].map((stat, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all",
                  isDarkMode
                    ? "bg-slate-800/40 border-slate-700/50"
                    : "bg-white border-slate-100 shadow-sm",
                )}
              >
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1",
                  )}
                >
                  {stat.label}
                </p>
                <p
                  className={cn(
                    "text-xl font-black",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Action Controls */}
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
                placeholder="Lookup student by name, matric, or email..."
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
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-8 py-3 border-2 rounded-xl appearance-none font-bold transition-all focus:outline-none",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200",
                  )}
                >
                  <option value="All">All Tiers/Levels</option>
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "rounded-3xl border-2 overflow-hidden transition-all shadow-2xl",
            isDarkMode
              ? "bg-slate-800/20 border-slate-700/50 shadow-black/20"
              : "bg-white border-slate-100 shadow-slate-200/50",
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
                    Student Profile
                  </th>
                  <th
                    className={cn(
                      "px-6 py-5 font-bold text-xs uppercase tracking-widest",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Active Course-Registry
                  </th>
                  <th
                    className={cn(
                      "px-6 py-5 font-bold text-xs uppercase tracking-widest",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Academic Tier
                  </th>
                  <th
                    className={cn(
                      "px-6 py-5 font-bold text-xs uppercase tracking-widest",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Authentication Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/10">
                <AnimatePresence mode="popLayout">
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                          <span className="font-black tracking-widest text-[10px] uppercase text-slate-500">
                            Querying Student Core...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center opacity-50">
                        <User className="w-12 h-12 mx-auto text-slate-500 mb-3" />
                        <p className="font-black text-slate-500">
                          No student records match the current inquiry profile.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={student._id}
                        className={cn(
                          "transition-colors group",
                          isDarkMode
                            ? "hover:bg-orange-500/5"
                            : "hover:bg-orange-50/30",
                        )}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-transform group-hover:scale-110",
                                isDarkMode
                                  ? "bg-slate-700 text-orange-400 shadow-xl"
                                  : "bg-orange-50 text-orange-600 shadow-lg shadow-orange-100",
                              )}
                            >
                              {student.fullname
                                ? student.fullname.charAt(0)
                                : "?"}
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "font-black text-sm tracking-tight",
                                  isDarkMode ? "text-white" : "text-slate-900",
                                )}
                              >
                                {student.fullname || "Anonymous Participant"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={cn(
                                    "text-[10px] font-bold flex items-center gap-1",
                                    isDarkMode
                                      ? "text-slate-500"
                                      : "text-slate-400",
                                  )}
                                >
                                  <Hash className="w-3 h-3" />
                                  {student.matricNumber || "UNREGISTERED"}
                                </span>
                                <span
                                  className={cn(
                                    "text-[10px] font-bold flex items-center gap-1",
                                    isDarkMode
                                      ? "text-slate-500"
                                      : "text-slate-400",
                                  )}
                                >
                                  <Mail className="w-3 h-3" />
                                  {student.email || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-1.5">
                            {(student.coursesInfo || []).length > 0 ? (
                              student.coursesInfo.map((c, i) => (
                                <span
                                  key={i}
                                  className={cn(
                                    "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tight",
                                    isDarkMode
                                      ? "bg-slate-700/50 text-orange-400"
                                      : "bg-orange-50 text-orange-600",
                                  )}
                                >
                                  {c.courseCode}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 italic">
                                No course context identified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                                isDarkMode
                                  ? "bg-slate-700"
                                  : "bg-white border border-slate-100",
                              )}
                            >
                              <GraduationCap className="w-4 h-4 text-slate-500" />
                            </div>
                            <span
                              className={cn(
                                "font-black tracking-widest",
                                isDarkMode ? "text-white" : "text-slate-900",
                              )}
                            >
                              {student.level || "???"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all group-hover:px-4",
                              isDarkMode
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm",
                            )}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Active
                            </span>
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

export default StudentEnrollments;
