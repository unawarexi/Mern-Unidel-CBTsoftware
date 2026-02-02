/**
 * Application Constants
 * Centralized constants for the CBT platform
 */

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const HttpStatus = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// ============================================================================
// ERROR CODES
// ============================================================================

export const ErrorCodes = {
  // Authentication (1xxx)
  INVALID_CREDENTIALS: 'E1001',
  TOKEN_EXPIRED: 'E1002',
  TOKEN_INVALID: 'E1003',
  UNAUTHORIZED: 'E1004',
  FORBIDDEN: 'E1005',
  ACCOUNT_LOCKED: 'E1006',
  ACCOUNT_SUSPENDED: 'E1007',
  EMAIL_NOT_VERIFIED: 'E1008',
  SESSION_EXPIRED: 'E1009',
  
  // Validation (2xxx)
  VALIDATION_ERROR: 'E2001',
  INVALID_INPUT: 'E2002',
  MISSING_REQUIRED_FIELD: 'E2003',
  INVALID_FORMAT: 'E2004',
  
  // User (3xxx)
  USER_NOT_FOUND: 'E3001',
  USER_ALREADY_EXISTS: 'E3002',
  EMAIL_ALREADY_EXISTS: 'E3003',
  STUDENT_NOT_FOUND: 'E3004',
  LECTURER_NOT_FOUND: 'E3005',
  
  // Exam (4xxx)
  EXAM_NOT_FOUND: 'E4001',
  EXAM_NOT_ACTIVE: 'E4002',
  EXAM_ALREADY_SUBMITTED: 'E4003',
  EXAM_TIME_EXPIRED: 'E4004',
  EXAM_NOT_STARTED: 'E4005',
  EXAM_ALREADY_STARTED: 'E4006',
  
  // Course (5xxx)
  COURSE_NOT_FOUND: 'E5001',
  COURSE_ALREADY_EXISTS: 'E5002',
  NOT_ENROLLED: 'E5003',
  
  // Department (6xxx)
  DEPARTMENT_NOT_FOUND: 'E6001',
  DEPARTMENT_ALREADY_EXISTS: 'E6002',
  
  // Submission (7xxx)
  SUBMISSION_NOT_FOUND: 'E7001',
  SUBMISSION_ALREADY_EXISTS: 'E7002',
  
  // Security (8xxx)
  RATE_LIMIT_EXCEEDED: 'E8001',
  SUSPICIOUS_ACTIVITY: 'E8002',
  IP_BLOCKED: 'E8003',
  
  // Server (9xxx)
  INTERNAL_ERROR: 'E9001',
  DATABASE_ERROR: 'E9002',
  EXTERNAL_SERVICE_ERROR: 'E9003',
  SERVICE_UNAVAILABLE: 'E9004',
};

// ============================================================================
// RATE LIMITING
// ============================================================================

export const RateLimits = {
  // General API
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },
  
  // Authentication endpoints
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
  },
  
  // Login attempts
  LOGIN: {
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 5,
  },
  
  // Password reset
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
  },
  
  // Exam submission
  EXAM_SUBMIT: {
    windowMs: 60 * 1000, // 1 minute
    max: 10,
  },
  
  // File upload
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50,
  },
};

// ============================================================================
// CACHE TTL (in seconds)
// ============================================================================

export const CacheTTL = {
  USER_PROFILE: 300,        // 5 minutes
  SESSION: 86400,           // 24 hours
  EXAM: 300,                // 5 minutes
  COURSE: 600,              // 10 minutes
  DEPARTMENT: 1800,         // 30 minutes
  STATISTICS: 60,           // 1 minute
  RATE_LIMIT: 900,          // 15 minutes
  LOGIN_ATTEMPTS: 1800,     // 30 minutes
  PASSWORD_RESET: 3600,     // 1 hour
  EMAIL_VERIFICATION: 86400, // 24 hours
};

// ============================================================================
// PAGINATION
// ============================================================================

export const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// ============================================================================
// USER ROLES
// ============================================================================

export const UserRoles = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  LECTURER: 'lecturer',
  STUDENT: 'student',
};

// ============================================================================
// EXAM STATUS
// ============================================================================

export const ExamStatus = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// ============================================================================
// SUBMISSION STATUS
// ============================================================================

export const SubmissionStatus = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
};

// ============================================================================
// FILE UPLOAD
// ============================================================================

export const FileUpload = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
};

// ============================================================================
// REGEX PATTERNS
// ============================================================================

export const Patterns = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  MONGO_ID: /^[a-fA-F0-9]{24}$/,
};

// ============================================================================
// REQUEST HEADERS
// ============================================================================

export const Headers = {
  REQUEST_ID: 'x-request-id',
  CORRELATION_ID: 'x-correlation-id',
  CLIENT_IP: 'x-forwarded-for',
  USER_AGENT: 'user-agent',
};

export default {
  HttpStatus,
  ErrorCodes,
  RateLimits,
  CacheTTL,
  Pagination,
  UserRoles,
  ExamStatus,
  SubmissionStatus,
  FileUpload,
  Patterns,
  Headers,
};
