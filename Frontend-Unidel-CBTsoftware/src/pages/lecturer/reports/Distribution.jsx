import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerDashboardStatsAction } from "../../../store/statistics-store";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Distribution = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedExam, setSelectedExam] = useState(null);

  const { dashboardStats, isLoading: statsLoading } =
    useGetLecturerDashboardStatsAction({});
  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const { submissions = [], isLoading: submissionsLoading } =
    useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 500 });

  // Calculate score distribution
  const getDistribution = () => {
    const ranges = [
      { range: "0-20%", min: 0, max: 20, count: 0, color: "#ef4444" },
      { range: "21-40%", min: 21, max: 40, count: 0, color: "#f97316" },
      { range: "41-60%", min: 41, max: 60, count: 0, color: "#eab308" },
      { range: "61-80%", min: 61, max: 80, count: 0, color: "#22c55e" },
      { range: "81-100%", min: 81, max: 100, count: 0, color: "#3b82f6" },
    ];

    submissions.forEach((sub) => {
      const score = sub.percentage || 0;
      for (const r of ranges) {
        if (score >= r.min && score <= r.max) {
          r.count++;
          break;
        }
      }
    });

    return ranges;
  };

  const distribution = getDistribution();

  // Grade distribution for pie chart
  const gradeDistribution = [
    {
      name: "A (80-100%)",
      value: submissions.filter((s) => s.percentage >= 80).length,
      color: "#22c55e",
    },
    {
      name: "B (60-79%)",
      value: submissions.filter((s) => s.percentage >= 60 && s.percentage < 80)
        .length,
      color: "#3b82f6",
    },
    {
      name: "C (50-59%)",
      value: submissions.filter((s) => s.percentage >= 50 && s.percentage < 60)
        .length,
      color: "#eab308",
    },
    {
      name: "D (40-49%)",
      value: submissions.filter((s) => s.percentage >= 40 && s.percentage < 50)
        .length,
      color: "#f97316",
    },
    {
      name: "F (0-39%)",
      value: submissions.filter((s) => s.percentage < 40).length,
      color: "#ef4444",
    },
  ];

  return (
    <LecturerPage
      title="Score Distribution"
      subtitle="Visualize score distribution across exams"
      icon={LecturerIcons.Reports}
    >
      <div className="space-y-6">
        {/* Exam Selector */}
        <div
          className={cn(
            "p-4 rounded-2xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <label
            className={cn(
              "text-sm font-medium mb-2 block",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Select Exam
          </label>
          <div className="relative">
            <select
              value={selectedExam?._id || ""}
              onChange={(e) =>
                setSelectedExam(
                  exams.find((ex) => ex._id === e.target.value) || null,
                )
              }
              className={cn(
                "w-full px-4 py-3 rounded-xl border appearance-none outline-none",
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-gray-200 text-gray-900",
              )}
            >
              <option value="">-- Select an exam --</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam._id}>
                  {exam.courseId?.courseCode} - {exam.courseId?.courseTitle}
                </option>
              ))}
            </select>
            <ChevronDown
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
          </div>
        </div>

        {selectedExam && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <h3
                className={cn(
                  "font-bold mb-4 flex items-center gap-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Score Range Distribution
              </h3>
              {submissionsLoading ? (
                <Skeleton height={250} />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={distribution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDarkMode ? "#334155" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="range"
                      stroke={isDarkMode ? "#94a3b8" : "#6b7280"}
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis stroke={isDarkMode ? "#94a3b8" : "#6b7280"} />
                    <Tooltip />
                    <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]}>
                      {distribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <h3
                className={cn(
                  "font-bold mb-4 flex items-center gap-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                Grade Distribution
              </h3>
              {submissionsLoading ? (
                <Skeleton height={250} />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {gradeDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>
        )}

        {/* Summary Stats */}
        {selectedExam && submissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/50 border-slate-700"
                : "bg-white border-gray-100",
            )}
          >
            <h3
              className={cn(
                "font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Distribution Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {distribution.map((d, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: d.color }}
                  >
                    {d.count}
                  </div>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    {d.range}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {submissions.length > 0
                      ? ((d.count / submissions.length) * 100).toFixed(0)
                      : 0}
                    %
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!selectedExam && !examsLoading && (
          <div
            className={cn(
              "text-center py-20 rounded-2xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Select an exam to view distribution</p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Distribution;
