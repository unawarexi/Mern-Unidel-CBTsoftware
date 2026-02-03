import express from "express";
import {
  protect,
  authorize,
  optionalProtect,
} from "../middlewares/auth.middleware.js";
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  updateTicketStatus,
  respondToTicket,
} from "../controllers/support.controller.js";

const router = express.Router();

// Public can create tickets
router.post("/", optionalProtect, createTicket);

// User-specific
router.get("/my", protect, getMyTickets);
router.get("/:id", optionalProtect, getTicketById);

// Admin only
router.get("/", protect, authorize("admin", "superadmin"), getAllTickets);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superadmin"),
  updateTicketStatus,
);
router.post(
  "/:id/respond",
  protect,
  authorize("admin", "superadmin"),
  respondToTicket,
);

export default router;
