/**
 * Typography Constants
 * Font sizes, weights, line heights, and letter spacing
 */

// Font families
export const FONT_FAMILY = {
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
};

// Font sizes (matches Tailwind)
export const FONT_SIZE = {
  xs: { size: "0.75rem", lineHeight: "1rem" }, // 12px
  sm: { size: "0.875rem", lineHeight: "1.25rem" }, // 14px
  base: { size: "1rem", lineHeight: "1.5rem" }, // 16px
  lg: { size: "1.125rem", lineHeight: "1.75rem" }, // 18px
  xl: { size: "1.25rem", lineHeight: "1.75rem" }, // 20px
  "2xl": { size: "1.5rem", lineHeight: "2rem" }, // 24px
  "3xl": { size: "1.875rem", lineHeight: "2.25rem" }, // 30px
  "4xl": { size: "2.25rem", lineHeight: "2.5rem" }, // 36px
  "5xl": { size: "3rem", lineHeight: "1" }, // 48px
  "6xl": { size: "3.75rem", lineHeight: "1" }, // 60px
  "7xl": { size: "4.5rem", lineHeight: "1" }, // 72px
  "8xl": { size: "6rem", lineHeight: "1" }, // 96px
  "9xl": { size: "8rem", lineHeight: "1" }, // 128px
};

// Font weights
export const FONT_WEIGHT = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// Line heights
export const LINE_HEIGHT = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter spacing
export const LETTER_SPACING = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

// Text styles for common use cases
export const TEXT_STYLES = {
  // Headings
  h1: "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight",
  h2: "text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight",
  h3: "text-xl sm:text-2xl lg:text-3xl font-bold leading-snug",
  h4: "text-lg sm:text-xl font-semibold leading-snug",
  h5: "text-base sm:text-lg font-semibold leading-normal",
  h6: "text-sm sm:text-base font-semibold leading-normal",

  // Body text
  bodyLg: "text-base sm:text-lg leading-relaxed",
  body: "text-sm sm:text-base leading-relaxed",
  bodySm: "text-xs sm:text-sm leading-relaxed",

  // Labels and captions
  label: "text-xs sm:text-sm font-semibold",
  caption: "text-xs text-gray-500",
  overline: "text-xs uppercase tracking-wider font-semibold",

  // Special
  link: "text-blue-600 hover:text-blue-700 font-medium transition-colors",
  code: "font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded",
};

// Responsive font size classes
export const RESPONSIVE_TEXT = {
  display: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl",
  title: "text-2xl sm:text-3xl lg:text-4xl",
  subtitle: "text-lg sm:text-xl lg:text-2xl",
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm",
};

export default FONT_SIZE;
