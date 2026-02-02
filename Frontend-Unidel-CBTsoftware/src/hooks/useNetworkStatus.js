import { useState, useEffect, useCallback } from "react";
import useUIStore from "../store/ui-store";

/**
 * useNetworkStatus - Network detection hook
 *
 * Uses navigator.onLine and window events to detect network status.
 * Syncs the isOffline boolean to Zustand UI store for global access.
 *
 * Usage:
 * const { isOnline, isOffline } = useNetworkStatus();
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const setOffline = useUIStore((state) => state.setOffline);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setOffline(false);
    console.log("🌐 Network: Back online");
  }, [setOffline]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setOffline(true);
    console.log("📴 Network: Gone offline");
  }, [setOffline]);

  useEffect(() => {
    // Set initial state
    const online = navigator.onLine;
    setIsOnline(online);
    setOffline(!online);

    // Listen for network changes
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline, setOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};

/**
 * useIsOffline - Simple offline status selector
 *
 * Use this when you only need to read the offline status without
 * initializing the network listeners (assumes useNetworkStatus is
 * already mounted higher in the component tree).
 */
export const useIsOffline = () => {
  return useUIStore((state) => state.isOffline);
};

export default useNetworkStatus;
