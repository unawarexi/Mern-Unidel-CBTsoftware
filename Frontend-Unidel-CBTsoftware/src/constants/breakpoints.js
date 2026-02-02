/**
 * Breakpoints Constants
 * Matches Tailwind CSS default breakpoints for consistency
 * Use these in JavaScript for responsive logic
 */

// Breakpoint pixel values
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Media query strings for use with matchMedia
export const MEDIA_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINTS["2xl"]}px)`,
  // Max-width queries (mobile-first)
  smDown: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  mdDown: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  lgDown: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  xlDown: `(max-width: ${BREAKPOINTS.xl - 1}px)`,
};

// Tailwind class prefixes for responsive design
export const RESPONSIVE_PREFIXES = {
  xs: "",
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
  "2xl": "2xl:",
};

// Container max-widths matching Tailwind
export const CONTAINER_WIDTHS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

/**
 * Check if viewport matches breakpoint
 * @param {string} breakpoint - xs, sm, md, lg, xl, 2xl
 * @returns {boolean}
 */
export const matchBreakpoint = (breakpoint) => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MEDIA_QUERIES[breakpoint]).matches;
};

/**
 * Get current breakpoint name
 * @returns {string} - Current breakpoint: xs, sm, md, lg, xl, 2xl
 */
export const getCurrentBreakpoint = () => {
  if (typeof window === "undefined") return "md";
  const width = window.innerWidth;
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
};

export default BREAKPOINTS;
