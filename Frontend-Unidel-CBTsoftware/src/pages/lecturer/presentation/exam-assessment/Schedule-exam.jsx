/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Save, AlertCircle } from "lucide-react";
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
    
    // ✅ Validate that end time is after start time
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    
    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }
    
    try {
      // ✅ This now creates only ONE exam since we removed automatic creation on approval
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Schedule Exam</h1>
          <p className="text-slate-600">Set the start time, end time, and duration for your exam.</p>
        </motion.div>
        <form className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-6" onSubmit={handleSchedule}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              min={10}
              max={300}
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isLoading ? "Scheduling..." : "Schedule Exam"}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleExam;
