import React from "react";
import useAuthStore from "../store/auth-store";
import useUserStore from "../store/user-store";
import Toast from "./ui/Toast-notifier";
import { FullPageSpinner } from "./Spinners";

export const GlobalUIOverlay = () => {
  // Get toast state from both stores
  const authToast = useAuthStore((state) => state.toast);
  const authHideToast = useAuthStore((state) => state.hideToast);
  const userToast = useUserStore((state) => state.toast);
  const userHideToast = useUserStore((state) => state.hideToast);

  // Choose which toast to display (auth store takes precedence)
  const toastToShow = authToast?.visible
    ? authToast
    : userToast?.visible
      ? userToast
      : { visible: false, message: "", type: "info", duration: 3000 };

  // Global loader if any store indicates
  const authLoading = useAuthStore((state) => state.globalLoader);
  const userLoading = useUserStore((state) => state.globalLoader);
  const showGlobalLoader = authLoading || userLoading;

  return (
    <>
      <Toast
        visible={toastToShow.visible}
        message={toastToShow.message}
        type={toastToShow.type}
        duration={toastToShow.duration}
        onHide={() => {
          if (authToast?.visible) {
            authHideToast();
          } else if (userToast?.visible) {
            userHideToast();
          }
        }}
      />
      {showGlobalLoader && <FullPageSpinner message="Please wait..." />}
    </>
  );
};
