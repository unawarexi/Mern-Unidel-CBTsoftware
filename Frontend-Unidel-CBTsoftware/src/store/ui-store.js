import { create } from "zustand";

/**
 * UI Store - Centralized client-side UI state
 *
 * This store holds ONLY client/UI state:
 * - ✅ Network status (isOffline boolean)
 * - ✅ Modal states
 * - ✅ UI flags
 *
 * It does NOT hold:
 * - ❌ API responses (use TanStack Query)
 * - ❌ Server errors (use TanStack Query)
 * - ❌ Loading states from queries (use TanStack Query)
 */
const useUIStore = create((set) => ({
  // Network status
  isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
  setOffline: (isOffline) => set({ isOffline }),

  // Global modal states
  confirmModal: {
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger", // 'danger' | 'warning' | 'info'
  },
  openConfirmModal: (config) =>
    set({
      confirmModal: {
        isOpen: true,
        title: config.title || "Confirm Action",
        message: config.message || "Are you sure?",
        onConfirm: config.onConfirm || null,
        onCancel: config.onCancel || null,
        confirmText: config.confirmText || "Confirm",
        cancelText: config.cancelText || "Cancel",
        variant: config.variant || "danger",
      },
    }),
  closeConfirmModal: () =>
    set({
      confirmModal: {
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
        confirmText: "Confirm",
        cancelText: "Cancel",
        variant: "danger",
      },
    }),

  // Sidebar state
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));

export default useUIStore;
