import React from "react";
import { Loader2, RefreshCw, Loader } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// ========== SPINNER 1: Rotating Circle (Default) ==========
export const CircleSpinner = ({ size = 24, color = "text-blue-600", className = "" }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`inline-block ${className}`}
    >
      <Loader2 size={size} className={color} />
    </motion.div>
  );
};

// ========== SPINNER 2: Pulse Dots ==========
export const DotsSpinner = ({ size = "md", color = "bg-blue-600", className = "" }) => {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const dotSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSize} rounded-full ${color}`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ========== SPINNER 3: Bouncing Bars ==========
export const BarsSpinner = ({ size = "md", color = "bg-blue-600", className = "" }) => {
  const sizeClasses = {
    sm: { width: "w-1", height: "h-4" },
    md: { width: "w-1.5", height: "h-6" },
    lg: { width: "w-2", height: "h-8" },
  };

  const barSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`${barSize.width} ${barSize.height} rounded-full ${color}`}
          animate={{
            scaleY: [1, 1.8, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ========== SPINNER 4: Refresh Spin ==========
export const RefreshSpinner = ({ size = 24, color = "text-blue-600", className = "" }) => {
  return (
    <motion.div
      animate={{ rotate: -360 }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`inline-block ${className}`}
    >
      <RefreshCw size={size} className={color} />
    </motion.div>
  );
};

// ========== SPINNER 5: Ring Spinner ==========
export const RingSpinner = ({ size = "md", color = "border-blue-600", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <motion.div
      className={`${spinnerSize} rounded-full border-t-transparent ${color} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// ========== FULL PAGE SPINNER OVERLAY ==========
// eslint-disable-next-line no-unused-vars
export const FullPageSpinner = ({ type = "circle", message = "Loading...", size = "lg", color = "text-blue-600" }) => {
  const renderSpinner = () => {
    switch (type) {
      case "dots":
        return <DotsSpinner size="lg" color="bg-blue-600" />;
      case "bars":
        return <BarsSpinner size="lg" color="bg-blue-600" />;
      case "ring":
        return <RingSpinner size="xl" color="border-blue-600" />;
      case "refresh":
        return <RefreshSpinner size={48} color={color} />;
      default:
        return <CircleSpinner size={48} color={color} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {renderSpinner()}
        {message && <p className="text-gray-700 font-medium text-sm md:text-base">{message}</p>}
      </div>
    </motion.div>
  );
};

// ========== BUTTON SPINNER (Inline for buttons) ==========
export const ButtonSpinner = ({ size = 16, className = "" }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`inline-block ${className}`}
    >
      <Loader size={size} className="text-current" />
    </motion.div>
  );
};
