import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  applyForJob,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/career-application.controller.js";
import { upload } from "../services/cloudinary.service.js";

const router = express.Router();

// Public can apply
router.post(
  "/apply",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "letter", maxCount: 1 },
  ]),
  applyForJob,
);

// Admin only
router.get("/", protect, authorize("admin", "superadmin"), getAllApplications);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superadmin"),
  updateApplicationStatus,
);

export default router;
