/**
 * Formatters
 * Data formatting utilities for dates, numbers, currency, etc.
 */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

// ============ DATE FORMATTERS ============

/**
 * Format date to readable string
 * @param {Date|string} date
 * @param {string} format - dayjs format string
 * @returns {string}
 */
export const formatDate = (date, format = "MMM D, YYYY") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

/**
 * Format date with time
 */
export const formatDateTime = (date, format = "MMM D, YYYY h:mm A") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

/**
 * Format time only
 */
export const formatTime = (date, format = "h:mm A") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";
  return dayjs(date).fromNow();
};

/**
 * Format duration in minutes to readable string
 * @param {number} minutes
 * @returns {string} e.g., "1h 30m" or "45m"
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format seconds to mm:ss
 */
export const formatTimerSeconds = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format seconds to hh:mm:ss for long durations
 */
export const formatTimerLong = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// ============ NUMBER FORMATTERS ============

/**
 * Format number with commas
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-NG").format(num);
};

/**
 * Format number as currency (NGN)
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = "NGN") => {
  if (amount === null || amount === undefined) return "₦0.00";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number as percentage
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format large numbers with suffix (K, M, B)
 * @param {number} num
 * @returns {string}
 */
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return "0";
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
};

/**
 * Format decimal to specified places
 */
export const formatDecimal = (num, places = 2) => {
  if (num === null || num === undefined) return "0";
  return Number(num).toFixed(places);
};

// ============ STRING FORMATTERS ============

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Title case string
 */
export const titleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Convert to slug format
 */
export const toSlug = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Get initials from name
 * @param {string} name
 * @param {number} length - Number of initials to return
 * @returns {string}
 */
export const getInitials = (name, length = 2) => {
  if (!name) return "";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts
    .slice(0, length)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  // Format as Nigerian number
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 13 && digits.startsWith("234")) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
};

// ============ FILE FORMATTERS ============

/**
 * Format file size
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
};

// ============ SCORE/GRADE FORMATTERS ============

/**
 * Format score as grade
 * @param {number} score - Percentage score
 * @returns {{ grade: string, remark: string }}
 */
export const formatGrade = (score) => {
  if (score >= 70) return { grade: "A", remark: "Excellent" };
  if (score >= 60) return { grade: "B", remark: "Very Good" };
  if (score >= 50) return { grade: "C", remark: "Good" };
  if (score >= 45) return { grade: "D", remark: "Pass" };
  if (score >= 40) return { grade: "E", remark: "Fair" };
  return { grade: "F", remark: "Fail" };
};

/**
 * Format score display
 */
export const formatScore = (obtained, total) => {
  if (!total) return "0/0";
  return `${obtained || 0}/${total}`;
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDuration,
  formatTimerSeconds,
  formatTimerLong,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatDecimal,
  truncate,
  capitalize,
  titleCase,
  toSlug,
  getInitials,
  formatPhoneNumber,
  formatFileSize,
  getFileExtension,
  formatGrade,
  formatScore,
};
