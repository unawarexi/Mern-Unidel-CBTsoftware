import express from "express";
import {
  login,
  changePasswordFirstLogin,
  changePassword,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  logout,
  refreshToken,
  agentSignup,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  loginLimiter,
  authLimiter,
  passwordResetLimiter,
} from "../middlewares/rate-limiter.middleware.js";

const router = express.Router();

// ========== PUBLIC ROUTES (with rate limiting) ==========
router.post("/login", login);
router.post("/agent/signup", authLimiter, agentSignup);
router.post(
  "/change-password-first-login",
  authLimiter,
  changePasswordFirstLogin,
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ========== PROTECTED ROUTES ==========
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout);
router.post("/refresh-token", refreshToken);

export default router;
