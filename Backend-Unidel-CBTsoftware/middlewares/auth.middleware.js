import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Lecturer from "../models/lecturer.model.js";
import Student from "../models/student.model.js";
import Agent from "../models/agent.model.js";
import Sentry from "../config/sentry.config.js";

// Helper to get user model based on role
const getUserModel = (role) => {
  const models = {
    admin: Admin,
    lecturer: Lecturer,
    student: Student,
    agent: Agent,
    superadmin: Admin,
  };
  return models[role];
};

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // New Access Token Cookie
  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  // Check for token in Authorization header
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Legacy Check: Also accept token from httpOnly cookie (including role-specific ones)
  if (!token && req.cookies) {
    token =
      req.cookies.token_admin ||
      req.cookies.token_student ||
      req.cookies.token_lecturer ||
      req.cookies.token_agent ||
      req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize payload
    let userId =
      decoded.userId ||
      decoded.id ||
      decoded._id ||
      (decoded.user && decoded.user.userId);

    // Determine Role
    // 1. Check X-Active-Role header first
    const headerRole = req.headers["x-active-role"];
    let activeRole = null;

    if (decoded.roles && Array.isArray(decoded.roles)) {
      // New Token Format
      if (headerRole && decoded.roles.includes(headerRole)) {
        activeRole = headerRole;
      } else {
        // Default to first role if header missing or invalid
        activeRole = decoded.roles[0];
      }
    } else {
      // Legacy Token Format
      activeRole =
        decoded.role || decoded.roleName || (decoded.user && decoded.user.role);
    }

    if (!userId || !activeRole) {
      console.error("Invalid token payload:", decoded);
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Resolve User ID for the specific role
    let targetUserId = userId;
    if (decoded.identities && decoded.identities[activeRole]) {
      targetUserId = decoded.identities[activeRole];
    }

    const Model = getUserModel(activeRole);
    if (!Model) {
      console.error("No model found for role from token:", activeRole);
      return res.status(401).json({
        success: false,
        message: "Invalid user role in token",
      });
    }

    const user = await Model.findById(targetUserId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = {
      _id: user._id,
      userId: user._id,
      id: user._id,
      role: activeRole, // The active role for this request
      roles: decoded.roles || [activeRole], // All available roles
      email: user.email,
      fullname: user.fullname,
      sessionId: decoded.sessionId, // Track session ID if available
    };

    // Set Sentry User Context
    if (Sentry && typeof Sentry.configureScope === "function") {
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: user._id,
          email: user.email,
          role: activeRole,
        });
      });
    } else {
      // Fallback or specific new SDK method if needed
      // console.warn("Sentry.configureScope not available");
    }

    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token expired"
        : "Not authorized to access this route";
    if (error.name !== "TokenExpiredError")
      console.error("Auth protect error:", error);

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

// Optional protect - attach user if token exists, but don't error if not
export const optionalProtect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies) {
    token =
      req.cookies.token_admin ||
      req.cookies.token_student ||
      req.cookies.token_lecturer ||
      req.cookies.token_agent ||
      req.cookies.token;
  }

  if (!token || token === "null" || token === "undefined") {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let userId =
      decoded.userId ||
      decoded.id ||
      decoded._id ||
      (decoded.user && decoded.user.userId);
    let activeRole = null;
    const headerRole = req.headers["x-active-role"];

    if (decoded.roles && Array.isArray(decoded.roles)) {
      if (headerRole && decoded.roles.includes(headerRole)) {
        activeRole = headerRole;
      } else {
        activeRole = decoded.roles[0];
      }
    } else {
      activeRole =
        decoded.role || decoded.roleName || (decoded.user && decoded.user.role);
    }

    if (userId && activeRole) {
      const Model = getUserModel(activeRole);
      if (Model) {
        let targetUserId = userId;
        if (decoded.identities && decoded.identities[activeRole]) {
          targetUserId = decoded.identities[activeRole];
        }

        const user = await Model.findById(targetUserId).select("-password");
        if (user) {
          req.user = {
            _id: user._id,
            userId: user._id,
            id: user._id,
            role: activeRole,
            roles: decoded.roles || [activeRole],
            email: user.email,
            fullname: user.fullname,
            sessionId: decoded.sessionId,
          };

          // Set Sentry User Context
          if (Sentry && typeof Sentry.configureScope === "function") {
            Sentry.configureScope((scope) => {
              scope.setUser({
                id: user._id,
                email: user.email,
                role: activeRole,
              });
            });
          }
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Superadmin has access to everything by default
    if (req.user && req.user.role === "superadmin") {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : "ghost"}' is not authorized to access this route`,
      });
    }
    next();
  };
};
