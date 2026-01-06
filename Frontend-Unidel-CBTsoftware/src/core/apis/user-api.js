import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/users";

// ========== LECTURER API FUNCTIONS ==========

export const createLecturer = async (data) => {
  console.log("[API] createLecturer called", data);
  const response = await fetch(`${BASE_URL}/lecturers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...data, level: data.level }),
  });
  return handleResponse(response);
};

export const getAllLecturers = async () => {
  console.log("[API] getAllLecturers called");
  const response = await fetch(`${BASE_URL}/lecturers`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

export const getLecturerById = async (id) => {
  console.log("[API] getLecturerById called", id);
  const response = await fetch(`${BASE_URL}/lecturers/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

export const updateLecturer = async ({ id, data }) => {
  console.log("[API] updateLecturer called", id, data);
  const response = await fetch(`${BASE_URL}/lecturers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...data, level: data.level }),
  });
  return handleResponse(response);
};

export const deleteLecturer = async (id) => {
  console.log("[API] deleteLecturer called", id);
  const response = await fetch(`${BASE_URL}/lecturers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
};

// ========== STUDENT API FUNCTIONS ==========

export const createStudent = async (data) => {
  console.log("[API] createStudent called", data);
  const response = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...data, level: data.level }),
  });
  return handleResponse(response);
};

export const getAllStudents = async () => {
  console.log("[API] getAllStudents called");
  const response = await fetch(`${BASE_URL}/students`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

export const getStudentById = async (id) => {
  console.log("[API] getStudentById called", id);
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

export const updateStudent = async ({ id, data }) => {
  console.log("[API] updateStudent called", id, data);
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ...data, level: data.level }),
  });
  return handleResponse(response);
};

export const deleteStudent = async (id) => {
  console.log("[API] deleteStudent called", id);
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
};

// ========== ADMIN API FUNCTIONS ==========

export const createAdmin = async (data) => {
  console.log("[API] createAdmin called", data);
  const response = await fetch(`${BASE_URL}/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getAllAdmins = async () => {
  console.log("[API] getAllAdmins called");
  const response = await fetch(`${BASE_URL}/admins`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

export const getAdminById = async (id) => {
  console.log("[API] getAdminById called", id);
  const response = await fetch(`${BASE_URL}/admins/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

export const updateAdmin = async ({ id, data }) => {
  console.log("[API] updateAdmin called", id, data);
  const response = await fetch(`${BASE_URL}/admins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteAdmin = async (id) => {
  console.log("[API] deleteAdmin called", id);
  const response = await fetch(`${BASE_URL}/admins/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
};

// ========== UTILITY API FUNCTIONS ==========

export const getUserStats = async () => {
  console.log("[API] getUserStats called");
  const response = await fetch(`${BASE_URL}/stats`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// NEW: Get stats for current user (all roles)
export const getCurrentUserStats = async () => {
  console.log("[API] getCurrentUserStats called");
  const response = await fetch(`${BASE_URL}/me/stats`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// ========== LECTURER UTILITY API FUNCTIONS ==========

export const getLecturerCourses = async () => {
  console.log("[API] getLecturerCourses called");
  const response = await fetch(`${BASE_URL}/lecturers/me/courses`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// NEW: Get students for the logged-in lecturer
export const getLecturerStudents = async () => {
  console.log("[API] getLecturerStudents called");
  const response = await fetch(`${BASE_URL}/lecturers/me/students`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(response);
};

// Helper function to handle API responses with session expiry detection
const handleResponse = async (response) => {
  // Check for session expiry (401 or 403)
  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json().catch(() => ({ message: "Session expired" }));

    // Dispatch custom event for session expiry
    window.dispatchEvent(new CustomEvent("session-expired", {
      detail: {
        status: response.status,
        message: errorData.message || "Session expired"
      }
    }));

    throw new Error(errorData.message || "Session expired");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

// ========== DRY: Standard Query Options ==========
const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== REACT QUERY HOOKS - LECTURERS ==========

export const useCreateLecturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLecturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useGetAllLecturers = () => {
  return useQuery({
    queryKey: ["lecturers"],
    queryFn: getAllLecturers,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetLecturerById = (id) => {
  return useQuery({
    queryKey: ["lecturer", id],
    queryFn: () => getLecturerById(id),
    enabled: !!id,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useUpdateLecturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLecturer,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      queryClient.invalidateQueries({ queryKey: ["lecturer", variables.id] });
    },
  });
};

export const useDeleteLecturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLecturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useGetLecturerCourses = () => {
  return useQuery({
    queryKey: ["lecturerCourses"],
    queryFn: getLecturerCourses,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// NEW: React Query hook for lecturer's students
export const useGetLecturerStudents = () => {
  return useQuery({
    queryKey: ["lecturerStudents"],
    queryFn: getLecturerStudents,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== REACT QUERY HOOKS - STUDENTS ==========

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useGetAllStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: getAllStudents,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetStudentById = (id) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

// ========== REACT QUERY HOOKS - ADMINS ==========

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

export const useGetAllAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: getAllAdmins,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetAdminById = (id) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdminById(id),
    enabled: !!id,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin", variables.id] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
};

// ========== REACT QUERY HOOKS - UTILITY ==========

export const useGetUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// NEW: React Query hook for current user stats
export const useGetCurrentUserStats = () => {
  return useQuery({
    queryKey: ["currentUserStats"],
    queryFn: getCurrentUserStats,
    ...STANDARD_QUERY_OPTIONS,
  });
};
