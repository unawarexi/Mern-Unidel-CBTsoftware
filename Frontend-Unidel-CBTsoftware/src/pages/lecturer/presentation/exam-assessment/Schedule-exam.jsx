/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Save, AlertCircle, Timer, CalendarClock, Sparkles } from "lucide-react";
import { useCreateExamFromQuestionBankAction } from "../../../../store/exam-store";

const ScheduleExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questionBankId } = location.state || {};
  const { createExamFromQuestionBank, isLoading } = useCreateExamFromQuestionBankAction();

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
      //  This now creates only ONE exam since we removed automatic creation on approval
      await createExamFromQuestionBank({
        questionBankId,
        duration: parseInt(form.duration), // Ensure it's a number
        startTime: form.startTime,
        endTime: form.endTime,
      });
      navigate("/lecturer/exams/manage");
    } catch (err) {
      setError(err.message || "Failed to schedule exam.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-slate-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <CalendarClock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Schedule Exam
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <p className="text-slate-600 text-sm">Configure your exam schedule with precision</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300" 
          onSubmit={handleSchedule}
        >
          <div className="space-y-6">
            {/* Duration Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <div className="p-1.5 bg-orange-50 rounded-lg">
                  <Timer className="w-4 h-4 text-orange-600" />
                </div>
                Exam Duration (minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 hover:border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium"
                  placeholder="Enter duration in minutes"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                  mins
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Recommended: 60-120 minutes for comprehensive exams
              </p>
            </motion.div>

            {/* Start Time Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <div className="p-1.5 bg-green-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                Exam Start Time
              </label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 hover:border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium [color-scheme:light]"
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                When students can begin taking the exam
              </p>
            </motion.div>

            {/* End Time Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <div className="p-1.5 bg-red-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-red-600" />
                </div>
                Exam End Time
              </label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 hover:border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium [color-scheme:light]"
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                Deadline for exam submission
              </p>
            </motion.div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mt-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm"
              >
                <div className="p-1 bg-red-200 rounded-lg shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-700" />
                </div>
                <div className="flex-1">
                  <p className="text-red-800 font-semibold text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling Exam...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                Schedule Exam
              </>
            )}
          </motion.button>

          {/* Helper Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-center text-xs text-slate-500"
          >
            Double-check all details before scheduling. Changes can be made later.
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
};

export default ScheduleExam;
