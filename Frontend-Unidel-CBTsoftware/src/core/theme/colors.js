/**
 * Theme Colors
 * Comprehensive color system for the UNIDEL CBT application
 * Use these throughout the app for consistency
 */

// Brand Colors
export const BRAND = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  accent: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
  },
};

// Role-based color schemes
export const ROLE_COLORS = {
  student: {
    primary: "from-blue-600 to-indigo-600",
    secondary: "blue",
    bg: "from-blue-50 via-white to-indigo-50",
    accent: "blue-600",
    focusRing: "focus:ring-blue-200",
  },
  admin: {
    primary: "from-emerald-600 to-cyan-600",
    secondary: "emerald",
    bg: "from-slate-900 via-gray-900 to-slate-900",
    accent: "emerald-600",
    focusRing: "focus:ring-emerald-200",
  },
  lecturer: {
    primary: "from-orange-600 to-red-600",
    secondary: "orange",
    bg: "from-orange-50 via-white to-amber-50",
    accent: "orange-600",
    focusRing: "focus:ring-orange-200",
  },
};

// Semantic colors
export const SEMANTIC = {
  success: {
    light: "bg-green-50",
    bg: "bg-green-500",
    text: "text-green-600",
    border: "border-green-200",
    hover: "hover:bg-green-600",
  },
  warning: {
    light: "bg-orange-50",
    bg: "bg-orange-500",
    text: "text-orange-600",
    border: "border-orange-200",
    hover: "hover:bg-orange-600",
  },
  error: {
    light: "bg-red-50",
    bg: "bg-red-500",
    text: "text-red-600",
    border: "border-red-200",
    hover: "hover:bg-red-600",
  },
  info: {
    light: "bg-blue-50",
    bg: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-200",
    hover: "hover:bg-blue-600",
  },
};

// Status colors for badges, indicators
export const STATUS = {
  active: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  inactive: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  completed: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  failed: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  scheduled: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  inProgress: { bg: "bg-cyan-100", text: "text-cyan-700", dot: "bg-cyan-500" },
};

// UI Colors
export const UI = {
  background: {
    primary: "bg-white",
    secondary: "bg-gray-50",
    tertiary: "bg-gray-100",
    dark: "bg-gray-900",
  },
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    tertiary: "text-gray-500",
    muted: "text-gray-400",
    inverse: "text-white",
    link: "text-blue-600 hover:text-blue-700",
  },
  border: {
    default: "border-gray-200",
    light: "border-gray-100",
    dark: "border-gray-300",
    focus: "border-blue-500",
    error: "border-red-500",
  },
  ring: {
    default: "ring-gray-200",
    focus: "ring-blue-500",
    error: "ring-red-500",
  },
};

// Gradient presets
export const GRADIENTS = {
  primary: "bg-gradient-to-r from-blue-600 to-indigo-600",
  secondary: "bg-gradient-to-r from-green-600 to-emerald-600",
  accent: "bg-gradient-to-r from-orange-600 to-red-600",
  admin: "bg-gradient-to-r from-emerald-600 to-cyan-600",
  danger: "bg-gradient-to-r from-red-600 to-rose-600",
  dark: "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900",
  hero: {
    student:
      "bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95",
    admin:
      "bg-gradient-to-br from-slate-950/97 via-gray-900/95 to-slate-950/97",
    lecturer:
      "bg-gradient-to-br from-orange-900/95 via-red-900/90 to-amber-900/95",
  },
};

// Shadow colors with transparency
export const SHADOW_COLORS = {
  blue: "shadow-blue-500/30",
  green: "shadow-green-500/30",
  emerald: "shadow-emerald-500/30",
  orange: "shadow-orange-500/30",
  red: "shadow-red-500/30",
  purple: "shadow-purple-500/30",
};

// Legacy colorMap for backward compatibility
export const colorMap = {
  primary: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-600",
    hover: "hover:border-blue-300",
    icon: "bg-blue-100",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  secondary: {
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-600",
    hover: "hover:border-green-300",
    icon: "bg-green-100",
    button: "bg-green-600 hover:bg-green-700",
  },
  accent: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    text: "text-orange-600",
    hover: "hover:border-orange-300",
    icon: "bg-orange-100",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    icon: "bg-blue-100",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    icon: "bg-green-100",
    button: "bg-green-600 hover:bg-green-700",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    icon: "bg-orange-100",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    icon: "bg-red-100",
    button: "bg-red-600 hover:bg-red-700",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-600",
    icon: "bg-purple-100",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  gray: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
    icon: "bg-gray-100",
    button: "bg-gray-600 hover:bg-gray-700",
    hover: "hover:border-gray-300",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    icon: "bg-emerald-100",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-600",
    icon: "bg-cyan-100",
    button: "bg-cyan-600 hover:bg-cyan-700",
  },
};

export default {
  BRAND,
  ROLE_COLORS,
  SEMANTIC,
  STATUS,
  UI,
  GRADIENTS,
  SHADOW_COLORS,
  colorMap,
};
