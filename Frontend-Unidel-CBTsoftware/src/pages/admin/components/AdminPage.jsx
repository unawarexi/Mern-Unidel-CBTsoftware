import React from "react";
import { motion } from "framer-motion";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

/**
 * AdminPage - Reusable page wrapper component for admin pages
 * Provides consistent header styling, action buttons, and content container
 */
const AdminPage = ({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
  noPadding = false,
}) => {
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
        <div className={noPadding ? "" : "p-4 md:p-6 lg:p-8"}>{children}</div>
      </div>
    </motion.div>
  );
};

/**
 * AdminCard - Reusable card component for admin dashboard
 */
export const AdminCard = ({
  title,
  icon: Icon,
  children,
  className,
  headerAction,
}) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 md:p-6 transition-all",
        isDarkMode
          ? "bg-slate-800/50 border-slate-700/50"
          : "bg-white border-gray-100 shadow-sm",
        className,
      )}
    >
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  isDarkMode
                    ? "bg-slate-700/50 text-orange-400"
                    : "bg-orange-50 text-orange-600",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            )}
            {title && (
              <h3
                className={cn(
                  "font-semibold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {title}
              </h3>
            )}
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * AdminStatCard - Stat card for quick metrics display
 */
export const AdminStatCard = ({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  color = "orange",
  onClick,
}) => {
  const { isDarkMode } = useThemeStore();

  const colorClasses = {
    orange: {
      bg: isDarkMode ? "bg-orange-500/20" : "bg-orange-50",
      text: "text-orange-500",
      border: isDarkMode ? "border-orange-500/30" : "border-orange-200",
    },
    blue: {
      bg: isDarkMode ? "bg-blue-500/20" : "bg-blue-50",
      text: "text-blue-500",
      border: isDarkMode ? "border-blue-500/30" : "border-blue-200",
    },
    green: {
      bg: isDarkMode ? "bg-emerald-500/20" : "bg-emerald-50",
      text: "text-emerald-500",
      border: isDarkMode ? "border-emerald-500/30" : "border-emerald-200",
    },
    purple: {
      bg: isDarkMode ? "bg-purple-500/20" : "bg-purple-50",
      text: "text-purple-500",
      border: isDarkMode ? "border-purple-500/30" : "border-purple-200",
    },
    red: {
      bg: isDarkMode ? "bg-red-500/20" : "bg-red-50",
      text: "text-red-500",
      border: isDarkMode ? "border-red-500/30" : "border-red-200",
    },
  };

  const colors = colorClasses[color] || colorClasses.orange;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "p-6 rounded-2xl border text-left transition-all w-full",
        isDarkMode
          ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800"
          : "bg-white border-gray-100 hover:shadow-lg shadow-gray-200/50",
        onClick && "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
          colors.bg,
          colors.text,
        )}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="space-y-1">
        <p
          className={cn(
            "text-sm font-medium",
            isDarkMode ? "text-slate-400" : "text-gray-500",
          )}
        >
          {label}
        </p>
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            {value}
          </h3>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trendUp ? "text-emerald-500" : "text-red-500",
              )}
            >
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p
            className={cn(
              "text-xs",
              isDarkMode ? "text-slate-500" : "text-gray-400",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </motion.button>
  );
};

export default AdminPage;
