import { useCallback } from "react";
import { useIsOffline } from "./useNetworkStatus";
import useAuthStore from "../store/auth-store";

/**
 * useNetworkSafeMutation - Wrapper for mutations that blocks when offline
 *
 * This hook wraps a TanStack Query mutation hook and adds network safety:
 * - Prevents mutation execution when offline
 * - Shows a warning toast to the user
 * - Returns the original mutation with a safe wrapper
 *
 * Usage:
 * const { safeMutate, isLoading, isOffline } = useNetworkSafeMutation(useCreateExam);
 *
 * // Instead of mutation.mutateAsync(data), use:
 * await safeMutate(data);
 */
export const useNetworkSafeMutation = (useMutationHook) => {
  const isOffline = useIsOffline();
  const showToast = useAuthStore((state) => state.showToast);

  // Call the mutation hook
  const mutation = useMutationHook();

  /**
   * Safe wrapper around mutateAsync that checks network status first
   */
  const safeMutate = useCallback(
    async (...args) => {
      if (isOffline) {
        showToast("Cannot perform this action while offline", "warning");
        console.warn("🚫 Mutation blocked: Network is offline");
        return Promise.reject(new Error("Network is offline"));
      }
      return mutation.mutateAsync(...args);
    },
    [isOffline, mutation, showToast],
  );

  /**
   * Safe wrapper around mutate (non-async version)
   */
  const safeMutateSync = useCallback(
    (...args) => {
      if (isOffline) {
        showToast("Cannot perform this action while offline", "warning");
        console.warn("🚫 Mutation blocked: Network is offline");
        return;
      }
      mutation.mutate(...args);
    },
    [isOffline, mutation, showToast],
  );

  return {
    ...mutation,
    safeMutate,
    safeMutateSync,
    isOffline,
  };
};

/**
 * createNetworkSafeAction - Factory for creating network-safe action hooks
 *
 * Use this in store files to wrap mutation actions:
 *
 * export const useCreateExamAction = createNetworkSafeAction(
 *   useExamStore,
 *   useCreateExam,
 *   {
 *     successMessage: 'Exam created successfully',
 *     errorMessage: 'Failed to create exam',
 *   }
 * );
 */
export const createNetworkSafeAction = (
  useStore,
  useMutationHook,
  options = {},
) => {
  return () => {
    const isOffline = useIsOffline();
    const { showToast, showLoader, hideLoader, setLoading, setError } =
      useStore();
    const mutation = useMutationHook();

    const execute = async (...args) => {
      if (isOffline) {
        showToast("Cannot perform this action while offline", "warning");
        return Promise.reject(new Error("Network is offline"));
      }

      setLoading?.(true);
      setError?.(null);
      showLoader?.();

      try {
        const result = await mutation.mutateAsync(...args);
        if (options.successMessage) {
          showToast(options.successMessage, "success");
        }
        return result;
      } catch (error) {
        setError?.(error.message);
        showToast(
          error.message || options.errorMessage || "Operation failed",
          "error",
        );
        throw error;
      } finally {
        setLoading?.(false);
        hideLoader?.();
      }
    };

    return {
      execute,
      isLoading: mutation.isPending,
      error: mutation.error,
      isOffline,
    };
  };
};

export default useNetworkSafeMutation;
