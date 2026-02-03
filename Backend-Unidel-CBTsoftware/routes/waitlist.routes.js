import express from "express";
import {
  subscribe,
  getSubscriptions,
  deleteSubscription,
} from "../controllers/waitlist.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/", protect, authorize("admin", "superadmin"), getSubscriptions);
router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  deleteSubscription,
);

export default router;
