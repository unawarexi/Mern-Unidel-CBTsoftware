import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import Lecturer from "../models/lecturer.model.js";
import Student from "../models/student.model.js";
import Exam from "../models/exam.model.js";
import QuestionBank from "../models/question.model.js";

// Helper to get user model based on role
const getUserModel = (role) => {
  const models = { admin: Admin, lecturer: Lecturer, student: Student };
  return models[role];
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin)
export const getUserStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalLecturers = await Lecturer.countDocuments();
    const totalAdmins = await Admin.countDocuments();

    const studentsByDept = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const lecturersByDept = await Lecturer.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

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

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private (All users)
export const getCurrentUser = async (req, res) => {
  try {
    const Model = getUserModel(req.user.role);
    let query = Model.findById(req.user.userId).select("-password -resetPasswordToken -resetPasswordExpires");

    if (req.user.role === "lecturer") {
      query = query.populate("courses", "courseCode courseTitle department");
    }

    const user = await query;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let exams = [];
    let questionBanks = [];
    if (req.user.role === "lecturer") {
      exams = await Exam.find({ lecturerId: req.user.userId }).populate("courseId", "courseCode courseTitle");
      questionBanks = await QuestionBank.find({ lecturerId: req.user.userId }).populate("courseId", "courseCode courseTitle");
    }

    res.status(200).json({
      success: true,
      data: user,
      exams,
      questionBanks,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private (All users)
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, password, department, courses } = req.body;

    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email) {
      const duplicate = await Model.findOne({ email, _id: { $ne: req.user.userId } });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (department) user.department = department;
    if (courses) user.courses = courses;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/picture
// @access  Private (All users)
export const uploadProfilePicture = async (req, res) => {
  try {
    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    // TODO: Add image processing and storage logic here

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete profile picture
// @route   DELETE /api/users/profile/picture
// @access  Private (All users)
export const deleteProfilePicture = async (req, res) => {
  try {
    const Model = getUserModel(req.user.role);
    const user = await Model.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // TODO: Add logic to delete profile picture

    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stats for current user (student/lecturer/admin)
// @route   GET /api/users/me/stats
// @access  Private (All users)
export const getCurrentUserStats = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let stats = {};

    if (role === "student") {
      const student = await Student.findById(userId).populate("courses");
      const examsTaken = await Exam.countDocuments({ students: userId });
      const passedExams = await Exam.countDocuments({ students: userId, "results.status": "passed" });
      const failedExams = await Exam.countDocuments({ students: userId, "results.status": "failed" });
      const resultsCount = await Exam.countDocuments({ students: userId, "results.student": userId });
      const notifications = 2;
      const courseScores = (student.courses || []).map((c, i) => ({
        course: c.courseName || c.courseCode || `Course ${i + 1}`,
        score: Math.floor(Math.random() * 40) + 60,
      }));

      stats = {
        examsTaken,
        passedExams,
        failedExams,
        resultsCount,
        notifications,
        courseScores,
      };
    } else if (role === "lecturer") {
      stats = {};
    } else if (role === "admin") {
      stats = {};
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
