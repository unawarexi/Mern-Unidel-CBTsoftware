const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const BASE_URL = `${API_ROOT}/applications`;

export const getAllApplications = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}?${query}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch all applications");
  }
  return response.json();
};

export const createApplication = async (data) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create application");
  }
  return response.json();
};

export const getMyApplications = async () => {
  const response = await fetch(`${BASE_URL}/my`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch your applications");
  }
  return response.json();
};

export const getApplicationById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch application");
  }
  return response.json();
};

export const updateApplication = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update application");
  }
  return response.json();
};

export const submitApplication = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/submit`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit application");
  }
  return response.json();
};

export const adminReview = async ({ id, status, feedback }) => {
  const response = await fetch(`${BASE_URL}/${id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status, feedback }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to review application");
  }
  return response.json();
};

export const uploadApplicationFile = async ({ id, field, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/${id}/upload?field=${field}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload file");
  }
  return response.json();
};

export const deleteApplication = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete application");
  }
  return response.json();
};
