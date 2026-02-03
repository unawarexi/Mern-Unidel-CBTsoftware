import Student from "../models/student.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateMatricNumber } from "../core/helpers/helper-functions.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

// @desc    Create Student (Agent only)
// @route   POST /api/agents/students
// @access  Private (Agent)
export const createAgentStudent = async (req, res) => {
  try {
    const { fullname, email, matricNumber, department, level } = req.body;
    const agentId = req.user.userId;

    if (!fullname || !email || !department) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ success: false, message: "Student already exists" });
    }

    const mNumber =
      matricNumber ||
      generateMatricNumber((await Student.countDocuments()) + 1);
    const randomPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    const student = await Student.create({
      fullname,
      email,
      password: hashedPassword,
      matricNumber: mNumber,
      department,
      level: level || 100,
      agentId,
      isFirstLogin: true,
    });

    // Send credentials to student
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.adminCreatedAccountEmail({
        fullName: student.fullname,
        role: "student",
        email: student.email,
        tempPassword: randomPassword,
        userId: student._id,
      });
      await Mailer.sendTemplatedMail(student.email, emailContent);
    } catch (err) {
      console.error("Error sending agent-student email:", err);
    }

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Agent Students (Agent and Admin)
// @route   GET /api/agents/students
// @access  Private (Agent/Admin)
export const getAgentStudents = async (req, res) => {
  try {
    const query =
      req.user.role === "agent"
        ? { agentId: req.user.userId }
        : { agentId: { $ne: null } };
    const students = await Student.find(query).populate(
      "department",
      "departmentName",
    );
    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Agent Student (Agent only)
// @route   PUT /api/agents/students/:id
// @access  Private (Agent)
export const updateAgentStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user.userId,
    });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found or unauthorized" });
    }

    const { fullname, level } = req.body;
    if (fullname) student.fullname = fullname;
    if (level) student.level = level;

    await student.save();
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Agent Student (Agent only)
// @route   DELETE /api/agents/students/:id
// @access  Private (Agent)
export const deleteAgentStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      agentId: req.user.userId,
    });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found or unauthorized" });
    }

    await student.deleteOne();
    res.status(200).json({ success: true, message: "Student removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
