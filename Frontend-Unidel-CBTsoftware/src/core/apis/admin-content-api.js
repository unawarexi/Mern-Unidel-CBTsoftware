/**
 * Admin Content API - CRUD endpoints for landing page content
 * Requires admin authentication
 */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const ADMIN_CONTENT_URL = `${BASE_URL}/admin/content`;

// ========== HELPER ==========

const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(`[API] Error:`, error);
    throw new Error(error.message || errorMessage);
  }
  return response.json();
};

const fetchWithAuth = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

// ========== FACULTIES ==========

export const getAllFaculties = async () => {
  console.log("[API] getAllFaculties called");
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/faculties`);
  return handleResponse(response, "Failed to fetch faculties");
};

export const createFaculty = async (data) => {
  console.log("[API] createFaculty called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/faculties`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create faculty");
};

export const updateFaculty = async ({ id, data }) => {
  console.log("[API] updateFaculty called", { id, data });
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/faculties/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update faculty");
};

export const deleteFaculty = async (id) => {
  console.log("[API] deleteFaculty called", id);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/faculties/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete faculty");
};

export const restoreFaculty = async (id) => {
  console.log("[API] restoreFaculty called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/faculties/${id}/restore`,
    {
      method: "POST",
    },
  );
  return handleResponse(response, "Failed to restore faculty");
};

// ========== SCHOLARSHIPS ==========

export const getAllScholarships = async () => {
  console.log("[API] getAllScholarships called");
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/scholarships`);
  return handleResponse(response, "Failed to fetch scholarships");
};

export const createScholarship = async (data) => {
  console.log("[API] createScholarship called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/scholarships`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create scholarship");
};

export const updateScholarship = async ({ id, data }) => {
  console.log("[API] updateScholarship called", { id, data });
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/scholarships/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
  return handleResponse(response, "Failed to update scholarship");
};

export const deleteScholarship = async (id) => {
  console.log("[API] deleteScholarship called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/scholarships/${id}`,
    {
      method: "DELETE",
    },
  );
  return handleResponse(response, "Failed to delete scholarship");
};

export const restoreScholarship = async (id) => {
  console.log("[API] restoreScholarship called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/scholarships/${id}/restore`,
    {
      method: "POST",
    },
  );
  return handleResponse(response, "Failed to restore scholarship");
};

// ========== CAREERS ==========

