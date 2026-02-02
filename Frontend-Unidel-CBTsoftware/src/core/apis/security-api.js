const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/security`;

// ========== SECURITY API FUNCTIONS ==========

export const reportViolation = async (data) => {
  console.log("[API] reportViolation called with:", data);
  console.log("[API] Using BASE_URL:", BASE_URL);
  
  const response = await fetch(`${BASE_URL}/violations`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  console.log("[API] Response status:", response.status);
  
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] reportViolation error:", error);
    throw new Error(error.message || "Failed to report violation");
  }
  
  const result = await response.json();
  console.log("[API] reportViolation success:", result);
  return result;
};

export const getSubmissionViolations = async (submissionId) => {
  console.log("[API] getSubmissionViolations called", submissionId);
  const response = await fetch(`${BASE_URL}/violations/${submissionId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getSubmissionViolations error:", error);
    throw new Error(error.message || "Failed to fetch submission violations");
  }
  return response.json();
};

export const getMyViolationStats = async () => {
  console.log("[API] getMyViolationStats called");
  const response = await fetch(`${BASE_URL}/students/me/violations`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getMyViolationStats error:", error);
    throw new Error(error.message || "Failed to fetch violation statistics");
  }
  return response.json();
};

export const getExamViolations = async (examId) => {
  console.log("[API] getExamViolations called", examId);
  const response = await fetch(`${BASE_URL}/exams/${examId}/violations`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getExamViolations error:", error);
    throw new Error(error.message || "Failed to fetch exam violations");
  }
  return response.json();
};
