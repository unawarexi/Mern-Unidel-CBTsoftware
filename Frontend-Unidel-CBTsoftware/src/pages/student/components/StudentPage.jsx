import React from "react";
import { motion } from "framer-motion";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const StudentPage = ({ title, subtitle, icon: Icon, children, actions }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105",
                isDarkMode
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-orange-100 text-orange-600 border border-orange-200",
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1
              className={cn(
                "text-2xl font-bold tracking-tight",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  "text-sm mt-1",
                  isDarkMode ? "text-gray-400" : "text-gray-500",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "rounded-3xl border shadow-sm overflow-hidden transition-colors duration-300",
          isDarkMode
            ? "bg-slate-900/50 backdrop-blur-md border-slate-800"
            : "bg-white border-gray-100",
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </motion.div>
  );
};

export default StudentPage;
