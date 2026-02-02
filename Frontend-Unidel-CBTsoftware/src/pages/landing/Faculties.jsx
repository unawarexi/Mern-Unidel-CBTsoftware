import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Beaker,
  Palette,
  Calculator,
  Globe,
  Users,
  Building,
  ArrowRight,
} from "../../constants/icons";
import ExportButton from "../../components/ExportButton";
import useThemeStore from "../../store/theme-store";
import {
  usePublicFacultiesAction,
  usePublicStatsAction,
} from "../../store/public-store";
import {
  FacultyCardSkeleton,
  StatsSkeleton,
} from "../../components/ui/SectionSkeleton";
import { colorMap } from "../../core/theme/colors";
import {
  containerVariants,
  itemVariants,
  slideDownVariants,
  scaleVariants,
  ctaAnimation,
  cardHover,
} from "../../core/animation/animations";

const Faculties = () => {
  const { isDarkMode } = useThemeStore();

  // Fetch faculties from API
  const { faculties: apiFaculties, isLoading: facultiesLoading } =
    usePublicFacultiesAction();
  const { stats, isLoading: statsLoading } = usePublicStatsAction();

  const iconMap = {
    BookOpen,
    Briefcase,
    Beaker,
    Palette,
    Calculator,
    Globe,
    Users,
    Building,
  };

  // Default color palette for faculties
  const defaultColors = [
    "orange",
    "blue",
    "green",
    "purple",
    "red",
    "teal",
    "indigo",
    "pink",
  ];

  // Transform API data
  const faculties = apiFaculties.map((faculty, index) => ({
    name: faculty.name,
    description: faculty.description,
    departments: faculty.departmentCount || faculty.departments?.length || 0,
    students: faculty.studentCount || 0,
    icon: faculty.icon || "BookOpen",
    color: faculty.color || defaultColors[index % defaultColors.length],
  }));

  // Dynamic stats
  const facultyStats = [
    {
      value: stats?.totalFaculties || faculties.length || 0,
      label: "Faculties",
    },
    { value: stats?.totalDepartments || 0, label: "Departments" },
    { value: stats?.totalCourses || 0, label: "Programs" },
    { value: stats?.totalLecturers || 0, label: "Faculty Members" },
  ];

  const isLoading = facultiesLoading || statsLoading;

  return (
    <section
      className={`relative ${isDarkMode ? "bg-gradient-to-br from-dark-950 via-accent-950 to-dark-900" : "bg-white"} py-8 md:py-16 overflow-hidden transition-colors duration-300`}
    >
      {/* Enhanced Decorative Background Elements */}
      <div
        className={`absolute top-20 -left-20 w-96 h-96 ${isDarkMode ? "bg-primary-600/30" : "bg-primary-500"} rounded-full blur-3xl animate-glow-pulse`}
      ></div>
      <div
        className={`absolute bottom-20 -right-20 w-[500px] h-[500px] ${isDarkMode ? "bg-accent-500/30" : "bg-accent-900"} rounded-full blur-3xl animate-glow-pulse-delayed`}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] ${isDarkMode ? "bg-dark-800/20" : "bg-dark-900"} rounded-full blur-3xl animate-glow-pulse-slow`}
      ></div>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={slideDownVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10"
        >
          <h2
            className={`text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2 md:mb-4`}
          >
            Our Faculties
          </h2>
          <p
            className={`text-sm sm:text-base md:text-base lg:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-3xl mx-auto`}
          >
            Diverse academic programs across multiple faculties, fostering
            excellence in education and research
          </p>

          <div className="flex justify-center mt-6">
            <ExportButton
              type="faculties-report"
              title="University Faculties Report"
              className="shadow-xl"
            />
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={scaleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-12"
        >
          {facultyStats.map((stat, index) => (
            <div
              key={index}
              className={`${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"} rounded-xl border-2 p-3 md:p-6 text-center`}
            >
              <div
                className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-1 md:mb-2`}
              >
                {stat.value}
              </div>
              <div
                className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Faculties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {faculties.map((faculty, index) => {
            const colors = colorMap[faculty.color];
            const FacultyIcon = iconMap[faculty.icon];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                {...cardHover}
                className={`${isDarkMode ? "bg-slate-800/50 border-slate-700 hover:border-orange-500/50" : "bg-white border-" + colors.border.split("-")[1] + " " + colors.hover} rounded-xl border-2 p-4 md:p-6 transition-all hover:shadow-lg`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 md:w-12 lg:w-14 md:h-12 lg:h-14 ${isDarkMode ? "bg-" + colors.bg.split("-")[1] + "-500/10" : colors.bg} rounded-xl flex items-center justify-center mb-3 md:mb-4`}
                >
                  <FacultyIcon
                    className={`w-6 h-6 md:w-6 lg:w-7 md:h-6 lg:h-7 ${colors.text}`}
                  />
                </div>

                {/* Faculty Name */}
                <h3
                  className={`text-lg md:text-lg lg:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2 md:mb-3`}
                >
                  {faculty.name}
                </h3>

                {/* Description */}
                <p
                  className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-3 md:mb-4 leading-relaxed`}
                >
                  {faculty.description}
                </p>

                {/* Stats */}
                <div
                  className={`flex items-center justify-between pt-3 md:pt-4 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}
                >
                  <div className="text-center">
                    <div
                      className={`text-base md:text-base lg:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {faculty.departments}
                    </div>
                    <div
                      className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Departments
                    </div>
                  </div>
                  <div
                    className={`w-px h-8 md:h-10 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}
                  ></div>
                  <div className="text-center">
                    <div
                      className={`text-base md:text-base lg:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {faculty.students.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Students
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Updated CTA */}
        <motion.div
          {...ctaAnimation}
          className={`mt-6 md:mt-12 flex flex-col md:flex-row items-center justify-between ${isDarkMode ? "bg-primary-500/10 border-primary-500/30" : "bg-primary-50 border-primary-200"} rounded-2xl border-2 p-4 md:p-8 gap-4 md:gap-6`}
        >
          <div className="flex-1">
            <h3
              className={`text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-1 md:mb-2`}
            >
              Explore Academic Excellence
            </h3>
            <p
              className={`text-xs md:text-sm lg:text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Discover comprehensive programs tailored to shape future leaders
              across diverse fields of study. Join our vibrant academic
              community today.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-sm md:text-sm lg:text-base font-semibold hover:bg-primary-700 transition-all whitespace-nowrap">
            View All Programs
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Faculties;

<style jsx>{`
  @keyframes blob {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`}</style>;
