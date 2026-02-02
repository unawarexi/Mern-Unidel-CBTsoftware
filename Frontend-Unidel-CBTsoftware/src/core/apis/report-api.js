const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Generate a report
 * @param {Object} data - { type, title, contextId, filters, formats }
 */
export const generateReport = async (data) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/reports/generate`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to generate report");
  return result;
};

/**
 * Get user report history
 * @param {string} type - Optional report type filter
 */
export const getReports = async (type) => {
  const url = type ? `${API_URL}/reports?type=${type}` : `${API_URL}/reports`;
  const token = localStorage.getItem("token");
  const headers = {};
  if (token && token !== "null" && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Failed to fetch reports");
  return result;
};

/**
 * Get report by ID
 * @param {string} id - Report ID
 */
export const getReportById = async (id) => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token && token !== "null" && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/reports/${id}`, {
    headers,
    credentials: "include",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch report");
  return result;
};
