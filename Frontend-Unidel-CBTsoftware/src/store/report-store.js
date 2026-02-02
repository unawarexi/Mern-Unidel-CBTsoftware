import { create } from "zustand";

const useReportStore = create((set) => ({
  isGenerating: false,
  lastGeneratedReport: null,
  error: null,

  setGenerating: (status) => set({ isGenerating: status }),
  setLastGeneratedReport: (report) => set({ lastGeneratedReport: report }),
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
  reset: () =>
    set({ isGenerating: false, lastGeneratedReport: null, error: null }),
}));

export default useReportStore;
