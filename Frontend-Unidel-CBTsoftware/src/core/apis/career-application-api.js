const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const BASE_URL = `${API_ROOT}/careers`;

export const applyForJob = async (formData) => {
  const response = await fetch(`${BASE_URL}/apply`, {
    method: "POST",
    credentials: "include",
    body: formData, // No Need for Content-Type when using FormData
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit application");
  }
  return response.json();
};

export const getAllCareerApplications = async (params) => {
  const query = params ? new URLSearchParams(params).toString() : "";
  const response = await fetch(`${BASE_URL}/apply?${query}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch applications");
  }
  return response.json();
};

export const updateCareerApplicationStatus = async ({
  id,
  status,
  adminFeedback,
  interviewDetails,
}) => {
  const response = await fetch(`${BASE_URL}/apply/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      status,
      adminFeedback,
      interviewDetails,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update application status");
  }
  return response.json();
};
