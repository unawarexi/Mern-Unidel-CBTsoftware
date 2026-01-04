import crypto from "crypto";
import bcrypt from "bcryptjs";
import Lecturer from "../models/lecturer.model.js";
import Course from "../models/course.model.js";
import Exam from "../models/exam.model.js";
import QuestionBank from "../models/question.model.js";
import Student from "../models/student.model.js";
import { generateEmployeeId, generateLecturerId } from "../core/helpers/helper-functions.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

// @desc    Create Lecturer (Admin only)
// @route   POST /api/users/lecturers
// @access  Private (Admin)
export const createLecturer = async (req, res) => {
  try {
    let { fullname, email, lecturerId, employeeId, department, courses } = req.body; // <-- Added courses

    if (!fullname || !email || !department) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Ensure department is an array
    const departmentArray = Array.isArray(department) ? department : [department];

    // Validate all department IDs exist
    const Department = (await import("../models/department.model.js")).default;
    const validDepartments = await Department.find({ _id: { $in: departmentArray } });
    
    if (validDepartments.length !== departmentArray.length) {
      return res.status(400).json({
        success: false,
        message: "One or more department IDs are invalid",
      });
    }

    // Validate courses if provided
    const coursesArray = Array.isArray(courses) ? courses : (courses ? [courses] : []);
    if (coursesArray.length > 0) {
      const validCourses = await Course.find({ _id: { $in: coursesArray } });
      if (validCourses.length !== coursesArray.length) {
        return res.status(400).json({
          success: false,
          message: "One or more course IDs are invalid",
        });
      }
    }

    const count = await Lecturer.countDocuments();
    if (!lecturerId) lecturerId = generateLecturerId(count + 1);
    if (!employeeId) employeeId = generateEmployeeId(count + 1);

    const existingLecturer = await Lecturer.findOne({
      $or: [{ email }, { lecturerId }, { employeeId }],
    });

    if (existingLecturer) {
      return res.status(400).json({
        success: false,
        message: "Lecturer with this email, lecturer ID, or employee ID already exists",
      });
    }

    const randomPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    const lecturer = await Lecturer.create({
      fullname,
      email,
      password: hashedPassword,
      lecturerId,
      employeeId,
      department: departmentArray,
      courses: coursesArray, // <-- Now saving courses
      role: "lecturer",
      isFirstLogin: true,
    });

    // Update each course to include this lecturer
    if (coursesArray.length > 0) {
      await Course.updateMany(
        { _id: { $in: coursesArray } },
        { $addToSet: { lecturers: lecturer._id } }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    lecturer.resetPasswordToken = hashedToken;
    lecturer.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await lecturer.save();

    let emailSent = false;
    try {
      const mailGen = new EmailContentGenerator();
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&role=lecturer`;
      const emailContent = mailGen.adminCreatedAccountEmail({
        fullName: lecturer.fullname,
        role: "lecturer",
        email: lecturer.email,
        tempPassword: randomPassword,
        resetUrl,
        userId: lecturer._id,
      });
      await Mailer.sendTemplatedMail(lecturer.email, emailContent);
      emailSent = true;
    } catch (err) {
      console.error("Error sending lecturer account email:", err);
    }

    // Populate department and courses before sending response
    await lecturer.populate("department", "departmentName departmentCode");
    await lecturer.populate("courses", "courseCode courseTitle");

    res.status(201).json({
      success: true,
      message: `Lecturer created successfully.${emailSent ? " Credentials sent to email." : " Failed to send credentials email."}`,
      emailSent,
      data: {
        id: lecturer._id,
        fullname: lecturer.fullname,
        email: lecturer.email,
        lecturerId: lecturer.lecturerId,
        employeeId: lecturer.employeeId,
        department: lecturer.department,
        courses: lecturer.courses, // <-- Include courses in response
      },
      credentials: { email, password: randomPassword },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Lecturers
// @route   GET /api/users/lecturers
// @access  Private (Admin)
export const getAllLecturers = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, search } = req.query;

    const query = {};
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { lecturerId: { $regex: search, $options: "i" } },
      ];
    }

    const lecturers = await Lecturer.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("courses", "courseCode courseTitle department")
      .populate("department", "departmentName departmentCode")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lecturer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: lecturers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: lecturers,
    });
  } catch (error) {
    console.error("Error in getAllLecturers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Lecturer by ID
// @route   GET /api/users/lecturers/:id
// @access  Private (Admin)
export const getLecturerById = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("courses", "courseCode courseTitle department")
      .populate("department", "departmentName departmentCode faculty");

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lecturer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Lecturer
// @route   PUT /api/users/lecturers/:id
// @access  Private (Admin)
export const updateLecturer = async (req, res) => {
  try {
    const { fullname, email, lecturerId, employeeId, department, courses } = req.body;

    const lecturer = await Lecturer.findById(req.params.id);

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
      });
    }

    if (department) {
      const departmentArray = Array.isArray(department) ? department : [department];
      const Department = (await import("../models/department.model.js")).default;
      const validDepartments = await Department.find({ _id: { $in: departmentArray } });
      
      if (validDepartments.length !== departmentArray.length) {
        return res.status(400).json({
          success: false,
          message: "One or more department IDs are invalid",
        });
      }
      lecturer.department = departmentArray;
    }

    // Handle courses update with Course bidirectional update
    if (courses) {
      const coursesArray = Array.isArray(courses) ? courses : [courses];
      const validCourses = await Course.find({ _id: { $in: coursesArray } });
      
      if (validCourses.length !== coursesArray.length) {
        return res.status(400).json({
          success: false,
          message: "One or more course IDs are invalid",
        });
      }

      // Remove lecturer from old courses
      const oldCourses = lecturer.courses.map(c => c.toString());
      const coursesToRemove = oldCourses.filter(c => !coursesArray.includes(c));
      if (coursesToRemove.length > 0) {
        await Course.updateMany(
          { _id: { $in: coursesToRemove } },
          { $pull: { lecturers: lecturer._id } }
        );
      }

      // Add lecturer to new courses
      const coursesToAdd = coursesArray.filter(c => !oldCourses.includes(c));
      if (coursesToAdd.length > 0) {
        await Course.updateMany(
          { _id: { $in: coursesToAdd } },
          { $addToSet: { lecturers: lecturer._id } }
        );
      }

      lecturer.courses = coursesArray;
    }

    if (email || lecturerId || employeeId) {
      const duplicateQuery = { _id: { $ne: req.params.id } };
      const orConditions = [];

      if (email) orConditions.push({ email });
      if (lecturerId) orConditions.push({ lecturerId });
      if (employeeId) orConditions.push({ employeeId });

      if (orConditions.length > 0) {
        duplicateQuery.$or = orConditions;
        const duplicate = await Lecturer.findOne(duplicateQuery);

        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: "Lecturer with this email, lecturer ID, or employee ID already exists",
          });
        }
      }
    }

    if (fullname) lecturer.fullname = fullname;
    if (email) lecturer.email = email;
    if (lecturerId) lecturer.lecturerId = lecturerId;
    if (employeeId) lecturer.employeeId = employeeId;

    await lecturer.save();
    await lecturer.populate("department", "departmentName departmentCode");
    await lecturer.populate("courses", "courseCode courseTitle");

    res.status(200).json({
      success: true,
      message: "Lecturer updated successfully",
      data: lecturer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Lecturer
// @route   DELETE /api/users/lecturers/:id
// @access  Private (Admin)
export const deleteLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id);

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Lecturer not found",
      });
    }

    await lecturer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lecturer deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all courses for the logged-in lecturer
// @route   GET /api/users/lecturers/me/courses
// @access  Private (Lecturer)
export const getLecturerCourses = async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const lecturer = await Lecturer.findById(req.user.userId);
    if (!lecturer) {
      return res.status(404).json({ success: false, message: "Lecturer not found" });
    }

    const courses = await Course.find({ _id: { $in: lecturer.courses } })
      .populate("department", "departmentName departmentCode")
      .populate("lecturers", "fullname email")
      .populate("students", "fullname email matricNumber");

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all exams for the logged-in lecturer
// @route   GET /api/users/lecturers/me/exams
// @access  Private (Lecturer)
export const getLecturerExams = async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const exams = await Exam.find({ lecturerId: req.user.userId })
      .populate("courseId", "courseCode courseTitle");

    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all question banks for the logged-in lecturer
// @route   GET /api/users/lecturers/me/question-banks
// @access  Private (Lecturer)
export const getLecturerQuestionBanks = async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const banks = await QuestionBank.find({ lecturerId: req.user.userId })
      .populate("courseId", "courseCode courseTitle");

    res.status(200).json({ success: true, data: banks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students for the logged-in lecturer
// @route   GET /api/users/lecturers/me/students
// @access  Private (Lecturer)
export const getLecturerStudents = async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const lecturer = await Lecturer.findById(req.user.userId).populate("courses");
    if (!lecturer) {
      return res.status(404).json({ success: false, message: "Lecturer not found" });
    }

    const courseIds = lecturer.courses.map((c) => c._id);
    const students = await Student.find({ courses: { $in: courseIds } })
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("department", "departmentName departmentCode")
      .populate("courses", "courseCode courseTitle")
      .lean();

    const courseMap = {};
    lecturer.courses.forEach((c) => {
      courseMap[c._id.toString()] = { courseTitle: c.courseTitle, courseCode: c.courseCode };
    });

    students.forEach((student) => {
      const sharedCourses = (student.courses || [])
        .map((c) => c._id.toString())
        .filter((cid) => courseMap[cid])
        .map((cid) => courseMap[cid]);
      student.coursesInfo = sharedCourses;
    });

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
