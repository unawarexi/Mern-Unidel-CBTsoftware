import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { render } from "../core/helpers/email-renderer.js";

dotenv.config();

// Validate required SMTP environment variables
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`Missing required email environment variables: ${missingVars.join(', ')}`);
  console.error('Please configure your .env file with proper SMTP settings.');
  throw new Error('Email service not configured properly');
}

// Create transporter with real SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Additional options for better reliability
  tls: {
    rejectUnauthorized: false, // For self-signed certificates
  },
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

/**
 * Send a raw HTML email
 */
export async function sendMail(to, subject, htmlContent) {
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'UNIDEL CBT'} <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} | Subject: ${subject} | MessageID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw error;
  }
}

/**
 * Render template data into base.html and send
 * @param {String} to
 * @param {Object} templateData - object produced by mail-content generator
 */
export async function sendTemplatedMail(to, templateData) {
  const html = render(templateData);
  const subject = templateData.EMAIL_TITLE || "Notification from UNIDEL CBT";
  return sendMail(to, subject, html);
}
