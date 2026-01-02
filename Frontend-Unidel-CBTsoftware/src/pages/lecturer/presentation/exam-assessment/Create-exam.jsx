/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BookOpen, CheckCircle2, Clock, Eye, AlertCircle } from "lucide-react";
import { useGetLecturerQuestionBanksAction } from "../../../../store/exam-store";

const CreateExam = () => {
  const navigate = useNavigate();
  // Fetch only approved question banks
  const { questionBanks = [], isLoading } = useGetLecturerQuestionBanksAction({ status: "approved" });
  const [selectedBankId, setSelectedBankId] = useState(null);

  const selectedBank = useMemo(
    () => questionBanks.find((qb) => qb._id === selectedBankId),
    [questionBanks, selectedBankId]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Exam</h1>
          <p className="text-slate-600">Select an approved question bank to publish as an exam.</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Approved Question Banks
          </h2>
          {isLoading ? (
            <div className="py-8 text-center text-slate-400">Loading...</div>
          ) : questionBanks.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No approved question banks found.</div>
          ) : (
            <div className="space-y-4">
              {questionBanks.map((qb) => (
                <motion.div
                  key={qb._id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedBankId === qb._id
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 bg-white hover:border-orange-300"
                  }`}
                  onClick={() => setSelectedBankId(qb._id)}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-900" />
                    <span className="font-bold text-orange-600">{qb.courseId?.courseCode}</span>
                    <span className="text-slate-900 font-medium">{qb.title}</span>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  </div>
                  <div className="text-slate-600 text-sm mt-1">{qb.description}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {qb.questions?.length || 0} questions
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {selectedBank && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-900" />
              Preview Questions
            </h2>
            <div className="space-y-3 mb-6">
              {selectedBank.questions.map((q, idx) => (
                <div key={q._id || idx} className="p-3 border border-slate-100 rounded-lg">
                  <div className="font-semibold text-slate-800 mb-1">
                    Q{idx + 1}. {q.question}
                  </div>
                  <ul className="ml-6 list-disc text-slate-700 text-sm">
                    {q.options.map((opt, i) => (
                      <li key={i} className={opt === q.correctAnswer ? "text-green-700 font-semibold" : ""}>
                        {String.fromCharCode(65 + i)}. {opt}
                        {opt === q.correctAnswer && " ✓"}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-slate-500 mt-1">
                    Marks: {q.marks} | Difficulty: {q.difficulty}
                  </div>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              onClick={() => navigate(`/lecturer/exams/schedule`, { state: { questionBankId: selectedBank._id } })}
            >
              <Clock className="w-5 h-5" />
              Publish Exam
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateExam;
