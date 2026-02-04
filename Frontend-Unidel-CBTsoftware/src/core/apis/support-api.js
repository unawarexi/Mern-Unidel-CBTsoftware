const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const BASE_URL = `${API_ROOT}/support`;

export const createTicket = async (ticketData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(ticketData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create ticket");
  }
  return response.json();
};

export const getMyTickets = async () => {
  const response = await fetch(`${BASE_URL}/my`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch tickets");
  }
  return response.json();
};

export const getAllTickets = async (params) => {
  const query = params ? new URLSearchParams(params).toString() : "";
  const response = await fetch(`${BASE_URL}?${query}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch all tickets");
  }
  return response.json();
};

export const getTicketById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch ticket");
  }
  return response.json();
};

export const updateTicketStatus = async ({
  id,
  status,
  priority,
  assignedTo,
}) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      status,
      priority,
      assignedTo,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update ticket status");
  }
  return response.json();
};

export const respondToTicket = async ({ id, message }) => {
  const response = await fetch(`${BASE_URL}/${id}/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send response");
  }
  return response.json();
};
