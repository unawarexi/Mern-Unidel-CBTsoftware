import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Lecturer from "../models/lecturer.model.js";
import Student from "../models/student.model.js";
import { generateToken } from "../core/helpers/helper-functions.js";
import { generateAdminId } from "../core/helpers/helper-functions.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

// Helper to get user model based on role
const getUserModel = (role) => {
  const models = { admin: Admin, lecturer: Lecturer, student: Student };
  return models[role];
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  // Set token as secure httpOnly cookie so browser sends it with subsequent requests
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("token", token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
    },
  });
};

// @desc    Admin Signup (Admin only)
// @route   POST /api/auth/admin/signup
// @access  Public (but should be protected in production)
export const adminSignup = async (req, res) => {
  try {
    // accept fullname or name; organisation or organization
    const fullname = req.body.fullname || req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    let adminId = req.body.adminId;
    const organisation = req.body.organisation || req.body.organization;

    if (!fullname || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide fullname, email and password" });
    }

    // generate adminId if not provided
    if (!adminId) {
      const count = await Admin.countDocuments();
      adminId = generateAdminId(count + 1);
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      fullname,
      email,
      password: hashedPassword,
      adminId,
      organisation,
      role: "admin",
      isFirstLogin: false, // signup set by user, not forced to change
    });

    // Send a brief welcome/account email (non-blocking failure)
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.generalNotification({
        title: "Welcome to UNIDEL CBT — Admin account created",
        recipientName: admin.fullname,
        message: `<p>Your administrator account has been created successfully.</p><p>You can sign in using your registered email.</p>`,
        recipientId: admin._id,
      });
      await Mailer.sendTemplatedMail(admin.email, emailContent);
    } catch (err) {
      console.error("Error sending admin signup email:", err);
    }

    sendTokenResponse(admin, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login (Admin, Lecturer, Student)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    // accept email OR identifier fields plus role & password
    const { email, password, role, studentId, employeeId, adminId } = req.body;

    // require at least role and password
    if (!role || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide role and password",
      });
    }

    const Model = getUserModel(role);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // build flexible query: prefer email, fall back to role-specific identifier
    const orQueries = [];
    if (email) orQueries.push({ email });
    if (role === "student" && studentId) orQueries.push({ studentId });
    if (role === "lecturer" && employeeId) orQueries.push({ employeeId });
    if (role === "admin" && adminId) orQueries.push({ adminId });

    if (orQueries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email or identifier for the specified role",
      });
    }

    const user = await Model.findOne({ $or: orQueries }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if first login
    if (user.isFirstLogin) {
      return res.status(200).json({
        success: true,
        requirePasswordChange: true,
        message: "Please change your password on first login",
        userId: user._id,
        role: user.role,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request Password Reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and role",
      });
    }

    const Model = getUserModel(role);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await Model.findOne({ email });

    // Always return success to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&role=${role}`;

    // Send email with reset link
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.passwordResetRequest({
        fullName: user.fullname || user.fullName || "",
        resetUrl,
        userId: user._id,
      });
      await Mailer.sendTemplatedMail(user.email, emailContent);
    } catch (err) {
      console.error("Error sending password reset email:", err);
    }

    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // accept token field under multiple names and allow role to be optional
    const tokenRaw = req.body.token || req.body.resetToken;
    const role = req.body.role;
    const newPassword = req.body.newPassword;

    if (!tokenRaw || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide token and newPassword",
      });
    }

    // Hash token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(tokenRaw).digest("hex");

    let user = null;
    let Model = null;

    // If role provided, search only that collection (faster). Otherwise search all models.
    if (role) {
      Model = getUserModel(role);
      if (Model) {
        user = await Model.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpires: { $gt: Date.now() },
        });
      }
    } else {
      // fallback: try all known models
      const potentialModels = [Admin, Lecturer, Student];
      for (const M of potentialModels) {
        const found = await M.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpires: { $gt: Date.now() },
        });
        if (found) {
          user = found;
          break;
        }
      }
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isFirstLogin = false;
    await user.save();

    // Send confirmation email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.passwordChangedConfirmation({
        fullName: user.fullname || "",
        changeTime: new Date().toLocaleString(),
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        userId: user._id,
      });
      await Mailer.sendTemplatedMail(user.email, emailContent);
    } catch (err) {
      console.error("Error sending password changed confirmation:", err);
    }

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with new password.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password on First Login
// @route   POST /api/auth/change-password-first-login
// @access  Public
export const changePasswordFirstLogin = async (req, res) => {
  try {
    const { userId, role, newPassword } = req.body;

    if (!userId || !role || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const Model = getUserModel(role);
    const user = await Model.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // First-login flow: set provided new password (no old password verification required)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isFirstLogin = false;
    await user.save();

    // Send confirmation email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.passwordChangedConfirmation({
        fullName: user.fullname || "",
        changeTime: new Date().toLocaleString(),
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        userId: user._id,
      });
      await Mailer.sendTemplatedMail(user.email, emailContent);
    } catch (err) {
      console.error("Error sending password changed confirmation:", err);
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password (Authenticated User)
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user.userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Send confirmation email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.passwordChangedConfirmation({
        fullName: user.fullname || "",
        changeTime: new Date().toLocaleString(),
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        userId: user._id,
      });
      await Mailer.sendTemplatedMail(user.email, emailContent);
    } catch (err) {
      console.error("Error sending password changed confirmation:", err);
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user.userId).select("-password -resetPasswordToken -resetPasswordExpires").populate("courses", "courseName courseCode");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Current User Profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email } = req.body;

    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await Model.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      user.email = email;
    }

    if (fullname) user.fullname = fullname;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Token invalidation handled on client side
    // Optional: Implement token blacklist in Redis

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh-token
// @access  Private
export const refreshToken = async (req, res) => {
  try {
    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
