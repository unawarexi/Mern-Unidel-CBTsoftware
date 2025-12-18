import express from "express";
import {
  createLecturer,
  getAllLecturers,
  getLecturerById,
  updateLecturer,
  deleteLecturer,
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getUserStats,
} from "../controllers/users.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ========== LECTURER ROUTES ==========
router.route("/lecturers").post(protect, authorize("admin"), createLecturer).get(protect, authorize("admin"), getAllLecturers);
router.route("/lecturers/:id").get(protect, authorize("admin"), getLecturerById).put(protect, authorize("admin"), updateLecturer).delete(protect, authorize("admin"), deleteLecturer);

// ========== STUDENT ROUTES ==========
router.route("/students").post(protect, authorize("admin"), createStudent).get(protect, authorize("admin"), getAllStudents);
router.route("/students/:id").get(protect, authorize("admin"), getStudentById).put(protect, authorize("admin"), updateStudent).delete(protect, authorize("admin"), deleteStudent);

// ========== ADMIN ROUTES ==========
router.route("/admins").post(protect, authorize("superadmin"), createAdmin).get(protect, authorize("admin", "superadmin"), getAllAdmins);
router.route("/admins/:id").get(protect, authorize("admin", "superadmin"), getAdminById).put(protect, authorize("superadmin"), updateAdmin).delete(protect, authorize("superadmin"), deleteAdmin);

// ========== UTILITY ROUTES ==========
router.get("/stats", protect, authorize("admin", "superadmin"), getUserStats);

export default router;
