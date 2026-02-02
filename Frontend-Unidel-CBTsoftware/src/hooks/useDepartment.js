import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByEntity,
  updateDepartment,
  deleteDepartment,
  promoteStudents,
} from "../core/apis/department-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== REACT QUERY HOOKS ==========

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
