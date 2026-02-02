/**
 * useIntersectionObserver Hook
 * Lazy loading trigger for landing page sections
 * Data fetching only starts when section enters viewport
 */
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for Intersection Observer
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.1
 * @param {string} options.rootMargin - Root margin, default "50px" (preload slightly before visible)
 * @param {boolean} options.triggerOnce - Only trigger once, default true
 * @param {boolean} options.enabled - Enable/disable observer, default true
 * @returns {{ ref: React.RefObject, isIntersecting: boolean, hasIntersected: boolean }}
 */
export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "50px",
  triggerOnce = true,
  enabled = true,
} = {}) => {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!enabled || (triggerOnce && hasIntersected)) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);

        if (intersecting && triggerOnce) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, enabled, hasIntersected]);

  return {
    ref,
    isIntersecting,
    hasIntersected: triggerOnce ? hasIntersected : isIntersecting,
  };
};

/**
 * Hook for lazy-loaded data fetching
 * Combines intersection observer with React Query's enabled option
 * @param {Object} options - Observer options
 * @returns {{ ref: React.RefObject, shouldFetch: boolean }}
 */
export const useLazySection = (options = {}) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.05,
    rootMargin: "100px", // Start fetching 100px before visible
    triggerOnce: true,
    ...options,
  });

  return {
    ref,
    shouldFetch: hasIntersected,
  };
};

export default useIntersectionObserver;
