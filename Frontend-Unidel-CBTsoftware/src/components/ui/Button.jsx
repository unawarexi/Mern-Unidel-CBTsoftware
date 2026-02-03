import React from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import clsx from "clsx";

/**
 * Reusable Button Component
 * Variants: primary, secondary, danger, ghost, outline
 * Sizes: sm, md, lg
 */
const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      disableOnLoading = true,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = "button",
      className = "",
      onClick,
      ...props
    },
    ref,
  ) => {
    const disabledState = disabled || (disableOnLoading && isLoading);
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-200 shadow-lg shadow-blue-500/30",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-200 border border-gray-200",
      danger:
        "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 focus:ring-red-200 shadow-lg shadow-red-500/30",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
      outline:
        "bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
      success:
        "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus:ring-green-200 shadow-lg shadow-green-500/30",
      admin:
        "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700 focus:ring-emerald-200 shadow-lg shadow-emerald-500/30",
      lecturer:
        "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 focus:ring-orange-200 shadow-lg shadow-orange-500/25",
      student:
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-200 shadow-lg shadow-blue-500/25",
    };

    const sizes = {
      sm: "px-3 py-2 text-xs gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3.5 text-base gap-2.5",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabledState}
        whileTap={{ scale: disabledState ? 1 : 0.98 }}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Loader className="w-4 h-4" />
            </motion.span>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
