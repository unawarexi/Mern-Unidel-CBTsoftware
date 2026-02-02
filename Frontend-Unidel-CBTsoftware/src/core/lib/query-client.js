import { QueryClient } from "@tanstack/react-query";

/**
 * Network-aware retry function
 *
 * - Retries network errors up to 3 times with exponential backoff
 * - Does NOT retry on 4xx client errors (bad request, unauthorized, etc.)
 * - Does NOT retry on 5xx server errors after first attempt
 */
const shouldRetry = (failureCount, error) => {
  // Don't retry on 4xx client errors
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    return false;
  }
  // Retry network errors up to 3 times
  return failureCount < 3;
};

/**
 * Exponential backoff for retries
 * Starts at 1s, doubles each time, caps at 30s
 */
const retryDelay = (attemptIndex) => {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
};

/**
 * QueryClient Configuration
 *
 * Following skills.md rules:
 * - staleTime: How long data is considered fresh (5 min)
 * - gcTime: How long unused cache is kept (10 min)
 * - keepPreviousData: Show stale data while refetching
 * - refetchOnReconnect: Refetch when coming back online
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: retryDelay,
      staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
      gcTime: 1000 * 60 * 10, // 10 minutes - cache lifetime (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      refetchOnReconnect: true, // Refetch when network comes back
      refetchOnMount: false, // Don't refetch on every mount
      networkMode: "offlineFirst", // Return cached data when offline
    },
    mutations: {
      retry: false, // Never retry mutations
      networkMode: "online", // Only run mutations when online
    },
  },
});
