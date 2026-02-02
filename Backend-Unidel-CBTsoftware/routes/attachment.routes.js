import express from "express";
import { uploadSingleFile, uploadMultipleFiles, getUserAttachments, deleteAttachment } from "../controllers/attachment.controller.js";
import { upload } from "../services/cloudinary.service.js";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadLimiter } from "../middlewares/rate-limiter.middleware.js";

const router = express.Router();

// File uploads with rate limiting
router.post("/upload", protect, uploadLimiter, upload.single("file"), uploadSingleFile);

router.post("/upload-multiple", protect, uploadLimiter, upload.array("files", 10), uploadMultipleFiles);

router.get("/", protect, getUserAttachments);

router.delete("/:fileUrl", protect, deleteAttachment);

export default router;

