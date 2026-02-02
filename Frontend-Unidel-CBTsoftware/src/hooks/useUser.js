import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLecturer,
  getAllLecturers,
  getLecturerById,
  updateLecturer,
  deleteLecturer,
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getUserStats,
  getCurrentUserStats,
  getLecturerCourses,
  getLecturerStudents,
} from "../core/apis/user-api";

// ========== STANDARD QUERY OPTIONS ==========
const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
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

export const useGetCurrentUserStats = () => {
  return useQuery({
    queryKey: ["currentUserStats"],
    queryFn: getCurrentUserStats,
    ...STANDARD_QUERY_OPTIONS,
  });
};
