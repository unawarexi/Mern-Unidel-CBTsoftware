import Sentry from "../config/sentry.config.js";

/**
 * Sentry User Context Middleware
 * Attaches authenticated user information to the Sentry scope
 */
export const sentryUserContext = (req, res, next) => {
  if (req.user) {
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: req.user._id || req.user.id,
        email: req.user.email,
        role: req.user.role,
      });
    });
  }
  next();
};
