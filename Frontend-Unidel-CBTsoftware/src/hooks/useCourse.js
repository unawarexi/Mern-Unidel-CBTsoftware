import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  assignLecturersToCourse,
  removeLecturersFromCourse,
  assignToCourse,
  removeFromCourse,
  uploadCourseMaterial,
  deleteCourseMaterial,
  restoreCourse,
} from "../core/apis/course-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== REACT QUERY HOOKS - COURSES ==========

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useGetAllCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetCourseById = (id) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useAssignLecturers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignLecturersToCourse,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });
};

export const useRemoveLecturers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeLecturersFromCourse,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });
};

export const useAssignToCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignToCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useRemoveFromCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// ========== REACT QUERY HOOKS - COURSE MATERIALS ==========

export const useUploadCourseMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadCourseMaterial,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourseMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourseMaterial,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useRestoreCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreCourse,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
    },
  });
};
