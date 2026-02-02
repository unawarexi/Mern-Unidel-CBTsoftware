import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  Eye,
  Target,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  Binary,
  Layers,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import ExportButton from "../../../components/ExportButton";

const ExamResults = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const {
    submissions = [],
    isLoading: submissionsLoading,
    refetch,
  } = useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 100 });

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentId?.fullname
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      sub.studentId?.matricNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "passed" && sub.passed) ||
      (statusFilter === "failed" && !sub.passed) ||
      (statusFilter === "pending" && sub.status === "pending");
    return matchesSearch && matchesStatus;
  });

  // Calculate stats for selected exam
  const passed = submissions.filter(
    (s) => s.passed && s.status === "graded",
  ).length;
  const failed = submissions.filter(
    (s) => !s.passed && s.status === "graded",
  ).length;
  const pending = submissions.filter((s) => s.status === "pending").length;
  const avgScore =
    submissions.length > 0
      ? submissions.reduce((acc, s) => acc + (s.percentage || 0), 0) /
        submissions.length
      : 0;

  const actions = selectedExam && (
    <ExportButton
      type="exam-results"
      contextId={selectedExam._id}
      title={`Performance Audit - ${selectedExam.courseId?.courseCode}`}
      filters={{ status: statusFilter, search: searchQuery }}
    />
  );

  return (
    <LecturerPage
      title="Performance Audit"
      subtitle="Comprehensive analysis of student transmissions and academic benchmarks"
      icon={LecturerIcons.Results}
      actions={actions}
    >
      <div className="max-w-7xl mx-auto pb-20 space-y-10">
        {/* Exam Selection Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-8 rounded-[3rem] border-2 relative overflow-hidden",
            isDarkMode
              ? "bg-slate-800/40 border-slate-700/50"
              : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                isDarkMode
                  ? "bg-orange-500/10 text-orange-500"
                  : "bg-orange-50 text-orange-600",
              )}
            >
              <Binary size={24} />
            </div>
            <div>
              <h3
                className={cn(
                  "text-xl font-black italic",
                  isDarkMode ? "text-white" : "text-slate-900",
                )}
              >
                Source Stream
              </h3>
              <p
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest opacity-50",
                  isDarkMode ? "text-slate-400" : "text-slate-500",
                )}
              >
                Select an examination module to begin audit
              </p>
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedExam?._id || ""}
              onChange={(e) => {
                const exam = exams.find((ex) => ex._id === e.target.value);
                setSelectedExam(exam || null);
              }}
              className={cn(
                "w-full px-8 py-5 rounded-[2rem] border-2 appearance-none outline-none font-black text-sm tracking-tight transition-all",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white focus:border-orange-500/50"
                  : "bg-slate-50 border-slate-100 text-slate-900 focus:border-orange-200",
              )}
            >
              <option value="" className="opacity-50">
                -- DETECTING MODULES --
              </option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.courseId?.courseCode} || {exam.courseId?.courseTitle} (
                  {exam.status.toUpperCase()})
                </option>
              ))}
            </select>
            <ChevronDown
              className={cn(
                "absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-40",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedExam ? (
            <motion.div
              key="audit-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "AUDITED TRANSMISSIONS",
                    value: submissions.length,
                    icon: Users,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                  {
                    label: "QUALIFIED (PASSED)",
                    value: passed,
                    icon: ShieldCheck,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    label: "UNQUALIFIED (FAILED)",
                    value: failed,
                    icon: XCircle,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                  },
                  {
                    label: "AVERAGE SYNDROME",
                    value: `${avgScore.toFixed(1)}%`,
                    icon: TrendingUp,
                    color: "text-orange-500",
                    bg: "bg-orange-500/10",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "p-8 rounded-[2.5rem] border-2 relative overflow-hidden group transition-all",
                      isDarkMode
                        ? "bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30"
                        : "bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-orange-200",
                    )}
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                        stat.bg,
                        stat.color,
                      )}
                    >
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50",
                          isDarkMode ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        {stat.label}
                      </p>
                      <h4
                        className={cn(
                          "text-3xl font-black italic tracking-tighter",
                          isDarkMode ? "text-white" : "text-slate-900",
                        )}
                      >
                        {submissionsLoading ? (
                          <Skeleton width={60} />
                        ) : (
                          stat.value
                        )}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Controls Terminal */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1">
                  <Search
                    className={cn(
                      "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  />
                  <input
                    type="text"
                    placeholder="Search by student identity or matric core..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 font-bold text-sm outline-none transition-all",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-orange-500/50"
                        : "bg-white border-slate-100 text-slate-900 placeholder-slate-400 focus:border-orange-200 shadow-lg shadow-slate-100",
                    )}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "px-6 py-5 rounded-[2rem] border-2 flex items-center gap-3",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-100 shadow-lg shadow-slate-100",
                    )}
                  >
                    <Filter size={18} className="text-orange-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={cn(
                        "bg-transparent font-black text-xs uppercase tracking-widest outline-none appearance-none pr-6",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      <option value="all">ALL SECTORS</option>
                      <option value="passed">QUALIFIED</option>
                      <option value="failed">REJECTED</option>
                      <option value="pending">PENDING</option>
                    </select>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => refetch()}
                    className={cn(
                      "w-[60px] h-[60px] rounded-[2rem] border-2 flex items-center justify-center transition-all",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        : "bg-white border-slate-100 text-slate-400 hover:text-orange-500 shadow-lg shadow-slate-100",
                    )}
                  >
                    <RefreshCw size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Results Table Terminal */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-[3rem] border-2 overflow-hidden",
                  isDarkMode
                    ? "bg-slate-800/40 border-slate-700/50"
                    : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
                )}
              >
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr
                        className={cn(
                          "border-b-2",
                          isDarkMode
                            ? "border-slate-700 bg-slate-900/40"
                            : "border-slate-100 bg-slate-50/50",
                        )}
                      >
                        {[
                          "STUDENT IDENTITY",
                          "REGISTRY NO.",
                          "PERFORMANCE %",
                          "AUDIT STATUS",
                          "TIMESTAMP",
                          "COMMANDS",
                        ].map((header) => (
                          <th
                            key={header}
                            className={cn(
                              "px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em]",
                              isDarkMode ? "text-slate-500" : "text-slate-400",
                            )}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100/5">
                      {submissionsLoading ? (
                        Array(5)
                          .fill(0)
                          .map((_, idx) => (
                            <tr key={idx}>
                              {Array(6)
                                .fill(0)
                                .map((__, cidx) => (
                                  <td key={cidx} className="px-8 py-6">
                                    <Skeleton height={25} borderRadius={10} />
                                  </td>
                                ))}
                            </tr>
                          ))
                      ) : filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((sub, idx) => (
                          <motion.tr
                            key={sub._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                              "transition-all group",
                              isDarkMode
                                ? "hover:bg-slate-900/40"
                                : "hover:bg-slate-50/50",
                            )}
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                                    isDarkMode
                                      ? "bg-slate-900 text-blue-400"
                                      : "bg-blue-50 text-blue-600",
                                  )}
                                >
                                  {sub.studentId?.fullname?.substring(0, 1)}
                                </div>
                                <span
                                  className={cn(
                                    "font-black tracking-tight",
                                    isDarkMode
                                      ? "text-white"
                                      : "text-slate-900",
                                  )}
                                >
                                  {sub.studentId?.fullname || "Unknown Entity"}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-xs font-black opacity-60 tracking-tighter">
                              {sub.studentId?.matricNumber || "DEP-REDACTED"}
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "h-2 w-12 rounded-full overflow-hidden",
                                    isDarkMode
                                      ? "bg-slate-700"
                                      : "bg-slate-100",
                                  )}
                                >
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${sub.percentage}%` }}
                                    className={cn(
                                      "h-full",
                                      sub.percentage >= 70
                                        ? "bg-emerald-500"
                                        : sub.percentage >= 50
                                          ? "bg-orange-500"
                                          : "bg-red-500",
                                    )}
                                  />
                                </div>
                                <span
                                  className={cn(
                                    "font-black italic text-sm",
                                    sub.percentage >= 70
                                      ? "text-emerald-500"
                                      : sub.percentage >= 50
                                        ? "text-orange-500"
                                        : "text-red-500",
                                  )}
                                >
                                  {sub.percentage?.toFixed(1) || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span
                                className={cn(
                                  "px-3 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest",
                                  sub.passed
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : "bg-red-500/10 text-red-500 border-red-500/20",
                                )}
                              >
                                {sub.passed ? "QUALIFIED" : "UNQUALIFIED"}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-xs font-bold opacity-40">
                              {new Date(sub.submittedAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td className="px-8 py-6">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                  "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all",
                                  isDarkMode
                                    ? "bg-slate-900 border-slate-800 text-blue-400 hover:border-blue-500"
                                    : "bg-slate-50 border-slate-100 text-blue-600 hover:border-blue-200",
                                )}
                              >
                                <Eye size={18} />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-24 text-center">
                            <div
                              className={cn(
                                "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4",
                                isDarkMode
                                  ? "bg-slate-800 text-slate-700"
                                  : "bg-slate-50 text-slate-200",
                              )}
                            >
                              <Layers size={32} />
                            </div>
                            <p
                              className={cn(
                                "text-lg font-black italic",
                                isDarkMode
                                  ? "text-slate-500"
                                  : "text-slate-300",
                              )}
                            >
                              ZERO DATA CORRELATION DETECTED
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "py-32 rounded-[4rem] border-4 border-dashed flex flex-col items-center justify-center text-center",
                isDarkMode
                  ? "bg-slate-800/20 border-slate-700/50 text-slate-500"
                  : "bg-slate-50 border-slate-100 text-slate-300",
              )}
            >
              <Award size={64} className="mb-8 opacity-30" />
              <h4 className="text-2xl font-black italic mb-2 tracking-tight">
                STATION STANDBY
              </h4>
              <p className="text-sm font-bold opacity-40 max-w-xs mx-auto uppercase tracking-widest leading-loose">
                Select an active module transmission from the Registry to
                initiate Performance Audit
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LecturerPage>
  );
};

export default ExamResults;
