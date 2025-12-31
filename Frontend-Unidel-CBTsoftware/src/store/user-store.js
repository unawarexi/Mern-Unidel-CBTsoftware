import { create } from "zustand";
import {
  useCreateLecturer,
  useGetAllLecturers,
  useGetLecturerById,
  useUpdateLecturer,
  useDeleteLecturer,
  useCreateStudent,
  useGetAllStudents,
  useGetStudentById,
  useUpdateStudent,
  useDeleteStudent,
  useCreateAdmin,
  useGetAllAdmins,
  useGetAdminById,
  useUpdateAdmin,
  useDeleteAdmin,
  useGetCurrentUserStats, // <-- only use this for user stats
  useGetLecturerCourses,
} from "../core/apis/user-api";
import { useEffect } from "react";

const useUserStore = create((set) => ({
  // Client-side state
  selectedUser: null,
  userType: null, // 'lecturer', 'student', 'admin'
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
  setSelectedUser: (user, userType) => set({ selectedUser: user, userType }),

  clearSelectedUser: () => set({ selectedUser: null, userType: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

// ========== LECTURER HOOKS ==========

export const useCreateLecturerAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const createLecturerMutation = useCreateLecturer();

  const createLecturer = async (lecturerData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await createLecturerMutation.mutateAsync(lecturerData);
      showToast("Lecturer created successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to create lecturer", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createLecturer,
    isLoading: createLecturerMutation.isLoading,
    error: createLecturerMutation.error,
  };
};

export const useGetAllLecturersAction = () => {
  const { setError, showToast } = useUserStore();
  const { data, isLoading, error, refetch } = useGetAllLecturers();

  if (error) {
    setError(error.message);
    showToast(error.message || "Failed to fetch lecturers", "error");
  }

  return {
    lecturers: data?.data || [], // <- backend returns { data: [...] }
    isLoading,
    error,
    refetch,
  };
};

export const useGetLecturerByIdAction = (id) => {
  const { setSelectedUser, setError } = useUserStore();
  const { data, isLoading, error, refetch } = useGetLecturerById(id);

  if (data?.data) {
    setSelectedUser(data.data, "lecturer");
    console.log("✅ Lecturer fetched successfully", data.data);
  }

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch lecturer:", error.message);
  }

  return {
    lecturer: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateLecturerAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const updateLecturerMutation = useUpdateLecturer();

  const updateLecturer = async (id, lecturerData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await updateLecturerMutation.mutateAsync({ id, data: lecturerData });
      showToast("Lecturer updated successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to update lecturer", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateLecturer,
    isLoading: updateLecturerMutation.isLoading,
    error: updateLecturerMutation.error,
  };
};

export const useDeleteLecturerAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const deleteLecturerMutation = useDeleteLecturer();

  const deleteLecturer = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await deleteLecturerMutation.mutateAsync(id);
      showToast("Lecturer deleted successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete lecturer", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteLecturer,
    isLoading: deleteLecturerMutation.isLoading,
    error: deleteLecturerMutation.error,
  };
};

export const useGetLecturerCoursesAction = () => {
  const { setError } = useUserStore();
  const { data, isLoading, error, refetch } = useGetLecturerCourses();

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch lecturer courses:", error.message);
  }

  return {
    courses: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

// ========== STUDENT HOOKS ==========

export const useCreateStudentAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const createStudentMutation = useCreateStudent();

  const createStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await createStudentMutation.mutateAsync(studentData);
      showToast("Student created successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to create student", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createStudent,
    isLoading: createStudentMutation.isLoading,
    error: createStudentMutation.error,
  };
};

export const useGetAllStudentsAction = () => {
  const { setError } = useUserStore();
  const { data, isLoading, error, refetch } = useGetAllStudents();

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch students:", error.message);
  }

  if (data) {
    console.log("✅ Students fetched successfully");
  }

  return {
    students: data?.data || [], // <- fix
    isLoading,
    error,
    refetch,
  };
};

export const useGetStudentByIdAction = (id) => {
  const { setSelectedUser, setError } = useUserStore();
  const { data, isLoading, error, refetch } = useGetStudentById(id);

  if (data?.data) {
    setSelectedUser(data.data, "student");
    console.log("✅ Student fetched successfully", data.data);
  }

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch student:", error.message);
  }

  return {
    student: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateStudentAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const updateStudentMutation = useUpdateStudent();

  const updateStudent = async (id, studentData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await updateStudentMutation.mutateAsync({ id, data: studentData });
      showToast("Student updated successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to update student", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateStudent,
    isLoading: updateStudentMutation.isLoading,
    error: updateStudentMutation.error,
  };
};

export const useDeleteStudentAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const deleteStudentMutation = useDeleteStudent();

  const deleteStudent = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await deleteStudentMutation.mutateAsync(id);
      showToast("Student deleted successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete student", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteStudent,
    isLoading: deleteStudentMutation.isLoading,
    error: deleteStudentMutation.error,
  };
};

// ========== ADMIN HOOKS ==========

export const useCreateAdminAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const createAdminMutation = useCreateAdmin();

  const createAdmin = async (adminData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await createAdminMutation.mutateAsync(adminData);
      showToast("Admin created successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to create admin", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createAdmin,
    isLoading: createAdminMutation.isLoading, // <- use isLoading
    error: createAdminMutation.error,
  };
};

export const useGetAllAdminsAction = () => {
  const { setError } = useUserStore();
  const { data, isLoading, error, refetch } = useGetAllAdmins();

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch admins:", error.message);
  }

  if (data) {
    console.log("✅ Admins fetched successfully");
  }

  return {
    admins: data?.data || [], // <- fix
    isLoading,
    error,
    refetch,
  };
};

export const useGetAdminByIdAction = (id) => {
  const { setSelectedUser, setError } = useUserStore();
  const { data, isLoading, error, refetch } = useGetAdminById(id);

  if (data?.data) {
    setSelectedUser(data.data, "admin");
    console.log("✅ Admin fetched successfully", data.data);
  }

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch admin:", error.message);
  }

  return {
    admin: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateAdminAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const updateAdminMutation = useUpdateAdmin();

  const updateAdmin = async (id, adminData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await updateAdminMutation.mutateAsync({ id, data: adminData });
      showToast("Admin updated successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to update admin", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateAdmin,
    isLoading: updateAdminMutation.isLoading, // <- use isLoading
    error: updateAdminMutation.error,
  };
};

export const useDeleteAdminAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useUserStore();
  const deleteAdminMutation = useDeleteAdmin();

  const deleteAdmin = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await deleteAdminMutation.mutateAsync(id);
      showToast("Admin deleted successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete admin", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteAdmin,
    isLoading: deleteAdminMutation.isLoading, // <- use isLoading
    error: deleteAdminMutation.error,
  };
};

// ========== UTILITY HOOKS ==========

// ========== UTILITY HOOKS ==========

// Fixed version - no more infinite refetching
export const useGetUserStatsAction = () => {
  const { setError } = useUserStore();
  const { data, isLoading, error, refetch } = useGetCurrentUserStats();

  // Move the if statements inside useEffect to prevent infinite loops
  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch user stats:", error.message);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data) {
      console.log("✅ User stats fetched successfully", data);
    }
  }, [data]);

  return {
    stats: data?.data || {},
    isLoading,
    error,
    refetch,
  };
};

export default useUserStore;
