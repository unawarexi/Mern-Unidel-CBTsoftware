/**
 * Spacing Constants
 * Consistent spacing scale for components
 * Based on 4px base unit (Tailwind default)
 */

// Spacing values in pixels (for JS calculations)
export const SPACING = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

// Component-specific spacing
export const COMPONENT_SPACING = {
  // Padding
  input: {
    sm: { x: 12, y: 8 }, // px-3 py-2
    md: { x: 16, y: 14 }, // px-4 py-3.5
    lg: { x: 20, y: 16 }, // px-5 py-4
  },
  button: {
    sm: { x: 12, y: 8 }, // px-3 py-2
    md: { x: 16, y: 10 }, // px-4 py-2.5
    lg: { x: 24, y: 14 }, // px-6 py-3.5
  },
  card: {
    sm: { x: 12, y: 12 }, // p-3
    md: { x: 20, y: 20 }, // p-5
    lg: { x: 24, y: 24 }, // p-6
  },
  modal: {
    sm: { x: 16, y: 16 }, // p-4
    md: { x: 24, y: 24 }, // p-6
    lg: { x: 32, y: 32 }, // p-8
  },
};

// Gap sizes for grids and flex
export const GAP = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Section spacing
export const SECTION_SPACING = {
  sm: { y: 32 }, // py-8
  md: { y: 48 }, // py-12
  lg: { y: 64 }, // py-16
  xl: { y: 96 }, // py-24
};

export default SPACING;
