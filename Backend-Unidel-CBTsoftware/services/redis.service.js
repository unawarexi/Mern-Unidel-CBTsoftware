/**
 * Redis Service - Production-ready caching and session management
 * Converted from TypeScript to JavaScript
 */
import { createClient } from "redis";

// ============================================================================
// REDIS CLIENT SINGLETON
// ============================================================================

/** @type {import('redis').RedisClientType | null} */
let redisClient = null;
let isConnected = false;
/** @type {Promise<void> | null} */
let connectionPromise = null;

/**
 * Initialize and get Redis client
 * @returns {Promise<import('redis').RedisClientType>}
 */
export async function getRedisClient() {
  if (redisClient && isConnected) {
    return redisClient;
  }

  if (connectionPromise) {
    await connectionPromise;
    return redisClient;
  }

  connectionPromise = initializeRedis();
  await connectionPromise;
  return redisClient;
}

/**
 * Initialize Redis connection
 * @returns {Promise<void>}
 */
async function initializeRedis() {
  try {
    const redisHost = process.env.REDIS_HOST || "localhost";
    const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);
    const redisPassword = process.env.REDIS_PASSWORD || "";

    redisClient = createClient({
      username: "default",
      password: redisPassword,
      socket: {
        host: redisHost,
        port: redisPort,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error("[Redis] Max reconnection attempts reached");
            return new Error("Max reconnection attempts reached");
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on("error", (err) => {
      console.error("[Redis] Client Error:", err.message);
      isConnected = false;
    });

    redisClient.on("connect", () => {
      console.log("[Redis] ✅ Connected to Redis");
      isConnected = true;
    });

    redisClient.on("reconnecting", () => {
      console.log("[Redis] 🔄 Reconnecting...");
    });

    redisClient.on("end", () => {
      console.log("[Redis] Connection closed");
      isConnected = false;
    });

    await redisClient.connect();
    isConnected = true;
    console.log("[Redis] ✅ Redis connection established");
  } catch (error) {
    console.error("[Redis] Failed to connect:", error);
    isConnected = false;
    // Don't throw - allow app to work without Redis in development
    console.warn("[Redis] Application will continue without Redis caching");
  }
}

/**
 * Graceful shutdown
 * @returns {Promise<void>}
 */
export async function disconnectRedis() {
  if (redisClient && isConnected) {
    await redisClient.quit();
    isConnected = false;
    redisClient = null;
    connectionPromise = null;
    console.log("[Redis] Disconnected");
  }
}

/**
 * Check if Redis is connected
 * @returns {boolean}
 */
export function isRedisConnected() {
  return isConnected;
}

// ============================================================================
// CACHE KEYS - Centralized key management
// ============================================================================

export const CACHE_KEYS = {
  // User related
  USER_PROFILE: (userId) => `cbt:user:profile:${userId}`,
  USER_SESSION: (userId, sessionId) => `cbt:session:${userId}:${sessionId}`,
  USER_SESSIONS_LIST: (userId) => `cbt:user:sessions:${userId}`,

  // Exam related
  EXAM: (examId) => `cbt:exam:${examId}`,
  EXAM_QUESTIONS: (examId) => `cbt:exam:questions:${examId}`,
  EXAM_SUBMISSIONS: (examId) => `cbt:exam:submissions:${examId}`,
  USER_EXAM_PROGRESS: (userId, examId) => `cbt:user:exam:${userId}:${examId}`,

  // Course related
  COURSE: (courseId) => `cbt:course:${courseId}`,
  COURSE_EXAMS: (courseId) => `cbt:course:exams:${courseId}`,

  // Rate limiting
  RATE_LIMIT: (identifier) => `cbt:ratelimit:${identifier}`,
  LOGIN_ATTEMPTS: (email) => `cbt:login:attempts:${email}`,

  // Statistics
  ADMIN_STATS: () => `cbt:admin:stats`,
  USER_STATS: (userId) => `cbt:user:stats:${userId}`,

  // Security
  BLOCKED_IPS: () => `cbt:security:blocked_ips`,
  PASSWORD_RESET: (token) => `cbt:verify:password:${token}`,
  EMAIL_VERIFICATION: (token) => `cbt:verify:email:${token}`,
};

// ============================================================================
// TTL CONSTANTS (in seconds)
// ============================================================================

export const CACHE_TTL = {
  USER_PROFILE: 300, // 5 minutes
  SESSION: 86400, // 24 hours
  EXAM: 300, // 5 minutes
  COURSE: 600, // 10 minutes
  RATE_LIMIT: 900, // 15 minutes
  LOGIN_ATTEMPTS: 1800, // 30 minutes
  ADMIN_STATS: 300, // 5 minutes
  PASSWORD_RESET: 3600, // 1 hour
  EMAIL_VERIFICATION: 86400, // 24 hours
};

// ============================================================================
// CORE CACHE OPERATIONS
// ============================================================================

/**
 * Get cached value
 * @template T
 * @param {string} key
 * @returns {Promise<T | null>}
 */
export async function cacheGet(key) {
  try {
    if (!isConnected) return null;
    const client = await getRedisClient();
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value);
  } catch (error) {
    console.error(`[Redis] Cache get error for ${key}:`, error);
    return null;
  }
}

/**
 * Set cached value with TTL
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds
 * @returns {Promise<boolean>}
 */
export async function cacheSet(key, value, ttlSeconds) {
  try {
    if (!isConnected) return false;
    const client = await getRedisClient();
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Redis] Cache set error for ${key}:`, error);
    return false;
  }
}

/**
 * Delete cached value
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function cacheDelete(key) {
  try {
    if (!isConnected) return false;
    const client = await getRedisClient();
    await client.del(key);
    return true;
  } catch (error) {
    console.error(`[Redis] Cache delete error for ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple keys by pattern
 * @param {string} pattern
 * @returns {Promise<number>}
 */
export async function cacheDeletePattern(pattern) {
  try {
    if (!isConnected) return 0;
    const client = await getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;
    return await client.del(keys);
  } catch (error) {
    console.error(`[Redis] Cache delete pattern error for ${pattern}:`, error);
    return 0;
  }
}

/**
 * Get or set cached value (cache-aside pattern)
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} fetchFn
 * @param {number} ttlSeconds
 * @returns {Promise<T>}
 */
export async function cacheGetOrSet(key, fetchFn, ttlSeconds) {
  const cached = await cacheGet(key);
  if (cached !== null) {
    return cached;
  }

  const freshData = await fetchFn();
  await cacheSet(key, freshData, ttlSeconds);
  return freshData;
}

/**
 * Check if key exists
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function cacheExists(key) {
  try {
    if (!isConnected) return false;
    const client = await getRedisClient();
    return (await client.exists(key)) === 1;
  } catch (error) {
    console.error(`[Redis] Cache exists error for ${key}:`, error);
    return false;
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Create user session
 * @param {string} userId
 * @param {string} sessionId
 * @param {Record<string, any>} sessionData
 * @returns {Promise<boolean>}
 */
export async function createSession(userId, sessionId, sessionData) {
  try {
    if (!isConnected) return true; // Allow without Redis
    const client = await getRedisClient();
    const key = CACHE_KEYS.USER_SESSION(userId, sessionId);

    await client.setEx(
      key,
      CACHE_TTL.SESSION,
      JSON.stringify({
        ...sessionData,
        userId,
        sessionId,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      }),
    );

    // Add to user's session list
    await client.sAdd(CACHE_KEYS.USER_SESSIONS_LIST(userId), sessionId);
    await client.expire(
      CACHE_KEYS.USER_SESSIONS_LIST(userId),
      CACHE_TTL.SESSION,
    );

    return true;
  } catch (error) {
    console.error(`[Redis] Create session error:`, error);
    return true; // Allow without Redis
  }
}

/**
 * Get session data
 * @param {string} userId
 * @param {string} [sessionId]
 * @returns {Promise<Record<string, any> | null>}
 */
export async function getSession(userId, sessionId) {
  if (!isConnected) return null;
  if (sessionId) {
    return cacheGet(CACHE_KEYS.USER_SESSION(userId, sessionId));
  }
  const sessions = await getUserSessions(userId);
  return sessions[0] || null;
}

/**
 * Delete session (logout)
 * @param {string} userId
 * @param {string} [sessionId]
 * @returns {Promise<boolean>}
 */
export async function deleteSession(userId, sessionId) {
  try {
    if (!isConnected) return true;
    const client = await getRedisClient();

    if (sessionId) {
      await client.del(CACHE_KEYS.USER_SESSION(userId, sessionId));
      await client.sRem(CACHE_KEYS.USER_SESSIONS_LIST(userId), sessionId);
    } else {
      return deleteAllUserSessions(userId);
    }
    return true;
  } catch (error) {
    console.error(`[Redis] Delete session error:`, error);
    return true;
  }
}

/**
 * Delete all user sessions (logout all devices)
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function deleteAllUserSessions(userId) {
  try {
    if (!isConnected) return true;
    const client = await getRedisClient();
    const sessionIds = await client.sMembers(
      CACHE_KEYS.USER_SESSIONS_LIST(userId),
    );

    if (sessionIds.length > 0) {
      const sessionKeys = sessionIds.map((sid) =>
        CACHE_KEYS.USER_SESSION(userId, sid),
      );
      await client.del(sessionKeys);
    }

    await client.del(CACHE_KEYS.USER_SESSIONS_LIST(userId));
    return true;
  } catch (error) {
    console.error(`[Redis] Delete all sessions error:`, error);
    return true;
  }
}

/**
 * Get all active sessions for user
 * @param {string} userId
 * @returns {Promise<Record<string, any>[]>}
 */
export async function getUserSessions(userId) {
  try {
    if (!isConnected) return [];
    const client = await getRedisClient();
    const sessionIds = await client.sMembers(
      CACHE_KEYS.USER_SESSIONS_LIST(userId),
    );

    const sessions = await Promise.all(
      sessionIds.map((sid) => getSession(userId, sid)),
    );

    return sessions.filter((s) => s !== null);
  } catch (error) {
    console.error(`[Redis] Get user sessions error:`, error);
    return [];
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Check rate limit using sliding window
 * @param {string} identifier
 * @param {number} limit
 * @param {number} windowMs
 * @returns {Promise<{allowed: boolean, remaining: number, resetTime: number, retryAfter?: number}>}
 */
export async function checkRateLimit(identifier, limit, windowMs) {
  try {
    if (!isConnected) {
      return {
        allowed: true,
        remaining: limit,
        resetTime: Date.now() + windowMs,
      };
    }

    const client = await getRedisClient();
    const key = CACHE_KEYS.RATE_LIMIT(identifier);
    const windowSeconds = Math.ceil(windowMs / 1000);

    const current = await client.incr(key);

    if (current === 1) {
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);
    const resetTime = Date.now() + (ttl > 0 ? ttl * 1000 : windowMs);
    const remaining = Math.max(0, limit - current);

    return {
      allowed: current <= limit,
      remaining,
      resetTime,
      retryAfter: current > limit ? ttl : undefined,
    };
  } catch (error) {
    console.error(`[Redis] Rate limit check error:`, error);
    return {
      allowed: true,
      remaining: limit,
      resetTime: Date.now() + windowMs,
    };
  }
}

/**
 * Track login attempts
 * @param {string} email
 * @param {boolean} success
 * @returns {Promise<{attempts: number, locked: boolean}>}
 */
export async function trackLoginAttempt(email, success) {
  try {
    if (!isConnected) return { attempts: 0, locked: false };

    const client = await getRedisClient();
    const key = CACHE_KEYS.LOGIN_ATTEMPTS(email.toLowerCase());

    if (success) {
      await client.del(key);
      return { attempts: 0, locked: false };
    }

    const attempts = await client.incr(key);
    if (attempts === 1) {
      await client.expire(key, CACHE_TTL.LOGIN_ATTEMPTS);
    }

    const maxAttempts = 30; // Increased from 5
    return {
      attempts,
      locked: attempts >= maxAttempts,
    };
  } catch (error) {
    console.error(`[Redis] Track login attempt error:`, error);
    return { attempts: 0, locked: false };
  }
}

/**
 * Check if login is locked
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function isLoginLocked(email) {
  try {
    if (!isConnected) return false;
    const client = await getRedisClient();
    const key = CACHE_KEYS.LOGIN_ATTEMPTS(email.toLowerCase());
    const attempts = await client.get(key);
    return attempts !== null && parseInt(attempts, 10) >= 30; // Increased from 5
  } catch (error) {
    return false;
  }
}

/**
 * Reset rate limit
 * @param {string} identifier
 * @returns {Promise<boolean>}
 */
export async function resetRateLimit(identifier) {
  return cacheDelete(CACHE_KEYS.RATE_LIMIT(identifier));
}

// ============================================================================
// USER CACHING
// ============================================================================

/**
 * Cache user profile
 * @param {string} userId
 * @param {any} profile
 * @returns {Promise<boolean>}
 */
export async function cacheUserProfile(userId, profile) {
  return cacheSet(
    CACHE_KEYS.USER_PROFILE(userId),
    profile,
    CACHE_TTL.USER_PROFILE,
  );
}

/**
 * Get cached user profile
 * @param {string} userId
 * @returns {Promise<any | null>}
 */
export async function getCachedUserProfile(userId) {
  return cacheGet(CACHE_KEYS.USER_PROFILE(userId));
}

/**
 * Invalidate user cache
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function invalidateUserCache(userId) {
  await Promise.all([
    cacheDelete(CACHE_KEYS.USER_PROFILE(userId)),
    cacheDelete(CACHE_KEYS.USER_STATS(userId)),
  ]);
}

// ============================================================================
// EXAM CACHING
// ============================================================================

/**
 * Cache exam data
 * @param {string} examId
 * @param {any} examData
 * @returns {Promise<boolean>}
 */
export async function cacheExamData(examId, examData) {
  return cacheSet(CACHE_KEYS.EXAM(examId), examData, CACHE_TTL.EXAM);
}

/**
 * Get cached exam data
 * @param {string} examId
 * @returns {Promise<any | null>}
 */
export async function getCachedExamData(examId) {
  return cacheGet(CACHE_KEYS.EXAM(examId));
}

/**
 * Cache exam progress for a student
 * @param {string} submissionId
 * @param {any} progressData
 * @returns {Promise<boolean>}
 */
export async function cacheExamProgress(submissionId, progressData) {
  const key = `cbt:exam:progress:${submissionId}`;
  return cacheSet(key, progressData, CACHE_TTL.EXAM);
}

/**
 * Get cached exam progress
 * @param {string} submissionId
 * @returns {Promise<any | null>}
 */
export async function getCachedExamProgress(submissionId) {
  const key = `cbt:exam:progress:${submissionId}`;
  return cacheGet(key);
}

/**
 * Invalidate exam cache
 * @param {string} examId
 * @returns {Promise<void>}
 */
export async function invalidateExamCache(examId) {
  await Promise.all([
    cacheDelete(CACHE_KEYS.EXAM(examId)),
    cacheDelete(CACHE_KEYS.EXAM_QUESTIONS(examId)),
    cacheDelete(CACHE_KEYS.EXAM_SUBMISSIONS(examId)),
  ]);
}

// ============================================================================
// VERIFICATION TOKENS
// ============================================================================

/**
 * Store password reset token
 * @param {string} token
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function storePasswordResetToken(token, userId) {
  return cacheSet(
    CACHE_KEYS.PASSWORD_RESET(token),
    { userId, createdAt: Date.now() },
    CACHE_TTL.PASSWORD_RESET,
  );
}

/**
 * Verify password reset token
 * @param {string} token
 * @returns {Promise<string | null>}
 */
export async function verifyPasswordResetToken(token) {
  const data = await cacheGet(CACHE_KEYS.PASSWORD_RESET(token));
  if (data) {
    await cacheDelete(CACHE_KEYS.PASSWORD_RESET(token));
    return data.userId;
  }
  return null;
}

/**
 * Store email verification token
 * @param {string} token
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function storeEmailVerificationToken(token, userId) {
  return cacheSet(
    CACHE_KEYS.EMAIL_VERIFICATION(token),
    { userId, createdAt: Date.now() },
    CACHE_TTL.EMAIL_VERIFICATION,
  );
}

/**
 * Verify email token
 * @param {string} token
 * @returns {Promise<string | null>}
 */
export async function verifyEmailToken(token) {
  const data = await cacheGet(CACHE_KEYS.EMAIL_VERIFICATION(token));
  if (data) {
    await cacheDelete(CACHE_KEYS.EMAIL_VERIFICATION(token));
    return data.userId;
  }
  return null;
}

// ============================================================================
// SECURITY - IP BLOCKING
// ============================================================================

/**
 * Block IP address
 * @param {string} ip
 * @param {number} [durationSeconds=3600]
 * @returns {Promise<boolean>}
 */
export async function blockIP(ip, durationSeconds = 3600) {
  try {
    if (!isConnected) return false;
    const client = await getRedisClient();
    await client.setEx(`cbt:blocked_ip:${ip}`, durationSeconds, "1");
    return true;
  } catch (error) {
    console.error(`[Redis] Block IP error:`, error);
    return false;
  }
}

/**
 * Check if IP is blocked
 * @param {string} ip
 * @returns {Promise<boolean>}
 */
export async function isIPBlocked(ip) {
  try {
    if (!isConnected) return false;
    const client = await getRedisClient();
    const exists = await client.exists(`cbt:blocked_ip:${ip}`);
    return exists === 1;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check Redis connection health
 * @returns {Promise<{status: string, latency?: number, connected: boolean}>}
 */
export async function healthCheck() {
  const start = Date.now();

  try {
    if (!isConnected) {
      return { status: "disconnected", connected: false };
    }
    const client = await getRedisClient();
    await client.ping();
    return {
      status: "healthy",
      latency: Date.now() - start,
      connected: isConnected,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      connected: false,
    };
  }
}

export default {
  getRedisClient,
  disconnectRedis,
  isRedisConnected,
  CACHE_KEYS,
  CACHE_TTL,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeletePattern,
  cacheGetOrSet,
  cacheExists,
  createSession,
  getSession,
  deleteSession,
  deleteAllUserSessions,
  getUserSessions,
  checkRateLimit,
  trackLoginAttempt,
  isLoginLocked,
  resetRateLimit,
  cacheUserProfile,
  getCachedUserProfile,
  invalidateUserCache,
  cacheExamData,
  getCachedExamData,
  cacheExamProgress,
  getCachedExamProgress,
  invalidateExamCache,
  storePasswordResetToken,
  verifyPasswordResetToken,
  storeEmailVerificationToken,
  verifyEmailToken,
  blockIP,
  isIPBlocked,
  healthCheck,
};
