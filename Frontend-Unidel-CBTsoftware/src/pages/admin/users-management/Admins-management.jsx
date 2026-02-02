import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Upload,
  Search,
  Shield,
  Edit2,
  Trash2,
  X,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AdminsManagement = () => {
  const { isDarkMode } = useThemeStore();
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "John Administrator",
      email: "john.admin@system.edu",
      role: "Super Admin",
      permissions: "Full Access",
      status: "Active",
      lastLogin: "2024-12-18 14:30",
      createdDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Alice Manager",
      email: "alice@system.edu",
      role: "Admin",
      permissions: "User Management",
      status: "Active",
      lastLogin: "2024-12-19 09:15",
      createdDate: "2023-05-20",
    },
    {
      id: 3,
      name: "Bob Moderator",
      email: "bob@system.edu",
      role: "Moderator",
      permissions: "Content Review",
      status: "Inactive",
      lastLogin: "2024-11-30 16:45",
      createdDate: "2023-08-10",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Admin",
    permissions: "",
    status: "Active",
  });

  const roles = ["Super Admin", "Admin", "Moderator", "Content Manager"];
  const permissionOptions = [
    "Full Access",
    "User Management",
    "Content Review",
    "Reports Only",
    "Test Management",
  ];

  const handleAddAdmin = () => {
    if (editingAdmin) {
      setAdmins(
        admins.map((a) =>
          a.id === editingAdmin.id
            ? {
                ...editingAdmin,
                ...formData,
                lastLogin: editingAdmin.lastLogin,
              }
            : a,
        ),
      );
    } else {
      const newAdmin = {
        id: admins.length + 1,
        ...formData,
        lastLogin: "Never",
        createdDate: new Date().toISOString().split("T")[0],
      };
      setAdmins([...admins, newAdmin]);
    }
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      role: "Admin",
      permissions: "",
      status: "Active",
    });
    setEditingAdmin(null);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      status: admin.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (
      confirm(
        "Are you sure you want to remove this administrator? This action cannot be undone.",
      )
    ) {
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(
        `File "${file.name}" uploaded successfully! In production, this would parse the CSV/PDF.`,
      );
      setShowUploadModal(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || admin.status === filterStatus;
    const matchesRole = filterRole === "All" || admin.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div
      className={cn(
        "min-h-screen p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-orange-500" size={32} />
            <h1
              className={cn(
                "text-3xl font-bold",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            >
              Administrators Management
            </h1>
          </div>
          <p className={cn(isDarkMode ? "text-slate-400" : "text-gray-600")}>
            Manage system administrators and access permissions
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Lock className="text-orange-500" size={16} />
            <span className="text-orange-500 font-medium">
              Restricted Access Area
            </span>
          </div>
        </div>

        {/* Actions Bar */}
        <div
          className={cn(
            "rounded-xl p-4 mb-6 border",
            isDarkMode
              ? "bg-slate-900/50 border-slate-800"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <UserPlus size={20} />
                Add Administrator
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Upload size={20} />
                Bulk Upload
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2",
                  isDarkMode ? "text-slate-500" : "text-gray-400",
                )}
                size={20}
              />
              <input
                type="text"
                placeholder="Search administrators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                    : "bg-white border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-900 focus:ring-blue-900/20",
                )}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={cn(
                  "px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:ring-orange-500/20"
                    : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                )}
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={cn(
                  "px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:ring-orange-500/20"
                    : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                )}
              >
                <option>All</option>
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "rounded-xl p-4 border shadow-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Total Admins
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold mt-1",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {admins.length}
                </p>
              </div>
              <Shield className="text-orange-500" size={32} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              "rounded-xl p-4 border shadow-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {admins.filter((a) => a.status === "Active").length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "rounded-xl p-4 border shadow-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200",
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  Inactive
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold mt-1",
                    isDarkMode ? "text-slate-400" : "text-gray-600",
                  )}
                >
                  {admins.filter((a) => a.status === "Inactive").length}
                </p>
              </div>
              <XCircle
                className={isDarkMode ? "text-slate-600" : "text-gray-500"}
                size={32}
              />
            </div>
          </motion.div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className={cn(
            "rounded-xl border overflow-hidden shadow-sm",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-slate-50 border-slate-200",
                  )}
                >
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Administrator
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Role
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Permissions
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Last Login
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Status
                  </th>
                  <th
                    className={cn(
                      "text-left px-6 py-4 font-semibold",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAdmins.map((admin, index) => (
                    <motion.tr
                      key={admin.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "border-b transition-colors",
                        isDarkMode
                          ? "border-slate-800 hover:bg-slate-800/30"
                          : "border-slate-100 hover:bg-slate-50",
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                            {admin.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-medium",
                                isDarkMode ? "text-white" : "text-slate-900",
                              )}
                            >
                              {admin.name}
                            </p>
                            <p
                              className={cn(
                                "text-sm",
                                isDarkMode ? "text-slate-400" : "text-gray-500",
                              )}
                            >
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            admin.role === "Super Admin"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : admin.role === "Admin"
                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          <Shield size={12} />
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-slate-400" : "text-slate-600",
                          )}
                        >
                          {admin.permissions}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p
                            className={cn(
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            {admin.lastLogin}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${admin.status === "Active" ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(admin)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isDarkMode
                                ? "hover:bg-blue-500/20 text-blue-400"
                                : "hover:bg-blue-100 text-blue-900",
                            )}
                          >
                            <Edit2 size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(admin.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isDarkMode
                                ? "hover:bg-red-500/20 text-red-400"
                                : "hover:bg-red-100 text-red-600",
                            )}
                          >
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
                setEditingAdmin(null);
                setFormData({
                  name: "",
                  email: "",
                  role: "Admin",
                  permissions: "",
                  status: "Active",
                });
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl p-6 w-full max-w-md border shadow-xl max-h-[90vh] overflow-y-auto",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200",
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="text-orange-500" size={24} />
                    <h2
                      className={cn(
                        "text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {editingAdmin
                        ? "Edit Administrator"
                        : "Add New Administrator"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingAdmin(null);
                      setFormData({
                        name: "",
                        email: "",
                        role: "Admin",
                        permissions: "",
                        status: "Active",
                      });
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div
                  className={cn(
                    "border rounded-lg p-3 mb-4",
                    isDarkMode
                      ? "bg-orange-500/10 border-orange-500/20"
                      : "bg-orange-50 border-orange-200",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm flex items-center gap-2",
                      isDarkMode ? "text-orange-400" : "text-orange-700",
                    )}
                  >
                    <Lock size={16} />
                    High-privilege account. Exercise caution when granting
                    permissions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white focus:border-orange-500 focus:ring-orange-500/20"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                      )}
                      placeholder="Enter administrator name"
                    />
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white focus:border-orange-500 focus:ring-orange-500/20"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                      )}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white focus:border-orange-500 focus:ring-orange-500/20"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                      )}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Permissions
                    </label>
                    <select
                      value={formData.permissions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          permissions: e.target.value,
                        })
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white focus:border-orange-500 focus:ring-orange-500/20"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                      )}
                    >
                      <option value="">Select permissions</option>
                      {permissionOptions.map((perm) => (
                        <option key={perm} value={perm}>
                          {perm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={cn(
                        "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white focus:border-orange-500 focus:ring-orange-500/20"
                          : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                      )}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddAdmin}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {editingAdmin ? "Update" : "Add"} Administrator
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingAdmin(null);
                        setFormData({
                          name: "",
                          email: "",
                          role: "Admin",
                          permissions: "",
                          status: "Active",
                        });
                      }}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                        isDarkMode
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-slate-900",
                      )}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl p-6 w-full max-w-md border shadow-xl",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200",
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    Bulk Upload Administrators
                  </h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div
                  className={cn(
                    "border rounded-lg p-3 mb-4",
                    isDarkMode
                      ? "bg-orange-500/10 border-orange-500/20"
                      : "bg-orange-50 border-orange-200",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm flex items-center gap-2",
                      isDarkMode ? "text-orange-400" : "text-orange-700",
                    )}
                  >
                    <Lock size={16} />
                    Bulk upload will create multiple high-privilege accounts
                  </p>
                </div>

                <div className="space-y-4">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                      isDarkMode
                        ? "border-slate-700 hover:border-orange-500"
                        : "border-slate-300 hover:border-orange-500",
                    )}
                  >
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <p
                      className={cn(
                        "mb-2",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Drop your CSV or PDF file here
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".csv,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-admin"
                    />
                    <label
                      htmlFor="file-upload-admin"
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </div>

                  <div
                    className={cn(
                      "rounded-lg p-4 border",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-slate-50 border-slate-200",
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      File Format Requirements:
                    </p>
                    <ul
                      className={cn(
                        "text-sm space-y-1",
                        isDarkMode ? "text-slate-400" : "text-slate-600",
                      )}
                    >
                      <li>• CSV: name, email, role, permissions, status</li>
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

export default AdminsManagement;
