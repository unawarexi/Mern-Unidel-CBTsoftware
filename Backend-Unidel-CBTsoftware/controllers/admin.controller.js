import crypto from "crypto";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import { generateAdminId } from "../core/helpers/helper-functions.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

// @desc    Create Admin (Super Admin only)
// @route   POST /api/users/admins
// @access  Private (Super Admin)
export const createAdmin = async (req, res) => {
  try {
    let { fullname, email, adminId, organisation, role = "admin" } = req.body;
    organisation = organisation || req.body.organization;

    if (!fullname || !email || !organisation) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!adminId) {
      const count = await Admin.countDocuments();
      adminId = generateAdminId(count + 1);
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { adminId }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email or admin ID already exists",
      });
    }

    const randomPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    const admin = await Admin.create({
      fullname,
      email,
      password: hashedPassword,
      adminId,
      organisation,
      role,
      isFirstLogin: true,
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await admin.save();

    let emailSent = false;
    try {
      const mailGen = new EmailContentGenerator();
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&role=${role}`;
      const emailContent = mailGen.adminCreatedAccountEmail({
        fullName: admin.fullname,
        role,
        email: admin.email,
        tempPassword: randomPassword,
        resetUrl,
        userId: admin._id,
      });
      await Mailer.sendTemplatedMail(admin.email, emailContent);
      emailSent = true;
    } catch (err) {
      console.error("Error sending admin account email:", err);
    }

    res.status(201).json({
      success: true,
      message: `Admin created successfully.${emailSent ? " Credentials sent to email." : " Failed to send credentials email."}`,
      emailSent,
      data: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        adminId: admin.adminId,
        organisation: admin.organisation,
        role: admin.role,
      },
      credentials: { email, password: randomPassword },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Admins
// @route   GET /api/users/admins
// @access  Private (Super Admin)
export const getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, organisation, search } = req.query;

    const query = {};
    if (organisation) query.organisation = organisation;
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { adminId: { $regex: search, $options: "i" } },
      ];
    }

    const admins = await Admin.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Admin.countDocuments(query);

    res.status(200).json({
      success: true,
      count: admins.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: admins,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Admin by ID
// @route   GET /api/users/admins/:id
// @access  Private (Super Admin)
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpires");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Admin
// @route   PUT /api/users/admins/:id
// @access  Private (Super Admin)
export const updateAdmin = async (req, res) => {
  try {
    const { fullname, email, adminId, organisation, role } = req.body;

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (email || adminId) {
      const duplicateQuery = { _id: { $ne: req.params.id } };
      const orConditions = [];

      if (email) orConditions.push({ email });
      if (adminId) orConditions.push({ adminId });

      if (orConditions.length > 0) {
        duplicateQuery.$or = orConditions;
        const duplicate = await Admin.findOne(duplicateQuery);

        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: "Admin with this email or admin ID already exists",
          });
        }
      }
    }

    if (fullname) admin.fullname = fullname;
    if (email) admin.email = email;
    if (adminId) admin.adminId = adminId;
    if (organisation) admin.organisation = organisation;
    if (role) admin.role = role;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Admin
// @route   DELETE /api/users/admins/:id
// @access  Private (Super Admin)
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin._id.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
