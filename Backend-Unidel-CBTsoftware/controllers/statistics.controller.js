import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import isBetween from "dayjs/plugin/isBetween.js";
import ActivityLog from "../models/statistics.model.js";
import Exam from "../models/exam.model.js";
import ExamSubmission from "../models/submission.model.js";
import QuestionBank from "../models/question.model.js";
import Course from "../models/course.model.js";
import Student from "../models/student.model.js";
import Lecturer from "../models/lecturer.model.js";
import Admin from "../models/admin.model.js";
import Department from "../models/department.model.js";

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

// ==================== HELPER FUNCTIONS ====================

/**
 * Get date range for period
 */
const getDateRange = (period, customStart = null, customEnd = null) => {
  const now = dayjs();
  let startDate, endDate;

  switch (period) {
    case "today":
      startDate = now.startOf("day");
      endDate = now.endOf("day");
      break;
    case "yesterday":
      startDate = now.subtract(1, "day").startOf("day");
      endDate = now.subtract(1, "day").endOf("day");
      break;
    case "week":
      startDate = now.startOf("week");
      endDate = now.endOf("week");
      break;
    case "last_week":
      startDate = now.subtract(1, "week").startOf("week");
      endDate = now.subtract(1, "week").endOf("week");
      break;
    case "month":
      startDate = now.startOf("month");
      endDate = now.endOf("month");
      break;
    case "last_month":
      startDate = now.subtract(1, "month").startOf("month");
      endDate = now.subtract(1, "month").endOf("month");
      break;
    case "year":
      startDate = now.startOf("year");
      endDate = now.endOf("year");
      break;
    case "last_year":
      startDate = now.subtract(1, "year").startOf("year");
      endDate = now.subtract(1, "year").endOf("year");
      break;
    case "custom":
      startDate = dayjs(customStart);
      endDate = dayjs(customEnd);
      break;
    default:
      startDate = now.subtract(30, "day");
      endDate = now;
  }

  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  };
};

/**
 * Get time grouping format
 */
const getGroupingFormat = (period) => {
  const formats = {
    today: { $dateToString: { format: "%H:00", date: "$createdAt" } },
    yesterday: { $dateToString: { format: "%H:00", date: "$createdAt" } },
    week: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    last_week: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    month: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    last_month: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    year: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
    last_year: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
  };
  return formats[period] || formats.month;
};

// ==================== ACTIVITY LOG OPERATIONS ====================

/**
 * Create activity log entry
 * POST /api/statistics/activity
 */
