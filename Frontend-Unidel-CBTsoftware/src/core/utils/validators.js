/**
 * Form Validators
 * Reusable validation patterns and schemas
 */
import * as z from "zod";

// ============ PATTERNS ============
export const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+?234|0)[789][01]\d{8}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  matricNumber: /^[A-Z]{2,10}\/\d{4}\/\d{3,6}$/i,
  employeeId: /^[A-Z]{2,5}\d{4,8}$/i,
  courseCode: /^[A-Z]{2,4}\s?\d{3,4}$/i,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
};

// ============ VALIDATION MESSAGES ============
export const MESSAGES = {
  required: (field) => `${field} is required`,
  email: "Please enter a valid email address",
  phone: "Please enter a valid Nigerian phone number",
  password:
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} must be at most ${max} characters`,
  min: (field, min) => `${field} must be at least ${min}`,
  max: (field, max) => `${field} must be at most ${max}`,
  matricNumber: "Please enter a valid matric number (e.g., CSC/2020/001)",
  employeeId: "Please enter a valid employee ID (e.g., EMP12345)",
  courseCode: "Please enter a valid course code (e.g., CSC 101)",
  url: "Please enter a valid URL",
  match: (field) => `${field}s do not match`,
  date: {
    future: "Date must be in the future",
    past: "Date must be in the past",
    range: "Date must be within the valid range",
  },
};

// ============ ZOD SCHEMAS ============
export const schemas = {
  // Basic field schemas
  email: z.string().email(MESSAGES.email),
  password: z.string().min(8, MESSAGES.minLength("Password", 8)),
  strongPassword: z
    .string()
    .min(8, MESSAGES.minLength("Password", 8))
    .regex(PATTERNS.password, MESSAGES.password),
  phone: z.string().regex(PATTERNS.phone, MESSAGES.phone),
  matricNumber: z.string().regex(PATTERNS.matricNumber, MESSAGES.matricNumber),
  employeeId: z.string().regex(PATTERNS.employeeId, MESSAGES.employeeId),
  courseCode: z.string().regex(PATTERNS.courseCode, MESSAGES.courseCode),
  url: z.string().url(MESSAGES.url).or(z.literal("")),

  // Common field schemas
  name: z
    .string()
    .min(2, MESSAGES.minLength("Name", 2))
    .max(100, MESSAGES.maxLength("Name", 100)),
  title: z
    .string()
    .min(3, MESSAGES.minLength("Title", 3))
    .max(200, MESSAGES.maxLength("Title", 200)),
  description: z
    .string()
    .max(1000, MESSAGES.maxLength("Description", 1000))
    .optional(),

  // ID schemas
  mongoId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID format"),
  uuid: z.string().uuid("Invalid UUID format"),
};

// ============ COMMON FORM SCHEMAS ============
export const formSchemas = {
  // Student sign-in
  studentSignIn: z.object({
    studentId: z.string().min(5, MESSAGES.minLength("Student ID", 5)),
    email: schemas.email,
    password: z.string().min(8, MESSAGES.minLength("Password", 8)),
  }),

  // Admin sign-in
  adminSignIn: z.object({
    email: schemas.email,
    password: z.string().min(8, MESSAGES.minLength("Password", 8)),
  }),

  // Lecturer sign-in
  lecturerSignIn: z.object({
    employeeId: z.string().min(3, MESSAGES.minLength("Employee ID", 3)),
    email: schemas.email,
    password: z.string().min(8, MESSAGES.minLength("Password", 8)),
  }),

  // Password reset
  passwordReset: z.object({
    email: schemas.email,
  }),

  // Change password
  changePassword: z
    .object({
      currentPassword: z.string().min(1, MESSAGES.required("Current password")),
      newPassword: schemas.strongPassword,
      confirmPassword: z.string().min(1, MESSAGES.required("Confirm password")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: MESSAGES.match("Password"),
      path: ["confirmPassword"],
    }),

  // Create course
  createCourse: z.object({
    courseCode: schemas.courseCode,
    courseName: schemas.title,
    departmentId: schemas.mongoId,
    creditUnits: z.number().min(1).max(6),
    description: schemas.description,
  }),

  // Create exam
  createExam: z.object({
    title: schemas.title,
    courseId: schemas.mongoId,
    duration: z
      .number()
      .min(5, MESSAGES.min("Duration", 5))
      .max(300, MESSAGES.max("Duration", 300)),
    startDate: z.date(),
    endDate: z.date(),
    totalMarks: z.number().min(1).max(100),
    passingMarks: z.number().min(0).max(100),
  }),
};

// ============ VALIDATION HELPERS ============

/**
 * Validate a single field
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {any} value - Value to validate
 * @returns {{ success: boolean, error?: string }}
 */
export const validateField = (schema, value) => {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true };
  }
  return { success: false, error: result.error.errors[0]?.message };
};

/**
 * Validate entire form data
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {object} data - Form data object
 * @returns {{ success: boolean, errors?: object, data?: object }}
 */
export const validateForm = (schema, data) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return { success: false, errors };
};

/**
 * Check if email is valid
 */
export const isValidEmail = (email) => PATTERNS.email.test(email);

/**
 * Check if phone is valid Nigerian number
 */
export const isValidPhone = (phone) => PATTERNS.phone.test(phone);

/**
 * Check password strength
 * @returns {{ score: number, feedback: string[] }}
 */
export const checkPasswordStrength = (password) => {
  const feedback = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password)) score++;
  else feedback.push("One lowercase letter");

  if (/[A-Z]/.test(password)) score++;
  else feedback.push("One uppercase letter");

  if (/\d/.test(password)) score++;
  else feedback.push("One number");

  if (/[@$!%*?&]/.test(password)) score++;
  else feedback.push("One special character (@$!%*?&)");

  return { score, feedback };
};

export default {
  PATTERNS,
  MESSAGES,
  schemas,
  formSchemas,
  validateField,
  validateForm,
  isValidEmail,
  isValidPhone,
  checkPasswordStrength,
};
