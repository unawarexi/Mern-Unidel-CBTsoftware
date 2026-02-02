/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  useGetLecturerExamsAction,
  useDeleteExamAction,
  useUpdateExamAction,
} from "../../../store/exam-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Trash2,
  Edit2,
  XCircle,
  Clock,
  CheckCircle2,
  Save,
  AlertCircle,
  MoreVertical,
  Calendar,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";

const ManageExams = () => {
  const { isDarkMode } = useThemeStore();
  const { exams = [], isLoading, refetch } = useGetLecturerExamsAction();
  const { deleteExam } = useDeleteExamAction();
  const { updateExam } = useUpdateExamAction();
  const [selectedExam, setSelectedExam] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");

  const statusConfigs = {
    pending: {
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      icon: Clock,
      label: "PENDING SYNC",
    },
    active: {
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: CheckCircle2,
      label: "LIVE STREAM",
    },
    completed: {
      color: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      icon: Shield,
      label: "ARCHIVED",
    },
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ARE YOU SURE YOU WANT TO DE-INDEX THIS EXAMINATION?"))
      return;
    await deleteExam(id);
    refetch();
  };

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setEditForm({
      duration: exam.duration,
      startTime: exam.startTime ? exam.startTime.slice(0, 16) : "",
      endTime: exam.endTime ? exam.endTime.slice(0, 16) : "",
    });
    setEditMode(true);
    setError("");
  };

  const handleUpdate = async () => {
    setError("");
    if (!editForm.duration || !editForm.startTime || !editForm.endTime) {
      setError("MANDATORY BIOMETRICS MISSING.");
      return;
    }
    try {
      await updateExam(selectedExam._id, {
        duration: editForm.duration,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
      });
      setEditMode(false);
      setSelectedExam(null);
      refetch();
    } catch (err) {
      setError(err.message || "FAILED TO SYNCHRONIZE CORE.");
    }
  };

  return (
    <LecturerPage
      title="Examination Registry"
      subtitle="Total administrative control over live academic streams and archived assessments"
      icon={LecturerIcons.Settings}
    >
      <div className="max-w-7xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
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
                    "COURSE CODE",
                    "OPERATIONAL DURATION",
                    "TRANSMISSION START",
                    "TRANSMISSION END",
                    "CORE STATUS",
                    "COMMANDS",
                  ].map((header) => (
                    <th
                      key={header}
                      className={cn(
                        "text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]",
                        isDarkMode ? "text-slate-500" : "text-slate-400",
                      )}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100/5 blur-none">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <tr key={idx}>
                        <td colSpan={6} className="px-8 py-6">
                          <Skeleton height={30} borderRadius={12} />
                        </td>
                      </tr>
                    ))
                ) : exams.length === 0 ? (
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
                          isDarkMode ? "text-slate-500" : "text-slate-300",
                        )}
                      >
                        REGISTRY IS CURRENTLY VACANT
                      </p>
                    </td>
                  </tr>
                ) : (
                  exams.map((exam, idx) => (
                    <motion.tr
                      key={exam._id}
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
                                ? "bg-slate-900 text-orange-400"
                                : "bg-orange-100 text-orange-700",
                            )}
                          >
                            {exam.courseId?.courseCode?.substring(0, 3)}
                          </div>
                          <span
                            className={cn(
                              "font-black tracking-tight",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            {exam.courseId?.courseCode || "UNC-404"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-blue-500" />
                          <span
                            className={cn(
                              "text-sm font-bold",
                              isDarkMode ? "text-slate-300" : "text-slate-700",
                            )}
                          >
                            {exam.duration} MINUTES
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-500" />
                          <span
                            className={cn(
                              "text-xs font-bold",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            {exam.startTime
                              ? new Date(exam.startTime).toLocaleString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-500" />
                          <span
                            className={cn(
                              "text-xs font-bold",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            {exam.endTime
                              ? new Date(exam.endTime).toLocaleString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {statusConfigs[exam.status] && (
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-[10px] font-black tracking-widest",
                              statusConfigs[exam.status].color,
                            )}
                          >
                            {React.createElement(
                              statusConfigs[exam.status].icon,
                              { size: 12 },
                            )}
                            {statusConfigs[exam.status].label}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {[
                            {
                              icon: Eye,
                              onClick: () => setSelectedExam(exam),
                              color: "blue",
                              label: "Inspect",
                            },
                            {
                              icon: Edit2,
                              onClick: () => handleEdit(exam),
                              color: "emerald",
                              label: "Modify",
                            },
                            {
                              icon: Trash2,
                              onClick: () => handleDelete(exam._id),
                              color: "red",
                              label: "De-index",
                            },
                          ].map((btn, i) => (
                            <motion.button
                              key={i}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={btn.onClick}
                              className={cn(
                                "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all",
                                isDarkMode
                                  ? `bg-slate-900 border-slate-800 text-${btn.color}-400 hover:border-${btn.color}-500/50`
                                  : `bg-slate-50 border-slate-100 text-${btn.color}-600 hover:border-${btn.color}-200`,
                              )}
                              title={btn.label}
                            >
                              <btn.icon size={18} />
                            </motion.button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Unified Modal Interface */}
        <AnimatePresence>
          {selectedExam && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={() => {
                  setSelectedExam(null);
                  setEditMode(false);
                }}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className={cn(
                  "relative w-full max-w-2xl rounded-[3rem] border-2 overflow-hidden shadow-2xl",
                  isDarkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200",
                )}
              >
                {editMode ? (
                  /* MODIFY TERMINAL */
                  <div className="p-10 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Edit2 size={28} />
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "text-2xl font-black italic",
                            isDarkMode ? "text-white" : "text-slate-900",
                          )}
                        >
                          MODIFY PROTOCOL
                        </h3>
                        <p
                          className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] opacity-50",
                            isDarkMode ? "text-slate-400" : "text-slate-500",
                          )}
                        >
                          Course: {selectedExam.courseId?.courseCode}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-full">
                        <label
                          className={cn(
                            "block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60",
                            isDarkMode ? "text-slate-400" : "text-slate-500",
                          )}
                        >
                          OPERATIONAL DURATION (MINUTES)
                        </label>
                        <input
                          type="number"
                          value={editForm.duration}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              duration: e.target.value,
                            })
                          }
                          className={cn(
                            "w-full px-6 py-4 rounded-3xl border-2 font-black text-sm transition-all outline-none",
                            isDarkMode
                              ? "bg-slate-800 border-slate-700 text-white focus:border-emerald-500"
                              : "bg-slate-50 border-slate-100 text-slate-900 focus:border-emerald-200",
                          )}
                        />
                      </div>
                      <div>
                        <label
                          className={cn(
                            "block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60",
                            isDarkMode ? "text-slate-400" : "text-slate-500",
                          )}
                        >
                          TRANSMISSION START
                        </label>
                        <input
                          type="datetime-local"
                          value={editForm.startTime}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              startTime: e.target.value,
                            })
                          }
                          className={cn(
                            "w-full px-6 py-4 rounded-3xl border-2 font-black text-sm transition-all outline-none [color-scheme:dark]",
                            isDarkMode
                              ? "bg-slate-800 border-slate-700 text-white focus:border-emerald-500"
                              : "bg-slate-50 border-slate-100 text-slate-900 focus:border-emerald-200",
                          )}
                        />
                      </div>
                      <div>
                        <label
                          className={cn(
                            "block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60",
                            isDarkMode ? "text-slate-400" : "text-slate-500",
                          )}
                        >
                          TRANSMISSION END
                        </label>
                        <input
                          type="datetime-local"
                          value={editForm.endTime}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              endTime: e.target.value,
                            })
                          }
                          className={cn(
                            "w-full px-6 py-4 rounded-3xl border-2 font-black text-sm transition-all outline-none [color-scheme:dark]",
                            isDarkMode
                              ? "bg-slate-800 border-slate-700 text-white focus:border-emerald-500"
                              : "bg-slate-50 border-slate-100 text-slate-900 focus:border-emerald-200",
                          )}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/20 text-red-500 text-xs font-black uppercase tracking-wider flex items-center gap-3">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdate}
                        className="flex-1 bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
                      >
                        <Save size={18} /> SYNCHRONIZE
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedExam(null);
                          setEditMode(false);
                        }}
                        className={cn(
                          "px-10 py-5 rounded-[2rem] border-2 font-black text-xs uppercase tracking-[0.2em] transition-all",
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-slate-500"
                            : "bg-slate-50 border-slate-100 text-slate-400",
                        )}
                      >
                        ABORT
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  /* INSPECT TERMINAL */
                  <div className="p-10">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <Shield size={28} />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "text-2xl font-black italic",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            REGISTRY INSPECTION
                          </h3>
                          <p
                            className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em] opacity-50",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            Reference: {selectedExam._id?.substring(0, 12)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedExam(null)}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all",
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-slate-500"
                            : "bg-slate-50 border-slate-100 text-slate-400",
                        )}
                      >
                        <XCircle size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                      {[
                        {
                          label: "COURSE CODE",
                          value: selectedExam.courseId?.courseCode,
                          icon: Layers,
                        },
                        {
                          label: "DURATION",
                          value: `${selectedExam.duration} MINUTES`,
                          icon: Clock,
                        },
                        {
                          label: "TRANSMISSION WINDOW",
                          value: `${new Date(selectedExam.startTime).toLocaleTimeString()} - ${new Date(selectedExam.endTime).toLocaleTimeString()}`,
                          icon: Calendar,
                          full: true,
                        },
                        {
                          label: "INDEX STATUS",
                          value: selectedExam.status.toUpperCase(),
                          icon: Zap,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={cn(
                            "p-6 rounded-[2rem] border-2",
                            isDarkMode
                              ? "bg-slate-800/20 border-slate-700/50"
                              : "bg-slate-50/50 border-slate-100",
                            item.full && "col-span-full",
                          )}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <item.icon size={14} className="text-blue-500" />
                            <span
                              className={cn(
                                "text-[10px] font-black uppercase tracking-widest opacity-60",
                                isDarkMode
                                  ? "text-slate-400"
                                  : "text-slate-500",
                              )}
                            >
                              {item.label}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-lg font-black tracking-tight",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4
                        className={cn(
                          "text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2",
                          isDarkMode ? "text-slate-500" : "text-slate-400",
                        )}
                      >
                        <ArrowRight size={14} className="text-orange-500" />{" "}
                        QUESTION BLUEPRINT
                      </h4>
                      <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {selectedExam.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "p-5 rounded-3xl border-2",
                              isDarkMode
                                ? "bg-slate-950/40 border-slate-800"
                                : "bg-slate-50 border-slate-200/50",
                            )}
                          >
                            <div className="flex gap-4">
                              <span className="text-xl font-black italic opacity-10">
                                {idx + 1}
                              </span>
                              <p
                                className={cn(
                                  "text-sm font-bold leading-relaxed",
                                  isDarkMode
                                    ? "text-slate-300"
                                    : "text-slate-700",
                                )}
                              >
                                {q.question}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedExam(null)}
                      className="w-full mt-10 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all border-2 border-slate-800"
                    >
                      CLOSE INSPECTION
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </LecturerPage>
  );
};

export default ManageExams;
