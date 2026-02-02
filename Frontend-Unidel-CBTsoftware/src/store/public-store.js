/**
 * Public Store - Zustand store for public landing page data
 * Wraps React Query hooks with centralized state management
 */
import { create } from "zustand";
import { useEffect } from "react";
import {
  useHomePageData,
  usePublicStats,
  usePublicFaculties,
  usePublicFacultyByCode,
  usePublicScholarships,
  usePublicCareers,
  usePublicCareerById,
  usePublicNews,
  usePublicNewsBySlug,
  usePublicEvents,
  usePublicEventBySlug,
  usePublicGallery,
  usePublicFees,
} from "../hooks/usePublic";

// ========== ZUSTAND STORE ==========

const usePublicStore = create((set) => ({
  // Loading and error state
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// ========== HOMEPAGE DATA ==========

export const useHomeDataAction = (options = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = useHomePageData();

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    homeData: data?.data || null,
    stats: data?.data?.stats || null,
    faculties: data?.data?.faculties || [],
    featuredNews: data?.data?.featuredNews || [],
    upcomingEvents: data?.data?.upcomingEvents || [],
    scholarships: data?.data?.scholarships || [],
    isLoading,
    error,
    refetch,
  };
};

// ========== PUBLIC STATS ==========

export const usePublicStatsAction = (options = {}) => {
  const { enabled = true } = options;
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicStats();

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    stats: data?.data || null,
    totalStudents: data?.data?.totalStudents || 0,
    totalLecturers: data?.data?.totalLecturers || 0,
    totalCourses: data?.data?.totalCourses || 0,
    totalExams: data?.data?.totalExams || 0,
    totalFaculties: data?.data?.totalFaculties || 0,
    totalDepartments: data?.data?.totalDepartments || 0,
    examSuccessData: data?.data?.examSuccessData || [],
    departmentData: data?.data?.departmentData || [],
    monthlyPerformanceData: data?.data?.monthlyPerformanceData || [],
    transparencyHighlights: data?.data?.transparencyHighlights || [],
    isLoading,
    error,
    refetch,
  };
};

// ========== FACULTIES ==========

export const usePublicFacultiesAction = (options = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicFaculties();

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

export const usePublicFacultyByCodeAction = (code) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicFacultyByCode(code);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    faculty: data?.data || null,
    isLoading,
    error,
    refetch,
  };
};

// ========== SCHOLARSHIPS ==========

export const usePublicScholarshipsAction = (params = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicScholarships(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    scholarships: data?.data?.scholarships || [],
    stats: data?.data?.stats || {},
    isLoading,
    error,
    refetch,
  };
};

// ========== CAREERS ==========

export const usePublicCareersAction = (params = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicCareers(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    careers: data?.data?.careers || [],
    stats: data?.data?.stats || {},
    pagination: data?.data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

export const usePublicCareerByIdAction = (id) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicCareerById(id);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    career: data?.data || null,
    isLoading,
    error,
    refetch,
  };
};

// ========== NEWS ==========

export const usePublicNewsAction = (params = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicNews(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    news: data?.data?.news || [],
    featured: data?.data?.featured || [],
    pagination: data?.data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

export const usePublicNewsBySlugAction = (slug) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicNewsBySlug(slug);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    article: data?.data || null,
    related: data?.data?.related || [],
    isLoading,
    error,
    refetch,
  };
};

// ========== EVENTS ==========

export const usePublicEventsAction = (params = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicEvents(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    events: data?.data?.events || [],
    featured: data?.data?.featured || [],
    pagination: data?.data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

export const usePublicEventBySlugAction = (slug) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicEventBySlug(slug);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    event: data?.data || null,
    isLoading,
    error,
    refetch,
  };
};

// ========== GALLERY ==========

export const usePublicGalleryAction = (params = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicGallery(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    images: data?.data?.images || [],
    pagination: data?.data?.pagination || null,
    isLoading,
    error,
    refetch,
  };
};

// ========== FEES ==========

export const usePublicFeesAction = (params = {}) => {
  const { setError } = usePublicStore();
  const { data, isLoading, error, refetch } = usePublicFees(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    fees: data?.data?.fees || {},
    otherMandatoryFees: data?.data?.otherMandatoryFees || [],
    currentSession: data?.data?.currentSession || "",
    isLoading,
    error,
    refetch,
  };
};

export default usePublicStore;
