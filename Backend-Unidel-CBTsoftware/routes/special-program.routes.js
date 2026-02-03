import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  restoreProgram,
} from "../controllers/special-program.controller.js";

const router = express.Router();

router.get("/", getAllPrograms);
router.get("/:id", getProgramById);

router.post("/", protect, authorize("admin", "superadmin"), createProgram);
router.put("/:id", protect, authorize("admin", "superadmin"), updateProgram);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteProgram);
router.post(
  "/:id/restore",
  protect,
  authorize("admin", "superadmin"),
  restoreProgram,
);

export default router;
