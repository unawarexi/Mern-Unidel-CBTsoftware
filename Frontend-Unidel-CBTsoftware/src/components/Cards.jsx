import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import clsx from "clsx";

/**
 * Base Card Component
 * Variants: default, elevated, outlined
 */
export const Card = ({
  children,
  variant = "default",
  padding = "md",
  className = "",
  onClick,
  hover = false,
  ...props
}) => {
  const variants = {
    default: "bg-white shadow-sm border border-gray-100",
    elevated: "bg-white shadow-lg shadow-gray-200/50",
    outlined: "bg-white border-2 border-gray-200",
  };

  const paddings = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-5",
    lg: "p-5 sm:p-6",
  };

  return (
    <div
      className={clsx(
        "rounded-xl",
        variants[variant],
        paddings[padding],
        hover && "hover:shadow-md transition-shadow cursor-pointer",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * StatCard Component
 * For dashboard statistics with icon, value, trend
 */
export const StatCard = ({
  icon,
  label,
  value,
  change,
  trend = "up",
  color = "blue",
  link,
  onClick,
  isLoading = false,
  className = "",
}) => {
  const colors = {
    blue: { bg: "bg-blue-50", icon: "bg-blue-600", text: "text-blue-600" },
    green: { bg: "bg-green-50", icon: "bg-green-600", text: "text-green-600" },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-500",
      text: "text-orange-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-600",
      text: "text-purple-600",
    },
    red: { bg: "bg-red-50", icon: "bg-red-600", text: "text-red-600" },
    emerald: {
      bg: "bg-emerald-50",
      icon: "bg-emerald-600",
      text: "text-emerald-600",
    },
    cyan: { bg: "bg-cyan-50", icon: "bg-cyan-600", text: "text-cyan-600" },
  };

  const colorScheme = colors[color] || colors.blue;

  const handleClick = () => {
    if (onClick) onClick();
    else if (link) window.location.href = link;
  };

  if (isLoading) {
    return (
      <Card className={clsx("animate-pulse", className)}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="w-12 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded mb-2" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick || link ? 1.02 : 1 }}
      className={className}
    >
      <Card
        hover={!!(onClick || link)}
        onClick={onClick || link ? handleClick : undefined}
        className="h-full"
      >
        <div className="flex items-start justify-between mb-2 sm:mb-4">
          <div className={clsx(colorScheme.bg, "p-2 sm:p-3 rounded-lg")}>
            <div
              className={clsx(
                colorScheme.icon,
                "text-white rounded-lg p-1 sm:p-2",
              )}
            >
              {React.cloneElement(icon, { className: "w-4 h-4 sm:w-6 sm:h-6" })}
            </div>
          </div>
          {trend && (
            <div
              className={clsx(
                "flex items-center gap-1 text-xs sm:text-sm font-medium",
                colorScheme.text,
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </div>
          )}
        </div>
        <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">
          {value}
        </div>
        <div className="text-xs sm:text-sm font-medium text-gray-700">
          {label}
        </div>
        {change && (
          <div className={clsx("text-xs mt-0.5 sm:mt-1", colorScheme.text)}>
            {change}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

/**
 * MetricCard Component
 * For displaying performance metrics with labels
 */
export const MetricCard = ({
  icon,
  label,
  value,
  count,
  total,
  color = "blue",
  isLoading = false,
  className = "",
}) => {
  const colors = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    green: { bg: "bg-green-50", text: "text-green-600" },
    red: { bg: "bg-red-50", text: "text-red-600" },
    gray: { bg: "bg-gray-50", text: "text-gray-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600" },
  };

  const colorScheme = colors[color] || colors.blue;

  if (isLoading) {
    return (
      <Card className={clsx("animate-pulse", className)}>
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          <div className="w-12 h-6 bg-gray-200 rounded" />
        </div>
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <div
            className={clsx(
              colorScheme.bg,
              "p-1.5 sm:p-2 rounded-lg",
              colorScheme.text,
            )}
          >
            {React.cloneElement(icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {value}
          </div>
        </div>
        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">
          {label}
        </div>
        {total !== undefined && (
          <div className="text-xs text-gray-500">
            {count} / {total} submissions
          </div>
        )}
      </Card>
    </motion.div>
  );
};

/**
 * InfoCard Component
 * For displaying feature/info items
 */
export const InfoCard = ({
  icon,
  title,
  description,
  color = "blue",
  onClick,
  className = "",
}) => {
  const colors = {
    blue: "text-blue-300",
    green: "text-green-300",
    purple: "text-purple-300",
    orange: "text-orange-300",
    cyan: "text-cyan-300",
  };

  return (
    <div
      className={clsx(
        "bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20",
        onClick && "cursor-pointer hover:bg-white/20 transition-colors",
        className,
      )}
      onClick={onClick}
    >
      {icon && (
        <div className={clsx("mb-2", colors[color])}>
          {React.cloneElement(icon, { className: "w-8 h-8" })}
        </div>
      )}
      <h3 className="font-semibold mb-1 text-white">{title}</h3>
      {description && <p className="text-sm text-blue-200">{description}</p>}
    </div>
  );
};

/**
 * ActionCard Component
 * Card with title and action link
 */
export const ActionCard = ({
  icon,
  title,
  description,
  actionLabel = "View All",
  onAction,
  children,
  className = "",
}) => {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          {icon &&
            React.cloneElement(icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
          {title}
        </h3>
        {onAction && (
          <button
            onClick={onAction}
            className="text-xs sm:text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
          >
            {actionLabel}
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
      {description && (
        <p className="text-xs sm:text-sm text-gray-500 mb-4">{description}</p>
      )}
      {children}
    </Card>
  );
};

export default Card;
