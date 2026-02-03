import express from "express";
import {
  getMySubscription,
  verifyAgent,
} from "../controllers/agent.controller.js";
import {
  createAgentStudent,
  getAgentStudents,
  updateAgentStudent,
  deleteAgentStudent,
} from "../controllers/agent-student.controller.js";
import {
  createAgentExam,
  getAgentExams,
  updateAgentExam,
  deleteAgentExam,
} from "../controllers/agent-exam.controller.js";
import {
  createAgentQuestionBank,
  getAgentQuestionBanks,
  updateAgentQuestionBank,
  deleteAgentQuestionBank,
} from "../controllers/agent-question.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require protection
router.use(protect);

// Agent specific routes
router.get("/subscription", authorize("agent"), getMySubscription);

// Students
router.post("/students", authorize("agent"), createAgentStudent);
router.get(
  "/students",
  authorize("agent", "admin", "superadmin"),
  getAgentStudents,
);
router.put("/students/:id", authorize("agent"), updateAgentStudent);
router.delete("/students/:id", authorize("agent"), deleteAgentStudent);

// Exams
router.post("/exams", authorize("agent"), createAgentExam);
router.get("/exams", authorize("agent", "admin", "superadmin"), getAgentExams);
router.put("/exams/:id", authorize("agent"), updateAgentExam);
router.delete("/exams/:id", authorize("agent"), deleteAgentExam);

// Question Banks
router.post("/question-banks", authorize("agent"), createAgentQuestionBank);
router.get(
  "/question-banks",
  authorize("agent", "admin", "superadmin"),
  getAgentQuestionBanks,
);
router.put("/question-banks/:id", authorize("agent"), updateAgentQuestionBank);
router.delete(
  "/question-banks/:id",
  authorize("agent"),
  deleteAgentQuestionBank,
);

// Admin routes for agents
router.put("/verify/:id", authorize("admin", "superadmin"), verifyAgent);

export default router;
