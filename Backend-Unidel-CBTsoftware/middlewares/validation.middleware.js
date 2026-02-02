/**
 * Validation Middleware
 * Zod schema validation wrapper
 */
import { HttpStatus, ErrorCodes } from '../config/constants.js';

// ============================================================================
// ZOD VALIDATION MIDDLEWARE
// ============================================================================

/**
 * Validate request body with Zod schema
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req.body);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Validation failed',
            details: errors,
          },
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      console.error('[Validation] Error:', error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Validation error',
        },
      });
    }
  };
}

/**
 * Validate request query with Zod schema
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
export function validateQuery(schema) {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req.query);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Invalid query parameters',
            details: errors,
          },
        });
      }

      req.query = result.data;
      next();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Query validation error',
        },
      });
    }
  };
}

/**
 * Validate request params with Zod schema
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
export function validateParams(schema) {
  return async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req.params);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: 'Invalid path parameters',
            details: errors,
          },
        });
      }

      req.params = result.data;
      next();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Params validation error',
        },
      });
    }
  };
}

/**
 * Validate MongoDB ObjectId
 * @param {string} paramName - Parameter name to validate
 * @returns {import('express').RequestHandler}
 */
export function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;

    if (!id || !objectIdRegex.test(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: ErrorCodes.INVALID_INPUT,
          message: `Invalid ${paramName} format`,
        },
      });
    }

    next();
  };
}

export default {
  validateBody,
  validateQuery,
  validateParams,
  validateObjectId,
};
