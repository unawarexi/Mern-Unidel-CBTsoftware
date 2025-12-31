import { create } from "zustand";
import {
  useCreateDepartment,
  useGetAllDepartments,
  useGetDepartmentById,
  useGetDepartmentsByEntity,
  useUpdateDepartment,
  useDeleteDepartment,
  usePromoteStudents,
} from "../core/apis/department-api";
import { useEffect } from "react";

const useDepartmentStore = create((set) => ({
  selectedDepartment: null,
  isLoading: false,
  error: null,
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) => set({ toast: { visible: true, message, type, duration } }),
  hideToast: () => set({ toast: { visible: false, message: "", type: "success", duration: 3000 } }),
  setSelectedDepartment: (department) => set({ selectedDepartment: department }),
  clearSelectedDepartment: () => set({ selectedDepartment: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// ========== DEPARTMENT HOOKS ==========

export const useCreateDepartmentAction = () => {
  const { setLoading, setError, showToast } = useDepartmentStore();
  const createDepartmentMutation = useCreateDepartment();

  const createDepartment = async (departmentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createDepartmentMutation.mutateAsync(departmentData);
      showToast("Department created successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to create department", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDepartment,
    isLoading: createDepartmentMutation.isLoading,
    error: createDepartmentMutation.error,
  };
};

export const useGetAllDepartmentsAction = () => {
  const { setError } = useDepartmentStore();
  const { data, isLoading, error, refetch } = useGetAllDepartments();

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    departments: data?.departments || [],
    isLoading,
    error,
    refetch,
  };
};

export const useGetDepartmentByIdAction = (id) => {
  const { setSelectedDepartment, setError } = useDepartmentStore();
  const { data, isLoading, error, refetch } = useGetDepartmentById(id);

  useEffect(() => {
    if (data?.department) setSelectedDepartment(data.department);
  }, [data, setSelectedDepartment]);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    department: data?.department,
    isLoading,
    error,
    refetch,
  };
};

export const useGetDepartmentsByEntityAction = (params) => {
  const { setError } = useDepartmentStore();
  // If lecturerId is "me", backend should resolve to logged-in lecturer
  const queryParams = { ...params };
  if (queryParams.lecturerId === "me") delete queryParams.lecturerId;
  const { data, isLoading, error, refetch } = useGetDepartmentsByEntity(params);

  useEffect(() => {
    if (error) setError(error.message);
  }, [error, setError]);

  return {
    departments: data?.departments || [],
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateDepartmentAction = () => {
  const { setLoading, setError, showToast } = useDepartmentStore();
  const updateDepartmentMutation = useUpdateDepartment();

  const updateDepartment = async (id, departmentData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateDepartmentMutation.mutateAsync({ id, data: departmentData });
      showToast("Department updated successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to update department", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateDepartment,
    isLoading: updateDepartmentMutation.isLoading,
    error: updateDepartmentMutation.error,
  };
};

export const useDeleteDepartmentAction = () => {
  const { setLoading, setError, showToast } = useDepartmentStore();
  const deleteDepartmentMutation = useDeleteDepartment();

  const deleteDepartment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deleteDepartmentMutation.mutateAsync(id);
      showToast("Department deleted successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete department", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteDepartment,
    isLoading: deleteDepartmentMutation.isLoading,
    error: deleteDepartmentMutation.error,
  };
};

export const usePromoteStudentsAction = () => {
  const { setLoading, setError, showToast } = useDepartmentStore();
  const promoteStudentsMutation = usePromoteStudents();

  const promoteStudents = async (promotionData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await promoteStudentsMutation.mutateAsync(promotionData);
      showToast("Students promoted successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to promote students", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    promoteStudents,
    isLoading: promoteStudentsMutation.isLoading,
    error: promoteStudentsMutation.error,
  };
};

export default useDepartmentStore;
