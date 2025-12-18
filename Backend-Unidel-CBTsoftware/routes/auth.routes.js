import express from "express";
import { login, changePasswordFirstLogin, changePassword, forgotPassword, resetPassword, getCurrentUser, updateProfile, logout, refreshToken, adminSignup } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.post("/login", login);
router.post("/change-password-first-login", changePasswordFirstLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/admin/signup", adminSignup);

// ========== PROTECTED ROUTES ==========
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout);
router.post("/refresh-token", protect, refreshToken);

export default router;
