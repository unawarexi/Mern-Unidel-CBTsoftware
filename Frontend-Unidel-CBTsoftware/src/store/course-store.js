import { create } from "zustand";
import { useCreateCourse, useGetAllCourses, useGetCourseById, useUpdateCourse, useDeleteCourse, useAssignLecturers, useRemoveLecturers } from "../core/apis/course-api";

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
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await createCourseMutation.mutateAsync(courseData);
      showToast("Course created successfully", "success");
      return data;
    } catch (error) {
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
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await updateCourseMutation.mutateAsync({ id, data: courseData });
      showToast("Course updated successfully", "success");
      return data;
    } catch (error) {
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
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await deleteCourseMutation.mutateAsync(id);
      showToast("Course deleted successfully", "success");
      return data;
    } catch (error) {
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
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await assignLecturersMutation.mutateAsync({ id: courseId, lecturers });
      showToast("Lecturers assigned successfully", "success");
      return data;
    } catch (error) {
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
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await removeLecturersMutation.mutateAsync({ id: courseId, lecturers });
      showToast("Lecturers removed successfully", "success");
      return data;
    } catch (error) {
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

export default useCourseStore;
