const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/agents";

// @desc    Get Agent Students
export const getAgentStudents = async () => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// @desc    Create Agent Student
export const createAgentStudent = async (data) => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// @desc    Update Agent Student
export const updateAgentStudent = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// @desc    Delete Agent Student
export const deleteAgentStudent = async (id) => {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
};

// @desc    Get Agent Exams
export const getAgentExams = async () => {
  const response = await fetch(`${BASE_URL}/exams`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// @desc    Create Agent Exam
export const createAgentExam = async (data) => {
  const response = await fetch(`${BASE_URL}/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// @desc    Get Agent Question Banks
export const getAgentQuestionBanks = async () => {
  const response = await fetch(`${BASE_URL}/question-banks`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// @desc    Create Agent Question Bank
export const createAgentQuestionBank = async (data) => {
  const response = await fetch(`${BASE_URL}/question-banks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// @desc    Get My Subscription
export const getAgentSubscription = async () => {
  const response = await fetch(`${BASE_URL}/subscription`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// @desc    Get All Agents (Admin Only)
export const getAgents = async (status) => {
  const query = status ? `?status=${status}` : "";
  const response = await fetch(`${BASE_URL}${query}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// @desc    Update Agent Status (Admin Only)
export const updateAgentStatus = async ({ id, status }) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Session expired" }));
    window.dispatchEvent(
      new CustomEvent("session-expired", {
        detail: {
          status: response.status,
          message: errorData.message || "Session expired",
        },
      }),
    );
    throw new Error(errorData.message || "Session expired");
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }
  return response.json();
};
