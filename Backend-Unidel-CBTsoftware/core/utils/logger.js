/**
 * Logger Utility
 * Structured logging with levels
 */
import { env } from '../../config/env.config.js';

// ============================================================================
// LOG LEVELS
// ============================================================================

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LOG_LEVELS[env.LOG_LEVEL] ?? LOG_LEVELS.info;

// ============================================================================
// COLORS (for terminal)
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
};

// ============================================================================
// LOGGER CLASS
// ============================================================================

class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Format log message
   * @param {string} level
   * @param {string} message
   * @param {any} [data]
   * @returns {string}
   */
  format(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`;
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data)}`;
    }
    return `${prefix} ${message}`;
  }

  /**
   * Log error message
   * @param {string} message
   * @param {any} [data]
   */
  error(message, data) {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(`${colors.red}${this.format('ERROR', message, data)}${colors.reset}`);
    }
  }

  /**
   * Log warning message
   * @param {string} message
   * @param {any} [data]
   */
  warn(message, data) {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(`${colors.yellow}${this.format('WARN', message, data)}${colors.reset}`);
    }
  }

  /**
   * Log info message
   * @param {string} message
   * @param {any} [data]
   */
  info(message, data) {
    if (currentLevel >= LOG_LEVELS.info) {
      console.info(`${colors.blue}${this.format('INFO', message, data)}${colors.reset}`);
    }
  }

  /**
   * Log debug message
   * @param {string} message
   * @param {any} [data]
   */
  debug(message, data) {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.log(`${colors.gray}${this.format('DEBUG', message, data)}${colors.reset}`);
    }
  }

  /**
   * Log success message (alias for info with green color)
   * @param {string} message
   * @param {any} [data]
   */
  success(message, data) {
    if (currentLevel >= LOG_LEVELS.info) {
      console.log(`${colors.green}${this.format('SUCCESS', message, data)}${colors.reset}`);
    }
  }

  /**
   * Create child logger with new context
   * @param {string} context
   * @returns {Logger}
   */
  child(context) {
    return new Logger(`${this.context}:${context}`);
  }
}

// ============================================================================
// DEFAULT LOGGER INSTANCE
// ============================================================================

const logger = new Logger();

/**
 * Create logger with context
 * @param {string} context
 * @returns {Logger}
 */
export function createLogger(context) {
  return new Logger(context);
}

export { Logger };
export default logger;
