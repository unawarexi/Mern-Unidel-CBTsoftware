import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/admin.model.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

// Load env if running as standalone script
if (process.env.NODE_ENV !== "production" && !process.env.DB_URI) {
  dotenv.config();
}

/**
 * Seeds the Super Admin user based on environment variables.
 * Can be called internally after DB connection or run as a standalone script.
 */
export const seedSuperAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn(
        "⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not defined in .env. Skipping admin seeding.",
      );
      return;
    }

    // Check if superadmin already exists
    let admin = await Admin.findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (admin) {
      console.log(
        "ℹ️ Super Admin already exists. Ensuring correct role and credentials...",
      );
      admin.password = hashedPassword;
      admin.role = "superadmin";
      // We don't force isFirstLogin to true for updates to avoid locking out existing admins
      await admin.save();
      console.log("✅ Super Admin updated successfully.");
    } else {
      console.log("🚀 Creating new Super Admin...");
      admin = await Admin.create({
        fullname: "UNIDEL Super Admin",
        email: adminEmail,
        password: hashedPassword,
        adminId: "ADMIN001",
        organisation: "UNIDEL",
        role: "superadmin",
        isFirstLogin: true,
      });

      console.log("✅ Super Admin created successfully.");

      // Send welcome email
      try {
        const mailGen = new EmailContentGenerator();
        const emailContent = mailGen.adminCreatedAccountEmail({
          fullName: admin.fullname,
          role: "superadmin",
          email: admin.email,
          tempPassword: adminPassword,
          userId: admin._id,
          resetUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/admin-signin`,
        });

        await Mailer.sendTemplatedMail(admin.email, emailContent);
        console.log(`📧 Welcome email sent to ${admin.email}`);
      } catch (mailError) {
        console.error(
          "❌ Failed to send super admin welcome email:",
          mailError.message,
        );
      }
    }
    return admin;
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error.message);
    throw error;
  }
};

// Handle standalone execution
const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("admin.seed.js");
if (isMain) {
  const run = async () => {
    try {
      const { connectDB, disconnectDB } =
        await import("../config/db-config.js");
      await connectDB();
      await seedSuperAdmin();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  run();
}
