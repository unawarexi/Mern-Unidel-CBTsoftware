/**
 * useMediaQuery Hook
 * Responsive breakpoint detection
 */
import { useState, useEffect } from "react";
import {
  MEDIA_QUERIES,
  getCurrentBreakpoint,
} from "../../constants/breakpoints";

/**
 * Check if a media query matches
 * @param {string} query - Media query string
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(query);

    const handler = (event) => setMatches(event.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    // Legacy browsers
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
};

/**
 * Hook for common breakpoint checks
 */
export const useBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint);

  useEffect(() => {
    const handleResize = () => setBreakpoint(getCurrentBreakpoint());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "xs" || breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop:
      breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl",
    isSmDown: useMediaQuery(MEDIA_QUERIES.smDown),
    isMdDown: useMediaQuery(MEDIA_QUERIES.mdDown),
    isLgDown: useMediaQuery(MEDIA_QUERIES.lgDown),
    isSm: useMediaQuery(MEDIA_QUERIES.sm),
    isMd: useMediaQuery(MEDIA_QUERIES.md),
    isLg: useMediaQuery(MEDIA_QUERIES.lg),
    isXl: useMediaQuery(MEDIA_QUERIES.xl),
  };
};

export default useMediaQuery;
