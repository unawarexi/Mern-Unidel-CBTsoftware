import express from "express";
import {
  initiatePayment,
  getMyPayments,
  getAllPayments,
} from "../controllers/payment.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/initiate", initiatePayment);
router.get("/my", getMyPayments);
router.get("/", authorize("admin", "superadmin"), getAllPayments);

export default router;
