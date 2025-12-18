import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/users";

// ========== LECTURER API FUNCTIONS ==========

export const createLecturer = async (data) => {
  const response = await fetch(`${BASE_URL}/lecturers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create lecturer");
  }
  return response.json();
};

export const getAllLecturers = async () => {
  const response = await fetch(`${BASE_URL}/lecturers`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch lecturers");
  }
  return response.json();
};

export const getLecturerById = async (id) => {
  const response = await fetch(`${BASE_URL}/lecturers/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch lecturer");
  }
  return response.json();
};

export const updateLecturer = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/lecturers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update lecturer");
  }
  return response.json();
};

export const deleteLecturer = async (id) => {
  const response = await fetch(`${BASE_URL}/lecturers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete lecturer");
  }
  return response.json();
};

// ========== STUDENT API FUNCTIONS ==========

export const createStudent = async (data) => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create student");
  }
  return response.json();
};

export const getAllStudents = async () => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch students");
  }
  return response.json();
};

export const getStudentById = async (id) => {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch student");
  }
  return response.json();
};

export const updateStudent = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update student");
  }
  return response.json();
};

export const deleteStudent = async (id) => {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete student");
  }
  return response.json();
};

// ========== ADMIN API FUNCTIONS ==========

export const createAdmin = async (data) => {
  const response = await fetch(`${BASE_URL}/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create admin");
  }
  return response.json();
};

export const getAllAdmins = async () => {
  const response = await fetch(`${BASE_URL}/admins`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch admins");
  }
  return response.json();
};

export const getAdminById = async (id) => {
  const response = await fetch(`${BASE_URL}/admins/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch admin");
  }
  return response.json();
};

export const updateAdmin = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/admins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update admin");
  }
  return response.json();
};

export const deleteAdmin = async (id) => {
  const response = await fetch(`${BASE_URL}/admins/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete admin");
  }
  return response.json();
};

// ========== UTILITY API FUNCTIONS ==========

export const getUserStats = async () => {
  const response = await fetch(`${BASE_URL}/stats`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch stats");
  }
  return response.json();
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
  });
};

export const useGetLecturerById = (id) => {
  return useQuery({
    queryKey: ["lecturer", id],
    queryFn: () => getLecturerById(id),
    enabled: !!id,
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
  });
};

export const useGetStudentById = (id) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
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
  });
};

export const useGetAdminById = (id) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdminById(id),
    enabled: !!id,
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
  });
};
