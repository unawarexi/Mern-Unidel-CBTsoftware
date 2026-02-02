import express from "express";
import {
  generateReport,
  getUserReports,
  getReportById,
} from "../controllers/report.controller.js";
import { protect, optionalProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Allow optional authentication for generation (public reports)
router.post("/generate", optionalProtect, generateReport);

// Protected routes for management and viewing history
router.use(protect);
router.get("/", getUserReports);
router.get("/:id", getReportById);

export default router;
