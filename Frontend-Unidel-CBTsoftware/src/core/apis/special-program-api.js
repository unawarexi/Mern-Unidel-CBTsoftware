const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/programs";

export const createProgram = async (data) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create program");
  }
  return response.json();
};

export const getAllPrograms = async () => {
  const response = await fetch(`${BASE_URL}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch programs");
  }
  return response.json();
};

export const updateProgram = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update program");
  }
  return response.json();
};

export const deleteProgram = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete program");
  }
  return response.json();
};

export const restoreProgram = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to restore program");
  }
  return response.json();
};
