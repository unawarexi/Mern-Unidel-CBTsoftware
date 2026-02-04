const API_ROOT =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const BASE_URL = `${API_ROOT}/governing-bodies`;

export const createBody = async (data) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create governing body");
  }
  return response.json();
};

export const getAllBodies = async () => {
  const response = await fetch(`${BASE_URL}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch governing bodies");
  }
  return response.json();
};

export const updateBody = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update governing body");
  }
  return response.json();
};

export const deleteBody = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete governing body");
  }
  return response.json();
};

export const restoreBody = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to restore governing body");
  }
  return response.json();
};
