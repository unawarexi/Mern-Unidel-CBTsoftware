import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth-store";

// New component to handle session expiry
export const SessionExpiryHandler = () => {
  const navigate = useNavigate();
  const handleSessionExpiry = useAuthStore(
    (state) => state.handleSessionExpiry,
  );

  useEffect(() => {
    const handleExpiry = (event) => {
      console.log(" Session expired event received:", event.detail);
      handleSessionExpiry(navigate);
    };

    window.addEventListener("session-expired", handleExpiry);

    return () => {
      window.removeEventListener("session-expired", handleExpiry);
    };
  }, [navigate, handleSessionExpiry]);

  return null;
};
