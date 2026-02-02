/**
 * General Helpers
 * Utility functions for common operations
 */

// ============ OBJECT HELPERS ============

/**
 * Deep clone an object
 * @param {object} obj
 * @returns {object}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Pick specific keys from object
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Omit specific keys from object
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export const omit = (obj, keys) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Get nested value from object using dot notation
 * @param {object} obj
 * @param {string} path - e.g., "user.profile.name"
 * @param {any} defaultValue
 * @returns {any}
 */
export const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
};

// ============ ARRAY HELPERS ============

/**
 * Remove duplicates from array
 * @param {array} arr
 * @param {string} key - Optional key for objects
 * @returns {array}
 */
export const unique = (arr, key = null) => {
  if (key) {
    const seen = new Set();
    return arr.filter((item) => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }
  return [...new Set(arr)];
};

/**
 * Group array by key
 * @param {array} arr
 * @param {string} key
 * @returns {object}
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

/**
 * Sort array of objects by key
 * @param {array} arr
 * @param {string} key
 * @param {string} order - "asc" or "desc"
 * @returns {array}
 */
export const sortBy = (arr, key, order = "asc") => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal === bVal) return 0;
    const comparison = aVal < bVal ? -1 : 1;
    return order === "asc" ? comparison : -comparison;
  });
};

/**
 * Chunk array into smaller arrays
 * @param {array} arr
 * @param {number} size
 * @returns {array}
 */
export const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

/**
 * Shuffle array
 */
export const shuffle = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// ============ FUNCTION HELPERS ============

/**
 * Debounce function
 * @param {function} fn
 * @param {number} delay
 * @returns {function}
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function
 * @param {function} fn
 * @param {number} limit
 * @returns {function}
 */
export const throttle = (fn, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Sleep/delay function
 * @param {number} ms
 * @returns {Promise}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry function with exponential backoff
 * @param {function} fn
 * @param {number} retries
 * @param {number} delay
 * @returns {Promise}
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
};

// ============ URL HELPERS ============

/**
 * Parse query string to object
 * @param {string} queryString
 * @returns {object}
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {};
  return Object.fromEntries(new URLSearchParams(queryString));
};

/**
 * Build query string from object
 * @param {object} params
 * @returns {string}
 */
export const buildQueryString = (params) => {
  const filteredParams = Object.entries(params).filter(
    ([_, value]) => value !== null && value !== undefined && value !== "",
  );
  return new URLSearchParams(filteredParams).toString();
};

/**
 * Get current URL without query params
 */
export const getBaseUrl = () => {
  if (typeof window === "undefined") return "";
  return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
};

// ============ STORAGE HELPERS ============

/**
 * Safe localStorage get
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Safe localStorage set
 */
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove from localStorage
 */
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

// ============ DOM HELPERS ============

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
};

/**
 * Download file from URL or blob
 * @param {string|Blob} content
 * @param {string} filename
 */
export const downloadFile = (content, filename) => {
  const url = content instanceof Blob ? URL.createObjectURL(content) : content;
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (content instanceof Blob) URL.revokeObjectURL(url);
};

/**
 * Scroll to element
 * @param {string} selector - CSS selector
 * @param {object} options
 */
export const scrollToElement = (
  selector,
  options = { behavior: "smooth", block: "start" },
) => {
  const element = document.querySelector(selector);
  if (element) element.scrollIntoView(options);
};

// ============ RANDOM HELPERS ============

/**
 * Generate random ID
 * @param {number} length
 * @returns {string}
 */
export const generateId = (length = 8) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate random number in range
 */
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate random color
 */
export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

export default {
  // Object
  deepClone,
  isEmpty,
  pick,
  omit,
  get,
  // Array
  unique,
  groupBy,
  sortBy,
  chunk,
  shuffle,
  // Function
  debounce,
  throttle,
  sleep,
  retry,
  // URL
  parseQueryString,
  buildQueryString,
  getBaseUrl,
  // Storage
  getStorage,
  setStorage,
  removeStorage,
  // DOM
  copyToClipboard,
  downloadFile,
  scrollToElement,
  // Random
  generateId,
  randomInRange,
  randomColor,
};
