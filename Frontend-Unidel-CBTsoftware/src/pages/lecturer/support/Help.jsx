import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  BookOpen,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Monitor,
  FileSpreadsheet,
  Users,
  Settings,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Help = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      category: "Exam Management",
      icon: FileSpreadsheet,
      questions: [
        {
          q: "How do I create a new exam?",
          a: "Navigate to Exams > Create Exam. Fill in the course details, add questions from your question bank or create new ones, set the duration and schedule, then publish the exam.",
        },
        {
          q: "Can I edit an exam after publishing?",
          a: "You can edit scheduled exams before they start. Once an exam is active, you can only extend the duration or end it early. Completed exams cannot be edited.",
        },
        {
          q: "How do I add images to questions?",
          a: "When creating/editing a question, click the attachment icon to upload images. Supported formats: JPG, PNG, GIF. Maximum file size is 5MB per image.",
        },
      ],
    },
    {
      category: "Question Bank",
      icon: FileText,
      questions: [
        {
          q: "How do I import questions in bulk?",
          a: "Go to Question Bank > Import/Export. Download the Excel template, fill in your questions following the format, then upload the file. The system will validate and import your questions.",
        },
        {
          q: "What question types are supported?",
          a: "The system supports MCQ (single and multiple choice), True/False, Short Answer, Essay, Fill in the Blank, and Matching questions.",
        },
        {
          q: "How does question approval work?",
          a: "Questions created by lecturers may require department approval before use in exams. Check with your admin about your institution's approval workflow.",
        },
      ],
    },
    {
      category: "Grading & Results",
      icon: Users,
      questions: [
        {
          q: "How are MCQ questions graded?",
          a: "MCQ questions are auto-graded immediately upon submission. Partial credit can be enabled for multiple-choice questions with multiple correct answers.",
        },
        {
          q: "How do I grade essay questions?",
          a: "Go to Submissions > Manual Grading. Select the exam and review each essay response. Enter scores and optional feedback for each answer.",
        },
        {
          q: "Can students see their results immediately?",
          a: "Result visibility is controlled per exam in settings. You can choose to release results immediately, after grading, or on a specific date.",
        },
      ],
    },
    {
      category: "Monitoring & Integrity",
      icon: Monitor,
      questions: [
        {
          q: "What activities are monitored during exams?",
          a: "The system monitors tab switching, copy/paste actions, browser focus loss, and connection issues. Webcam proctoring is available for high-stakes exams.",
        },
        {
          q: "How do I review integrity flags?",
          a: "Go to Monitoring > Integrity to see all flagged submissions. Review the details, watch any recorded footage if available, and mark as reviewed or escalate.",
        },
      ],
    },
  ];

  const quickLinks = [
    {
      label: "Create Exam",
      href: "/lecturer/exams/create",
      icon: FileSpreadsheet,
    },
    {
      label: "Question Bank",
      href: "/lecturer/questions/create",
      icon: FileText,
    },
    { label: "View Results", href: "/lecturer/exams/results", icon: Users },
    { label: "Settings", href: "/lecturer/profile/settings", icon: Settings },
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <LecturerPage
      title="Help Center"
      subtitle="Find answers and get support"
      icon={LecturerIcons.Support}
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
              isDarkMode ? "text-slate-500" : "text-gray-400",
            )}
          />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-4 rounded-2xl border outline-none text-lg",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
            )}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, idx) => (
            <motion.a
              key={idx}
              href={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border text-center transition-all hover:shadow-md",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700 hover:border-blue-500"
                  : "bg-white border-gray-100 hover:border-blue-400",
              )}
            >
              <link.icon
                className={cn(
                  "w-6 h-6 mx-auto mb-2",
                  isDarkMode ? "text-blue-400" : "text-blue-500",
                )}
              />
              <p
                className={cn(
                  "font-medium text-sm",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {link.label}
              </p>
            </motion.a>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {filteredFaqs.map((category, cidx) => (
            <motion.div
              key={cidx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cidx * 0.1 }}
              className={cn(
                "p-6 rounded-3xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <category.icon
                  className={cn(
                    "w-5 h-5",
                    isDarkMode ? "text-blue-400" : "text-blue-500",
                  )}
                />
                <h3
                  className={cn(
                    "font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {category.category}
                </h3>
              </div>
              <div className="space-y-2">
                {category.questions.map((faq, fidx) => {
                  const faqId = `${cidx}-${fidx}`;
                  const isExpanded = expandedFaq === faqId;
                  return (
                    <div
                      key={fidx}
                      className={cn(
                        "rounded-xl border overflow-hidden",
                        isDarkMode ? "border-slate-700" : "border-gray-100",
                      )}
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(isExpanded ? null : faqId)
                        }
                        className={cn(
                          "w-full px-4 py-3 flex items-center justify-between text-left transition-colors",
                          isDarkMode
                            ? isExpanded
                              ? "bg-slate-700"
                              : "bg-slate-800/50 hover:bg-slate-700"
                            : isExpanded
                              ? "bg-gray-50"
                              : "hover:bg-gray-50",
                        )}
                      >
                        <span
                          className={cn(
                            "font-medium",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {faq.q}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          className={cn(
                            "px-4 py-3",
                            isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                          )}
                        >
                          <p
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-slate-300" : "text-gray-600",
                            )}
                          >
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border text-center",
            isDarkMode
              ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30"
              : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200",
          )}
        >
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h3
            className={cn(
              "font-bold text-lg mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Need More Help?
          </h3>
          <p
            className={cn(
              "mb-4",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Contact our support team for assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@unidel.edu"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <a
              href="tel:+234123456789"
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                isDarkMode
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-white text-gray-700 hover:bg-gray-100",
              )}
            >
              <Phone className="w-4 h-4" />
              Call Support
            </a>
          </div>
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default Help;
