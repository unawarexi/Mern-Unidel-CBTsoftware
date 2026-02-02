import rateLimit from "express-rate-limit";

// Helper to extract real IP
function getClientIP(req) {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    return xForwardedFor.split(",")[0].trim(); // First IP in the list
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.connection?.socket?.remoteAddress || "unknown";
}

// Global rate limiter: 100 requests / 15 min
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit per IP
  message: {
    success: false,
    message: "Too many requests, please slow down.",
  },
  keyGenerator: (req) => getClientIP(req), // use real IP as key
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for sensitive endpoints (auth, submissions)
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
  },
  keyGenerator: (req) => getClientIP(req),
});

export default globalRateLimiter;
