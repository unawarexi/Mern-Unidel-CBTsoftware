/**
 * Animation Constants
 * Framer Motion animation presets and Tailwind animation classes
 */

// Transition durations (in seconds for Framer Motion)
export const DURATION = {
  instant: 0,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
};

// Easing functions
export const EASING = {
  linear: "linear",
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 400, damping: 30 },
  bounce: { type: "spring", stiffness: 300, damping: 15 },
};

// Framer Motion variants
export const MOTION_VARIANTS = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.normal },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: DURATION.normal },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: DURATION.normal },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: DURATION.normal },
  },
  scaleInBounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: EASING.bounce,
  },

  // Slide animations
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Modal/Dialog
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: DURATION.normal, ease: "easeOut" },
  },
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.fast },
  },

  // List stagger (for children)
  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.05 },
    },
  },
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
};

// Tailwind animation classes
export const ANIMATION_CLASSES = {
  // Entrance
  fadeIn: "animate-in fade-in",
  fadeInUp: "animate-in fade-in slide-in-from-bottom-2",
  fadeInDown: "animate-in fade-in slide-in-from-top-2",
  fadeInLeft: "animate-in fade-in slide-in-from-left-2",
  fadeInRight: "animate-in fade-in slide-in-from-right-2",
  scaleIn: "animate-in zoom-in-95",

  // Exit
  fadeOut: "animate-out fade-out",
  fadeOutDown: "animate-out fade-out slide-out-to-bottom-2",
  fadeOutUp: "animate-out fade-out slide-out-to-top-2",

  // Looping
  spin: "animate-spin",
  ping: "animate-ping",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
};

// Button press animation
export const BUTTON_TAP = { scale: 0.98 };
export const BUTTON_HOVER = { scale: 1.02 };

// Page transition
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: DURATION.normal },
};

export default {
  DURATION,
  EASING,
  MOTION_VARIANTS,
  ANIMATION_CLASSES,
  BUTTON_TAP,
  BUTTON_HOVER,
  PAGE_TRANSITION,
};
