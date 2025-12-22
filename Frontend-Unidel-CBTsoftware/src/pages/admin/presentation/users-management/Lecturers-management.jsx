import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Upload, Search, Filter, Edit2, Trash2, X, Award, BookOpen } from "lucide-react";
import {
  useCreateLecturerAction,
  useGetAllLecturersAction,
  useUpdateLecturerAction,
  useDeleteLecturerAction,
} from "../../../../store/user-store";
import { useUploadAttachmentAction, useGetUserAttachmentsAction } from "../../../../store/attachment-store";

const LecturersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    lecturerId: "",
    employeeId: "",
    department: "",
    courses: "", // comma-separated
  });

  const departments = ["Computer Science", "Software Engineering", "Data Science", "Information Technology"];
  const roles = ["Lecturer", "Senior Lecturer", "Professor", "Associate Professor"];

  // store hooks
  const { createLecturer } = useCreateLecturerAction();
  // eslint-disable-next-line no-unused-vars
  const { lecturers = [], refetch, isLoading: loadingLecturers } = useGetAllLecturersAction();
  const { updateLecturer } = useUpdateLecturerAction();
  const { deleteLecturer } = useDeleteLecturerAction();
  const { uploadAttachment } = useUploadAttachmentAction();
  // eslint-disable-next-line no-unused-vars
  const { attachments, refetch: refetchAttachments } = useGetUserAttachmentsAction();

  useEffect(() => {
    // initial fetch (refetch from hook if available)
    if (refetch) refetch();
  }, []);

  const handleAddLecturer = async () => {
    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      lecturerId: formData.lecturerId || undefined,
      employeeId: formData.employeeId || undefined,
      department: formData.department,
      courses: formData.courses ? formData.courses.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    };

    try {
      if (editingLecturer) {
        await updateLecturer(editingLecturer._id, payload);
      } else {
        await createLecturer(payload);
      }
      if (refetch) refetch();
      setShowModal(false);
      setEditingLecturer(null);
      setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: "", courses: "" });
    } catch (err) {
      // create/update action already triggers toast via store
      console.error(err);
    }
  };

  const handleEdit = (lecturer) => {
    setEditingLecturer(lecturer);
    setFormData({
      fullname: lecturer.fullname || "",
      email: lecturer.email || "",
      lecturerId: lecturer.lecturerId || "",
      employeeId: lecturer.employeeId || "",
      department: lecturer.department || "",
      courses: Array.isArray(lecturer.courses) ? lecturer.courses.join(", ") : (lecturer.courses || ""),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this lecturer?")) {
      try {
        await deleteLecturer(id);
        if (refetch) refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    try {
      await uploadAttachment(form);
      if (refetchAttachments) refetchAttachments();
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLecturers = (lecturers || []).filter((lecturer) => {
    const matchesSearch =
      (lecturer.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lecturer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lecturer.lecturerId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" || lecturer.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Lecturers Management</h1>
          <p className="text-gray-600">Manage lecturer accounts and course assignments</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <UserPlus size={20} />
                Add Lecturer
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Upload size={20} />
                Bulk Upload
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search lecturers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors">
                <option>All</option>
                {departments.map((dept) => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Name</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Role</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Department</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Courses</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLecturers.map((lecturer, index) => (
                    <motion.tr key={lecturer._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm">
                            {(lecturer.fullname || "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-slate-900 font-medium">{lecturer.fullname}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{lecturer.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-900 border border-blue-200">
                          <Award size={14} />
                          {lecturer.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{lecturer.department}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 text-sm">
                          <BookOpen size={14} />
                          {Array.isArray(lecturer.courses) ? lecturer.courses.join(", ") : lecturer.courses}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(lecturer)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors">
                            <Edit2 size={18} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(lecturer._id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
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
                setEditingLecturer(null);
                setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: "", courses: "" });
              }}
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{editingLecturer ? "Edit Lecturer" : "Add New Lecturer"}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingLecturer(null);
                      setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: "", courses: "" });
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter lecturer name"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Course IDs (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.courses}
                      onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="e.g., CS101, CS102"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddLecturer} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      {editingLecturer ? "Update" : "Add"} Lecturer
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingLecturer(null);
                        setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: "", courses: "" });
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

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowUploadModal(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Bulk Upload Lecturers</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-slate-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-slate-700 mb-2">Drop your CSV or PDF file here</p>
                    <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                    <input type="file" accept=".csv,.pdf" onChange={handleFileUpload} className="hidden" id="file-upload-lecturer" />
                    <label htmlFor="file-upload-lecturer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors">
                      Choose File
                    </label>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-700 text-sm mb-2 font-medium">File Format Requirements:</p>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• CSV: name, email, role, department, courseId, status</li>
                      <li>• PDF: Structured table format</li>
                      <li>• Maximum file size: 5MB</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LecturersManagement;
