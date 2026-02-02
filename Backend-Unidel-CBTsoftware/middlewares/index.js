/**
 * Middlewares Index
 * Barrel export for all middlewares
 */

// Authentication
export { protect, authorize } from './auth.middleware.js';

// Rate Limiting
export {
  createRateLimiter,
  apiLimiter,
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  examSubmitLimiter,
  uploadLimiter,
  redisRateLimiter,
} from './rate-limiter.middleware.js';

// Error Handling
export {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  internalError,
  notFoundHandler,
  globalErrorHandler,
} from './error-handler.middleware.js';

// Request Logging
export {
  requestId,
  requestLogger,
  responseTime,
} from './request-logger.middleware.js';

// Validation
export {
  validateBody,
  validateQuery,
  validateParams,
  validateObjectId,
} from './validation.middleware.js';

// Security
export {
  securityHeaders,
  corsConfig,
  configureTrustProxy,
  xssProtection,
  noCache,
} from './security.middleware.js';
