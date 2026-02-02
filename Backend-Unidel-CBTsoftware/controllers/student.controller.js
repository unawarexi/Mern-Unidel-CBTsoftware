import crypto from "crypto";
import bcrypt from "bcryptjs";
import Student from "../models/student.model.js";
import { generateMatricNumber } from "../core/helpers/helper-functions.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

// @desc    Create Student (Admin only)
// @route   POST /api/users/students
// @access  Private (Admin)
export const createStudent = async (req, res) => {
  try {
    let { fullname, email, matricNumber, department, courses, level } = req.body; // <-- Added courses and level

    if (!fullname || !email || !department) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const departmentDoc = await (await import("../models/department.model.js")).default.findById(department);
    if (!departmentDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    // Validate courses if provided
    const coursesArray = Array.isArray(courses) ? courses : (courses ? [courses] : []);
    if (coursesArray.length > 0) {
      const Course = (await import("../models/course.model.js")).default;
      const validCourses = await Course.find({ _id: { $in: coursesArray } });
      if (validCourses.length !== coursesArray.length) {
        return res.status(400).json({
          success: false,
          message: "One or more course IDs are invalid",
        });
      }
    }

    if (!matricNumber) {
      const count = await Student.countDocuments();
      matricNumber = generateMatricNumber(count + 1);
    }

    const existingStudent = await Student.findOne({
      $or: [{ email }, { matricNumber }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or matric number already exists",
      });
    }

    const randomPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    const student = await Student.create({
      fullname,
      email,
      password: hashedPassword,
      matricNumber,
      department,
      courses: coursesArray, // <-- Now saving courses
      level: level || 100, // <-- Save level with default 100
      role: "student",
      isFirstLogin: true,
    });

    // Update each course to include this student
    if (coursesArray.length > 0) {
      const Course = (await import("../models/course.model.js")).default;
      await Course.updateMany(
        { _id: { $in: coursesArray } },
        { $addToSet: { students: student._id } }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    student.resetPasswordToken = hashedToken;
    student.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await student.save();

    let emailSent = false;
    try {
      const mailGen = new EmailContentGenerator();
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&role=student`;
      const emailContent = mailGen.adminCreatedAccountEmail({
        fullName: student.fullname,
        role: "student",
        email: student.email,
        tempPassword: randomPassword,
        resetUrl,
        userId: student._id,
      });
      await Mailer.sendTemplatedMail(student.email, emailContent);
      emailSent = true;
    } catch (err) {
      console.error("Error sending student account email:", err);
    }

    // Populate department and courses before sending response
    await student.populate("department", "departmentName departmentCode");
    await student.populate("courses", "courseCode courseTitle");

    res.status(201).json({
      success: true,
      message: `Student created successfully.${emailSent ? " Credentials sent to email." : " Failed to send credentials email."}`,
      emailSent,
      data: {
        id: student._id,
        fullname: student.fullname,
        email: student.email,
        matricNumber: student.matricNumber,
        department: student.department,
        courses: student.courses, // <-- Include courses in response
        level: student.level,
      },
      credentials: { email, password: randomPassword },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Students
// @route   GET /api/users/students
// @access  Private (Admin)
export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, search } = req.query;

    const query = {};
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { matricNumber: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("courses", "courseCode courseTitle")
      .populate("department", "departmentName departmentCode")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: students,
    });
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Student by ID
// @route   GET /api/users/students/:id
// @access  Private (Admin)
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("courses", "courseCode courseTitle")
      .populate("department", "departmentName departmentCode faculty");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Student
// @route   PUT /api/users/students/:id
// @access  Private (Admin)
export const updateStudent = async (req, res) => {
  try {
    const { fullname, email, matricNumber, department, courses, level } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (department) {
      const departmentDoc = await (await import("../models/department.model.js")).default.findById(department);
      if (!departmentDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid department ID",
        });
      }
    }

    // Handle courses update with Course bidirectional update
    if (courses) {
      const coursesArray = Array.isArray(courses) ? courses : [courses];
      const Course = (await import("../models/course.model.js")).default;
      const validCourses = await Course.find({ _id: { $in: coursesArray } });
      
      if (validCourses.length !== coursesArray.length) {
        return res.status(400).json({
          success: false,
          message: "One or more course IDs are invalid",
        });
      }

      // Remove student from old courses
      const oldCourses = student.courses.map(c => c.toString());
      const coursesToRemove = oldCourses.filter(c => !coursesArray.includes(c));
      if (coursesToRemove.length > 0) {
        await Course.updateMany(
          { _id: { $in: coursesToRemove } },
          { $pull: { students: student._id } }
        );
      }

      // Add student to new courses
      const coursesToAdd = coursesArray.filter(c => !oldCourses.includes(c));
      if (coursesToAdd.length > 0) {
        await Course.updateMany(
          { _id: { $in: coursesToAdd } },
          { $addToSet: { students: student._id } }
        );
      }

      student.courses = coursesArray;
    }

    if (email || matricNumber) {
      const duplicateQuery = { _id: { $ne: req.params.id } };
      const orConditions = [];

      if (email) orConditions.push({ email });
      if (matricNumber) orConditions.push({ matricNumber });

      if (orConditions.length > 0) {
        duplicateQuery.$or = orConditions;
        const duplicate = await Student.findOne(duplicateQuery);

        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: "Student with this email or matric number already exists",
          });
        }
      }
    }

    if (fullname) student.fullname = fullname;
    if (email) student.email = email;
    if (matricNumber) student.matricNumber = matricNumber;
    if (department) student.department = department;
    if (level) student.level = level;

    await student.save();
    await student.populate("department", "departmentName departmentCode");
    await student.populate("courses", "courseCode courseTitle");

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Student
// @route   DELETE /api/users/students/:id
// @access  Private (Admin)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
