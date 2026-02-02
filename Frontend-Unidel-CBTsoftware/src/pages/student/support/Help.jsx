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
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Help = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqs = [
    {
      category: "Exams",
      questions: [
        {
          q: "How do I start an exam?",
          a: "Navigate to 'Active Exams' from your dashboard or sidebar. Click on the exam you want to take and then click 'Start Exam'. Make sure to read all instructions before beginning.",
        },
        {
          q: "What happens if I lose internet during an exam?",
          a: "Your answers are saved automatically every 30 seconds. If you lose connection, try to reconnect as soon as possible. Your progress will be restored when you rejoin.",
        },
        {
          q: "Can I pause an exam and continue later?",
          a: "No, once an exam is started, the timer continues. You must complete the exam within the allocated time. Plan accordingly before starting.",
        },
        {
          q: "How is my exam graded?",
          a: "Multiple choice questions are graded automatically. Other question types may require manual grading by your instructor. You'll be notified when results are available.",
        },
      ],
    },
    {
      category: "Results",
      questions: [
        {
          q: "Where can I view my exam results?",
          a: "Go to Dashboard → Results or the Results section in the sidebar. You can view all your results, filter by course, and access detailed analytics.",
        },
        {
          q: "When will my results be available?",
          a: "Multiple choice exam results are available immediately after submission. Other exams requiring manual grading may take 24-72 hours.",
        },
        {
          q: "Can I dispute a grade?",
          a: "Yes, contact your course instructor or the academic office within 7 days of results release. Provide specific details about which questions you'd like reviewed.",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          q: "What browsers are supported?",
          a: "We recommend Google Chrome, Mozilla Firefox, or Microsoft Edge (latest versions). Safari is supported but may have limited features.",
        },
        {
          q: "The page isn't loading properly. What should I do?",
          a: "Try clearing your browser cache, disabling extensions, or using incognito mode. If the issue persists, try a different browser or device.",
        },
        {
          q: "How do I enable dark mode?",
          a: "Click on your profile in the sidebar and navigate to Settings. You can toggle dark mode from there, or use the theme toggle in the sidebar.",
        },
      ],
    },
    {
      category: "Account",
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Profile → Change Password. Enter your current password, then your new password twice. Make sure it meets security requirements.",
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "On the login page, click 'Forgot Password' and enter your email. You'll receive a reset link within a few minutes.",
        },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Support",
      value: "support@unidel.edu",
      action: "mailto:support@unidel.edu",
    },
    {
      icon: Phone,
      label: "Phone Support",
      value: "+234 800 123 4567",
      action: "tel:+2348001234567",
    },
    {
      icon: Clock,
      label: "Support Hours",
      value: "Mon-Fri, 8AM-5PM",
      action: null,
    },
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setShowContactForm(false);
      setFormSubmitted(false);
    }, 2000);
  };

  return (
    <StudentPage
      title="Help & Support"
      subtitle="Find answers and get assistance"
      icon={StudentIcons.Support}
    >
      <div className="space-y-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
                "w-full pl-12 pr-4 py-4 rounded-2xl border text-lg outline-none transition-all",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500"
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-orange-500",
              )}
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Monitor, label: "Getting Started", color: "text-blue-500" },
            { icon: BookOpen, label: "User Guide", color: "text-emerald-500" },
            { icon: FileText, label: "FAQs", color: "text-purple-500" },
            {
              icon: MessageCircle,
              label: "Contact Us",
              color: "text-orange-500",
            },
          ].map((link, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() =>
                link.label === "Contact Us" && setShowContactForm(true)
              }
              className={cn(
                "p-4 rounded-2xl border text-center transition-all hover:shadow-lg",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700 hover:border-orange-500/50"
                  : "bg-white border-gray-100 hover:border-orange-500/50",
              )}
            >
              <link.icon className={cn("w-6 h-6 mx-auto mb-2", link.color)} />
              <p
                className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {link.label}
              </p>
            </motion.button>
          ))}
        </div>

        {/* FAQs */}
        <div>
          <h3
            className={cn(
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div
                className={cn(
                  "text-center py-12 rounded-2xl border",
                  isDarkMode
                    ? "bg-slate-800/30 border-slate-800 text-slate-500"
                    : "bg-gray-50 border-gray-100 text-gray-500",
                )}
              >
                <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No matching questions found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              filteredFaqs.map((category, catIdx) => (
                <div key={catIdx}>
                  <h4
                    className={cn(
                      "text-sm font-medium mb-2 uppercase tracking-wide",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {category.category}
                  </h4>
                  <div
                    className={cn(
                      "rounded-2xl border overflow-hidden divide-y",
                      isDarkMode
                        ? "bg-slate-800/30 border-slate-800 divide-slate-700"
                        : "bg-white border-gray-100 divide-gray-100",
                    )}
                  >
                    {category.questions.map((faq, idx) => {
                      const isExpanded = expandedFaq === `${catIdx}-${idx}`;
                      return (
                        <div key={idx}>
                          <button
                            onClick={() =>
                              setExpandedFaq(
                                isExpanded ? null : `${catIdx}-${idx}`,
                              )
                            }
                            className={cn(
                              "w-full flex items-center justify-between p-4 text-left transition-all",
                              isDarkMode
                                ? "hover:bg-slate-700/30"
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
                              <ChevronDown
                                className={cn(
                                  "w-5 h-5 flex-shrink-0",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-gray-400",
                                )}
                              />
                            ) : (
                              <ChevronRight
                                className={cn(
                                  "w-5 h-5 flex-shrink-0",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-gray-400",
                                )}
                              />
                            )}
                          </button>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              className={cn(
                                "px-4 pb-4 text-sm",
                                isDarkMode ? "text-slate-400" : "text-gray-600",
                              )}
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-gray-50 border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.action || undefined}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl transition-all",
                  info.action && "hover:bg-orange-500/10 cursor-pointer",
                  isDarkMode ? "bg-slate-700/50" : "bg-white",
                )}
              >
                <info.icon className="w-5 h-5 text-orange-500" />
                <div>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {info.label}
                  </p>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {info.value}
                  </p>
                </div>
                {info.action && (
                  <ExternalLink
                    className={cn(
                      "w-4 h-4 ml-auto",
                      isDarkMode ? "text-slate-500" : "text-gray-400",
                    )}
                  />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-md rounded-3xl p-6 shadow-xl",
                isDarkMode ? "bg-slate-800" : "bg-white",
              )}
            >
              {formSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                  <h3
                    className={cn(
                      "text-xl font-bold mb-2",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Message Sent!
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <h3
                    className={cn(
                      "text-xl font-bold mb-4",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Contact Support
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        className={cn(
                          "text-sm font-medium",
                          isDarkMode ? "text-slate-300" : "text-gray-700",
                        )}
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        className={cn(
                          "w-full mt-1 px-4 py-3 rounded-xl border outline-none",
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "bg-white border-gray-200 text-gray-900",
                        )}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div>
                      <label
                        className={cn(
                          "text-sm font-medium",
                          isDarkMode ? "text-slate-300" : "text-gray-700",
                        )}
                      >
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        className={cn(
                          "w-full mt-1 px-4 py-3 rounded-xl border outline-none resize-none",
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "bg-white border-gray-200 text-gray-900",
                        )}
                        placeholder="Describe your issue in detail..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-medium transition-all",
                        isDarkMode
                          ? "bg-slate-700 text-white hover:bg-slate-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </StudentPage>
  );
};

export default Help;
