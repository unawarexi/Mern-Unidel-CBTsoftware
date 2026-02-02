import { useEffect } from "react";
import { useAuthCurrentUser } from "../store/auth-store";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

// Component to initialize auth on app load
export const AuthInitializer = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, isLoading, error } = useAuthCurrentUser();

  useEffect(() => {
    if (error) {
      console.log("⚠️ Failed to fetch current user on app init");
    }
    if (user) {
      console.log("✅ Current user loaded:", user);
    }
  }, [user, error]);

  return null;
};

// Component to initialize network status detection
export const NetworkInitializer = () => {
  // This hook sets up the online/offline event listeners
  // and syncs the status to the UI store
  useNetworkStatus();
  return null;
};
