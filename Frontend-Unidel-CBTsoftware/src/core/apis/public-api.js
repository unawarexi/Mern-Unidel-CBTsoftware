/**
 * Public API - Endpoints for landing page data
 * No authentication required
 */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const PUBLIC_URL = `${BASE_URL}/public`;

// ========== HELPER ==========

const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || errorMessage);
  }
  return response.json();
};

// ========== HOMEPAGE & STATS ==========

export const getHomePageData = async () => {
  console.log("[API] getHomePageData called");
  const response = await fetch(`${PUBLIC_URL}/home`);
  return handleResponse(response, "Failed to fetch homepage data");
};

export const getPublicStats = async () => {
  console.log("[API] getPublicStats called");
  const response = await fetch(`${PUBLIC_URL}/stats`);
  return handleResponse(response, "Failed to fetch statistics");
};

// ========== FACULTIES & DEPARTMENTS ==========

export const getPublicFaculties = async () => {
  console.log("[API] getPublicFaculties called");
  const response = await fetch(`${PUBLIC_URL}/faculties`);
  return handleResponse(response, "Failed to fetch faculties");
};

export const getPublicFacultyByCode = async (code) => {
  console.log("[API] getPublicFacultyByCode called", code);
  const response = await fetch(`${PUBLIC_URL}/faculties/${code}`);
  return handleResponse(response, "Failed to fetch faculty");
};

// ========== SCHOLARSHIPS ==========

export const getPublicScholarships = async (params = {}) => {
  console.log("[API] getPublicScholarships called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${PUBLIC_URL}/scholarships?${query}`
    : `${PUBLIC_URL}/scholarships`;
  const response = await fetch(url);
  return handleResponse(response, "Failed to fetch scholarships");
};

// ========== CAREERS ==========

export const getPublicCareers = async (params = {}) => {
  console.log("[API] getPublicCareers called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${PUBLIC_URL}/careers?${query}`
    : `${PUBLIC_URL}/careers`;
  const response = await fetch(url);
  return handleResponse(response, "Failed to fetch careers");
};

export const getPublicCareerById = async (id) => {
  console.log("[API] getPublicCareerById called", id);
  const response = await fetch(`${PUBLIC_URL}/careers/${id}`);
  return handleResponse(response, "Failed to fetch career");
};

// ========== NEWS ==========

export const getPublicNews = async (params = {}) => {
  console.log("[API] getPublicNews called", params);
  const query = new URLSearchParams(params).toString();
  const url = query ? `${PUBLIC_URL}/news?${query}` : `${PUBLIC_URL}/news`;
  const response = await fetch(url);
  return handleResponse(response, "Failed to fetch news");
};

export const getPublicNewsBySlug = async (slug) => {
  console.log("[API] getPublicNewsBySlug called", slug);
  const response = await fetch(`${PUBLIC_URL}/news/${slug}`);
  return handleResponse(response, "Failed to fetch news article");
};

// ========== EVENTS ==========

export const getPublicEvents = async (params = {}) => {
  console.log("[API] getPublicEvents called", params);
  const query = new URLSearchParams(params).toString();
  const url = query ? `${PUBLIC_URL}/events?${query}` : `${PUBLIC_URL}/events`;
  const response = await fetch(url);
  return handleResponse(response, "Failed to fetch events");
};

export const getPublicEventBySlug = async (slug) => {
  console.log("[API] getPublicEventBySlug called", slug);
  const response = await fetch(`${PUBLIC_URL}/events/${slug}`);
  return handleResponse(response, "Failed to fetch event");
};

// ========== GALLERY ==========

export const getPublicGallery = async (params = {}) => {
  console.log("[API] getPublicGallery called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${PUBLIC_URL}/gallery?${query}`
    : `${PUBLIC_URL}/gallery`;
  const response = await fetch(url);
  return handleResponse(response, "Failed to fetch gallery");
};

// ========== FEES ==========

export const getPublicFees = async (params = {}) => {
  console.log("[API] getPublicFees called", params);
  const query = new URLSearchParams(params).toString();
  const url = query ? `${PUBLIC_URL}/fees?${query}` : `${PUBLIC_URL}/fees`;
  const response = await fetch(url);
  return handleResponse(response, "Failed to fetch fees");
};
