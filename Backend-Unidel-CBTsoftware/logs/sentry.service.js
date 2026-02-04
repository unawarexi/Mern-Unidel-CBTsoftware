import Sentry from "../config/sentry.config.js";

/**
 * Capture an exception in Sentry
 * @param {Error} error - The error object
 * @param {Object} [context] - Additional context to attach
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Capture a message in Sentry
 * @param {string} message - The message to capture
 * @param {string} [level='info'] - Log level (info, warning, error, fatal, debug)
 */
export const captureMessage = (message, level = "info") => {
  Sentry.captureMessage(message, level);
};

export default {
  captureException,
  captureMessage,
};
