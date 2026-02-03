/**
 * Admin Content Hooks - React Query hooks for content management
 * Requires admin authentication
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // Faculties
  getAllFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  // Scholarships
  getAllScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  // Careers
  getAllCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  // News
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  // Events
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  // Gallery
  getAllGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  // Fees
  getAllFees,
  createFee,
  updateFee,
  deleteFee,
  // Settings
  getSiteSettings,
  updateSiteSetting,
  bulkUpdateSettings,
  deleteSiteSetting,
  // Restore
  restoreFaculty,
  restoreScholarship,
  restoreCareer,
  restoreNews,
  restoreEvent,
  restoreGalleryImage,
  restoreFee,
} from "../core/apis/admin-content-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== FACULTIES ==========

export const useGetAllFaculties = () => {
  return useQuery({
    queryKey: ["admin", "faculties"],
    queryFn: getAllFaculties,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faculties"] });
      queryClient.invalidateQueries({ queryKey: ["public", "faculties"] });
    },
  });
};

export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faculties"] });
      queryClient.invalidateQueries({ queryKey: ["public", "faculties"] });
    },
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faculties"] });
      queryClient.invalidateQueries({ queryKey: ["public", "faculties"] });
    },
  });
};

// ========== SCHOLARSHIPS ==========

export const useGetAllScholarships = () => {
  return useQuery({
    queryKey: ["admin", "scholarships"],
    queryFn: getAllScholarships,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["public", "scholarships"] });
    },
  });
};

export const useUpdateScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["public", "scholarships"] });
    },
  });
};

export const useDeleteScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["public", "scholarships"] });
    },
  });
};

// ========== CAREERS ==========

export const useGetAllCareers = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "careers", params],
    queryFn: () => getAllCareers(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
      queryClient.invalidateQueries({ queryKey: ["public", "careers"] });
    },
  });
};

export const useUpdateCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
      queryClient.invalidateQueries({ queryKey: ["public", "careers"] });
    },
  });
};

export const useDeleteCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
      queryClient.invalidateQueries({ queryKey: ["public", "careers"] });
    },
  });
};

// ========== NEWS ==========

export const useGetAllNews = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "news", params],
    queryFn: () => getAllNews(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
      queryClient.invalidateQueries({ queryKey: ["public", "news"] });
      queryClient.invalidateQueries({ queryKey: ["public", "home"] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
      queryClient.invalidateQueries({ queryKey: ["public", "news"] });
      queryClient.invalidateQueries({ queryKey: ["public", "home"] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
      queryClient.invalidateQueries({ queryKey: ["public", "news"] });
      queryClient.invalidateQueries({ queryKey: ["public", "home"] });
    },
  });
};

// ========== EVENTS ==========

export const useGetAllEvents = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "events", params],
    queryFn: () => getAllEvents(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["public", "events"] });
      queryClient.invalidateQueries({ queryKey: ["public", "home"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["public", "events"] });
      queryClient.invalidateQueries({ queryKey: ["public", "home"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["public", "events"] });
      queryClient.invalidateQueries({ queryKey: ["public", "home"] });
    },
  });
};

// ========== GALLERY ==========

export const useGetAllGalleryImages = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "gallery", params],
    queryFn: () => getAllGalleryImages(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
    },
  });
};

export const useUpdateGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
    },
  });
};

// ========== FEES ==========

export const useGetAllFees = () => {
  return useQuery({
    queryKey: ["admin", "fees"],
    queryFn: getAllFees,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      queryClient.invalidateQueries({ queryKey: ["public", "fees"] });
    },
  });
};

export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      queryClient.invalidateQueries({ queryKey: ["public", "fees"] });
    },
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      queryClient.invalidateQueries({ queryKey: ["public", "fees"] });
    },
  });
};

// ========== SITE SETTINGS ==========

export const useGetSiteSettings = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "settings", params],
    queryFn: () => getSiteSettings(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSiteSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["public"] });
    },
  });
};

export const useBulkUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUpdateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["public"] });
    },
  });
};

export const useDeleteSiteSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSiteSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["public"] });
    },
  });
};

export const useRestoreFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faculties"] });
    },
  });
};

export const useRestoreScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "scholarships"] });
    },
  });
};

export const useRestoreCareer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
    },
  });
};

export const useRestoreNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
    },
  });
};

export const useRestoreEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
};

export const useRestoreGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    },
  });
};

export const useRestoreFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
    },
  });
};
