import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  FileText,
  Scale,
  Eye,
  Clock,
  Award,
} from "lucide-react";
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const IntegrityPolicy = () => {
  const { isDarkMode } = useThemeStore();

  const sections = [
    {
      title: "Academic Integrity Standards",
      icon: Shield,
      color: "text-blue-500",
      content: [
        "All examinations must be completed individually unless otherwise specified",
        "Use of unauthorized materials, notes, or devices is strictly prohibited",
        "Communication with other students during exams is forbidden",
        "All work submitted must be the student's own original work",
      ],
    },
    {
      title: "Proctoring & Monitoring",
      icon: Eye,
      color: "text-purple-500",
      content: [
        "All online exams are monitored using AI-powered proctoring",
        "Tab switching, copy/paste, and browser activities are tracked",
        "Webcam monitoring may be enabled for high-stakes exams",
        "All flagged incidents are reviewed by academic staff",
      ],
    },
    {
      title: "Prohibited Actions",
      icon: XCircle,
      color: "text-red-500",
      content: [
        "Copying answers from external sources",
        "Sharing exam questions or answers with others",
        "Using AI tools or chatbots during exams",
        "Having another person take the exam on your behalf",
        "Accessing unauthorized browser tabs or applications",
      ],
    },
    {
      title: "Consequences of Violations",
      icon: AlertTriangle,
      color: "text-amber-500",
      content: [
        "First offense: Written warning and zero marks for the exam",
        "Second offense: Suspension from the course",
        "Third offense: Academic probation or expulsion",
        "All violations are recorded in academic records",
      ],
    },
    {
      title: "Reporting Violations",
      icon: FileText,
      color: "text-orange-500",
      content: [
        "Integrity violations are flagged automatically by the system",
        "Lecturers can review and escalate flagged submissions",
        "Students may appeal violations within 7 days",
        "All appeals are reviewed by the academic integrity committee",
      ],
    },
    {
      title: "Your Responsibilities as Lecturer",
      icon: Scale,
      color: "text-emerald-500",
      content: [
        "Review all flagged submissions promptly",
        "Document evidence of violations thoroughly",
        "Follow due process when reporting violations",
        "Maintain confidentiality of student records",
        "Provide clear exam instructions to prevent unintentional violations",
      ],
    },
  ];

  return (
    <LecturerPage
      title="Academic Integrity"
      subtitle="Guidelines and policies for exam integrity"
      icon={LecturerIcons.Integrity}
    >
      <div className="space-y-6">
        {/* Hero Section */}
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
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2
            className={cn(
              "text-xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Upholding Academic Excellence
          </h2>
          <p
            className={cn(
              "max-w-2xl mx-auto",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Academic integrity is the foundation of educational excellence.
            These guidelines ensure fair assessment and maintain the value of
            academic credentials.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-6 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isDarkMode ? "bg-slate-700" : "bg-gray-100",
                  )}
                >
                  <section.icon className={cn("w-5 h-5", section.color)} />
                </div>
                <h3
                  className={cn(
                    "font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, iidx) => (
                  <li
                    key={iidx}
                    className={cn(
                      "flex items-start gap-2 text-sm",
                      isDarkMode ? "text-slate-400" : "text-gray-600",
                    )}
                  >
                    <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/lecturer/monitoring/integrity"
              className={cn(
                "p-4 rounded-xl text-center transition-all hover:shadow-md",
                isDarkMode
                  ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100",
              )}
            >
              <Eye className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Review Flags</p>
            </a>
            <a
              href="/lecturer/submissions/manual"
              className={cn(
                "p-4 rounded-xl text-center transition-all hover:shadow-md",
                isDarkMode
                  ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                  : "bg-amber-50 text-amber-600 hover:bg-amber-100",
              )}
            >
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Pending Grades</p>
            </a>
            <a
              href="/lecturer/reports/performance"
              className={cn(
                "p-4 rounded-xl text-center transition-all hover:shadow-md",
                isDarkMode
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
              )}
            >
              <Award className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">View Reports</p>
            </a>
          </div>
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default IntegrityPolicy;
