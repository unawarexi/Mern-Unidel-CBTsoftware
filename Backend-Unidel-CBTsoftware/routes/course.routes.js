import express from "express";
import { createCourse, getAllCourses, getCourse, updateCourse, deleteCourse, assignLecturers, removeLecturers, uploadCourseMaterial, deleteCourseMaterial, assignToCourse, removeFromCourse } from "../controllers/course.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../services/cloudinary.service.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all courses - accessible by admin and lecturer
router.get("/", authorize("admin", "superadmin", "lecturer"), getAllCourses);

// Get single course - accessible by admin and lecturer
router.get("/:id", authorize("admin", "superadmin", "lecturer"), getCourse);

// Admin only routes
router.post("/", authorize("admin", "superadmin"), createCourse);
router.put("/:id", authorize("admin", "superadmin"), updateCourse);
router.delete("/:id", authorize("admin", "superadmin"), deleteCourse);

// Assign and remove lecturers - admin only
router.post("/:id/assign-lecturers", authorize("admin", "superadmin"), assignLecturers);
router.post("/:id/remove-lecturers", authorize("admin", "superadmin"), removeLecturers);

// Upload course material (lecturer only)
router.post("/:id/materials", protect, authorize("lecturer"), upload.single("file"), uploadCourseMaterial);

// Delete course material (lecturer only)
router.delete("/:id/materials/:materialId", protect, authorize("lecturer"), deleteCourseMaterial);

// Assign and remove students - admin only
router.post("/:id/assign", protect, authorize("admin", "superadmin"), assignToCourse);
router.post("/:id/remove", protect, authorize("admin", "superadmin"), removeFromCourse);

export default router;
