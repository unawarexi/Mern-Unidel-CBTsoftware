/**
 * Async Handler
 * Wraps async route handlers to catch errors
 */

/**
 * Wrap async route handler to catch errors
 * @param {Function} fn - Async route handler
 * @returns {import('express').RequestHandler}
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Alias for asyncHandler
 */
export const catchAsync = asyncHandler;

/**
 * Wrap multiple handlers
 * @param  {...Function} handlers
 * @returns {import('express').RequestHandler[]}
 */
export function asyncHandlers(...handlers) {
  return handlers.map(handler => asyncHandler(handler));
}

export default asyncHandler;
