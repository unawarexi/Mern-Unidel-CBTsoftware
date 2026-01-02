import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import * as submissionController from "../controllers/submission.controller.js";

const router = express.Router();

// ========== STUDENT ROUTES ==========
router.post("/start/:examId", protect, authorize("student"), submissionController.startExam);

router.put("/:id/answer", protect, authorize("student"), submissionController.saveAnswer);

router.post("/:id/submit", protect, authorize("student"), submissionController.submitExam);

router.get("/exam/:examId", protect, authorize("student"), submissionController.getStudentSubmission);

router.get("/student/me", protect, authorize("student"), submissionController.getMySubmissions);

// ========== LECTURER ROUTES ==========
router.get("/exam/:examId/all", protect, authorize("lecturer", "admin"), submissionController.getExamSubmissions);

router.get("/exam/:examId/statistics", protect, authorize("lecturer", "admin"), submissionController.getExamStatistics);

router.put("/:id/feedback", protect, authorize("lecturer", "admin"), submissionController.addFeedback);

router.put("/:id/flag", protect, authorize("lecturer", "admin"), submissionController.flagSubmission);

// ========== ADMIN ROUTES ==========
router.get("/admin/all", protect, authorize("admin", "superadmin"), submissionController.getAllSubmissions);

router.get("/admin/statistics", protect, authorize("admin", "superadmin"), submissionController.getSystemStatistics);

router.delete("/:id", protect, authorize("admin", "superadmin"), submissionController.deleteSubmission);

export default router;
