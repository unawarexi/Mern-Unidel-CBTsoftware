import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Award,
  Clock,
  Target,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  Percent,
  FileSpreadsheet,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetLecturerDashboardStatsAction } from "../../../store/statistics-store";
import { useGetLecturerExamsAction } from "../../../store/exam-store";
import { useGetExamSubmissionsAction } from "../../../store/submission-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Statistics = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedExam, setSelectedExam] = useState(null);

  const { dashboardStats, isLoading: statsLoading } =
    useGetLecturerDashboardStatsAction({});
  const { exams = [], isLoading: examsLoading } = useGetLecturerExamsAction();
  const { submissions = [], isLoading: submissionsLoading } =
    useGetExamSubmissionsAction(selectedExam?._id, { page: 1, limit: 500 });

  // Calculate statistics
  const calculateStats = () => {
    if (submissions.length === 0) {
      return {
        mean: 0,
        median: 0,
        mode: 0,
        stdDev: 0,
        min: 0,
        max: 0,
        range: 0,
      };
    }

    const scores = submissions
      .map((s) => s.percentage || 0)
      .sort((a, b) => a - b);
    const n = scores.length;

    // Mean
    const mean = scores.reduce((a, b) => a + b, 0) / n;

    // Median
    const median =
      n % 2 === 0
        ? (scores[n / 2 - 1] + scores[n / 2]) / 2
        : scores[Math.floor(n / 2)];

    // Mode
    const freq = {};
    scores.forEach((s) => {
      freq[Math.round(s)] = (freq[Math.round(s)] || 0) + 1;
    });
    const mode = parseInt(
      Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b)),
    );

    // Standard Deviation
    const variance =
      scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Min, Max, Range
    const min = scores[0];
    const max = scores[n - 1];
    const range = max - min;

    return { mean, median, mode, stdDev, min, max, range };
  };

  const stats = calculateStats();

  // Question analysis (mock based on exam)
  const questionAnalysis =
    selectedExam?.questions?.slice(0, 5).map((q, idx) => ({
      question: `Q${idx + 1}`,
      correct: Math.floor(Math.random() * 80) + 20,
      difficulty:
        Math.random() > 0.5 ? "Medium" : Math.random() > 0.5 ? "Hard" : "Easy",
    })) || [];

  return (
    <LecturerPage
      title="Detailed Statistics"
      subtitle="In-depth statistical analysis"
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
          <>
            {/* Central Tendency */}
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
                Central Tendency
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Mean",
                    value: `${stats.mean.toFixed(1)}%`,
                    icon: Award,
                    color: "text-purple-500",
                  },
                  {
                    label: "Median",
                    value: `${stats.median.toFixed(1)}%`,
                    icon: Target,
                    color: "text-blue-500",
                  },
                  {
                    label: "Mode",
                    value: `${stats.mode}%`,
                    icon: Percent,
                    color: "text-green-500",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-4 rounded-2xl text-center",
                      isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                    )}
                  >
                    <item.icon
                      className={cn("w-6 h-6 mx-auto mb-2", item.color)}
                    />
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {submissionsLoading ? (
                        <Skeleton width={50} />
                      ) : (
                        item.value
                      )}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Dispersion */}
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
                Dispersion Measures
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Std Deviation", value: stats.stdDev.toFixed(2) },
                  { label: "Range", value: `${stats.range.toFixed(1)}%` },
                  { label: "Min Score", value: `${stats.min.toFixed(1)}%` },
                  { label: "Max Score", value: `${stats.max.toFixed(1)}%` },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-4 rounded-xl text-center",
                      isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                    )}
                  >
                    <p
                      className={cn(
                        "text-xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {submissionsLoading ? (
                        <Skeleton width={40} />
                      ) : (
                        item.value
                      )}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Exam Info */}
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
                Exam Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Submissions",
                    value: submissions.length,
                    icon: Users,
                  },
                  {
                    label: "Questions",
                    value: selectedExam.questions?.length || 0,
                    icon: FileSpreadsheet,
                  },
                  {
                    label: "Duration",
                    value: `${selectedExam.duration || 0} mins`,
                    icon: Clock,
                  },
                  {
                    label: "Pass Mark",
                    value: `${selectedExam.passMark || 40}%`,
                    icon: Target,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl",
                      isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-slate-400" : "text-gray-500",
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          "font-bold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {item.value}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Question Analysis */}
            {questionAnalysis.length > 0 && (
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
                  Question Analysis
                </h3>
                <div className="space-y-3">
                  {questionAnalysis.map((q, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                      )}
                    >
                      <span
                        className={cn(
                          "font-medium",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {q.question}
                      </span>
                      <div className="flex items-center gap-4">
                        <span
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-gray-600",
                          )}
                        >
                          {q.correct}% correct
                        </span>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            q.difficulty === "Easy"
                              ? "bg-emerald-500/20 text-emerald-500"
                              : q.difficulty === "Medium"
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-red-500/20 text-red-500",
                          )}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
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
            <p className="font-medium">Select an exam to view statistics</p>
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default Statistics;
