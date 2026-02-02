/**
 * Admin Content Store - Zustand store with React Query integration
 * Manages client-side state for admin content management
 */
import { create } from "zustand";
import { useEffect } from "react";
import {
  // Faculties
  useGetAllFaculties,
  useCreateFaculty,
  useUpdateFaculty,
  useDeleteFaculty,
  // Scholarships
  useGetAllScholarships,
  useCreateScholarship,
  useUpdateScholarship,
  useDeleteScholarship,
  // Careers
  useGetAllCareers,
  useCreateCareer,
  useUpdateCareer,
  useDeleteCareer,
  // News
  useGetAllNews,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
  // Events
  useGetAllEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  // Gallery
  useGetAllGalleryImages,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  // Fees
  useGetAllFees,
  useCreateFee,
  useUpdateFee,
  useDeleteFee,
  // Settings
  useGetSiteSettings,
  useUpdateSiteSetting,
  useBulkUpdateSettings,
  useDeleteSiteSetting,
} from "../hooks/useAdminContent";

// ========== ZUSTAND STORE ==========

const useAdminContentStore = create((set) => ({
  // Selected items for each content type
  selectedFaculty: null,
  selectedScholarship: null,
  selectedCareer: null,
  selectedNews: null,
  selectedEvent: null,
  selectedGalleryImage: null,
  selectedFee: null,
  selectedSetting: null,

  // Loading and error state
  isLoading: false,
  error: null,

  // UI helpers
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) =>
    set({ toast: { visible: true, message, type, duration } }),
  hideToast: () =>
    set({
      toast: { visible: false, message: "", type: "success", duration: 3000 },
    }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Selection actions
  setSelectedFaculty: (faculty) => set({ selectedFaculty: faculty }),
  clearSelectedFaculty: () => set({ selectedFaculty: null }),

  setSelectedScholarship: (scholarship) =>
    set({ selectedScholarship: scholarship }),
  clearSelectedScholarship: () => set({ selectedScholarship: null }),

  setSelectedCareer: (career) => set({ selectedCareer: career }),
  clearSelectedCareer: () => set({ selectedCareer: null }),

  setSelectedNews: (news) => set({ selectedNews: news }),
  clearSelectedNews: () => set({ selectedNews: null }),

  setSelectedEvent: (event) => set({ selectedEvent: event }),
  clearSelectedEvent: () => set({ selectedEvent: null }),

  setSelectedGalleryImage: (image) => set({ selectedGalleryImage: image }),
  clearSelectedGalleryImage: () => set({ selectedGalleryImage: null }),

  setSelectedFee: (fee) => set({ selectedFee: fee }),
  clearSelectedFee: () => set({ selectedFee: null }),

  setSelectedSetting: (setting) => set({ selectedSetting: setting }),
  clearSelectedSetting: () => set({ selectedSetting: null }),

  // Common actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Clear all selections
  clearAllSelections: () =>
    set({
      selectedFaculty: null,
      selectedScholarship: null,
      selectedCareer: null,
      selectedNews: null,
      selectedEvent: null,
      selectedGalleryImage: null,
      selectedFee: null,
      selectedSetting: null,
    }),
}));

// ========== FACULTIES ACTION HOOKS ==========

