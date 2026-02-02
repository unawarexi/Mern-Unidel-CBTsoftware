/**
 * Request Logger Middleware
 * Structured logging with request ID and timing
 */
import { v4 as uuidv4 } from 'uuid';
import { Headers } from '../config/constants.js';

// ============================================================================
// REQUEST ID MIDDLEWARE
// ============================================================================

/**
 * Add request ID to each request
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestId(req, res, next) {
  const existingId = req.headers[Headers.REQUEST_ID];
  req.requestId = existingId || uuidv4();
  res.set(Headers.REQUEST_ID, req.requestId);
  next();
}

// ============================================================================
// REQUEST LOGGER MIDDLEWARE
// ============================================================================

/**
 * Log incoming requests with timing
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Log request start
  const logData = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent'],
  };

  // Add user info if authenticated
  if (req.user) {
    logData.userId = req.user.id || req.user._id;
    logData.userRole = req.user.role;
  }

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    const responseLog = {
      ...logData,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Only log non-health check requests
    if (!req.originalUrl.includes('/health')) {
      console[logLevel](`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });

  next();
}

// ============================================================================
// RESPONSE TIME HEADER
// ============================================================================

/**
 * Add response time header
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function responseTime(req, res, next) {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    res.set('X-Response-Time', `${duration}ms`);
  });

  next();
}

export default {
  requestId,
  requestLogger,
  responseTime,
};
