import express from "express";
import path from "path";
import {
  // Question Bank CRUD
  createQuestionBank,
  getLecturerQuestionBanks,
  getQuestionBankById,
  updateQuestionBank,
  addQuestionToBank,
  updateQuestionInBank,
  deleteQuestionFromBank,
  submitForApproval,
  deleteQuestionBank,

  // Admin approval
  getPendingApprovals,
  approveQuestionBank,
  rejectQuestionBank,

  // Exam CRUD
  createExam,
  createExamFromQuestionBank,
  getLecturerExams,
  getExamById,
  updateExam,
  publishExam,
  deleteExam,
  getActiveExamsForStudent,
} from "../controllers/exam.controller.js";
import { generateQuestionsFromFile, extractTextFromFile, bulkUploadQuestions, improveQuestionsWithAI, generateImageForQuestion } from "../controllers/file-extraction.controller.js";
import { upload } from "../services/cloudinary.service.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==================== FILE EXTRACTION & AI GENERATION ====================

// Extract text from uploaded file (PDF/DOCX)
router.post("/extract-text", protect, authorize("lecturer"), upload.single("file"), extractTextFromFile);

// Generate questions from uploaded file using AI
router.post("/generate-from-file", protect, authorize("lecturer"), upload.single("file"), generateQuestionsFromFile);

// ==================== QUESTION BANK ROUTES ====================

// Create new question bank (draft)
router.post("/question-bank", protect, authorize("lecturer"), createQuestionBank);

// Get all question banks for logged-in lecturer
router.get("/question-bank", protect, authorize("lecturer"), getLecturerQuestionBanks);

// Get specific question bank by ID
router.get("/question-bank/:id", protect, authorize("lecturer", "admin"), getQuestionBankById);

// Update question bank (title, description, or bulk questions update)
router.put("/question-bank/:id", protect, authorize("lecturer"), updateQuestionBank);

// Add single question to question bank
router.post("/question-bank/:id/questions", protect, authorize("lecturer"), addQuestionToBank);

// Update specific question in question bank
router.put("/question-bank/:id/questions/:questionId", protect, authorize("lecturer"), updateQuestionInBank);

// Delete specific question from question bank
router.delete("/question-bank/:id/questions/:questionId", protect, authorize("lecturer"), deleteQuestionFromBank);

// Submit question bank for admin approval
router.post("/question-bank/:id/submit", protect, authorize("lecturer"), submitForApproval);

// Delete question bank
router.delete("/question-bank/:id", protect, authorize("lecturer"), deleteQuestionBank);

// Use AI to improve questions in question bank
router.post("/question-bank/:id/improve", protect, authorize("lecturer"), improveQuestionsWithAI);

// Bulk upload questions from file (CSV, XLSX, DOCX, PDF)
router.post("/question-bank/bulk-upload", protect, authorize("lecturer"), upload.single("file"), bulkUploadQuestions);

// ==================== ADMIN APPROVAL ROUTES ====================

// Get all question banks pending approval (Admin only)
router.get("/question-bank/pending/approvals", protect, authorize("admin"), getPendingApprovals);

// Approve question bank (Admin only)
router.post("/question-bank/:id/approve", protect, authorize("admin"), approveQuestionBank);

// Reject question bank (Admin only)
router.post("/question-bank/:id/reject", protect, authorize("admin"), rejectQuestionBank);

// ==================== EXAM ROUTES ====================

// Create exam manually (without question bank)
router.post("/exams", protect, authorize("lecturer"), createExam);

// Create exam from approved question bank
router.post("/exams/from-question-bank", protect, authorize("lecturer"), createExamFromQuestionBank);

// Get all exams for lecturer
router.get("/exams", protect, authorize("lecturer"), getLecturerExams);

// Get active exams for students
router.get("/exams/active", protect, authorize("student"), getActiveExamsForStudent);

// Get exam by ID
router.get("/exams/:id", protect, authorize("lecturer", "student", "admin"), getExamById);

// Update exam
router.put("/exams/:id", protect, authorize("lecturer"), updateExam);

// Publish exam (make it active for students)
router.post("/exams/:id/publish", protect, authorize("lecturer"), publishExam);

// Delete exam
router.delete("/exams/:id", protect, authorize("lecturer"), deleteExam);

// Generate image/illustration for a question (AI)
router.post("/question-image", protect, authorize("lecturer"), generateImageForQuestion);

export default router;
