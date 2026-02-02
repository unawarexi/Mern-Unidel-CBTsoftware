/**
 * Rate Limiter Middleware
 * Production-grade rate limiting with Redis support
 */
import rateLimit from 'express-rate-limit';
import { RateLimits, HttpStatus, ErrorCodes } from '../config/constants.js';
import { checkRateLimit, isRedisConnected } from '../services/redis.service.js';

// ============================================================================
// RATE LIMITER FACTORY
// ============================================================================

/**
 * Create rate limiter middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Max requests per window
 * @param {string} [options.message] - Error message
 * @returns {import('express').RequestHandler}
 */
export function createRateLimiter(options) {
  const { windowMs, max, message } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        message: message || 'Too many requests, please try again later.',
      },
    },
    skip: (req) => {
      // Skip rate limiting in test environment
      return process.env.NODE_ENV === 'test';
    },
    validate: {
      // Disable the IPv6 key generator validation since we use default keyGenerator
      xForwardedForHeader: false,
    },
    handler: (req, res) => {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          code: ErrorCodes.RATE_LIMIT_EXCEEDED,
          message: message || 'Too many requests, please try again later.',
        },
      });
    },
  });
}

// ============================================================================
// PRESET RATE LIMITERS
// ============================================================================

/**
 * General API rate limiter
 */
export const apiLimiter = createRateLimiter({
  ...RateLimits.API,
  keyPrefix: 'api',
  message: 'Too many API requests, please try again later.',
});

/**
 * Authentication rate limiter (stricter)
 */
export const authLimiter = createRateLimiter({
  ...RateLimits.AUTH,
  keyPrefix: 'auth',
  message: 'Too many authentication attempts, please try again later.',
});

/**
 * Login rate limiter (very strict)
 */
export const loginLimiter = createRateLimiter({
  ...RateLimits.LOGIN,
  keyPrefix: 'login',
  message: 'Too many login attempts. Your account may be temporarily locked.',
});

/**
 * Password reset rate limiter
 */
export const passwordResetLimiter = createRateLimiter({
  ...RateLimits.PASSWORD_RESET,
  keyPrefix: 'password-reset',
  message: 'Too many password reset requests. Please try again later.',
});

/**
 * Exam submission rate limiter
 */
export const examSubmitLimiter = createRateLimiter({
  ...RateLimits.EXAM_SUBMIT,
  keyPrefix: 'exam-submit',
  message: 'Too many submission attempts. Please wait before resubmitting.',
});

/**
 * File upload rate limiter
 */
export const uploadLimiter = createRateLimiter({
  ...RateLimits.UPLOAD,
  keyPrefix: 'upload',
  message: 'Too many file uploads. Please try again later.',
});

// ============================================================================
// REDIS-BACKED RATE LIMITER (Custom)
// ============================================================================

/**
 * Custom Redis-backed rate limiter for specific endpoints
 * @param {Object} options
 * @param {number} options.limit - Max requests
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {string} options.keyPrefix - Key prefix
 * @returns {import('express').RequestHandler}
 */
export function redisRateLimiter(options) {
  const { limit, windowMs, keyPrefix } = options;

  return async (req, res, next) => {
    // Skip if Redis not connected
    if (!isRedisConnected()) {
      return next();
    }

    try {
      const userId = req.user?.id || req.user?._id;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const identifier = `${keyPrefix}:${userId || ip}`;

      const result = await checkRateLimit(identifier, limit, windowMs);

      // Set rate limit headers
      res.set('X-RateLimit-Limit', String(limit));
      res.set('X-RateLimit-Remaining', String(result.remaining));
      res.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

      if (!result.allowed) {
        res.set('Retry-After', String(result.retryAfter || 60));
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          success: false,
          error: {
            code: ErrorCodes.RATE_LIMIT_EXCEEDED,
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.retryAfter,
          },
        });
      }

      next();
    } catch (error) {
      console.error('[RateLimiter] Error:', error);
      // Allow request on error (fail open)
      next();
    }
  };
}

export default {
  createRateLimiter,
  apiLimiter,
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  examSubmitLimiter,
  uploadLimiter,
  redisRateLimiter,
};
