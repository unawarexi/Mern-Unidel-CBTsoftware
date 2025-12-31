import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByEntity,
  updateDepartment,
  deleteDepartment,
  promoteStudents,
} from "../controllers/department.controller.js";

const router = express.Router();

// Admin-only create, update, delete, promote
router.post("/", protect, authorize("admin", "superadmin"), createDepartment);
router.put("/:id", protect, authorize("admin", "superadmin"), updateDepartment);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteDepartment);
router.post("/promote", protect, authorize("admin", "superadmin"), promoteStudents);

// Public/fetch routes (protected, but any role)
router.get("/", protect, getAllDepartments);
router.get("/by-entity", protect, getDepartmentsByEntity);
router.get("/:id", protect, getDepartmentById);

export default router;
