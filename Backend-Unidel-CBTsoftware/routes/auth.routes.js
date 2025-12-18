const express = require("express");
const router = express.Router();
const { login, changePasswordFirstLogin, changePassword, forgotPassword, resetPassword, getCurrentUser, updateProfile, logout, refreshToken } = require("../controllers/auth.controller");

// Import authentication middleware
const { protect } = require("../middleware/auth.middleware");

// ========== PUBLIC ROUTES ==========
router.post("/login", login);
router.post("/change-password-first-login", changePasswordFirstLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ========== PROTECTED ROUTES ==========
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout);
router.post("/refresh-token", protect, refreshToken);

module.exports = router;
