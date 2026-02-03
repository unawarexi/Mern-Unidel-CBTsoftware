import React, { useState } from "react";
import {
  useGetAllBodies,
  useCreateBody,
  useUpdateBody,
  useDeleteBody,
  useRestoreBody,
} from "../../../hooks/useGoverningBody";
import { toast } from "react-hot-toast";

const ManageGoverningBodies = () => {
  const { data, isLoading } = useGetAllBodies();
  const createMutation = useCreateBody();
  const updateMutation = useUpdateBody();
  const deleteMutation = useDeleteBody();
  const restoreMutation = useRestoreBody();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    acronym: "",
    description: "",
    website: "",
  });
  const [showDeleted, setShowDeleted] = useState(false);

  const bodies = data?.data || [];
  const filteredItems = bodies.filter((b) =>
    showDeleted ? b.isDeleted : !b.isDeleted,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Governing body updated");
            setIsModalOpen(false);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Governing body created");
          setIsModalOpen(false);
        },
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Governing Bodies</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="px-4 py-2 border rounded"
          >
            {showDeleted ? "Active" : "Deleted"}
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Body
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Acronym</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.acronym}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {!item.isDeleted ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({
                            name: item.name,
                            acronym: item.acronym,
                            description: item.description,
                            website: item.website,
                          });
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(item._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </>
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
              {editingItem ? "Edit" : "Add"} Governing Body
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
                placeholder="Acronym (e.g. NUC)"
                value={formData.acronym}
                onChange={(e) =>
                  setFormData({ ...formData, acronym: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
                required
              />
              <input
                type="url"
                placeholder="Website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full p-2 border rounded dark:bg-gray-800"
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

export default ManageGoverningBodies;
