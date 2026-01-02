import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createActivityLog,
  getActivityLogs,
  getAdminDashboardStats,
  getLecturerDashboardStats,
  getStudentDashboardStats,
  getExamAnalytics,
  getSystemAnalytics,
  exportStatistics,
} from "../controllers/statistics.controller.js";

const router = express.Router();

// Activity logs
router.post("/activity", protect, createActivityLog);
router.get("/activity", protect, authorize("admin", "superadmin"), getActivityLogs);

// Dashboard statistics
router.get("/admin/dashboard", protect, authorize("admin", "superadmin"), getAdminDashboardStats);
router.get("/lecturer/dashboard", protect, authorize("lecturer"), getLecturerDashboardStats);
router.get("/student/dashboard", protect, authorize("student"), getStudentDashboardStats);

// Exam analytics
router.get("/exam/:examId/analytics", protect, authorize("lecturer", "admin", "superadmin"), getExamAnalytics);

// System analytics
router.get("/system/analytics", protect, authorize("admin", "superadmin"), getSystemAnalytics);

// Export
router.get("/export", protect, authorize("admin", "superadmin"), exportStatistics);

export default router;
