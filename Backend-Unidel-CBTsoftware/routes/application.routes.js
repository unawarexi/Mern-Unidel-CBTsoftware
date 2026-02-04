import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../services/cloudinary.service.js";
import {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  submitApplication,
  adminReview,
  softDeleteApplication,
  getAllApplications,
  uploadApplicationFile,
} from "../controllers/application.controller.js";

const router = express.Router();

// Public routes
router.post("/", createApplication);

router.use(protect);

router.get("/my", getMyApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.post("/:id/submit", submitApplication);
router.post("/:id/upload", upload.single("file"), uploadApplicationFile);

// Admin only
router.get("/", authorize("admin", "superadmin"), getAllApplications);
router.patch("/:id/review", authorize("admin", "superadmin"), adminReview);
router.delete("/:id", authorize("admin", "superadmin"), softDeleteApplication);

export default router;
