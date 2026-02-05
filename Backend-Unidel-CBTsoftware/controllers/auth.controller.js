import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Admin from "../models/admin.model.js";
import Lecturer from "../models/lecturer.model.js";
import Student from "../models/student.model.js";
import Agent from "../models/agent.model.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";
import { emitToRoom } from "../services/socketIO.service.js";
// Redis for login tracking and caching
import {
  trackLoginAttempt,
  isLoginLocked,
  createSession,
  deleteSession,
  getSession,
  cacheUserProfile,
  getCachedUserProfile,
  invalidateUserCache,
  deleteAllUserSessions,
} from "../services/redis.service.js";

// Helper to get user model based on role
const getUserModel = (role) => {
  const models = {
    admin: Admin,
    lecturer: Lecturer,
    student: Student,
    agent: Agent,
  };
  return models[role];
};

/**
 * Generate Access Token - Short lived (15m)
 * Contains user ID (primary), all roles, current session ID, and identity map
 */
const generateAccessToken = (user, sessionId, allRoles, identities) => {
  return jwt.sign(
    {
      userId: user._id, // Primary ID (used for login)
      roles: allRoles,
      identities: identities, // Map of role -> userId
      sessionId: sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

/**
 * Generate Refresh Token - Long lived (7d)
 * Contains session ID and User ID
 */
const generateRefreshToken = (user, sessionId, roles, identities) => {
  return jwt.sign(
    {
      sessionId: sessionId,
      userId: user._id,
      roles: roles,
      identities: identities,
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// Send token response
const sendTokenResponse = async (
  user,
  allRoles,
  identities,
  sessionId,
  statusCode,
  res,
) => {
  const accessToken = generateAccessToken(
    user,
    sessionId,
    allRoles,
    identities,
  );
  const refreshToken = generateRefreshToken(
    user,
    sessionId,
    allRoles,
    identities,
  );

  // Store session metadata in Redis
  await createSession(user._id.toString(), sessionId, {
    roles: allRoles,
    identities: identities,
    lastIp: res.req.ip,
    userAgent: res.req.get("User-Agent"),
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Access Token Cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh Token Cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth/refresh-token",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Legacy / compatibility support: Clear old cookies
  const clearOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 0,
  };
  [
    "token",
    "token_admin",
    "token_student",
    "token_lecturer",
    "token_agent",
  ].forEach((c) => {
    res.cookie(c, "", clearOptions);
  });

  res.status(statusCode).json({
    success: true,
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      roles: allRoles,
      image: user.image,
      isFirstLogin: user.isFirstLogin,
    },
  });
};

// @desc    Agent Signup
export const agentSignup = async (req, res) => {
  try {
    const { fullname, email, password, organisation } = req.body;

    if (!fullname || !email || !password || !organisation) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = await Agent.create({
      fullname,
      email,
      password: hashedPassword,
      organisation,
      role: "agent",
      isFirstLogin: false,
      isVerified: false,
    });

    try {
      const admins = await Admin.find({ role: "admin" }).select("email");
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.agentApplication({
        agentName: agent.fullname,
        email: agent.email,
        organisation: agent.organisation,
      });

      for (const admin of admins) {
        await Mailer.sendTemplatedMail(admin.email, emailContent);
      }
      emitToRoom("admin_notifications", "agent:new", agent);
    } catch (err) {
      console.error("Error sending admin notification:", err);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. Please wait for admin verification.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login (Universal)
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let userEmail = email;

    if (!userEmail) {
      const { studentId, matricNumber, matnumber, employeeId, adminId } =
        req.body;

      let foundUser = null;
      if (role === "student")
        foundUser = await Student.findOne({
          matricNumber: (studentId || matricNumber || matnumber || "")
            .trim()
            .toUpperCase(),
        });
      else if (role === "lecturer")
        foundUser = await Lecturer.findOne({
          employeeId: (employeeId || "").trim().toUpperCase(),
        });
      else if (role === "admin")
        foundUser = await Admin.findOne({
          adminId: (adminId || "").trim().toUpperCase(),
        });

      if (foundUser) {
        userEmail = foundUser.email;
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    }

    if (await isLoginLocked(userEmail)) {
      return res.status(429).json({
        success: false,
        message: "Too many failed login attempts. Try again later.",
      });
    }

    const [admin, lecturer, student, agent] = await Promise.all([
      Admin.findOne({ email: userEmail }).select("+password"),
      Lecturer.findOne({ email: userEmail }).select("+password"),
      Student.findOne({ email: userEmail }).select("+password"),
      Agent.findOne({ email: userEmail }).select("+password"),
    ]);

    const usersFound = [];
    if (admin) usersFound.push({ type: "admin", user: admin });
    if (lecturer) usersFound.push({ type: "lecturer", user: lecturer });
    if (student) usersFound.push({ type: "student", user: student });
    if (agent) usersFound.push({ type: "agent", user: agent });

    if (usersFound.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    let validUser = null;
    let isMatch = false;

    if (role) {
      const target = usersFound.find((u) => u.type === role);
      if (target) {
        isMatch = await bcrypt.compare(password, target.user.password);
        if (isMatch) validUser = target.user;
      }
    }

    if (!validUser) {
      for (const u of usersFound) {
        if (role && u.type === role) continue;

        if (await bcrypt.compare(password, u.user.password)) {
          validUser = u.user;
          isMatch = true;
          break;
        }
      }
    }

    if (!validUser) {
      await trackLoginAttempt(userEmail, false);
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    await trackLoginAttempt(userEmail, true);

    const allRoles = usersFound.map((u) => u.type);
    const identities = {};
    usersFound.forEach((u) => {
      identities[u.type] = u.user._id;
    });

    const sessionId = uuidv4();

    // Pass session logic here
    if (validUser.isFirstLogin) {
      return res.status(200).json({
        success: true,
        requirePasswordChange: true,
        message: "Please change your password on first login",
        userId: validUser._id,
        role: validUser.role,
      });
    }

    return sendTokenResponse(
      validUser,
      allRoles,
      identities,
      sessionId,
      200,
      res,
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request Password Reset
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

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&role=${role}`;

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
export const resetPassword = async (req, res) => {
  try {
    const tokenRaw = req.body.token || req.body.resetToken;
    const role = req.body.role;
    const newPassword = req.body.newPassword;

    if (!tokenRaw || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide token and newPassword",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenRaw)
      .digest("hex");

    let user = null;
    let Model = null;

    if (role) {
      Model = getUserModel(role);
      if (Model) {
        user = await Model.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpires: { $gt: Date.now() },
        });
      }
    } else {
      const potentialModels = [Admin, Lecturer, Student, Agent];
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

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isFirstLogin = false;
    await user.save();

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

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isFirstLogin = false;
    await user.save();

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

    // Re-fetch all roles for this email
    const [admin, lecturer, student, agent] = await Promise.all([
      Admin.findOne({ email: user.email }),
      Lecturer.findOne({ email: user.email }),
      Student.findOne({ email: user.email }),
      Agent.findOne({ email: user.email }),
    ]);
    const usersFound = [];
    if (admin) usersFound.push({ type: "admin", user: admin });
    if (lecturer) usersFound.push({ type: "lecturer", user: lecturer });
    if (student) usersFound.push({ type: "student", user: student });
    if (agent) usersFound.push({ type: "agent", user: agent });
    const allRoles = usersFound.map((u) => u.type);

    const sessionId = uuidv4();
    sendTokenResponse(user, allRoles, sessionId, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password (Authenticated User)
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

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

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
export const getCurrentUser = async (req, res) => {
  try {
    const cachedUser = await getCachedUserProfile(req.user.userId);
    if (cachedUser) {
      return res.status(200).json({
        success: true,
        data: cachedUser,
        cached: true,
      });
    }

    const Model = getUserModel(req.user.role);
    let query = Model.findById(req.user.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    // Only populate courses for roles that have them
    if (["student", "lecturer"].includes(req.user.role)) {
      query = query.populate("courses", "courseName courseCode");
    }

    const user = await query;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await cacheUserProfile(req.user.userId, user);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Current User Profile
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
    await invalidateUserCache(req.user.userId);

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
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        );
        if (decoded.userId && decoded.sessionId) {
          await deleteSession(decoded.userId, decoded.sessionId);
        }
      } catch (e) {
        /* ignore */
      }
    } else if (req.user && req.user.userId) {
      // Fallback if no cookie but req.user exists
      await deleteAllUserSessions(req.user.userId);
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "lax",
    };

    res.cookie("access_token", "", cookieOptions);
    res.cookie("refresh_token", "", {
      ...cookieOptions,
      path: "/api/auth/refresh-token",
    });
    res.cookie("token", "", cookieOptions);
    res.cookie("token_admin", "", cookieOptions);
    res.cookie("token_student", "", cookieOptions);
    res.cookie("token_lecturer", "", cookieOptions);
    res.cookie("token_agent", "", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      );
    } catch (e) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Check Session in Redis
    let session = await getSession(decoded.userId, decoded.sessionId);

    // Stateless Fallback: If Redis is down/empty, use token payload if available
    if (!session && decoded.roles && decoded.identities) {
      // Mock session object from token claims
      session = {
        roles: decoded.roles,
        identities: decoded.identities,
      };
      // Note: We lose revocation check here, but maintain availability
    }

    if (!session) {
      return res
        .status(403)
        .json({ success: false, message: "Session expired or invalid" });
    }

    // Get User to issue new token
    const roles = session.roles || [];
    const identities = session.identities || {};
    let user = null;

    // Try to find the user using the identity map from session
    // We prefer the 'primary' user ID if available, otherwise just pick the first valid role

    // We used decoded.userId as the primary in previous steps.
    // Let's verify if that user still exists.
    for (const r of roles) {
      const id = identities[r];
      if (id) {
        const Model = getUserModel(r);
        user = await Model.findById(id);
        if (user) break;
      }
    }

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    }

    // Rotate tokens
    const newSessionId = uuidv4();
    // Update session with new ID but keep data
    await createSession(user._id.toString(), newSessionId, session);
    await deleteSession(user._id.toString(), decoded.sessionId);

    return sendTokenResponse(user, roles, identities, newSessionId, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
