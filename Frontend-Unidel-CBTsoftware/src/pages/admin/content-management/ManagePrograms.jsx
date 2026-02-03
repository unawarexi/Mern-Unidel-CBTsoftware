import React, { useState } from "react";
import {
  useGetAllPrograms,
  useCreateProgram,
  useUpdateProgram,
  useDeleteProgram,
  useRestoreProgram,
} from "../../../hooks/useProgram";
import { useGetAllDepartments } from "../../../hooks/useDepartment";
import { toast } from "react-hot-toast";

const ManagePrograms = () => {
  const { data, isLoading } = useGetAllPrograms();
  const { data: deptData } = useGetAllDepartments();
  const createMutation = useCreateProgram();
  const updateMutation = useUpdateProgram();
  const deleteMutation = useDeleteProgram();
  const restoreMutation = useRestoreProgram();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    duration: "",
    description: "",
    department: "",
  });
  const [showDeleted, setShowDeleted] = useState(false);

  const programs = data?.data || [];
  const departments = deptData?.data || [];
  const filteredItems = programs.filter((p) =>
    showDeleted ? p.isDeleted : !p.isDeleted,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Program updated");
            setIsModalOpen(false);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Program created");
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      degree: item.degree,
      duration: item.duration,
      description: item.description,
      department: item.department?._id || "",
    });
    setIsModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Programs</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="px-4 py-2 border rounded"
          >
            {showDeleted ? "Show Active" : "Show Deleted"}
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Program
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Degree</th>
              <th className="px-6 py-3 text-left">Duration</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.degree}</td>
                <td className="px-6 py-4">{item.duration}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {!item.isDeleted ? (
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreMutation.mutate(item._id)}
                      className="text-green-600"
                    >
                      Restore
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? "Edit" : "Add"} Program
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Degree (e.g. B.Sc)"
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Duration (e.g. 4 Years)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
                required
              />
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.departmentName}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
                rows="3"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrograms;
