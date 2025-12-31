import jwt from "jsonwebtoken";

// Generate JWT Token
export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Generate Admin ID: ADM000001
export const generateAdminId = (count) => {
  return `ADM${String(count).padStart(6, "0")}`;
};

// Generate Employee ID: EMP000001
export const generateEmployeeId = (count) => {
  return `EMP${String(count).padStart(6, "0")}`;
};

// Generate Matriculation Number: MAT000001
export const generateMatricNumber = (count) => {
  return `MAT${String(count).padStart(6, "0")}`;
};

// Generate Lecturer ID: LEC000001
export const generateLecturerId = (count) => {
  return `LEC${String(count).padStart(6, "0")}`;
};

// Generate Department ID: DEPT000001
export const generateDepartmentId = (count) => {
  return `DEPT${String(count).padStart(6, "0")}`;
};

// Generate Department Code: DPT001, DPT002, etc.
export const generateDepartmentCode = (count) => {
  return `DPT${String(count).padStart(3, "0")}`;
};
