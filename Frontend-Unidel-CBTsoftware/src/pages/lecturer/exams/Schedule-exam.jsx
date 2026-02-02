/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Save,
  AlertCircle,
  Timer,
  CalendarClock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
} from "lucide-react";
import { useCreateExamFromQuestionBankAction } from "../../../store/exam-store";
import useThemeStore from "../../../store/theme-store";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import { cn } from "../../../core/lib/cn";

const ScheduleExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { questionBankId } = location.state || {};
  const { createExamFromQuestionBank, isLoading } =
    useCreateExamFromQuestionBankAction();

  const [form, setForm] = useState({
    duration: 60,
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError("");

    if (!questionBankId) {
      setError("No question bank selected.");
      return;
    }

    if (!form.startTime || !form.endTime || !form.duration) {
      setError("All fields are required.");
      return;
    }

    //  Validate that end time is after start time
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);

    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }

    try {
      await createExamFromQuestionBank({
        questionBankId,
        duration: parseInt(form.duration),
        startTime: form.startTime,
        endTime: form.endTime,
      });
      navigate("/lecturer/exams/manage");
    } catch (err) {
      setError(err.message || "Failed to schedule exam.");
    }
  };

  return (
    <LecturerPage
      title="Temporal Sequencing"
      subtitle="Calibrate the execution parameters for your examination transmission"
      icon={LecturerIcons.Schedule}
    >
      <div className="max-w-4xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Side */}
          <div className="lg:col-span-12">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "rounded-[3rem] border-2 p-10 relative overflow-hidden",
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50",
              )}
              onSubmit={handleSchedule}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

              <div className="flex items-center gap-4 mb-12">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    isDarkMode
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-orange-50 text-orange-600",
                  )}
                >
                  <Cpu size={24} />
                </div>
                <div>
                  <h3
                    className={cn(
                      "text-xl font-black italic",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    Chronos Config
                  </h3>
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest opacity-50",
                      isDarkMode ? "text-slate-400" : "text-slate-500",
                    )}
                  >
                    Define session timeline and duration
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Duration Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-50",
                      isDarkMode ? "text-slate-400" : "text-slate-500",
                    )}
                  >
                    MISSION DURATION (MINUTES)
                  </label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500">
                      <Timer size={20} />
                    </div>
                    <input
                      type="number"
                      min={10}
                      max={300}
                      value={form.duration}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, duration: e.target.value }))
                      }
                      className={cn(
                        "w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 font-black text-sm outline-none transition-all",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white focus:border-orange-500/50"
                          : "bg-slate-50 border-slate-100 text-slate-900 focus:border-orange-200",
                      )}
                      placeholder="60"
                      required
                    />
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Start Time Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label
                      className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-50",
                        isDarkMode ? "text-slate-400" : "text-slate-500",
                      )}
                    >
                      INITIALIZE SEQUENCE (START)
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500">
                        <CalendarClock size={20} />
                      </div>
                      <input
                        type="datetime-local"
                        value={form.startTime}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, startTime: e.target.value }))
                        }
                        className={cn(
                          "w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 font-black text-sm outline-none transition-all",
                          isDarkMode
                            ? "bg-slate-900 border-slate-700 text-white focus:border-emerald-500/30 [color-scheme:dark]"
                            : "bg-slate-50 border-slate-100 text-slate-900 focus:border-emerald-200 [color-scheme:light]",
                        )}
                        required
                      />
                    </div>
                  </motion.div>

                  {/* End Time Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label
                      className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] mb-3 block opacity-50",
                        isDarkMode ? "text-slate-400" : "text-slate-500",
                      )}
                    >
                      TERMINATE SEQUENCE (END)
                    </label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500">
                        <Clock size={20} />
                      </div>
                      <input
                        type="datetime-local"
                        value={form.endTime}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, endTime: e.target.value }))
                        }
                        className={cn(
                          "w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 font-black text-sm outline-none transition-all",
                          isDarkMode
                            ? "bg-slate-900 border-slate-700 text-white focus:border-red-500/30 [color-scheme:dark]"
                            : "bg-slate-50 border-slate-100 text-slate-900 focus:border-red-200 [color-scheme:light]",
                        )}
                        required
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "mt-8 p-6 rounded-[2rem] border-2 flex items-center gap-4",
                      isDarkMode
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-red-50 border-red-100 text-red-600",
                    )}
                  >
                    <AlertCircle size={20} />
                    <p className="text-xs font-black uppercase tracking-widest">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={cn(
                  "mt-12 w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl",
                  isDarkMode
                    ? "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-400"
                    : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800",
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    COMMITTING...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    COMMIT TRANSMISSION
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>

              <p
                className={cn(
                  "mt-6 text-center text-[10px] font-black uppercase tracking-widest opacity-40",
                  isDarkMode ? "text-slate-400" : "text-slate-500",
                )}
              >
                VERIFY TEMPORAL SYNC BEFORE COMMITTING
              </p>
            </motion.form>
          </div>
        </div>
      </div>
    </LecturerPage>
  );
};

export default ScheduleExam;
