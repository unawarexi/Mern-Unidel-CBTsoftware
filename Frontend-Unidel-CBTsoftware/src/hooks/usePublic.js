/**
 * Public Data Hooks - React Query hooks for landing page data
 * No authentication required
 */
import { useQuery } from "@tanstack/react-query";
import {
  getHomePageData,
  getPublicStats,
  getPublicFaculties,
  getPublicFacultyByCode,
  getPublicScholarships,
  getPublicCareers,
  getPublicCareerById,
  getPublicNews,
  getPublicNewsBySlug,
  getPublicEvents,
  getPublicEventBySlug,
  getPublicGallery,
  getPublicFees,
} from "../core/apis/public-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

const LONG_CACHE_OPTIONS = {
  staleTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== HOMEPAGE & STATS ==========

export const useHomePageData = () => {
  return useQuery({
    queryKey: ["public", "home"],
    queryFn: getHomePageData,
    ...LONG_CACHE_OPTIONS,
  });
};

export const usePublicStats = () => {
  return useQuery({
    queryKey: ["public", "stats"],
    queryFn: getPublicStats,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== FACULTIES & DEPARTMENTS ==========

export const usePublicFaculties = () => {
  return useQuery({
    queryKey: ["public", "faculties"],
    queryFn: getPublicFaculties,
    ...LONG_CACHE_OPTIONS,
  });
};

export const usePublicFacultyByCode = (code) => {
  return useQuery({
    queryKey: ["public", "faculty", code],
    queryFn: () => getPublicFacultyByCode(code),
    enabled: !!code,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== SCHOLARSHIPS ==========

export const usePublicScholarships = (params = {}) => {
  return useQuery({
    queryKey: ["public", "scholarships", params],
    queryFn: () => getPublicScholarships(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== CAREERS ==========

export const usePublicCareers = (params = {}) => {
  return useQuery({
    queryKey: ["public", "careers", params],
    queryFn: () => getPublicCareers(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const usePublicCareerById = (id) => {
  return useQuery({
    queryKey: ["public", "career", id],
    queryFn: () => getPublicCareerById(id),
    enabled: !!id,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== NEWS ==========

export const usePublicNews = (params = {}) => {
  return useQuery({
    queryKey: ["public", "news", params],
    queryFn: () => getPublicNews(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const usePublicNewsBySlug = (slug) => {
  return useQuery({
    queryKey: ["public", "newsArticle", slug],
    queryFn: () => getPublicNewsBySlug(slug),
    enabled: !!slug,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== EVENTS ==========

export const usePublicEvents = (params = {}) => {
  return useQuery({
    queryKey: ["public", "events", params],
    queryFn: () => getPublicEvents(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const usePublicEventBySlug = (slug) => {
  return useQuery({
    queryKey: ["public", "event", slug],
    queryFn: () => getPublicEventBySlug(slug),
    enabled: !!slug,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== GALLERY ==========

export const usePublicGallery = (params = {}) => {
  return useQuery({
    queryKey: ["public", "gallery", params],
    queryFn: () => getPublicGallery(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== FEES ==========

export const usePublicFees = (params = {}) => {
  return useQuery({
    queryKey: ["public", "fees", params],
    queryFn: () => getPublicFees(params),
    ...LONG_CACHE_OPTIONS,
  });
};
