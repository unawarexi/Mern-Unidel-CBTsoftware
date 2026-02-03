import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createBody,
  getAllBodies,
  getBodyById,
  updateBody,
  deleteBody,
  restoreBody,
} from "../controllers/governing-body.controller.js";

const router = express.Router();

router.get("/", getAllBodies);
router.get("/:id", getBodyById);

router.post("/", protect, authorize("admin", "superadmin"), createBody);
router.put("/:id", protect, authorize("admin", "superadmin"), updateBody);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteBody);
router.post(
  "/:id/restore",
  protect,
  authorize("admin", "superadmin"),
  restoreBody,
);

export default router;
