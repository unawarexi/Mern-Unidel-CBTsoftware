import React from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import clsx from "clsx";

/**
 * Alert Component
 * Inline alerts for success, warning, error, info messages
 */
const Alert = ({
  children,
  variant = "info",
  title,
  dismissible = false,
  onDismiss,
  icon,
  className = "",
}) => {
  const variants = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: "text-green-500",
      defaultIcon: CheckCircle,
    },
    warning: {
      container: "bg-orange-50 border-orange-200 text-orange-800",
      icon: "text-orange-500",
      defaultIcon: AlertTriangle,
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: "text-red-500",
      defaultIcon: AlertCircle,
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "text-blue-500",
      defaultIcon: Info,
    },
  };

  const variantStyles = variants[variant] || variants.info;
  const IconComponent = icon || variantStyles.defaultIcon;

  return (
    <div
      className={clsx(
        "flex items-start gap-3 p-4 border rounded-xl",
        variantStyles.container,
        className,
      )}
      role="alert"
    >
      <div className={clsx("flex-shrink-0 mt-0.5", variantStyles.icon)}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={clsx(
            "flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors",
            variantStyles.icon,
          )}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
