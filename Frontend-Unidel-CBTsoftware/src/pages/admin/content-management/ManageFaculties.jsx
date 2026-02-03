import React, { useState } from "react";
import {
  useGetAllFaculties,
  useCreateFaculty,
  useUpdateFaculty,
  useDeleteFaculty,
  useRestoreFaculty,
} from "../../../hooks/useAdminContent";
import { toast } from "react-hot-toast";

const ManageFaculties = () => {
  const { data, isLoading } = useGetAllFaculties();
  const createMutation = useCreateFaculty();
  const updateMutation = useUpdateFaculty();
  const deleteMutation = useDeleteFaculty();
  const restoreMutation = useRestoreFaculty();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [showDeleted, setShowDeleted] = useState(false);

  const faculties = data?.data || [];
  const filteredFaculties = faculties.filter((f) =>
    showDeleted ? f.isDeleted : !f.isDeleted,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingFaculty) {
      updateMutation.mutate(
        { id: editingFaculty._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Faculty updated");
            setIsModalOpen(false);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Faculty created");
          setIsModalOpen(false);
          setFormData({ name: "", code: "", description: "" });
        },
      });
    }
  };

  const handleEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Faculty soft-deleted"),
      });
    }
  };

  const handleRestore = (id) => {
    restoreMutation.mutate(id, {
      onSuccess: () => toast.success("Faculty restored"),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Faculties</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {showDeleted ? "Show Active" : "Show Deleted"}
          </button>
          <button
            onClick={() => {
              setEditingFaculty(null);
              setFormData({ name: "", code: "", description: "" });
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Faculty
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {filteredFaculties.map((faculty) => (
              <tr key={faculty._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {faculty.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {faculty.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  {!faculty.isDeleted ? (
                    <>
                      <button
                        onClick={() => handleEdit(faculty)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faculty._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRestore(faculty._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Restore
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredFaculties.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No {showDeleted ? "deleted" : ""} faculties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingFaculty ? "Edit Faculty" : "Add Faculty"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingFaculty ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaculties;
