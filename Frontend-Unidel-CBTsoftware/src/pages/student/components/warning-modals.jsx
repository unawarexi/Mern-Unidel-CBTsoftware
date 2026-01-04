/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, Shield, Eye, MonitorOff, Navigation, 
  Copy, X, CheckCircle, Clock, BookOpen, FileText, Lock
} from "lucide-react";

const ExamWarningModal = ({ isOpen, onClose, onProceed, exam }) => {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const handleScroll = (e) => {
    const element = e.target;
    const bottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 5;
    if (bottom) {
      setIsScrolledToBottom(true);
    }
  };

  const handleProceed = () => {
    if (hasReadTerms && isScrolledToBottom) {
      onProceed();
    }
  };

  if (!isOpen) return null;

  const rules = [
    {
      icon: Eye,
      title: "Stay Focused",
      description: "You must remain on the exam page. Switching tabs, windows, or apps will be detected.",
      severity: "high",
    },
    {
      icon: MonitorOff,
      title: "No Minimizing",
      description: "Do not minimize the browser window or switch to other applications during the exam.",
      severity: "high",
    },
    {
      icon: Navigation,
      title: "No Navigation",
      description: "Browser back/forward buttons are disabled. Attempting to navigate away will trigger a violation.",
      severity: "critical",
    },
    {
      icon: Copy,
      title: "No Copy/Paste",
      description: "Copying, pasting, or right-clicking is strictly prohibited and will be flagged.",
      severity: "medium",
    },
    {
      icon: Shield,
      title: "No Developer Tools",
      description: "Opening browser developer tools or console will be detected and flagged.",
      severity: "high",
    },
    {
      icon: Lock,
      title: "Fullscreen Mode",
      description: "Exam will run in fullscreen. Exiting fullscreen mode will trigger a warning.",
      severity: "medium",
    },
  ];

  const penalties = [
    {
      violations: "1-2 violations",
      penalty: "Warning issued - Exam continues",
      color: "text-yellow-700 bg-yellow-50",
    },
    {
      violations: "3 violations",
      penalty: "Automatic submission - Exam ends immediately",
      color: "text-red-700 bg-red-50",
    },
    {
      violations: "Multiple violations",
      penalty: "Flagged for review - May result in zero marks",
      color: "text-red-700 bg-red-50",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Exam Rules & Guidelines</h2>
                <p className="text-white text-opacity-90 text-sm">Please read carefully before proceeding</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Exam Info */}
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600 font-medium">Course</div>
                  <div className="text-sm font-semibold text-blue-900">
                    {exam?.courseId?.courseCode || "N/A"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600 font-medium">Duration</div>
                  <div className="text-sm font-semibold text-blue-900">
                    {exam?.duration || 0} minutes
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600 font-medium">Questions</div>
                  <div className="text-sm font-semibold text-blue-900">
                    {exam?.questions?.length || 0} questions
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div 
            className="px-6 py-6 max-h-[50vh] overflow-y-auto"
            onScroll={handleScroll}
          >
            {/* Integrity Notice */}
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Academic Integrity</h3>
                  <p className="text-sm text-red-800">
                    This exam is monitored by our fraud detection system. Any attempt to cheat, 
                    use unauthorized materials, or violate exam rules will be detected and may 
                    result in disciplinary action including exam failure.
                  </p>
                </div>
              </div>
            </div>

            {/* Rules Section */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Exam Rules & Restrictions
              </h3>
              <div className="space-y-3">
                {rules.map((rule, index) => {
                  const Icon = rule.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        rule.severity === "critical"
                          ? "bg-red-50 border-red-200"
                          : rule.severity === "high"
                          ? "bg-orange-50 border-orange-200"
                          : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          rule.severity === "critical"
                            ? "bg-red-100"
                            : rule.severity === "high"
                            ? "bg-orange-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            rule.severity === "critical"
                              ? "text-red-600"
                              : rule.severity === "high"
                              ? "text-orange-600"
                              : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{rule.title}</h4>
                        <p className="text-sm text-gray-700">{rule.description}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rule.severity === "critical"
                            ? "bg-red-200 text-red-800"
                            : rule.severity === "high"
                            ? "bg-orange-200 text-orange-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {rule.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Penalties Section */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Violation Penalties
              </h3>
              <div className="space-y-3">
                {penalties.map((penalty, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${penalty.color} border ${
                      index === 0 ? "border-yellow-200" : "border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{penalty.violations}</span>
                      <span className="text-sm">{penalty.penalty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Tips for Success
              </h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Close all other applications and browser tabs before starting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Ensure stable internet connection throughout the exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Disable all notifications and alerts on your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Stay focused on the exam window and don't click outside</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Your answers are auto-saved, so don't worry about losing progress</span>
                </li>
              </ul>
            </div>

            {/* Scroll Indicator */}
            {!isScrolledToBottom && (
              <div className="text-center text-sm text-gray-500 italic">
                ↓ Scroll down to read all rules ↓
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={hasReadTerms}
                onChange={(e) => setHasReadTerms(e.target.checked)}
                disabled={!isScrolledToBottom}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={`text-sm ${!isScrolledToBottom ? "text-gray-400" : "text-gray-700"}`}>
                I have read and understand all the exam rules, restrictions, and penalties. 
                I agree to abide by the academic integrity policy and understand that 
                violations will result in disciplinary action.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                disabled={!hasReadTerms || !isScrolledToBottom}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  hasReadTerms && isScrolledToBottom
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                I Understand, Proceed to Exam
              </button>
            </div>

            {!isScrolledToBottom && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Please scroll to the bottom to enable the checkbox
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExamWarningModal;
