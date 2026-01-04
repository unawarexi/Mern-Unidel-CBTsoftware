import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/departments";

// ========== DEPARTMENT API FUNCTIONS ==========

export const createDepartment = async (data) => {
  console.log("[API] createDepartment called", data);
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] createDepartment error:", error);
    throw new Error(error.message || "Failed to create department");
  }
  return response.json();
};

export const getAllDepartments = async () => {
  console.log("[API] getAllDepartments called");
  const response = await fetch(`${BASE_URL}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getAllDepartments error:", error);
    throw new Error(error.message || "Failed to fetch departments");
  }
  return response.json();
};

export const getDepartmentById = async (id) => {
  console.log("[API] getDepartmentById called", id);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getDepartmentById error:", error);
    throw new Error(error.message || "Failed to fetch department");
  }
  return response.json();
};

export const getDepartmentsByEntity = async (params = {}) => {
  console.log("[API] getDepartmentsByEntity called", params);
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/by-entity?${query}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getDepartmentsByEntity error:", error);
    throw new Error(error.message || "Failed to fetch departments");
  }
  return response.json();
};

export const updateDepartment = async ({ id, data }) => {
  console.log("[API] updateDepartment called", id, data);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] updateDepartment error:", error);
    throw new Error(error.message || "Failed to update department");
  }
  return response.json();
};

export const deleteDepartment = async (id) => {
  console.log("[API] deleteDepartment called", id);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] deleteDepartment error:", error);
    throw new Error(error.message || "Failed to delete department");
  }
  return response.json();
};

export const promoteStudents = async (data) => {
  console.log("[API] promoteStudents called", data);
  const response = await fetch(`${BASE_URL}/promote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] promoteStudents error:", error);
    throw new Error(error.message || "Failed to promote students");
  }
  return response.json();
};

// ========== REACT QUERY HOOKS ==========

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useGetAllDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetDepartmentById = (id) => {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetDepartmentsByEntity = (params) => {
  return useQuery({
    queryKey: ["departmentsByEntity", params],
    queryFn: () => getDepartmentsByEntity(params),
    enabled: !!params,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", variables.id] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const usePromoteStudents = () => {
  return useMutation({
    mutationFn: promoteStudents,
  });
};
