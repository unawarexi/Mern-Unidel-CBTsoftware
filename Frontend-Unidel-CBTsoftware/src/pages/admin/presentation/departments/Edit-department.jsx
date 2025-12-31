/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDepartmentByIdAction, useUpdateDepartmentAction } from "../../../../store/department-store";

const initialForm = {
  departmentName: "",
  departmentCode: "",
  departmentId: "",
  faculty: "",
  description: "",
  levels: "",
};

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { department, isLoading } = useGetDepartmentByIdAction(id);
  const { updateDepartment } = useUpdateDepartmentAction();

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (department) {
      setFormData({
        departmentName: department.departmentName || "",
        departmentCode: department.departmentCode || "",
        departmentId: department.departmentId || "",
        faculty: department.faculty || "",
        description: department.description || "",
        levels: Array.isArray(department.levels) ? department.levels.map((l) => l.level).join(", ") : "",
      });
    }
  }, [department]);

  const handleUpdate = async () => {
    // Only send updatable fields (not departmentCode/departmentId)
    const payload = {
      faculty: formData.faculty,
      description: formData.description,
      levels: formData.levels
        ? formData.levels
            .split(",")
            .map((l) => ({ level: parseInt(l.trim()), description: `${l.trim()} Level` }))
        : [],
    };
    try {
      await updateDepartment(id, payload);
      navigate(-1);
    } catch (err) { /* empty */ }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-8 w-full max-w-lg border border-slate-200 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Department</h2>
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
            <label className="block text-gray-300 mb-2 font-medium">Department Code</label>
            <input
              type="text"
              value={formData.departmentCode}
              onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
              placeholder="e.g. CSC"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Department ID</label>
            <input
              type="text"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
              placeholder="e.g. DEPT001"
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
              onClick={handleUpdate}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Update Department
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditDepartment;
