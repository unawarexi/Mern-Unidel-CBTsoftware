import express from "express";
import {
  createLecturer,
  getAllLecturers,
  getLecturerById,
  updateLecturer,
  deleteLecturer,
  getLecturerCourses,
  getLecturerExams,
  getLecturerQuestionBanks,
  getLecturerStudents,
} from "../controllers/lecturer.controller.js";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import {
  getUserStats,
  getCurrentUser,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getCurrentUserStats,
} from "../controllers/users.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ========== LECTURER ROUTES ==========
router
  .route("/lecturers")
  .post(protect, authorize("admin"), createLecturer)
  .get(protect, authorize("admin"), getAllLecturers);

router
  .route("/lecturers/:id")
  .get(protect, authorize("admin"), getLecturerById)
  .put(protect, authorize("admin"), updateLecturer)
  .delete(protect, authorize("admin"), deleteLecturer);

router.get(
  "/lecturers/me/courses",
  protect,
  authorize("lecturer"),
  getLecturerCourses
);
router.get(
  "/lecturers/me/exams",
  protect,
  authorize("lecturer"),
  getLecturerExams
);
router.get(
  "/lecturers/me/question-banks",
  protect,
  authorize("lecturer"),
  getLecturerQuestionBanks
);
router.get(
  "/lecturers/me/students",
  protect,
  authorize("lecturer"),
  getLecturerStudents
);

// ========== STUDENT ROUTES ==========
router
  .route("/students")
  .post(protect, authorize("admin"), createStudent)
  .get(protect, authorize("admin"), getAllStudents);

router
  .route("/students/:id")
  .get(protect, authorize("admin"), getStudentById)
  .put(protect, authorize("admin"), updateStudent)
  .delete(protect, authorize("admin"), deleteStudent);

// ========== ADMIN ROUTES ==========
router
  .route("/admins")
  .post(protect, authorize("superadmin"), createAdmin)
  .get(protect, authorize("admin", "superadmin"), getAllAdmins);

router
  .route("/admins/:id")
  .get(protect, authorize("admin", "superadmin"), getAdminById)
  .put(protect, authorize("superadmin"), updateAdmin)
  .delete(protect, authorize("superadmin"), deleteAdmin);

// ========== UTILITY ROUTES ==========
router.get("/stats", protect, authorize("admin", "superadmin"), getUserStats);
router.get("/me/stats", protect, getCurrentUserStats);

// ========== PROFILE ROUTES ==========
router
  .route("/profile")
  .get(protect, getCurrentUser)
  .put(protect, updateProfile);

router
  .route("/profile/picture")
  .post(protect, uploadProfilePicture)
  .delete(protect, deleteProfilePicture);

export default router;
