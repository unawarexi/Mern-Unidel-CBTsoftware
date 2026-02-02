/**
 * Common Validators
 * Reusable validation functions
 */
import { Patterns } from '../../config/constants.js';

// ============================================================================
// STRING VALIDATORS
// ============================================================================

/**
 * Check if value is a valid MongoDB ObjectId
 * @param {string} id
 * @returns {boolean}
 */
export function isValidObjectId(id) {
  return Patterns.MONGO_ID.test(id);
}

/**
 * Check if value is a valid email
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return Patterns.EMAIL.test(email);
}

/**
 * Check if value is a valid phone number
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  return Patterns.PHONE.test(phone);
}

/**
 * Check if password meets requirements
 * @param {string} password
 * @returns {boolean}
 */
export function isStrongPassword(password) {
  return password.length >= 8 && Patterns.PASSWORD.test(password);
}

/**
 * Check if string is not empty
 * @param {string} value
 * @returns {boolean}
 */
export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// ============================================================================
// NUMERIC VALIDATORS
// ============================================================================

/**
 * Check if value is a positive integer
 * @param {any} value
 * @returns {boolean}
 */
export function isPositiveInteger(value) {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
}

/**
 * Check if value is within range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function isInRange(value, min, max) {
  return typeof value === 'number' && value >= min && value <= max;
}

// ============================================================================
// DATE VALIDATORS
// ============================================================================

/**
 * Check if value is a valid date
 * @param {any} value
 * @returns {boolean}
 */
export function isValidDate(value) {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Check if date is in the future
 * @param {Date | string} date
 * @returns {boolean}
 */
export function isFutureDate(date) {
  const d = new Date(date);
  return !isNaN(d.getTime()) && d > new Date();
}

/**
 * Check if date is in the past
 * @param {Date | string} date
 * @returns {boolean}
 */
export function isPastDate(date) {
  const d = new Date(date);
  return !isNaN(d.getTime()) && d < new Date();
}

// ============================================================================
// ARRAY VALIDATORS
// ============================================================================

/**
 * Check if array is not empty
 * @param {any[]} arr
 * @returns {boolean}
 */
export function isNonEmptyArray(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Check if all elements in array are unique
 * @param {any[]} arr
 * @returns {boolean}
 */
export function hasUniqueElements(arr) {
  return new Set(arr).size === arr.length;
}

// ============================================================================
// SANITIZERS
// ============================================================================

/**
 * Sanitize string by trimming and removing extra whitespace
 * @param {string} value
 * @returns {string}
 */
export function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Sanitize email by trimming and lowercasing
 * @param {string} email
 * @returns {string}
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Extract ObjectId from various formats
 * @param {any} id
 * @returns {string | null}
 */
export function extractObjectId(id) {
  if (!id) return null;
  
  // If it's already a string, validate and return
  if (typeof id === 'string') {
    return isValidObjectId(id) ? id : null;
  }
  
  // If it's an object with _id or id property
  if (typeof id === 'object') {
    const rawId = id._id || id.id || (id.toString ? id.toString() : null);
    if (typeof rawId === 'string' && isValidObjectId(rawId)) {
      return rawId;
    }
  }
  
  return null;
}

export default {
  isValidObjectId,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isNotEmpty,
  isPositiveInteger,
  isInRange,
  isValidDate,
  isFutureDate,
  isPastDate,
  isNonEmptyArray,
  hasUniqueElements,
  sanitizeString,
  sanitizeEmail,
  extractObjectId,
};