export const useGetAllFacultiesAction = () => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetAllFaculties();

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    faculties: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useCreateFacultyAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const createFacultyMutation = useCreateFaculty();

  const createFaculty = async (facultyData) => {
    console.log("[STORE] useCreateFacultyAction called", facultyData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await createFacultyMutation.mutateAsync(facultyData);
      showToast("Faculty created successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateFacultyAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to create faculty", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createFaculty,
    isLoading: createFacultyMutation.isLoading,
    error: createFacultyMutation.error,
  };
};

export const useUpdateFacultyAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateFacultyMutation = useUpdateFaculty();

  const updateFaculty = async (id, facultyData) => {
    console.log("[STORE] useUpdateFacultyAction called", { id, facultyData });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateFacultyMutation.mutateAsync({
        id,
        data: facultyData,
      });
      showToast("Faculty updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateFacultyAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update faculty", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateFaculty,
    isLoading: updateFacultyMutation.isLoading,
    error: updateFacultyMutation.error,
  };
};

export const useDeleteFacultyAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteFacultyMutation = useDeleteFaculty();

  const deleteFaculty = async (id) => {
    console.log("[STORE] useDeleteFacultyAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteFacultyMutation.mutateAsync(id);
      showToast("Faculty deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteFacultyAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete faculty", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteFaculty,
    isLoading: deleteFacultyMutation.isLoading,
    error: deleteFacultyMutation.error,
  };
};

// ========== SCHOLARSHIPS ACTION HOOKS ==========

export const useGetAllScholarshipsAction = () => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetAllScholarships();

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    scholarships: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useCreateScholarshipAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const createScholarshipMutation = useCreateScholarship();

  const createScholarship = async (scholarshipData) => {
    console.log("[STORE] useCreateScholarshipAction called", scholarshipData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await createScholarshipMutation.mutateAsync(scholarshipData);
      showToast("Scholarship created successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateScholarshipAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to create scholarship", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createScholarship,
    isLoading: createScholarshipMutation.isLoading,
    error: createScholarshipMutation.error,
  };
};

export const useUpdateScholarshipAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateScholarshipMutation = useUpdateScholarship();

  const updateScholarship = async (id, scholarshipData) => {
    console.log("[STORE] useUpdateScholarshipAction called", {
      id,
      scholarshipData,
    });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateScholarshipMutation.mutateAsync({
        id,
        data: scholarshipData,
      });
      showToast("Scholarship updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateScholarshipAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update scholarship", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateScholarship,
    isLoading: updateScholarshipMutation.isLoading,
    error: updateScholarshipMutation.error,
  };
};

export const useDeleteScholarshipAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteScholarshipMutation = useDeleteScholarship();

  const deleteScholarship = async (id) => {
    console.log("[STORE] useDeleteScholarshipAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteScholarshipMutation.mutateAsync(id);
      showToast("Scholarship deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteScholarshipAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete scholarship", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteScholarship,
    isLoading: deleteScholarshipMutation.isLoading,
    error: deleteScholarshipMutation.error,
  };
};

// ========== CAREERS ACTION HOOKS ==========

export const useGetAllCareersAction = (params = {}) => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetAllCareers(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    careers: data?.data || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateCareerAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const createCareerMutation = useCreateCareer();

  const createCareer = async (careerData) => {
    console.log("[STORE] useCreateCareerAction called", careerData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await createCareerMutation.mutateAsync(careerData);
      showToast("Career opportunity created successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateCareerAction error:", error);
      setError(error.message);
      showToast(
        error.message || "Failed to create career opportunity",
        "error",
      );
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createCareer,
    isLoading: createCareerMutation.isLoading,
    error: createCareerMutation.error,
  };
};

export const useUpdateCareerAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateCareerMutation = useUpdateCareer();

  const updateCareer = async (id, careerData) => {
    console.log("[STORE] useUpdateCareerAction called", { id, careerData });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateCareerMutation.mutateAsync({
        id,
        data: careerData,
      });
      showToast("Career opportunity updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateCareerAction error:", error);
      setError(error.message);
      showToast(
        error.message || "Failed to update career opportunity",
        "error",
      );
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateCareer,
    isLoading: updateCareerMutation.isLoading,
    error: updateCareerMutation.error,
  };
};

export const useDeleteCareerAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteCareerMutation = useDeleteCareer();

  const deleteCareer = async (id) => {
    console.log("[STORE] useDeleteCareerAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteCareerMutation.mutateAsync(id);
      showToast("Career opportunity deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteCareerAction error:", error);
      setError(error.message);
      showToast(
        error.message || "Failed to delete career opportunity",
        "error",
      );
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteCareer,
    isLoading: deleteCareerMutation.isLoading,
    error: deleteCareerMutation.error,
  };
};

// ========== NEWS ACTION HOOKS ==========

export const useGetAllNewsAction = (params = {}) => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetAllNews(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    news: data?.data || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateNewsAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const createNewsMutation = useCreateNews();

  const createNews = async (newsData) => {
    console.log("[STORE] useCreateNewsAction called", newsData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await createNewsMutation.mutateAsync(newsData);
      showToast("News article created successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateNewsAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to create news article", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createNews,
    isLoading: createNewsMutation.isLoading,
    error: createNewsMutation.error,
  };
};

export const useUpdateNewsAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateNewsMutation = useUpdateNews();

  const updateNews = async (id, newsData) => {
    console.log("[STORE] useUpdateNewsAction called", { id, newsData });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateNewsMutation.mutateAsync({ id, data: newsData });
      showToast("News article updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateNewsAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update news article", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateNews,
    isLoading: updateNewsMutation.isLoading,
    error: updateNewsMutation.error,
  };
};

export const useDeleteNewsAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteNewsMutation = useDeleteNews();

  const deleteNews = async (id) => {
    console.log("[STORE] useDeleteNewsAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteNewsMutation.mutateAsync(id);
      showToast("News article deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteNewsAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete news article", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteNews,
    isLoading: deleteNewsMutation.isLoading,
    error: deleteNewsMutation.error,
  };
};

// ========== EVENTS ACTION HOOKS ==========

export const useGetAllEventsAction = (params = {}) => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetAllEvents(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    events: data?.data || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateEventAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const createEventMutation = useCreateEvent();

  const createEvent = async (eventData) => {
    console.log("[STORE] useCreateEventAction called", eventData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await createEventMutation.mutateAsync(eventData);
      showToast("Event created successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateEventAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to create event", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createEvent,
    isLoading: createEventMutation.isLoading,
    error: createEventMutation.error,
  };
};

export const useUpdateEventAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateEventMutation = useUpdateEvent();

  const updateEvent = async (id, eventData) => {
    console.log("[STORE] useUpdateEventAction called", { id, eventData });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateEventMutation.mutateAsync({
        id,
        data: eventData,
      });
      showToast("Event updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateEventAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update event", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateEvent,
    isLoading: updateEventMutation.isLoading,
    error: updateEventMutation.error,
  };
};

export const useDeleteEventAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteEventMutation = useDeleteEvent();

  const deleteEvent = async (id) => {
    console.log("[STORE] useDeleteEventAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteEventMutation.mutateAsync(id);
      showToast("Event deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteEventAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete event", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteEvent,
    isLoading: deleteEventMutation.isLoading,
    error: deleteEventMutation.error,
  };
};

// ========== GALLERY ACTION HOOKS ==========

export const useGetAllGalleryImagesAction = (params = {}) => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetAllGalleryImages(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    images: data?.data || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateGalleryImageAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const createGalleryImageMutation = useCreateGalleryImage();

  const createGalleryImage = async (imageData) => {
    console.log("[STORE] useCreateGalleryImageAction called", imageData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await createGalleryImageMutation.mutateAsync(imageData);
      showToast("Gallery image uploaded successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateGalleryImageAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to upload gallery image", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createGalleryImage,
    isLoading: createGalleryImageMutation.isLoading,
    error: createGalleryImageMutation.error,
  };
};

export const useUpdateGalleryImageAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateGalleryImageMutation = useUpdateGalleryImage();

  const updateGalleryImage = async (id, imageData) => {
    console.log("[STORE] useUpdateGalleryImageAction called", {
      id,
      imageData,
    });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateGalleryImageMutation.mutateAsync({
        id,
        data: imageData,
      });
      showToast("Gallery image updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateGalleryImageAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update gallery image", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateGalleryImage,
    isLoading: updateGalleryImageMutation.isLoading,
    error: updateGalleryImageMutation.error,
  };
};

export const useDeleteGalleryImageAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteGalleryImageMutation = useDeleteGalleryImage();

  const deleteGalleryImage = async (id) => {
    console.log("[STORE] useDeleteGalleryImageAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteGalleryImageMutation.mutateAsync(id);
      showToast("Gallery image deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteGalleryImageAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete gallery image", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteGalleryImage,
    isLoading: deleteGalleryImageMutation.isLoading,
    error: deleteGalleryImageMutation.error,
  };
};

// ========== FEES ACTION HOOKS ==========

export const useGetAllFeesAction = () => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetAllFees();

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    fees: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useCreateFeeAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const createFeeMutation = useCreateFee();

  const createFee = async (feeData) => {
    console.log("[STORE] useCreateFeeAction called", feeData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await createFeeMutation.mutateAsync(feeData);
      showToast("Fee structure created successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateFeeAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to create fee structure", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createFee,
    isLoading: createFeeMutation.isLoading,
    error: createFeeMutation.error,
  };
};

export const useUpdateFeeAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateFeeMutation = useUpdateFee();

  const updateFee = async (id, feeData) => {
    console.log("[STORE] useUpdateFeeAction called", { id, feeData });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateFeeMutation.mutateAsync({ id, data: feeData });
      showToast("Fee structure updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateFeeAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update fee structure", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateFee,
    isLoading: updateFeeMutation.isLoading,
    error: updateFeeMutation.error,
  };
};

export const useDeleteFeeAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteFeeMutation = useDeleteFee();

  const deleteFee = async (id) => {
    console.log("[STORE] useDeleteFeeAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteFeeMutation.mutateAsync(id);
      showToast("Fee structure deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteFeeAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete fee structure", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteFee,
    isLoading: deleteFeeMutation.isLoading,
    error: deleteFeeMutation.error,
  };
};

// ========== SITE SETTINGS ACTION HOOKS ==========

export const useGetSiteSettingsAction = (params = {}) => {
  const { setError } = useAdminContentStore();
  const { data, isLoading, error, refetch } = useGetSiteSettings(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    settings: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateSiteSettingAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const updateSettingMutation = useUpdateSiteSetting();

  const updateSiteSetting = async (id, settingData) => {
    console.log("[STORE] useUpdateSiteSettingAction called", {
      id,
      settingData,
    });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await updateSettingMutation.mutateAsync({
        id,
        data: settingData,
      });
      showToast("Site setting updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateSiteSettingAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update site setting", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateSiteSetting,
    isLoading: updateSettingMutation.isLoading,
    error: updateSettingMutation.error,
  };
};

export const useBulkUpdateSettingsAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const bulkUpdateMutation = useBulkUpdateSettings();

  const bulkUpdateSettings = async (settingsData) => {
    console.log("[STORE] useBulkUpdateSettingsAction called", settingsData);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await bulkUpdateMutation.mutateAsync(settingsData);
      showToast("Site settings updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useBulkUpdateSettingsAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update site settings", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    bulkUpdateSettings,
    isLoading: bulkUpdateMutation.isLoading,
    error: bulkUpdateMutation.error,
  };
};

export const useDeleteSiteSettingAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useAdminContentStore();
  const deleteSettingMutation = useDeleteSiteSetting();

  const deleteSiteSetting = async (id) => {
    console.log("[STORE] useDeleteSiteSettingAction called", id);
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await deleteSettingMutation.mutateAsync(id);
      showToast("Site setting deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteSiteSettingAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete site setting", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteSiteSetting,
    isLoading: deleteSettingMutation.isLoading,
    error: deleteSettingMutation.error,
  };
};

export default useAdminContentStore;
