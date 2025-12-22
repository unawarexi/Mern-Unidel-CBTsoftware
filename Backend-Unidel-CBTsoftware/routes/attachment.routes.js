import express from "express";
import { uploadSingleFile, uploadMultipleFiles, getUserAttachments, deleteAttachment } from "../controllers/attachment.controller.js";
import { upload } from "../services/cloudinary.service.js";
import { protect } from "../middlewares/auth.middleware.js"; // use 'protect' (existing middleware)

const router = express.Router();


router.post("/upload", protect, upload.single("file"), uploadSingleFile);

router.post("/upload-multiple", protect, upload.array("files", 10), uploadMultipleFiles);

router.get("/", protect, getUserAttachments);

router.delete("/:fileUrl", protect, deleteAttachment);

export default router;
