import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Shield,
  ArrowRight,
  School,
  Moon,
  Sun,
} from "lucide-react";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";

const AuthSelection = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const roles = [
    {
      id: "student",
      title: "Student Portal",
      description:
        "Access your exams, results, and academic resources in one secure place.",
      icon: GraduationCap,
      href: "/portal-signin",
      color: "blue",
      gradient: "from-blue-600 to-indigo-600",
      lightBg: "bg-blue-50",
      darkBg: "bg-blue-900/10",
      accent: "text-blue-600",
    },
    {
      id: "lecturer",
      title: "Faculty Access",
      description:
        "Manage your courses, create assessments, and track student performance.",
      icon: BookOpen,
      href: "/lecturer-signin",
      color: "orange",
      gradient: "from-orange-500 to-red-600",
      lightBg: "bg-orange-50",
      darkBg: "bg-orange-900/10",
      accent: "text-orange-600",
    },
    {
      id: "admin",
      title: "Administrator",
      description:
        "System-wide management, configuration, and operational control center.",
      icon: Shield,
      href: "/admin-signin",
      color: "emerald",
      gradient: "from-emerald-500 to-cyan-600",
      lightBg: "bg-emerald-50",
      darkBg: "bg-emerald-900/10",
      accent: "text-emerald-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-colors duration-300",
        isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900",
      )}
    >
      {/* Background Decals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
            isDarkMode ? "bg-orange-500" : "bg-orange-200",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
            isDarkMode ? "bg-blue-500" : "bg-blue-200",
          )}
        />
      </div>

      {/* Header */}
      <nav className="relative z-10 p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <span
              className={cn(
                "text-xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              UNIDEL
            </span>
            <span className="text-orange-500 font-bold ml-1">CBT</span>
          </div>
        </Link>
        <button
          onClick={toggleDarkMode}
          className={cn(
            "p-2.5 rounded-xl transition-all border",
            isDarkMode
              ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm",
          )}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl w-full"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Who <span className="text-orange-500 italic">are you?</span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl max-w-2xl mx-auto",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Select your role to access the UNIDEL Computer Based Testing
              platform and continue your journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Link
                  to={role.href}
                  className={cn(
                    "group relative h-full flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 overflow-hidden",
                    isDarkMode
                      ? "bg-slate-800/40 border-slate-700 hover:border-orange-500/50 hover:bg-slate-800/60"
                      : "bg-white border-gray-100 hover:border-orange-200 hover:shadow-2xl shadow-lg shadow-gray-200/50",
                  )}
                >
                  {/* Hover background effect */}
                  <div
                    className={cn(
                      "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                      role.id === "student"
                        ? "bg-blue-500"
                        : role.id === "lecturer"
                          ? "bg-orange-500"
                          : "bg-emerald-500",
                    )}
                  />

                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-lg",
                      `bg-gradient-to-br ${role.gradient} text-white`,
                    )}
                  >
                    <role.icon className="w-7 h-7" />
                  </div>

                  <h3
                    className={cn(
                      "text-2xl font-bold mb-3",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {role.title}
                  </h3>

                  <p
                    className={cn(
                      "text-base leading-relaxed mb-8 flex-1",
                      isDarkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {role.description}
                  </p>

                  <div
                    className={cn(
                      "inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider transition-all",
                      role.accent,
                      "group-hover:translate-x-1",
                    )}
                  >
                    Proceed to Login <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="relative z-10 p-8 text-center">
        <p
          className={cn(
            "text-sm font-medium",
            isDarkMode ? "text-gray-500" : "text-gray-400",
          )}
        >
          &copy; {new Date().getFullYear()} University of Delta, Agbor. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AuthSelection;
