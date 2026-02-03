const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/payments";

// @desc    Initiate Payment
export const initiatePayment = async (data) => {
  const response = await fetch(`${BASE_URL}/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// @desc    Get My Payments
export const getMyPayments = async () => {
  const response = await fetch(`${BASE_URL}/my`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// @desc    Get All Payments (Admin Only)
export const getAllPayments = async () => {
  const response = await fetch(`${BASE_URL}/`, {
    method: "GET",
    credentials: "include",
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
