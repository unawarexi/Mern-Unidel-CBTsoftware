import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Lecturer from "../models/lecturer.model.js";
import Student from "../models/student.model.js";

// Helper to get user model based on role
const getUserModel = (role) => {
  const models = { admin: Admin, lecturer: Lecturer, student: Student, superadmin: Admin };
  return models[role];
};

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Also accept token from httpOnly cookie (if set)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
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

    // support different token payload shapes
    const userId = decoded.userId || decoded.id || decoded._id || (decoded.user && decoded.user.userId);
    const role = decoded.role || decoded.roleName || (decoded.user && decoded.user.role);

    if (!userId || !role) {
      console.error("Invalid token payload:", decoded);
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Get user from token
    const Model = getUserModel(role);
    if (!Model) {
      console.error("No model found for role from token:", role);
      return res.status(401).json({
        success: false,
        message: "Invalid user role in token",
      });
    }

    const user = await Model.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object (provide multiple id shapes for compatibility)
    req.user = {
      _id: user._id,
      userId: user._id,
      id: user._id,
      role: user.role,
      email: user.email,
      fullname: user.fullname,
    };

    next();
  } catch (error) {
    console.error("Auth protect error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
