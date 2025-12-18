import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { render } from "../core/helpers/email-renderer.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER_EMAIL,
    pass: process.env.SMTP_USER_PASSWORD,
  },
});

/**
 * Send a raw HTML email
 */
export async function sendMail(to, subject, htmlContent) {
  const mailOptions = {
    from: process.env.SMTP_USER_EMAIL,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} (subject: ${subject})`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
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

  await sendMail(to, subject, html);
}
