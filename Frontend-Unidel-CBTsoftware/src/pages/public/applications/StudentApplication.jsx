import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { Images } from "../../../constants/image-strings";
import {
  GraduationCap,
  User,
  BookOpen,
  School,
  CheckCircle,
  Globe,
} from "lucide-react";

// New Components
import StepForm from "./StepForm";

import { useApplicationStore } from "../../../store/ui-store/application-store";

const StudentApplication = () => {
  const { isDarkMode } = useThemeStore();
  const { step, isInternational: isInternationalFn } = useApplicationStore();
  const isInternational = isInternationalFn();

  // Visual steps for the Right Panel
  const visualSteps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Guardian Info", icon: User },
    { id: 3, title: "Academics", icon: School },
    { id: 4, title: "Documents", icon: BookOpen },
    ...(isInternational
      ? [{ id: 5, title: "International", icon: CheckCircle }]
      : []),
    { id: 6, title: "Program", icon: GraduationCap },
    { id: 7, title: "Review", icon: CheckCircle },
  ];

  return (
    <div
      className={cn(
        "min-h-screen flex",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      {/* 1. Left Sidebar - Admission Journey (Fixed) */}
      <div
        className={cn(
          "hidden lg:flex w-80 h-screen sticky top-0 flex-col justify-between p-8 border-r transition-all z-30",
          isDarkMode
            ? "bg-slate-900/50 border-slate-800"
            : "bg-white border-gray-100",
        )}
      >
        <div className="space-y-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              <School className="w-6 h-6 text-white" />
            </div>
            <span
              className={cn(
                "font-bold text-xl",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              UNIDEL<span className="text-orange-500">CBT</span>
            </span>
          </Link>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Admission Journey
            </h3>
            <div className="space-y-4">
              {visualSteps.map((s, idx) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-4 group transition-all duration-300",
                    step === s.id ? "translate-x-2" : "opacity-60",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                      step > s.id
                        ? "bg-green-500/10 border-green-500/20 text-green-600"
                        : step === s.id
                          ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-gray-100 dark:bg-slate-800 border-transparent text-gray-400",
                    )}
                  >
                    {step > s.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <s.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        step === s.id
                          ? "text-orange-500"
                          : isDarkMode
                            ? "text-gray-300"
                            : "text-gray-700",
                      )}
                    >
                      {s.title}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-tight">
                      {step === s.id
                        ? "Active Stage"
                        : step > s.id
                          ? "Completed"
                          : "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
          <p className="text-xs text-orange-800 dark:text-orange-400 leading-relaxed font-medium">
            Need help? Contact admissions support at support@unidel.edu.ng
          </p>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div
          className={cn(
            "lg:hidden p-4 border-b flex items-center justify-between",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <Link to="/" className="flex items-center gap-2">
            <School className="w-5 h-5 text-orange-500" />
            <span className="font-bold dark:text-white">UNIDEL</span>
          </Link>
          <div className="text-xs font-medium text-orange-500">
            Step {step} of {isInternational ? 7 : 6}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-8 lg:py-16">
          <div className="flex flex-col xl:flex-row gap-12">
            {/* Form Column */}
            <div className="flex-1 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10"
              >
                <h1
                  className={cn(
                    "text-4xl font-black mb-3 tracking-tight",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Enroll for <span className="text-orange-500">Excellence</span>
                </h1>
                <p
                  className={cn(
                    "text-lg",
                    isDarkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Complete your application to join the next generation of
                  UNIDEL scholars.
                </p>
              </motion.div>

              <div
                className={cn(
                  "p-8 lg:p-12 rounded-[2.5rem] shadow-2xl shadow-orange-500/5 relative overflow-hidden",
                  isDarkMode
                    ? "bg-slate-900/50 border border-slate-800"
                    : "bg-white border border-gray-50",
                )}
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />

                <StepForm />
              </div>

              {/* Quote / Footer Info */}
              <div className="mt-12 opacity-50 text-sm italic">
                &ldquo;Providing excellence and quality education for future
                leaders.&rdquo; — UNIDEL Admissions
              </div>
            </div>

            {/* Guidelines Sidebar (Right) */}
            <div className="hidden xl:block w-80 shrink-0">
              <div className="sticky top-0 space-y-6">
                <div
                  className={cn(
                    "p-6 rounded-3xl border border-dashed",
                    isDarkMode
                      ? "bg-slate-900/30 border-slate-800"
                      : "bg-orange-50/50 border-orange-200",
                  )}
                >
                  <h3 className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Application Rules
                  </h3>
                  <ul className="space-y-4">
                    <li className="space-y-1">
                      <p
                        className={cn(
                          "text-xs font-bold",
                          isDarkMode ? "text-gray-300" : "text-gray-700",
                        )}
                      >
                        File Requirements
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        All uploads must be in PDF, JPG, or PNG format. Maximum
                        file size is **5MB** per document.
                      </p>
                    </li>
                    <li className="space-y-1">
                      <p
                        className={cn(
                          "text-xs font-bold",
                          isDarkMode ? "text-gray-300" : "text-gray-700",
                        )}
                      >
                        Draft Saving
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Your application is automatically saved as a draft once
                        you start uploading documents or complete Step 1.
                      </p>
                    </li>
                    <li className="space-y-1">
                      <p
                        className={cn(
                          "text-xs font-bold",
                          isDarkMode ? "text-gray-300" : "text-gray-700",
                        )}
                      >
                        Accuracy
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Ensure all names match your official documents.
                        Inconsistent records may lead to disqualification.
                      </p>
                    </li>
                  </ul>
                </div>

                {isInternational ? (
                  <div
                    className={cn(
                      "p-6 rounded-3xl border",
                      isDarkMode
                        ? "bg-blue-900/10 border-blue-900/30"
                        : "bg-blue-50 border-blue-100",
                    )}
                  >
                    <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> International Kit
                    </h3>
                    <ul className="space-y-3 text-[11px] text-gray-500">
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        Valid International Passport required.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        Proof of English Proficiency (if applicable).
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        Certified translation for non-English transcripts.
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "p-6 rounded-3xl border",
                      isDarkMode
                        ? "bg-green-900/10 border-green-900/30"
                        : "bg-green-50 border-green-100",
                    )}
                  >
                    <h3 className="text-sm font-bold uppercase tracking-widest text-green-600 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Local Student Info
                    </h3>
                    <ul className="space-y-3 text-[11px] text-gray-500">
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        JAMB/UTME result slip is mandatory.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        O'Level results (WAEC/NECO) must be verified.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        Certificate of Origin may be required.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApplication;
