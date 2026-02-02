/**
 * Hero Section - Professional University Landing
 * Modern, text-rich design with serious academic aesthetic
 */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useThemeStore from "../../store/theme-store";
import { usePublicStatsAction } from "../../store/public-store";
import { cn } from "../../core/lib/cn";
import { Images } from "../../constants/image-strings";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Globe,
  ChevronRight,
  Building2,
  FlaskConical,
  Laptop,
  ArrowRight,
} from "lucide-react";

// Default quick facts (fallback when loading)
const defaultQuickFacts = [
  { icon: GraduationCap, value: "--", label: "Students Enrolled" },
  { icon: BookOpen, value: "--", label: "Academic Programs" },
  { icon: Users, value: "--", label: "Expert Faculty" },
  { icon: Award, value: "--", label: "Employment Rate" },
];

// Featured highlights
const highlights = [
  {
    icon: Building2,
    title: "8 Faculties",
    description: "Comprehensive academic coverage",
  },
  {
    icon: FlaskConical,
    title: "Research Excellence",
    description: "World-class research facilities",
  },
  {
    icon: Globe,
    title: "Global Recognition",
    description: "NUC accredited programs",
  },
  {
    icon: Laptop,
    title: "Digital Learning",
    description: "Advanced CBT infrastructure",
  },
];

// Announcements/news ticker
const announcements = [
  "🎓 2025/2026 Admissions Now Open — Apply Today",
  "🏆 UNIDEL Ranked Among Top 10 Nigerian Universities",
  "📅 Post-UTME Screening Starts January 15th",
  "🔬 New Research Center for Artificial Intelligence Inaugurated",
];

const HeroSection = () => {
  const { isDarkMode } = useThemeStore();
  const { stats, isLoading: statsLoading } = usePublicStatsAction();

  // Build dynamic quick facts from API data
  const quickFacts = stats
    ? [
        {
          icon: GraduationCap,
          value: stats.totalStudents?.toLocaleString() + "+" || "15,000+",
          label: "Students Enrolled",
        },
        {
          icon: BookOpen,
          value: stats.totalCourses?.toLocaleString() + "+" || "140+",
          label: "Academic Programs",
        },
        {
          icon: Users,
          value: stats.totalLecturers?.toLocaleString() + "+" || "850+",
          label: "Expert Faculty",
        },
        {
          icon: Award,
          value: stats.employmentRate || "95%",
          label: "Employment Rate",
        },
      ]
    : defaultQuickFacts;

  // Build dynamic highlights from API data
  const dynamicHighlights = [
    {
      icon: Building2,
      title: `${stats?.totalFaculties || 8} Faculties`,
      description: "Comprehensive academic coverage",
    },
    {
      icon: FlaskConical,
      title: "Research Excellence",
      description: "World-class research facilities",
    },
    {
      icon: Globe,
      title: "Global Recognition",
      description: "NUC accredited programs",
    },
    {
      icon: Laptop,
      title: "Digital Learning",
      description: "Advanced CBT infrastructure",
    },
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      {/* Announcement Bar */}
      <div
        className={cn(
          "py-2 px-4 text-center text-sm font-medium",
          isDarkMode ? "bg-orange-600 text-white" : "bg-orange-500 text-white",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>{announcements[0]}</span>
          <Link
            to="/auth/selection"
            className="inline-flex items-center gap-1 underline hover:no-underline"
          >
            Learn More <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={Images.heroImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className={cn(
              "absolute inset-0",
              isDarkMode
                ? "bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/70"
                : "bg-gradient-to-r from-white via-white/95 to-white/70",
            )}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="space-y-8">
              {/* University Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isDarkMode ? "bg-orange-500/20" : "bg-orange-100",
                  )}
                >
                  <GraduationCap
                    className={cn(
                      "w-6 h-6",
                      isDarkMode ? "text-orange-400" : "text-orange-600",
                    )}
                  />
                </div>
                <div>
                  <div
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      isDarkMode ? "text-orange-400" : "text-orange-600",
                    )}
                  >
                    University of Delta
                  </div>
                  <div
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Excellence in Education Since 1985
                  </div>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1
                  className={cn(
                    "text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Shaping Future Leaders Through{" "}
                  <span
                    className={cn(
                      "text-transparent bg-clip-text bg-gradient-to-r",
                      isDarkMode
                        ? "from-orange-400 to-orange-600"
                        : "from-orange-500 to-orange-700",
                    )}
                  >
                    Academic Excellence
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "text-lg lg:text-xl leading-relaxed max-w-xl",
                  isDarkMode ? "text-gray-300" : "text-gray-600",
                )}
              >
                Join one of Nigeria's premier institutions of higher learning.
                With over 140 programs across 8 faculties, UNIDEL provides
                world-class education, cutting-edge research opportunities, and
                a vibrant campus community.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/auth/selection"
                  className={cn(
                    "inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-105",
                    "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25",
                  )}
                >
                  Apply for Admission
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="#programs"
                  className={cn(
                    "inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all border-2",
                    isDarkMode
                      ? "border-gray-700 text-white hover:bg-gray-800"
                      : "border-gray-300 text-gray-900 hover:bg-gray-50",
                  )}
                >
                  Explore Programs
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                {["Undergraduate", "Graduate", "Research", "Campus Life"].map(
                  (link, idx) => (
                    <a
                      key={idx}
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className={cn(
                        "text-sm font-medium flex items-center gap-1 hover:underline",
                        isDarkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900",
                      )}
                    >
                      {link}
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  ),
                )}
              </motion.div>
            </div>

            {/* Right - Stats & Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:block"
            >
              {/* Stats Grid */}
              <div
                className={cn(
                  "rounded-2xl p-8 mb-6",
                  isDarkMode
                    ? "bg-slate-900/80 backdrop-blur-sm border border-slate-800"
                    : "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl",
                )}
              >
                <div className="grid grid-cols-2 gap-6">
                  {quickFacts.map((fact, idx) => (
                    <div key={idx} className="text-center p-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center",
                          isDarkMode ? "bg-orange-500/20" : "bg-orange-100",
                        )}
                      >
                        <fact.icon
                          className={cn(
                            "w-6 h-6",
                            isDarkMode ? "text-orange-400" : "text-orange-600",
                          )}
                        />
                      </div>
                      <div
                        className={cn(
                          "text-2xl font-bold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {fact.value}
                      </div>
                      <div
                        className={cn(
                          "text-xs",
                          isDarkMode ? "text-gray-400" : "text-gray-600",
                        )}
                      >
                        {fact.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4">
                {dynamicHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:scale-105",
                      isDarkMode
                        ? "bg-slate-900/60 border-slate-800 hover:border-orange-500/50"
                        : "bg-white/60 border-gray-200 hover:border-orange-300 shadow-sm",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 mb-2",
                        isDarkMode ? "text-orange-400" : "text-orange-600",
                      )}
                    />
                    <div
                      className={cn(
                        "font-semibold text-sm",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {item.title}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar (Mobile) */}
      <div
        className={cn(
          "lg:hidden py-6 border-t",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-gray-50 border-gray-200",
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {quickFacts.slice(0, 4).map((fact, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={cn(
                    "text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {fact.value}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
