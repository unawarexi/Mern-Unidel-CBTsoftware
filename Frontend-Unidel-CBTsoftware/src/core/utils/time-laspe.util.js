import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

// Configure dayjs with plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

/**
 * Calculate time remaining until a specific date
 * @param {Date|string} endTime - The end time
 * @returns {Object} Time remaining object
 */
export const getTimeRemaining = (endTime) => {
  if (!endTime) {
    return {
      expired: true,
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "00:00:00",
      endTime: null,
    };
  }

  const now = dayjs();
  const end = dayjs(endTime);
  const diff = end.diff(now);

  if (diff <= 0) {
    return {
      expired: true,
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "00:00:00",
      endTime: end.toISOString(),
    };
  }

  const durationObj = dayjs.duration(diff);
  const totalSeconds = Math.floor(diff / 1000);
  const days = durationObj.days();
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();
  const seconds = durationObj.seconds();

  // Format as HH:MM:SS or DD:HH:MM:SS
  let formatted;
  if (days > 0) {
    formatted = `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return {
    expired: false,
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    formatted,
    endTime: end.toISOString(),
  };
};

/**
 * Calculate time elapsed since a specific date
 * @param {Date|string} startTime - The start time
 * @returns {Object} Time elapsed object
 */
export const getTimeElapsed = (startTime) => {
  if (!startTime) {
    return {
      totalSeconds: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "00:00:00",
    };
  }

  const now = dayjs();
  const start = dayjs(startTime);
  const diff = now.diff(start);

  if (diff <= 0) {
    return {
      totalSeconds: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "00:00:00",
    };
  }

  const durationObj = dayjs.duration(diff);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();
  const seconds = durationObj.seconds();

  const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    totalSeconds,
    hours,
    minutes,
    seconds,
    formatted,
  };
};

/**
 * Check if current time is between start and end times
 * @param {Date|string} startTime - Start time
 * @param {Date|string} endTime - End time
 * @returns {boolean} True if current time is between start and end
 */
export const isTimeBetween = (startTime, endTime) => {
  if (!startTime || !endTime) return false;

  const now = dayjs();
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  return now.isBetween(start, end, null, "[]"); // inclusive
};

/**
 * Check if exam is currently active
 * @param {Object} exam - Exam object with startTime, endTime, status
 * @returns {boolean} True if exam is active
 */
export const isExamActive = (exam) => {
  if (!exam) return false;

  const now = dayjs();
  const start = dayjs(exam.startTime);
  const end = dayjs(exam.endTime);

  const isTimeValid = now.isBetween(start, end, null, "[]");
  const isStatusActive = exam.status === "active";

  return isTimeValid && isStatusActive;
};

/**
 * Check if exam has started
 * @param {Date|string} startTime - Exam start time
 * @returns {boolean} True if exam has started
 */
export const hasExamStarted = (startTime) => {
  if (!startTime) return false;
  return dayjs().isAfter(dayjs(startTime));
};

/**
 * Check if exam has ended
 * @param {Date|string} endTime - Exam end time
 * @returns {boolean} True if exam has ended
 */
export const hasExamEnded = (endTime) => {
  if (!endTime) return false;
  return dayjs().isAfter(dayjs(endTime));
};

/**
 * Get exam status based on current time
 * @param {Object} exam - Exam object
 * @returns {string} Status: 'upcoming', 'active', 'ended'
 */
export const getExamStatus = (exam) => {
  if (!exam || !exam.startTime || !exam.endTime) return "unknown";

  const now = dayjs();
  const start = dayjs(exam.startTime);
  const end = dayjs(exam.endTime);

  if (now.isBefore(start)) return "upcoming";
  if (now.isAfter(end)) return "ended";
  return "active";
};

/**
 * Format duration in seconds to human-readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0s";

  const duration = dayjs.duration(seconds, "seconds");
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const secs = duration.seconds();

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: "MMMM D, YYYY h:mm A")
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = "MMMM D, YYYY h:mm A") => {
  if (!date) return "N/A";
  return dayjs(date).format(format);
};

/**
 * Get relative time (e.g., "2 hours ago", "in 5 minutes")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return "N/A";
  return dayjs(date).fromNow();
};

/**
 * Get time until event (e.g., "in 2 hours", "in 5 minutes")
 * @param {Date|string} date - Future date
 * @returns {string} Time until string
 */
export const getTimeUntil = (date) => {
  if (!date) return "N/A";
  const now = dayjs();
  const target = dayjs(date);

  if (target.isBefore(now)) return "Started";

  return target.fromNow();
};

/**
 * Calculate percentage of time elapsed
 * @param {Date|string} startTime - Start time
 * @param {Date|string} endTime - End time
 * @returns {number} Percentage (0-100)
 */
export const getTimeElapsedPercentage = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const now = dayjs();
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  const total = end.diff(start);
  const elapsed = now.diff(start);

  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;

  return Math.round((elapsed / total) * 100);
};

/**
 * Get warning level based on time remaining
 * @param {number} totalSeconds - Total seconds remaining
 * @param {number} duration - Total exam duration in minutes
 * @returns {string} Warning level: 'safe', 'warning', 'danger', 'critical'
 */
export const getTimeWarningLevel = (totalSeconds, duration) => {
  if (!totalSeconds || !duration) return "safe";

  const totalDurationSeconds = duration * 60;
  const percentage = (totalSeconds / totalDurationSeconds) * 100;

  if (percentage > 50) return "safe";
  if (percentage > 25) return "warning";
  if (percentage > 10) return "danger";
  return "critical";
};

/**
 * Parse exam time and return formatted info
 * @param {Object} exam - Exam object
 * @returns {Object} Parsed exam time info
 */
export const parseExamTime = (exam) => {
  if (!exam) return null;

  const now = dayjs();
  const start = dayjs(exam.startTime);
  const end = dayjs(exam.endTime);
  const duration = end.diff(start, "minute");

  return {
    startTime: start.format("MMMM D, YYYY h:mm A"),
    endTime: end.format("MMMM D, YYYY h:mm A"),
    duration: `${duration} minutes`,
    status: getExamStatus(exam),
    isActive: isExamActive(exam),
    hasStarted: hasExamStarted(exam.startTime),
    hasEnded: hasExamEnded(exam.endTime),
    timeUntilStart: start.isAfter(now) ? start.fromNow() : null,
    timeRemaining: end.isAfter(now) ? getTimeRemaining(exam.endTime) : null,
    elapsedPercentage: getTimeElapsedPercentage(exam.startTime, exam.endTime),
  };
};

/**
 * Create a countdown timer that updates at specified interval
 * @param {Date|string} endTime - End time for countdown
 * @param {Function} callback - Callback function to call on each tick
 * @param {number} interval - Update interval in milliseconds (default: 1000)
 * @returns {Function} Stop function to clear the interval
 */
export const createCountdownTimer = (endTime, callback, interval = 1000) => {
  if (!endTime || typeof callback !== "function") {
    console.error("Invalid parameters for countdown timer");
    return () => {};
  }

  // Initial call
  const timeRemaining = getTimeRemaining(endTime);
  callback(timeRemaining);

  // Set up interval
  const intervalId = setInterval(() => {
    const timeRemaining = getTimeRemaining(endTime);
    callback(timeRemaining);

    // Stop if expired
    if (timeRemaining.expired) {
      clearInterval(intervalId);
    }
  }, interval);

  // Return stop function
  return () => clearInterval(intervalId);
};

/**
 * Validate if a date is in the future
 * @param {Date|string} date - Date to validate
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  return dayjs(date).isAfter(dayjs());
};

/**
 * Validate if a date is in the past
 * @param {Date|string} date - Date to validate
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
};

/**
 * Add time to a date
 * @param {Date|string} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit (minutes, hours, days, etc.)
 * @returns {string} New date as ISO string
 */
export const addTime = (date, amount, unit = "minutes") => {
  if (!date) return null;
  return dayjs(date).add(amount, unit).toISOString();
};

/**
 * Subtract time from a date
 * @param {Date|string} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Unit (minutes, hours, days, etc.)
 * @returns {string} New date as ISO string
 */
export const subtractTime = (date, amount, unit = "minutes") => {
  if (!date) return null;
  return dayjs(date).subtract(amount, unit).toISOString();
};

export default {
  getTimeRemaining,
  getTimeElapsed,
  isTimeBetween,
  isExamActive,
  hasExamStarted,
  hasExamEnded,
  getExamStatus,
  formatDuration,
  formatDate,
  getRelativeTime,
  getTimeUntil,
  getTimeElapsedPercentage,
  getTimeWarningLevel,
  parseExamTime,
  createCountdownTimer,
  isFutureDate,
  isPastDate,
  addTime,
  subtractTime,
};