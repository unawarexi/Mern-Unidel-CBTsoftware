import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  submitApplication,
  adminReview,
  softDeleteApplication,
  getAllApplications,
} from "../controllers/application.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createApplication);
router.get("/my", getMyApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.post("/:id/submit", submitApplication);

// Admin only
router.get("/", authorize("admin", "superadmin"), getAllApplications);
router.patch("/:id/review", authorize("admin", "superadmin"), adminReview);
router.delete("/:id", authorize("admin", "superadmin"), softDeleteApplication);

export default router;
