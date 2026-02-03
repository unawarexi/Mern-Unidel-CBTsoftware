import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  X,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  useAgentExams,
  useCreateAgentExam,
  useAgentQuestionBanks,
} from "../../../hooks/useAgent";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { toast } from "react-hot-toast";

const AgentExams = () => {
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    examType: "General",
    duration: 60,
    startTime: "",
    questionBankId: "",
  });

  const { data: exams = [], isLoading } = useAgentExams();
  const { data: qBanks = [], isLoading: qBanksLoading } =
    useAgentQuestionBanks();
  const createExamMutation = useCreateAgentExam();

  const filteredExams = exams.filter((e) =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExamMutation.mutateAsync(formData);
      toast.success("Exam scheduled successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to create exam");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
            Active
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className={cn(
                "text-2xl sm:text-3xl font-bold mb-1",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Exam Management
            </h1>
            <p
              className={cn(
                "text-sm sm:text-base",
                isDarkMode ? "text-slate-400" : "text-gray-600",
              )}
            >
              Create and monitor exams for your students.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <PlusCircle size={18} />
            <span>Create New Exam</span>
          </button>
        </header>

        <div
          className={cn(
            "mb-6 relative max-w-md",
            isDarkMode ? "text-white" : "text-gray-900",
          )}
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exams..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-xl border outline-none transition-all",
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500",
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl p-6 border shadow-sm",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-gray-100",
                  )}
                >
                  <Skeleton
                    height={200}
                    baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  />
                </div>
              ))
          ) : filteredExams.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              No exams found. Click "Create New Exam" to start.
            </div>
          ) : (
            filteredExams.map((exam) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-100",
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isDarkMode
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-blue-50 text-blue-600",
                    )}
                  >
                    <FileText size={20} />
                  </div>
                  {getStatusBadge(exam.status)}
                </div>
                <h3
                  className={cn(
                    "text-lg font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {exam.title}
                </h3>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span>
                      {exam.startTime
                        ? new Date(exam.startTime).toLocaleString()
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={14} />
                    <span>Duration: {exam.duration} mins</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                  <div className="text-xs font-medium text-gray-500">
                    Created: {new Date(exam.createdAt).toLocaleDateString()}
                  </div>
                  <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-bold">
                    View Results
                    <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Exam Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-md rounded-2xl shadow-2xl p-6",
                isDarkMode ? "bg-slate-900" : "bg-white",
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={cn(
                    "text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Schedule New Exam
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-1",
                      isDarkMode ? "text-slate-400" : "text-gray-700",
                    )}
                  >
                    Exam Title
                  </label>
                  <input
                    required
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200",
                    )}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-1",
                      isDarkMode ? "text-slate-400" : "text-gray-700",
                    )}
                  >
                    Question Bank
                  </label>
                  <select
                    required
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border outline-none",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200",
                    )}
                    value={formData.questionBankId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        questionBankId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a Question Bank</option>
                    {qBanks.map((qb) => (
                      <option key={qb._id} value={qb._id}>
                        {qb.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? "text-slate-400" : "text-gray-700",
                      )}
                    >
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      required
                      className={cn(
                        "w-full px-4 py-2 rounded-lg border outline-none",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-200",
                      )}
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? "text-slate-400" : "text-gray-700",
                      )}
                    >
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className={cn(
                        "w-full px-4 py-2 rounded-lg border outline-none",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-200",
                      )}
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createExamMutation.isPending}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 mt-6"
                >
                  Create Exam
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentExams;
