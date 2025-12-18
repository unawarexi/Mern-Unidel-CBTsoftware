const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Lecturer = require("../models/lecturer.model");
const Student = require("../models/student.model");
const { generateToken } = require("../core/helpers/helper-functions");

// Helper to get user model based on role
const getUserModel = (role) => {
  const models = { admin: Admin, lecturer: Lecturer, student: Student };
  return models[role];
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

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

// @desc    Login (Admin, Lecturer, Student)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const Model = getUserModel(role);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Find user
    const user = await Model.findOne({ email }).select("+password");
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

// @desc    Change Password on First Login
// @route   POST /api/auth/change-password-first-login
// @access  Public
exports.changePasswordFirstLogin = async (req, res) => {
  try {
    const { userId, role, oldPassword, newPassword } = req.body;

    if (!userId || !role || !oldPassword || !newPassword) {
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

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isFirstLogin = false;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password (Authenticated User)
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request Password Reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
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

    // TODO: Send email with reset link
    // await sendEmail(user.email, resetUrl);

    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link has been sent",
      resetUrl, // Remove in production
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, role, newPassword } = req.body;

    if (!token || !role || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    // Hash token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const Model = getUserModel(role);
    const user = await Model.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

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
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with new password.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
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
exports.updateProfile = async (req, res) => {
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
exports.logout = async (req, res) => {
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
exports.refreshToken = async (req, res) => {
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
