import { create } from "zustand";
import { useCreateCourse, useGetAllCourses, useGetCourseById, useUpdateCourse, useDeleteCourse, useAssignLecturers, useRemoveLecturers, useUploadCourseMaterial, useDeleteCourseMaterial, useAssignToCourse, useRemoveFromCourse } from "../core/apis/course-api";

const useCourseStore = create((set) => ({
  // Client-side state
  selectedCourse: null,
  isLoading: false,
  error: null,

  // UI helpers
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) => set({ toast: { visible: true, message, type, duration } }),
  hideToast: () => set({ toast: { visible: false, message: "", type: "success", duration: 3000 } }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Actions
  setSelectedCourse: (course) => set({ selectedCourse: course }),

  clearSelectedCourse: () => set({ selectedCourse: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

// ========== COURSE HOOKS ==========

export const useCreateCourseAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useCourseStore();
  const createCourseMutation = useCreateCourse();

  const createCourse = async (courseData) => {
    console.log("[STORE] useCreateCourseAction called", courseData);
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await createCourseMutation.mutateAsync(courseData);
      showToast("Course created successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useCreateCourseAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to create course", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createCourse,
    isLoading: createCourseMutation.isLoading,
    error: createCourseMutation.error,
  };
};

export const useGetAllCoursesAction = () => {
  const { setError, showToast } = useCourseStore();
  const { data, isLoading, error, refetch } = useGetAllCourses();

  if (error) {
    setError(error.message);
    showToast(error.message || "Failed to fetch courses", "error");
  }

  return {
    courses: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useGetCourseByIdAction = (id) => {
  const { setSelectedCourse, setError } = useCourseStore();
  const { data, isLoading, error, refetch } = useGetCourseById(id);

  if (data?.data) {
    setSelectedCourse(data.data);
    console.log("✅ Course fetched successfully", data.data);
  }

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch course:", error.message);
  }

  return {
    course: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateCourseAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useCourseStore();
  const updateCourseMutation = useUpdateCourse();

  const updateCourse = async (id, courseData) => {
    console.log("[STORE] useUpdateCourseAction called", { id, courseData });
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await updateCourseMutation.mutateAsync({ id, data: courseData });
      showToast("Course updated successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUpdateCourseAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to update course", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateCourse,
    isLoading: updateCourseMutation.isLoading,
    error: updateCourseMutation.error,
  };
};

export const useDeleteCourseAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useCourseStore();
  const deleteCourseMutation = useDeleteCourse();

  const deleteCourse = async (id) => {
    console.log("[STORE] useDeleteCourseAction called", id);
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await deleteCourseMutation.mutateAsync(id);
      showToast("Course deleted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteCourseAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to delete course", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteCourse,
    isLoading: deleteCourseMutation.isLoading,
    error: deleteCourseMutation.error,
  };
};

export const useAssignLecturersAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useCourseStore();
  const assignLecturersMutation = useAssignLecturers();

  const assignLecturers = async (courseId, lecturers) => {
    console.log("[STORE] useAssignLecturersAction called", { courseId, lecturers });
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await assignLecturersMutation.mutateAsync({ id: courseId, lecturers });
      showToast("Lecturers assigned successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useAssignLecturersAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to assign lecturers", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    assignLecturers,
    isLoading: assignLecturersMutation.isLoading,
    error: assignLecturersMutation.error,
  };
};

export const useRemoveLecturersAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useCourseStore();
  const removeLecturersMutation = useRemoveLecturers();

  const removeLecturers = async (courseId, lecturers) => {
    console.log("[STORE] useRemoveLecturersAction called", { courseId, lecturers });
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await removeLecturersMutation.mutateAsync({ id: courseId, lecturers });
      showToast("Lecturers removed successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useRemoveLecturersAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to remove lecturers", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    removeLecturers,
    isLoading: removeLecturersMutation.isLoading,
    error: removeLecturersMutation.error,
  };
};

export const useUploadCourseMaterialAction = () => {
  const { showToast, showLoader, hideLoader } = useCourseStore();
  const uploadMaterialMutation = useUploadCourseMaterial();

  const uploadMaterial = async ({ courseId, file, description, type }) => {
    console.log("[STORE] useUploadCourseMaterialAction called", { courseId, description, type });
    showLoader();
    try {
      // Pass type (category) to backend
      const data = await uploadMaterialMutation.mutateAsync({ courseId, file, description, type });
      showToast("Course material uploaded", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useUploadCourseMaterialAction error:", error);
      showToast(error.message || "Failed to upload material", "error");
      throw error;
    } finally {
      hideLoader();
    }
  };

  return {
    uploadMaterial,
    isLoading: uploadMaterialMutation.isLoading,
    error: uploadMaterialMutation.error,
  };
};

export const useDeleteCourseMaterialAction = () => {
  const { showToast, showLoader, hideLoader } = useCourseStore();
  const deleteMaterialMutation = useDeleteCourseMaterial();

  const deleteMaterial = async ({ courseId, materialId }) => {
    console.log("[STORE] useDeleteCourseMaterialAction called", { courseId, materialId });
    showLoader();
    try {
      const data = await deleteMaterialMutation.mutateAsync({ courseId, materialId });
      showToast("Course material deleted", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useDeleteCourseMaterialAction error:", error);
      showToast(error.message || "Failed to delete material", "error");
      throw error;
    } finally {
      hideLoader();
    }
  };

  return {
    deleteMaterial,
    isLoading: deleteMaterialMutation.isLoading,
    error: deleteMaterialMutation.error,
  };
};

export const useAssignToCourseAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useCourseStore();
  const assignToCourseMutation = useAssignToCourse();

  const assignToCourse = async (courseId, { students = [], lecturers = [] }) => {
    console.log("[STORE] useAssignToCourseAction called", { courseId, students, lecturers });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await assignToCourseMutation.mutateAsync({ id: courseId, students, lecturers });
      showToast("Assigned successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useAssignToCourseAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to assign", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    assignToCourse,
    isLoading: assignToCourseMutation.isLoading,
    error: assignToCourseMutation.error,
  };
};

export const useRemoveFromCourseAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useCourseStore();
  const removeFromCourseMutation = useRemoveFromCourse();

  const removeFromCourse = async (courseId, { students = [], lecturers = [] }) => {
    console.log("[STORE] useRemoveFromCourseAction called", { courseId, students, lecturers });
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const data = await removeFromCourseMutation.mutateAsync({ id: courseId, students, lecturers });
      showToast("Removed successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useRemoveFromCourseAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to remove", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    removeFromCourse,
    isLoading: removeFromCourseMutation.isLoading,
    error: removeFromCourseMutation.error,
  };
};

export default useCourseStore;
