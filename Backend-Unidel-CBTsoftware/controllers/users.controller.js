import crypto from "crypto";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import Lecturer from "../models/lecturer.model.js";
import Student from "../models/student.model.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

// Helper to get user model based on role
const getUserModel = (role) => {
  const models = { admin: Admin, lecturer: Lecturer, student: Student };
  return models[role];
};

// ========== LECTURER CRUD OPERATIONS ==========

// @desc    Create Lecturer (Admin only)
// @route   POST /api/users/lecturers
// @access  Private (Admin)
export const createLecturer = async (req, res) => {
  try {
    const { fullname, email, lecturerId, employeeId, department } = req.body;

    // Validate required fields
    if (!fullname || !email || !lecturerId || !employeeId || !department) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if lecturer exists
    const existingLecturer = await Lecturer.findOne({
      $or: [{ email }, { lecturerId }, { employeeId }],
    });

    if (existingLecturer) {
      return res.status(400).json({
        success: false,
        message: "Lecturer with this email, lecturer ID, or employee ID already exists",
      });
    }

    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Create lecturer
    const lecturer = await Lecturer.create({
      fullname,
      email,
      password: hashedPassword,
      lecturerId,
      employeeId,
      department,
      role: "lecturer",
      isFirstLogin: true,
    });

    // Generate reset token so lecturer is forced to set password via email
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    lecturer.resetPasswordToken = hashedToken;
    lecturer.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await lecturer.save();

    // Send account created email
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
    } catch (err) {
      console.error("Error sending lecturer account email:", err);
    }

    res.status(201).json({
      success: true,
      message: "Lecturer created successfully. Credentials sent to email.",
      data: {
        id: lecturer._id,
        fullname: lecturer.fullname,
        email: lecturer.email,
        lecturerId: lecturer.lecturerId,
        employeeId: lecturer.employeeId,
        department: lecturer.department,
      },
      credentials: { email, password: randomPassword }, // Remove in production
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

    // Build query
    const query = {};
    if (department) query.department = department;
    if (search) {
      query.$or = [{ fullname: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { lecturerId: { $regex: search, $options: "i" } }];
    }

    // Execute query with pagination
    const lecturers = await Lecturer.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("courses", "courseName courseCode")
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Lecturer by ID
// @route   GET /api/users/lecturers/:id
// @access  Private (Admin)
export const getLecturerById = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires").populate("courses", "courseName courseCode");

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

    // Check for duplicate email, lecturerId, or employeeId (excluding current lecturer)
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

    // Update fields
    if (fullname) lecturer.fullname = fullname;
    if (email) lecturer.email = email;
    if (lecturerId) lecturer.lecturerId = lecturerId;
    if (employeeId) lecturer.employeeId = employeeId;
    if (department) lecturer.department = department;
    if (courses) lecturer.courses = courses;

    await lecturer.save();

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

// ========== STUDENT CRUD OPERATIONS ==========

// @desc    Create Student (Admin only)
// @route   POST /api/users/students
// @access  Private (Admin)
export const createStudent = async (req, res) => {
  try {
    const { fullname, email, matricNumber, department } = req.body;

    // Validate required fields
    if (!fullname || !email || !matricNumber || !department) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if student exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { matricNumber }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or matric number already exists",
      });
    }

    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Create student
    const student = await Student.create({
      fullname,
      email,
      password: hashedPassword,
      matricNumber,
      department,
      role: "student",
      isFirstLogin: true,
    });

    // Create reset token for student
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    student.resetPasswordToken = hashedToken;
    student.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await student.save();

    // Send account created email
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
    } catch (err) {
      console.error("Error sending student account email:", err);
    }

    res.status(201).json({
      success: true,
      message: "Student created successfully. Credentials sent to email.",
      data: {
        id: student._id,
        fullname: student.fullname,
        email: student.email,
        matricNumber: student.matricNumber,
        department: student.department,
      },
      credentials: { email, password: randomPassword }, // Remove in production
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

    // Build query
    const query = {};
    if (department) query.department = department;
    if (search) {
      query.$or = [{ fullname: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { matricNumber: { $regex: search, $options: "i" } }];
    }

    // Execute query with pagination
    const students = await Student.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("courses", "courseName courseCode")
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Student by ID
// @route   GET /api/users/students/:id
// @access  Private (Admin)
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires").populate("courses", "courseName courseCode");

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
    const { fullname, email, matricNumber, department, courses } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check for duplicate email or matricNumber (excluding current student)
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

    // Update fields
    if (fullname) student.fullname = fullname;
    if (email) student.email = email;
    if (matricNumber) student.matricNumber = matricNumber;
    if (department) student.department = department;
    if (courses) student.courses = courses;

    await student.save();

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

// ========== ADMIN CRUD OPERATIONS ==========

// @desc    Create Admin (Super Admin only)
// @route   POST /api/users/admins
// @access  Private (Super Admin)
export const createAdmin = async (req, res) => {
  try {
    const { fullname, email, adminId, organisation, role = "admin" } = req.body;

    // Validate required fields
    if (!fullname || !email || !adminId || !organisation) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { adminId }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email or admin ID already exists",
      });
    }

    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Create admin
    const admin = await Admin.create({
      fullname,
      email,
      password: hashedPassword,
      adminId,
      organisation,
      role,
    });

    // Create reset token for admin
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await admin.save();

    // Send account created email
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
    } catch (err) {
      console.error("Error sending admin account email:", err);
    }

    res.status(201).json({
      success: true,
      message: "Admin created successfully. Credentials sent to email.",
      data: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        adminId: admin.adminId,
        organisation: admin.organisation,
        role: admin.role,
      },
      credentials: { email, password: randomPassword }, // Remove in production
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

    // Build query
    const query = {};
    if (organisation) query.organisation = organisation;
    if (search) {
      query.$or = [{ fullname: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { adminId: { $regex: search, $options: "i" } }];
    }

    // Execute query with pagination
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
    const admin = await Admin.findById(req.params.id).select("-password -resetPasswordToken -resetPasswordExpires");

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

    // Check for duplicate email or adminId (excluding current admin)
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

    // Update fields
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

    // Prevent deleting yourself
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

// ========== UTILITY ENDPOINTS ==========

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin)
export const getUserStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalLecturers = await Lecturer.countDocuments();
    const totalAdmins = await Admin.countDocuments();

    // Get department-wise distribution
    const studentsByDept = await Student.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);

    const lecturersByDept = await Lecturer.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalLecturers,
          totalAdmins,
          totalUsers: totalStudents + totalLecturers + totalAdmins,
        },
        studentsByDepartment: studentsByDept,
        lecturersByDepartment: lecturersByDept,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
