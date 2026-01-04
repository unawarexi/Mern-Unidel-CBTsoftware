import express from "express";
import {
  reportViolation,
  getSubmissionViolations,
  getExamViolations,
  getMyViolationStats,
} from "../controllers/security.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Student routes
router.post("/violations", protect, authorize("student"), reportViolation);
router.get("/violations/:submissionId", protect, getSubmissionViolations);
router.get("/students/me/violations", protect, authorize("student"), getMyViolationStats);

// Lecturer/Admin routes
router.get("/exams/:examId/violations", protect, authorize("lecturer", "admin"), getExamViolations);

export default router;
