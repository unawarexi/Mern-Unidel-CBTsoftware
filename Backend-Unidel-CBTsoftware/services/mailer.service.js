import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { render } from "../core/helpers/email-renderer.js";

dotenv.config();

// Build transporter: use real SMTP when configured, otherwise create an Ethereal test account
let transporter;
let isTestAccount = false;

if (process.env.SMTP_HOST && process.env.SMTP_USER_EMAIL && process.env.SMTP_USER_PASSWORD) {
	// Production / configured SMTP
	transporter = nodemailer.createTransport({
		service: process.env.SMTP_SERVICE || undefined,
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
		secure: process.env.SMTP_SECURE === "true",
		auth: {
			user: process.env.SMTP_USER_EMAIL,
			pass: process.env.SMTP_USER_PASSWORD,
		},
	});
} else {
	// Create Ethereal test account when real SMTP not configured (useful for development)
	isTestAccount = true;
	// createTestAccount returns a Promise
	nodemailer.createTestAccount().then((testAccount) => {
		transporter = nodemailer.createTransport({
			host: testAccount.smtp.host,
			port: testAccount.smtp.port,
			secure: testAccount.smtp.secure,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		});
		console.warn("⚠️ SMTP not configured. Using Ethereal test account for email preview.");
	});
}

/**
 * Send a raw HTML email
 */
export async function sendMail(to, subject, htmlContent) {
	const mailOptions = {
		from: process.env.SMTP_USER_EMAIL || "no-reply@unidel.edu.ng",
		to,
		subject,
		html: htmlContent,
	};

	try {
		if (!transporter) {
			throw new Error("Email transporter not initialized");
		}
		const info = await transporter.sendMail(mailOptions);
		console.log(`Email sent to ${to} (subject: ${subject}) messageId=${info.messageId}`);

		// If using Ethereal, log preview URL
		if (isTestAccount && nodemailer.getTestMessageUrl) {
			const previewUrl = nodemailer.getTestMessageUrl(info);
			if (previewUrl) {
				console.log(`Preview URL: ${previewUrl}`);
			}
		}

		// return info for callers that may want details
		return info;
	} catch (error) {
		console.error(`Error sending email to ${to}:`, error);
		// rethrow so callers can react (controllers will catch and handle)
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

	// Bubble up errors to callers so they can detect failures
	return sendMail(to, subject, html);
}
