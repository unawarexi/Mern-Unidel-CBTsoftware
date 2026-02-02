/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  Zap,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Target,
  Layers,
  Sparkles,
} from "lucide-react";
import { useGetLecturerQuestionBanksAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";

const CreateExam = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  // Fetch only approved question banks
  const { questionBanks = [], isLoading } = useGetLecturerQuestionBanksAction({
    status: "approved",
  });
  const [selectedBankId, setSelectedBankId] = useState(null);

  const selectedBank = useMemo(
    () => questionBanks.find((qb) => qb._id === selectedBankId),
    [questionBanks, selectedBankId],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <LecturerPage
      title="Examination Synthesis"
      subtitle="Transform validated question repositories into official academic assessments"
      icon={LecturerIcons.Assignment}
    >
      <div className="max-w-6xl mx-auto pb-20 space-y-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left Column: Repository Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className={cn(
                    "text-xl font-black italic mb-1",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  Qualified Repositories
                </h3>
                <p
                  className={cn(
                    "text-xs font-bold opacity-60 uppercase tracking-widest",
                    isDarkMode ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  Select an authorized bank to proceed
                </p>
              </div>
              <div
                className={cn(
                  "px-4 py-2 rounded-2xl border-2 flex items-center gap-2",
                  isDarkMode
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 border-emerald-100 text-emerald-600",
                )}
              >
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  Verified Stream
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height={120} borderRadius={24} />
                ))}
              </div>
            ) : questionBanks.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className={cn(
                  "p-12 rounded-[2.5rem] border-4 border-dashed text-center",
                  isDarkMode
                    ? "bg-slate-800/20 border-slate-700/50"
                    : "bg-slate-50 border-slate-100",
                )}
              >
                <div
                  className={cn(
                    "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6",
                    isDarkMode
                      ? "bg-slate-800 text-slate-700"
                      : "bg-white text-slate-200 shadow-xl",
                  )}
                >
                  <AlertCircle size={40} />
                </div>
                <p
                  className={cn(
                    "text-xl font-black italic",
                    isDarkMode ? "text-slate-500" : "text-slate-300",
                  )}
                >
                  No authorized banks detected
                </p>
                <p
                  className={cn(
                    "text-sm font-bold mt-2 opacity-60",
                    isDarkMode ? "text-slate-600" : "text-slate-400",
                  )}
                >
                  Submit your question modules for review first.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {questionBanks.map((qb) => (
                  <motion.div
                    key={qb._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "p-6 rounded-[2rem] border-2 cursor-pointer transition-all relative overflow-hidden group",
                      selectedBankId === qb._id
                        ? isDarkMode
                          ? "border-orange-500 bg-orange-500/10 shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]"
                          : "border-orange-500 bg-orange-50 shadow-[0_0_30px_-10px_rgba(249,115,22,0.2)]"
                        : isDarkMode
                          ? "border-slate-700/50 bg-slate-800/40 hover:border-orange-500/30"
                          : "bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-orange-200",
                    )}
                    onClick={() => setSelectedBankId(qb._id)}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-3",
                          selectedBankId === qb._id
                            ? "bg-orange-500 text-white"
                            : isDarkMode
                              ? "bg-slate-900/50 text-blue-400"
                              : "bg-blue-50 text-blue-600",
                        )}
                      >
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              "text-xs font-black px-2 py-0.5 rounded-lg",
                              isDarkMode
                                ? "bg-slate-900 text-orange-400"
                                : "bg-orange-100 text-orange-700",
                            )}
                          >
                            {qb.courseId?.courseCode}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-bold opacity-40",
                              isDarkMode ? "text-slate-500" : "text-slate-400",
                            )}
                          >
                            {qb.questions?.length || 0} SECTIONS
                          </span>
                        </div>
                        <h4
                          className={cn(
                            "text-lg font-black truncate",
                            isDarkMode ? "text-white" : "text-slate-900",
                          )}
                        >
                          {qb.title}
                        </h4>
                      </div>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                          selectedBankId === qb._id
                            ? "bg-orange-500 text-white scale-110"
                            : "opacity-0",
                        )}
                      >
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    {/* Background Progress style divider */}
                    <div
                      className={cn(
                        "mt-4 h-1 rounded-full w-full relative overflow-hidden",
                        isDarkMode ? "bg-slate-700" : "bg-slate-100",
                      )}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: selectedBankId === qb._id ? "100%" : "20%",
                        }}
                        className="absolute inset-y-0 left-0 bg-orange-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Preview & Finalize */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {selectedBank ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-6 space-y-6"
                >
                  <div
                    className={cn(
                      "p-8 rounded-[3rem] border-2 relative overflow-hidden",
                      isDarkMode
                        ? "bg-slate-800/40 border-slate-700/50"
                        : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
                    )}
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center",
                          isDarkMode
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-blue-50 text-blue-600",
                        )}
                      >
                        <Target size={24} />
                      </div>
                      <h3
                        className={cn(
                          "text-xl font-black",
                          isDarkMode ? "text-white" : "text-slate-900",
                        )}
                      >
                        Blueprint Preview
                      </h3>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedBank.questions.map((q, idx) => (
                        <div
                          key={q._id || idx}
                          className={cn(
                            "p-5 rounded-3xl border-2 transition-all group",
                            isDarkMode
                              ? "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                              : "bg-slate-50/50 border-slate-100 hover:border-slate-200",
                          )}
                        >
                          <div className="flex gap-4">
                            <span
                              className={cn(
                                "text-2xl font-black italic opacity-10 group-hover:opacity-20 transition-opacity",
                              )}
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1">
                              <p
                                className={cn(
                                  "text-sm font-bold mb-3 leading-relaxed",
                                  isDarkMode
                                    ? "text-slate-200"
                                    : "text-slate-700",
                                )}
                              >
                                {q.question}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={cn(
                                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                    isDarkMode
                                      ? "bg-slate-800 text-slate-400"
                                      : "bg-white border border-slate-100 text-slate-500",
                                  )}
                                >
                                  {q.marks} MARKS
                                </span>
                                <span
                                  className={cn(
                                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                    q.difficulty === "Easy"
                                      ? "text-emerald-500 bg-emerald-500/10"
                                      : q.difficulty === "Medium"
                                        ? "text-orange-500 bg-orange-500/10"
                                        : "text-red-500 bg-red-500/10",
                                  )}
                                >
                                  {q.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 bg-orange-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                      onClick={() =>
                        navigate(`/lecturer/exams/schedule`, {
                          state: { questionBankId: selectedBank._id },
                        })
                      }
                    >
                      <Zap className="w-5 h-5 fill-current" />
                      Finalize Synthesis
                    </motion.button>
                  </div>

                  {/* Additional info card */}
                  <div
                    className={cn(
                      "p-6 rounded-[2rem] border-2",
                      isDarkMode
                        ? "bg-blue-500/5 border-blue-500/10"
                        : "bg-blue-50 border-blue-100",
                    )}
                  >
                    <div className="flex gap-4">
                      <Sparkles className="text-blue-500 shrink-0" size={20} />
                      <p
                        className={cn(
                          "text-xs font-bold leading-relaxed",
                          isDarkMode ? "text-blue-400/80" : "text-blue-700/80",
                        )}
                      >
                        Published exams are immediately available for
                        scheduling. Ensure all assets and logic are validated
                        before synthesis.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "h-full p-12 rounded-[3.5rem] border-4 border-dashed flex flex-col items-center justify-center text-center",
                    isDarkMode
                      ? "bg-slate-800/20 border-slate-700/50"
                      : "bg-slate-50 border-slate-100",
                  )}
                >
                  <div
                    className={cn(
                      "w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner",
                      isDarkMode
                        ? "bg-slate-800 text-slate-700"
                        : "bg-white text-slate-200 shadow-xl",
                    )}
                  >
                    <Layers size={48} />
                  </div>
                  <h3
                    className={cn(
                      "text-xl font-black italic mb-2",
                      isDarkMode ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Awaiting Blueprint Selection
                  </h3>
                  <p
                    className={cn(
                      "text-sm font-bold opacity-40 max-w-[200px]",
                      isDarkMode ? "text-slate-600" : "text-slate-500",
                    )}
                  >
                    Choose a question bank from the left panel to begin
                    synthesis.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default CreateExam;
