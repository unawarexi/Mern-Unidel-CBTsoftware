import React, { useState } from "react";
import {
  useGetAllScholarships,
  useCreateScholarship,
  useUpdateScholarship,
  useDeleteScholarship,
  useRestoreScholarship,
} from "../../../hooks/useAdminContent";
import { toast } from "react-hot-toast";

const ManageScholarships = () => {
  const { data, isLoading } = useGetAllScholarships();
  const createMutation = useCreateScholarship();
  const updateMutation = useUpdateScholarship();
  const deleteMutation = useDeleteScholarship();
  const restoreMutation = useRestoreScholarship();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverage: "",
    eligibility: "",
    deadline: "",
  });
  const [showDeleted, setShowDeleted] = useState(false);

  const scholarships = data?.data || [];
  const filteredItems = scholarships.filter((s) =>
    showDeleted ? s.isDeleted : !s.isDeleted,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Scholarship updated");
            setIsModalOpen(false);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Scholarship created");
          setIsModalOpen(false);
          setFormData({
            title: "",
            description: "",
            coverage: "",
            eligibility: "",
            deadline: "",
          });
        },
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      coverage: item.coverage,
      eligibility: item.eligibility,
      deadline: item.deadline
        ? new Date(item.deadline).toISOString().split("T")[0]
        : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Deleted successfully"),
      });
    }
  };

  const handleRestore = (id) => {
    restoreMutation.mutate(id, {
      onSuccess: () => toast.success("Restored successfully"),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Scholarships</h1>
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
            Add Scholarship
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Coverage</th>
              <th className="px-6 py-3 text-left">Deadline</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 font-medium">{item.title}</td>
                <td className="px-6 py-4">{item.coverage}</td>
                <td className="px-6 py-4">
                  {item.deadline
                    ? new Date(item.deadline).toLocaleDateString()
                    : "No deadline"}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {!item.isDeleted ? (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRestore(item._id)}
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
              {editingItem ? "Edit" : "Add"} Scholarship
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
                required
              />
              <input
                type="text"
                placeholder="Coverage"
                value={formData.coverage}
                onChange={(e) =>
                  setFormData({ ...formData, coverage: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
              />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
              />
              <textarea
                placeholder="Eligibility"
                value={formData.eligibility}
                onChange={(e) =>
                  setFormData({ ...formData, eligibility: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
                rows="2"
              />
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

export default ManageScholarships;
