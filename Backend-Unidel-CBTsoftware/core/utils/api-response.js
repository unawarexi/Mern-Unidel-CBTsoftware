/**
 * API Response Helpers
 * Standardized response utilities
 */
import { HttpStatus } from '../../config/constants.js';

// ============================================================================
// SUCCESS RESPONSES
// ============================================================================

/**
 * Send success response
 * @param {import('express').Response} res
 * @param {any} data
 * @param {string} [message='Success']
 * @param {number} [statusCode=200]
 */
export function success(res, data, message = 'Success', statusCode = HttpStatus.OK) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send created response
 * @param {import('express').Response} res
 * @param {any} data
 * @param {string} [message='Created successfully']
 */
export function created(res, data, message = 'Created successfully') {
  success(res, data, message, HttpStatus.CREATED);
}

/**
 * Send no content response
 * @param {import('express').Response} res
 */
export function noContent(res) {
  res.status(HttpStatus.NO_CONTENT).send();
}

// ============================================================================
// PAGINATED RESPONSE
// ============================================================================

/**
 * Send paginated response
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {any[]} options.data - Items
 * @param {number} options.page - Current page
 * @param {number} options.limit - Items per page
 * @param {number} options.total - Total items
 * @param {string} [options.message='Success']
 */
export function paginated(res, { data, page, limit, total, message = 'Success' }) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(HttpStatus.OK).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

/**
 * Send error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 * @param {string} [code]
 * @param {any} [details]
 */
export function error(res, message, statusCode = HttpStatus.INTERNAL_SERVER_ERROR, code, details) {
  const response = {
    success: false,
    error: {
      message,
    },
  };

  if (code) {
    response.error.code = code;
  }

  if (details) {
    response.error.details = details;
  }

  res.status(statusCode).json(response);
}

/**
 * Send bad request response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {any} [details]
 */
export function badRequest(res, message, details) {
  error(res, message, HttpStatus.BAD_REQUEST, 'E2001', details);
}

/**
 * Send unauthorized response
 * @param {import('express').Response} res
 * @param {string} [message='Unauthorized']
 */
export function unauthorized(res, message = 'Unauthorized') {
  error(res, message, HttpStatus.UNAUTHORIZED, 'E1004');
}

/**
 * Send forbidden response
 * @param {import('express').Response} res
 * @param {string} [message='Forbidden']
 */
export function forbidden(res, message = 'Forbidden') {
  error(res, message, HttpStatus.FORBIDDEN, 'E1005');
}

/**
 * Send not found response
 * @param {import('express').Response} res
 * @param {string} [resource='Resource']
 */
export function notFound(res, resource = 'Resource') {
  error(res, `${resource} not found`, HttpStatus.NOT_FOUND, 'E3001');
}

/**
 * Send conflict response
 * @param {import('express').Response} res
 * @param {string} message
 */
export function conflict(res, message) {
  error(res, message, HttpStatus.CONFLICT, 'E3002');
}

/**
 * Send server error response
 * @param {import('express').Response} res
 * @param {string} [message='Internal server error']
 */
export function serverError(res, message = 'Internal server error') {
  error(res, message, HttpStatus.INTERNAL_SERVER_ERROR, 'E9001');
}

export default {
  success,
  created,
  noContent,
  paginated,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
};