export const getAllCareers = async (params = {}) => {
  console.log("[API] getAllCareers called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${ADMIN_CONTENT_URL}/careers?${query}`
    : `${ADMIN_CONTENT_URL}/careers`;
  const response = await fetchWithAuth(url);
  return handleResponse(response, "Failed to fetch careers");
};

export const createCareer = async (data) => {
  console.log("[API] createCareer called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/careers`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create career");
};

export const updateCareer = async ({ id, data }) => {
  console.log("[API] updateCareer called", { id, data });
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/careers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update career");
};

export const deleteCareer = async (id) => {
  console.log("[API] deleteCareer called", id);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/careers/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete career");
};

export const restoreCareer = async (id) => {
  console.log("[API] restoreCareer called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/careers/${id}/restore`,
    {
      method: "POST",
    },
  );
  return handleResponse(response, "Failed to restore career");
};

// ========== NEWS ==========

export const getAllNews = async (params = {}) => {
  console.log("[API] getAllNews called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${ADMIN_CONTENT_URL}/news?${query}`
    : `${ADMIN_CONTENT_URL}/news`;
  const response = await fetchWithAuth(url);
  return handleResponse(response, "Failed to fetch news");
};

export const createNews = async (data) => {
  console.log("[API] createNews called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/news`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create news");
};

export const updateNews = async ({ id, data }) => {
  console.log("[API] updateNews called", { id, data });
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update news");
};

export const deleteNews = async (id) => {
  console.log("[API] deleteNews called", id);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/news/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete news");
};

export const restoreNews = async (id) => {
  console.log("[API] restoreNews called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/news/${id}/restore`,
    {
      method: "POST",
    },
  );
  return handleResponse(response, "Failed to restore news");
};

// ========== EVENTS ==========

export const getAllEvents = async (params = {}) => {
  console.log("[API] getAllEvents called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${ADMIN_CONTENT_URL}/events?${query}`
    : `${ADMIN_CONTENT_URL}/events`;
  const response = await fetchWithAuth(url);
  return handleResponse(response, "Failed to fetch events");
};

export const createEvent = async (data) => {
  console.log("[API] createEvent called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create event");
};

export const updateEvent = async ({ id, data }) => {
  console.log("[API] updateEvent called", { id, data });
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update event");
};

export const deleteEvent = async (id) => {
  console.log("[API] deleteEvent called", id);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/events/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete event");
};

export const restoreEvent = async (id) => {
  console.log("[API] restoreEvent called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/events/${id}/restore`,
    {
      method: "POST",
    },
  );
  return handleResponse(response, "Failed to restore event");
};

// ========== GALLERY ==========

export const getAllGalleryImages = async (params = {}) => {
  console.log("[API] getAllGalleryImages called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${ADMIN_CONTENT_URL}/gallery?${query}`
    : `${ADMIN_CONTENT_URL}/gallery`;
  const response = await fetchWithAuth(url);
  return handleResponse(response, "Failed to fetch gallery");
};

export const createGalleryImage = async (data) => {
  console.log("[API] createGalleryImage called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/gallery`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create gallery image");
};

export const updateGalleryImage = async ({ id, data }) => {
  console.log("[API] updateGalleryImage called", { id, data });
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/gallery/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update gallery image");
};

export const deleteGalleryImage = async (id) => {
  console.log("[API] deleteGalleryImage called", id);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/gallery/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete gallery image");
};

export const restoreGalleryImage = async (id) => {
  console.log("[API] restoreGalleryImage called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/gallery/${id}/restore`,
    {
      method: "POST",
    },
  );
  return handleResponse(response, "Failed to restore gallery image");
};

// ========== FEES ==========

export const getAllFees = async () => {
  console.log("[API] getAllFees called");
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/fees`);
  return handleResponse(response, "Failed to fetch fees");
};

export const createFee = async (data) => {
  console.log("[API] createFee called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/fees`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create fee");
};

export const updateFee = async ({ id, data }) => {
  console.log("[API] updateFee called", { id, data });
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/fees/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update fee");
};

export const deleteFee = async (id) => {
  console.log("[API] deleteFee called", id);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/fees/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete fee");
};

export const restoreFee = async (id) => {
  console.log("[API] restoreFee called", id);
  const response = await fetchWithAuth(
    `${ADMIN_CONTENT_URL}/fees/${id}/restore`,
    {
      method: "POST",
    },
  );
  return handleResponse(response, "Failed to restore fee");
};

// ========== SITE SETTINGS ==========

export const getSiteSettings = async (params = {}) => {
  console.log("[API] getSiteSettings called", params);
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${ADMIN_CONTENT_URL}/settings?${query}`
    : `${ADMIN_CONTENT_URL}/settings`;
  const response = await fetchWithAuth(url);
  return handleResponse(response, "Failed to fetch settings");
};

export const updateSiteSetting = async (data) => {
  console.log("[API] updateSiteSetting called", data);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/settings`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update setting");
};

export const bulkUpdateSettings = async (settings) => {
  console.log("[API] bulkUpdateSettings called", settings);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/settings/bulk`, {
    method: "POST",
    body: JSON.stringify({ settings }),
  });
  return handleResponse(response, "Failed to update settings");
};

export const deleteSiteSetting = async (id) => {
  console.log("[API] deleteSiteSetting called", id);
  const response = await fetchWithAuth(`${ADMIN_CONTENT_URL}/settings/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete setting");
};
