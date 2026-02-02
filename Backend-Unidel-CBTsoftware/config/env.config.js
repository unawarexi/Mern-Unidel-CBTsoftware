/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get string environment variable
 * @param {string} key
 * @param {string} [defaultValue]
 * @returns {string}
 */
function getEnvString(key, defaultValue) {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    console.warn(`[Config] Missing environment variable: ${key}`);
    return '';
  }
  return value;
}

/**
 * Get number environment variable
 * @param {string} key
 * @param {number} [defaultValue]
 * @returns {number}
 */
function getEnvNumber(key, defaultValue) {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    console.warn(`[Config] Missing environment variable: ${key}`);
    return 0;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`[Config] Environment variable ${key} must be a number, got: ${value}`);
    return defaultValue || 0;
  }
  return parsed;
}

/**
 * Get boolean environment variable
 * @param {string} key
 * @param {boolean} [defaultValue=false]
 * @returns {boolean}
 */
function getEnvBoolean(key, defaultValue = false) {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get array environment variable (comma-separated)
 * @param {string} key
 * @param {string[]} [defaultValue=[]]
 * @returns {string[]}
 */
function getEnvArray(key, defaultValue = []) {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

// ============================================================================
// CONFIGURATION OBJECT
// ============================================================================

export const env = {
  // Server
  NODE_ENV: getEnvString('NODE_ENV', 'development'),
  PORT: getEnvNumber('PORT', 3000),
  HOST: getEnvString('HOST', '0.0.0.0'),
  BASE_URL: getEnvString('BASE_URL', 'http://localhost:3000'),

  // Frontend
  FRONTEND_URL: getEnvString('FRONTEND_URL', 'http://localhost:5173'),

  // Database
  DB_URI: getEnvString('DB_URI', ''),

  // JWT
  JWT_SECRET: getEnvString('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production'),
  JWT_EXPIRES_IN: getEnvString('JWT_EXPIRES_IN', '1h'),
  REFRESH_TOKEN_EXPIRES_IN: getEnvString('REFRESH_TOKEN_EXPIRES_IN', '7d'),

  // Redis
  REDIS_HOST: getEnvString('REDIS_HOST', 'localhost'),
  REDIS_PORT: getEnvNumber('REDIS_PORT', 6379),
  REDIS_PASSWORD: getEnvString('REDIS_PASSWORD', ''),
  REDIS_USERNAME: getEnvString('REDIS_USERNAME', 'default'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: getEnvString('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: getEnvString('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: getEnvString('CLOUDINARY_API_SECRET', ''),

  // Email
  EMAIL_HOST: getEnvString('EMAIL_HOST', 'smtp.gmail.com'),
  EMAIL_PORT: getEnvNumber('EMAIL_PORT', 587),
  EMAIL_USER: getEnvString('EMAIL_USER', ''),
  EMAIL_PASS: getEnvString('EMAIL_PASS', ''),
  FROM_EMAIL: getEnvString('FROM_EMAIL', 'noreply@unidel.edu'),
  FROM_NAME: getEnvString('FROM_NAME', 'UNIDEL CBT Platform'),
  SECURITY_EMAIL: getEnvString('SECURITY_EMAIL', 'security@unidel.edu'),

  // OpenAI & HuggingFace
  OPENAI_API_KEY: getEnvString('OPENAI_API_KEY', ''),
  HF_TOKEN: getEnvString('HF_TOKEN', ''),

  // Security
  DISABLE_HELMET: getEnvBoolean('DISABLE_HELMET', false),
  HELMET_ENABLED: getEnvBoolean('HELMET_ENABLED', true),
  TRUST_PROXY: getEnvBoolean('TRUST_PROXY', false),

  // Rate Limiting
  RATE_LIMIT_WINDOW: getEnvNumber('RATE_LIMIT_WINDOW', 900), // 15 minutes in seconds
  RATE_LIMIT_MAX: getEnvNumber('RATE_LIMIT_MAX', 100),
  MAX_2FA_ATTEMPTS: getEnvNumber('MAX_2FA_ATTEMPTS', 5),

  // Logging
  LOG_LEVEL: getEnvString('LOG_LEVEL', 'info'),
  SENTRY_DSN: getEnvString('SENTRY_DSN', ''),

  // CORS
  CORS_ORIGINS: getEnvArray('CORS_ORIGINS', ['http://localhost:3000', 'http://localhost:5173']),
};

// ============================================================================
// ENVIRONMENT CHECKS
// ============================================================================

/**
 * Check if running in production
 * @returns {boolean}
 */
export function isProduction() {
  return env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 * @returns {boolean}
 */
export function isDevelopment() {
  return env.NODE_ENV === 'development';
}

/**
 * Check if running in test
 * @returns {boolean}
 */
export function isTest() {
  return env.NODE_ENV === 'test';
}

/**
 * Validate required environment variables
 * @returns {{valid: boolean, missing: string[]}}
 */
export function validateEnv() {
  const required = ['DB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`[Config] ⚠️ Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

export default env;