export const createActivityLog = async (req, res) => {
  try {
    const { action, entityType, entityId, metadata } = req.body;
    const userId = req.user._id;
    const role = req.user.role;

    const userModel = role === "student" ? "Student" : role === "lecturer" ? "Lecturer" : "Admin";

    const log = await ActivityLog.create({
      userId,
      userModel,
      role,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress: req.ip || req.headers["x-forwarded-for"],
      userAgent: req.headers["user-agent"],
      status: "success",
    });

    res.status(201).json({
      success: true,
      message: "Activity logged",
      data: log,
    });
  } catch (error) {
    console.error("Create activity log error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get activity logs with filters
 * GET /api/statistics/activity
 */
export const getActivityLogs = async (req, res) => {
  try {
    const { userId, role, action, entityType, period, startDate, endDate, page = 1, limit = 50 } = req.query;

    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate);

    const query = {
      createdAt: { $gte: start, $lte: end },
    };

    if (userId) query.userId = userId;
    if (role) query.role = role;
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;

    const logs = await ActivityLog.find(query)
      .populate("userId", "fullname email matricNumber lecturerId adminId")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get activity logs error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DASHBOARD STATISTICS ====================

/**
 * Get admin dashboard statistics
 * GET /api/statistics/admin/dashboard
 */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const { period = "month", startDate, endDate } = req.query;
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate);

    // Users overview
    const totalStudents = await Student.countDocuments();
    const totalLecturers = await Lecturer.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalDepartments = await Department.countDocuments();

    // New users in period
    const newStudents = await Student.countDocuments({ createdAt: { $gte: start, $lte: end } });
    const newLecturers = await Lecturer.countDocuments({ createdAt: { $gte: start, $lte: end } });

    // Exams overview
    const totalExams = await Exam.countDocuments();
    const activeExams = await Exam.countDocuments({ status: "active" });
    const completedExams = await Exam.countDocuments({ status: "completed" });

    // Submissions overview
    const totalSubmissions = await ExamSubmission.countDocuments({ createdAt: { $gte: start, $lte: end } });
    const passedSubmissions = await ExamSubmission.countDocuments({
      passed: true,
      createdAt: { $gte: start, $lte: end },
    });

    // Activity trends
    const activityTrend = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: getGroupingFormat(period),
          count: { $sum: 1 },
          logins: { $sum: { $cond: [{ $eq: ["$action", "login"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top active users
    const topActiveUsers = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { userId: "$userId", role: "$role" },
          activityCount: { $sum: 1 },
        },
      },
      { $sort: { activityCount: -1 } },
      { $limit: 10 },
    ]);

    // Department distribution
    const studentsByDepartment = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          users: {
            totalStudents,
            totalLecturers,
            totalAdmins,
            newStudents,
            newLecturers,
          },
          courses: {
            totalCourses,
            totalDepartments,
          },
          exams: {
            totalExams,
            activeExams,
            completedExams,
          },
          submissions: {
            totalSubmissions,
            passedSubmissions,
            passRate: totalSubmissions > 0 ? ((passedSubmissions / totalSubmissions) * 100).toFixed(2) : 0,
          },
        },
        trends: {
          activity: activityTrend,
          topActiveUsers,
        },
        distribution: {
          studentsByDepartment,
        },
      },
    });
  } catch (error) {
    console.error("Get admin dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get lecturer dashboard statistics
 * GET /api/statistics/lecturer/dashboard
 */
export const getLecturerDashboardStats = async (req, res) => {
  try {
    const lecturerId = req.user._id;
    const { period = "month", startDate, endDate } = req.query;
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate);

    // Lecturer courses
    const lecturer = await Lecturer.findById(lecturerId).populate("courses");
    const courseIds = lecturer.courses.map((c) => c._id);

    // Exams overview
    const totalExams = await Exam.countDocuments({ lecturerId });
    const activeExams = await Exam.countDocuments({ lecturerId, status: "active" });
    const pendingExams = await Exam.countDocuments({ lecturerId, status: "pending" });

    // Question banks
    const totalQuestionBanks = await QuestionBank.countDocuments({ lecturerId });
    const approvedQuestionBanks = await QuestionBank.countDocuments({ lecturerId, status: "approved" });
    const pendingApprovalQuestionBanks = await QuestionBank.countDocuments({ lecturerId, status: "pending_approval" });

    // Students enrolled in lecturer's courses
    const totalStudents = await Student.countDocuments({ courses: { $in: courseIds } });

    // Submissions for lecturer's exams
    const lecturerExams = await Exam.find({ lecturerId }).select("_id");
    const examIds = lecturerExams.map((e) => e._id);

    const totalSubmissions = await ExamSubmission.countDocuments({
      examId: { $in: examIds },
      createdAt: { $gte: start, $lte: end },
    });

    const gradedSubmissions = await ExamSubmission.countDocuments({
      examId: { $in: examIds },
      status: "graded",
      createdAt: { $gte: start, $lte: end },
    });

    // Average scores
    const avgScoreResult = await ExamSubmission.aggregate([
      {
        $match: {
          examId: { $in: examIds },
          status: "graded",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$percentage" },
        },
      },
    ]);

    const averageScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

    // Activity trend
    const activityTrend = await ActivityLog.aggregate([
      {
        $match: {
          userId: lecturerId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: getGroupingFormat(period),
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Exam performance by course
    const examPerformance = await ExamSubmission.aggregate([
      {
        $match: {
          examId: { $in: examIds },
          status: "graded",
        },
      },
      {
        $lookup: {
          from: "exams",
          localField: "examId",
          foreignField: "_id",
          as: "exam",
        },
      },
      { $unwind: "$exam" },
      {
        $lookup: {
          from: "courses",
          localField: "exam.courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $group: {
          _id: "$course.courseCode",
          courseTitle: { $first: "$course.courseTitle" },
          avgScore: { $avg: "$percentage" },
          submissions: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          courses: courseIds.length,
          totalExams,
          activeExams,
          pendingExams,
          totalStudents,
          totalQuestionBanks,
          approvedQuestionBanks,
          pendingApprovalQuestionBanks,
        },
        submissions: {
          totalSubmissions,
          gradedSubmissions,
          averageScore: averageScore.toFixed(2),
        },
        trends: {
          activity: activityTrend,
        },
        performance: {
          examPerformance,
        },
      },
    });
  } catch (error) {
    console.error("Get lecturer dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get student dashboard statistics
 * GET /api/statistics/student/dashboard
 */
export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { period = "month", startDate, endDate } = req.query;
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate);

    // Student info
    const student = await Student.findById(studentId).populate("courses");
    const courseIds = student.courses.map((c) => c._id);

    // Exams available
    const availableExams = await Exam.countDocuments({
      courseId: { $in: courseIds },
      status: { $in: ["pending", "active"] },
    });

    // Submissions
    const totalSubmissions = await ExamSubmission.countDocuments({ studentId });
    const completedSubmissions = await ExamSubmission.countDocuments({
      studentId,
      status: { $in: ["submitted", "graded"] },
    });
    const passedExams = await ExamSubmission.countDocuments({ studentId, passed: true });
    const failedExams = await ExamSubmission.countDocuments({ studentId, passed: false, status: "graded" });

    // Average score
    const avgScoreResult = await ExamSubmission.aggregate([
      { $match: { studentId: studentId, status: "graded" } },
      { $group: { _id: null, avgScore: { $avg: "$percentage" } } },
    ]);

    const averageScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

    // Performance trend
    const performanceTrend = await ExamSubmission.aggregate([
      {
        $match: {
          studentId: studentId,
          status: "graded",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: getGroupingFormat(period),
          avgScore: { $avg: "$percentage" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Performance by course
    const performanceByCourse = await ExamSubmission.aggregate([
      { $match: { studentId: studentId, status: "graded" } },
      {
        $lookup: {
          from: "exams",
          localField: "examId",
          foreignField: "_id",
          as: "exam",
        },
      },
      { $unwind: "$exam" },
      {
        $lookup: {
          from: "courses",
          localField: "exam.courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $group: {
          _id: "$course.courseCode",
          courseTitle: { $first: "$course.courseTitle" },
          avgScore: { $avg: "$percentage" },
          examsTaken: { $sum: 1 },
          passed: { $sum: { $cond: ["$passed", 1, 0] } },
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    // Recent grades
    const recentGrades = await ExamSubmission.find({
      studentId: studentId,
      status: "graded",
    })
      .populate({
        path: "examId",
        populate: { path: "courseId", select: "courseCode courseTitle" },
      })
      .sort({ gradedAt: -1 })
      .limit(5)
      .select("score totalMarks percentage grade gradedAt examId");

    // Activity trend
    const activityTrend = await ActivityLog.aggregate([
      {
        $match: {
          userId: studentId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: getGroupingFormat(period),
          logins: { $sum: { $cond: [{ $eq: ["$action", "login"] }, 1, 0] } },
          examsStarted: { $sum: { $cond: [{ $eq: ["$action", "exam_started"] }, 1, 0] } },
          examsSubmitted: { $sum: { $cond: [{ $eq: ["$action", "exam_submitted"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          enrolledCourses: courseIds.length,
          availableExams,
          totalSubmissions,
          completedSubmissions,
          passedExams,
          failedExams,
          averageScore: averageScore.toFixed(2),
        },
        trends: {
          performance: performanceTrend,
          activity: activityTrend,
        },
        performance: {
          byCourse: performanceByCourse,
          recentGrades,
        },
      },
    });
  } catch (error) {
    console.error("Get student dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== EXAM ANALYTICS ====================

/**
 * Get detailed exam analytics
 * GET /api/statistics/exam/:examId/analytics
 */
export const getExamAnalytics = async (req, res) => {
  try {
    const { examId } = req.params;
    const lecturerId = req.user._id;

    const exam = await Exam.findOne({ _id: examId, lecturerId }).populate("courseId", "courseCode courseTitle");

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found or unauthorized" });
    }

    // Submissions stats
    const submissions = await ExamSubmission.find({ examId, status: { $in: ["submitted", "graded"] } });

    const totalSubmissions = submissions.length;
    const passedCount = submissions.filter((s) => s.passed).length;
    const failedCount = totalSubmissions - passedCount;
    const passRate = totalSubmissions > 0 ? ((passedCount / totalSubmissions) * 100).toFixed(2) : 0;

    // Score distribution
    const scoreDistribution = submissions.reduce((acc, s) => {
      const range = Math.floor(s.percentage / 10) * 10;
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {});

    // Grade distribution
    const gradeDistribution = submissions.reduce((acc, s) => {
      acc[s.grade] = (acc[s.grade] || 0) + 1;
      return acc;
    }, {});

    // Time spent analysis
    const avgTimeSpent = submissions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / (totalSubmissions || 1);

    // Question difficulty analysis
    const questionAnalysis = await ExamSubmission.aggregate([
      { $match: { examId: exam._id } },
      { $unwind: "$answers" },
      {
        $group: {
          _id: "$answers.questionId",
          totalAttempts: { $sum: 1 },
          correctCount: { $sum: { $cond: ["$answers.isCorrect", 1, 0] } },
        },
      },
      {
        $project: {
          questionId: "$_id",
          totalAttempts: 1,
          correctCount: 1,
          difficulty: {
            $multiply: [{ $divide: ["$correctCount", "$totalAttempts"] }, 100],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        examInfo: {
          examId: exam._id,
          courseCode: exam.courseId.courseCode,
          courseTitle: exam.courseId.courseTitle,
          duration: exam.duration,
          totalQuestions: exam.questions.length,
        },
        overview: {
          totalSubmissions,
          passedCount,
          failedCount,
          passRate,
          avgTimeSpent: Math.round(avgTimeSpent),
        },
        distributions: {
          score: scoreDistribution,
          grade: gradeDistribution,
        },
        questionAnalysis,
      },
    });
  } catch (error) {
    console.error("Get exam analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SYSTEM ANALYTICS ====================

/**
 * Get system-wide analytics
 * GET /api/statistics/system/analytics
 */
export const getSystemAnalytics = async (req, res) => {
  try {
    const { period = "month", startDate, endDate } = req.query;
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate);

    // User activity by role
    const activityByRole = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          role: "$_id",
          activityCount: "$count",
          uniqueUsers: { $size: "$uniqueUsers" },
        },
      },
    ]);

    // Most common actions
    const topActions = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // System errors
    const systemErrors = await ActivityLog.countDocuments({
      status: "failed",
      createdAt: { $gte: start, $lte: end },
    });

    // Peak usage hours
    const peakHours = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $project: {
          hour: { $hour: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        activityByRole,
        topActions,
        systemErrors,
        peakHours,
      },
    });
  } catch (error) {
    console.error("Get system analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Export statistics data
 * GET /api/statistics/export
 */
export const exportStatistics = async (req, res) => {
  try {
    const { type, period, startDate, endDate, format = "json" } = req.query;
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate);

    let data;

    switch (type) {
      case "activity":
        data = await ActivityLog.find({ createdAt: { $gte: start, $lte: end } })
          .populate("userId", "fullname email")
          .lean();
        break;
      case "submissions":
        data = await ExamSubmission.find({ createdAt: { $gte: start, $lte: end } })
          .populate("studentId", "fullname matricNumber")
          .populate("examId", "courseId duration")
          .lean();
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid export type" });
    }

    if (format === "csv") {
      // TODO: Implement CSV conversion
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=statistics_${type}_${Date.now()}.csv`);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=statistics_${type}_${Date.now()}.json`);
    }

    res.status(200).json({
      success: true,
      data,
      metadata: {
        type,
        period,
        startDate: start,
        endDate: end,
        count: data.length,
      },
    });
  } catch (error) {
    console.error("Export statistics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
