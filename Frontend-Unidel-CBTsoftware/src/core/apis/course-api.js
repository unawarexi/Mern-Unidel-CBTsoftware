import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/courses";

// ========== COURSE API FUNCTIONS ==========

export const createCourse = async (data) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create course");
  }
  return response.json();
};

export const getAllCourses = async () => {
  const response = await fetch(`${BASE_URL}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch courses");
  }
  return response.json();
};

export const getCourseById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch course");
  }
  return response.json();
};

export const updateCourse = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update course");
  }
  return response.json();
};

export const deleteCourse = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete course");
  }
  return response.json();
};

export const assignLecturersToCourse = async ({ id, lecturers }) => {
  const response = await fetch(`${BASE_URL}/${id}/assign-lecturers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ lecturers }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to assign lecturers");
  }
  return response.json();
};

export const removeLecturersFromCourse = async ({ id, lecturers }) => {
  const response = await fetch(`${BASE_URL}/${id}/remove-lecturers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ lecturers }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove lecturers");
  }
  return response.json();
};

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

// ========== COURSE MATERIALS API FUNCTIONS ==========

// Upload course material (document) for a course
export const uploadCourseMaterial = async ({ courseId, file, description }) => {
  const formData = new FormData();
  formData.append("file", file);
  if (description) formData.append("description", description);

  const response = await fetch(`${BASE_URL}/${courseId}/materials`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload course material");
  }
  return response.json();
};

// Delete course material
export const deleteCourseMaterial = async ({ courseId, materialId }) => {
  const response = await fetch(`${BASE_URL}/${courseId}/materials/${materialId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete course material");
  }
  return response.json();
};

// ========== REACT QUERY HOOKS - COURSE MATERIALS ==========

export const useUploadCourseMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadCourseMaterial,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourseMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourseMaterial,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
