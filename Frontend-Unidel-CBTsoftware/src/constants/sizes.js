/**
 * Size Constants
 * Component sizes for buttons, inputs, avatars, icons, etc.
 */

// Icon sizes
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
};

// Avatar sizes
export const AVATAR_SIZES = {
  xs: { size: 24, fontSize: "text-xs" },
  sm: { size: 32, fontSize: "text-xs" },
  md: { size: 40, fontSize: "text-sm" },
  lg: { size: 48, fontSize: "text-base" },
  xl: { size: 64, fontSize: "text-lg" },
  "2xl": { size: 80, fontSize: "text-xl" },
};

// Button sizes (padding and text)
export const BUTTON_SIZES = {
  xs: {
    padding: "px-2 py-1",
    text: "text-xs",
    icon: 14,
    height: 28,
  },
  sm: {
    padding: "px-3 py-2",
    text: "text-xs sm:text-sm",
    icon: 16,
    height: 36,
  },
  md: {
    padding: "px-4 py-2.5",
    text: "text-sm",
    icon: 18,
    height: 42,
  },
  lg: {
    padding: "px-6 py-3.5",
    text: "text-base",
    icon: 20,
    height: 52,
  },
  xl: {
    padding: "px-8 py-4",
    text: "text-lg",
    icon: 24,
    height: 60,
  },
};

// Input sizes
export const INPUT_SIZES = {
  sm: {
    padding: "px-3 py-2",
    text: "text-sm",
    height: 36,
  },
  md: {
    padding: "px-3 sm:px-4 py-2.5 sm:py-3.5",
    text: "text-sm sm:text-base",
    height: 46,
  },
  lg: {
    padding: "px-4 sm:px-5 py-3.5 sm:py-4",
    text: "text-base sm:text-lg",
    height: 56,
  },
};

// Modal sizes
export const MODAL_SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  full: "max-w-[95vw]",
};

// Card sizes
export const CARD_SIZES = {
  sm: { padding: "p-3 sm:p-4" },
  md: { padding: "p-4 sm:p-5" },
  lg: { padding: "p-5 sm:p-6" },
  xl: { padding: "p-6 sm:p-8" },
};

// Border radius
export const BORDER_RADIUS = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

// Shadow sizes
export const SHADOWS = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
};

// Z-index layers
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  max: 9999,
};

export default {
  ICON_SIZES,
  AVATAR_SIZES,
  BUTTON_SIZES,
  INPUT_SIZES,
  MODAL_SIZES,
  CARD_SIZES,
  BORDER_RADIUS,
  SHADOWS,
  Z_INDEX,
};
