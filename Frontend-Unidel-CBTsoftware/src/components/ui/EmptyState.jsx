import React from "react";
import { FileX, Search, AlertCircle, Plus } from "lucide-react";
import clsx from "clsx";
import Button from "./Button";

/**
 * EmptyState Component
 * Displays when no data is available
 */
const EmptyState = ({
  icon,
  title = "No data found",
  description,
  actionLabel,
  onAction,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const icons = {
    default: FileX,
    search: Search,
    error: AlertCircle,
  };

  const IconComponent = icon || icons[variant] || icons.default;

  const sizes = {
    sm: {
      container: "py-6",
      icon: "w-10 h-10",
      title: "text-sm",
      description: "text-xs",
    },
    md: {
      container: "py-8 sm:py-12",
      icon: "w-12 h-12 sm:w-16 sm:h-16",
      title: "text-base sm:text-lg",
      description: "text-xs sm:text-sm",
    },
    lg: {
      container: "py-12 sm:py-16",
      icon: "w-16 h-16 sm:w-20 sm:h-20",
      title: "text-lg sm:text-xl",
      description: "text-sm",
    },
  };

  const sizeStyles = sizes[size];

  const iconColors = {
    default: "text-gray-300",
    search: "text-blue-300",
    error: "text-red-300",
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        sizeStyles.container,
        className,
      )}
    >
      <div className={clsx("mb-4", iconColors[variant])}>
        {React.isValidElement(icon) ? (
          React.cloneElement(icon, { className: sizeStyles.icon })
        ) : (
          <IconComponent className={sizeStyles.icon} />
        )}
      </div>
      <h3
        className={clsx("font-semibold text-gray-900 mb-1", sizeStyles.title)}
      >
        {title}
      </h3>
      {description && (
        <p
          className={clsx(
            "text-gray-500 max-w-sm mb-4",
            sizeStyles.description,
          )}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
