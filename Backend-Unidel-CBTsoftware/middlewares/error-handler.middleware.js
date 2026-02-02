/**
 * Error Handler Middleware
 * Centralized error handling with custom AppError class
 */
import { HttpStatus, ErrorCodes } from '../config/constants.js';
import { isDevelopment } from '../config/env.config.js';

// ============================================================================
// CUSTOM ERROR CLASS
// ============================================================================

/**
 * Application Error Class
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {string} [code] - Internal error code
   * @param {any} [details] - Additional error details
   */
  constructor(message, statusCode = 500, code = ErrorCodes.INTERNAL_ERROR, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================================================
// ERROR FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a Bad Request error
 * @param {string} message
 * @param {any} [details]
 * @returns {AppError}
 */
export function badRequest(message, details) {
  return new AppError(message, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, details);
}

/**
 * Create an Unauthorized error
 * @param {string} [message]
 * @returns {AppError}
 */
export function unauthorized(message = 'Unauthorized') {
  return new AppError(message, HttpStatus.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED);
}

/**
 * Create a Forbidden error
 * @param {string} [message]
 * @returns {AppError}
 */
export function forbidden(message = 'Forbidden') {
  return new AppError(message, HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN);
}

/**
 * Create a Not Found error
 * @param {string} [resource='Resource']
 * @returns {AppError}
 */
export function notFound(resource = 'Resource') {
  return new AppError(`${resource} not found`, HttpStatus.NOT_FOUND, ErrorCodes.USER_NOT_FOUND);
}

/**
 * Create a Conflict error
 * @param {string} message
 * @returns {AppError}
 */
export function conflict(message) {
  return new AppError(message, HttpStatus.CONFLICT, ErrorCodes.USER_ALREADY_EXISTS);
}

/**
 * Create an Internal Server error
 * @param {string} [message]
 * @returns {AppError}
 */
export function internalError(message = 'Internal server error') {
  return new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCodes.INTERNAL_ERROR);
}

// ============================================================================
// ERROR HANDLER MIDDLEWARE
// ============================================================================

/**
 * Not Found Handler - 404 for unmatched routes
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl}`, HttpStatus.NOT_FOUND));
}

/**
 * Global Error Handler
 * @param {Error | AppError} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function globalErrorHandler(err, req, res, next) {
  // Default values
  let statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  let status = err.status || 'error';
  let message = err.message || 'Something went wrong';
  let code = err.code || ErrorCodes.INTERNAL_ERROR;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = HttpStatus.BAD_REQUEST;
    code = ErrorCodes.VALIDATION_ERROR;
    message = Object.values(err.errors || {}).map(e => e.message).join(', ') || message;
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ID)
    statusCode = HttpStatus.BAD_REQUEST;
    code = ErrorCodes.INVALID_INPUT;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = HttpStatus.CONFLICT;
    code = ErrorCodes.USER_ALREADY_EXISTS;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Value'} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    code = ErrorCodes.TOKEN_INVALID;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    code = ErrorCodes.TOKEN_EXPIRED;
    message = 'Your token has expired. Please log in again.';
  }

  // Log error
  if (statusCode >= 500) {
    console.error('[Error]', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  // Response structure
  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };

  // Add details in development
  if (isDevelopment()) {
    response.error.stack = err.stack;
    if (err.details) {
      response.error.details = err.details;
    }
  }

  res.status(statusCode).json(response);
}

export default {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  internalError,
  notFoundHandler,
  globalErrorHandler,
};
