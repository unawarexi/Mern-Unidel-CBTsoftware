/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import {
  useCreateDepartmentAction,
  useGetAllDepartmentsAction,
  useDeleteDepartmentAction,
} from "../../../../store/department-store";
import DeleteModal from "../../../../components/Delete-modal";

const initialForm = {
  departmentName: "",
  departmentCode: "",
  departmentId: "",
  faculty: "",
  description: "",
  levels: "",
};

const CreateDepartment = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const { createDepartment } = useCreateDepartmentAction();
  const { departments = [], refetch, isLoading } = useGetAllDepartmentsAction();
  const { deleteDepartment } = useDeleteDepartmentAction();

  useEffect(() => {
    if (refetch) refetch();
  }, []);

  const handleAddOrEdit = async () => {
    const payload = {
      ...formData,
      levels: formData.levels
        ? formData.levels
            .split(",")
            .map((l) => ({ level: parseInt(l.trim()), description: `${l.trim()} Level` }))
        : [],
    };
    try {
      if (editing) {
        // Editing handled in EditDepartment page
      } else {
        await createDepartment(payload);
      }
      if (refetch) refetch();
      setShowModal(false);
      setEditing(null);
      setFormData(initialForm);
    } catch (err) {
      // error handled by store
    }
  };

  const handleEdit = (dept) => {
    setEditing(dept);
    setFormData({
      departmentName: dept.departmentName || "",
      departmentCode: dept.departmentCode || "",
      departmentId: dept.departmentId || "",
      faculty: dept.faculty || "",
      description: dept.description || "",
      levels: Array.isArray(dept.levels) ? dept.levels.map((l) => l.level).join(", ") : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (dept) => {
    setDeptToDelete(dept);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deptToDelete) return;
    try {
      await deleteDepartment(deptToDelete._id);
      if (refetch) refetch();
      setDeleteModalOpen(false);
      setDeptToDelete(null);
    } catch (err) {
      // error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Departments Management</h1>
          <p className="text-gray-600">Create and manage academic departments</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowModal(true);
              setEditing(null);
              setFormData(initialForm);
            }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Add Department
          </motion.button>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Name</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Code</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">ID</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Faculty</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Levels</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-medium">{dept.departmentName}</td>
                    <td className="px-6 py-4 text-slate-600">{dept.departmentCode}</td>
                    <td className="px-6 py-4 text-slate-600">{dept.departmentId}</td>
                    <td className="px-6 py-4 text-slate-600">{dept.faculty}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {Array.isArray(dept.levels) ? dept.levels.map((l) => l.level).join(", ") : ""}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(dept)}
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors"
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(dept)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
                setFormData(initialForm);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{editing ? "Edit Department" : "Add New Department"}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditing(null);
                      setFormData(initialForm);
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Department Name</label>
                    <input
                      type="text"
                      value={formData.departmentName}
                      onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter department name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Department Code
                      <span className="ml-2 text-xs text-gray-400">(auto-generated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.departmentCode}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 border border-slate-300 rounded-lg text-slate-400 cursor-not-allowed"
                      placeholder="Will be generated"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Department ID
                      <span className="ml-2 text-xs text-gray-400">(auto-generated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.departmentId}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 border border-slate-300 rounded-lg text-slate-400 cursor-not-allowed"
                      placeholder="Will be generated"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Faculty</label>
                    <input
                      type="text"
                      value={formData.faculty}
                      onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="e.g. Science"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Levels</label>
                    <input
                      type="text"
                      value={formData.levels}
                      onChange={(e) => setFormData({ ...formData, levels: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="e.g. 100, 200, 300, 400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Department description"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddOrEdit}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {editing ? "Update" : "Add"} Department
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditing(null);
                        setFormData(initialForm);
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeptToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
        itemName={deptToDelete?.departmentName}
      />
    </div>
  );
};

export default CreateDepartment;
