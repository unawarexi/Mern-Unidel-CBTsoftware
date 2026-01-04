import SecurityViolation from "../models/security.model.js";
import ExamSubmission from "../models/submission.model.js";
import Exam from "../models/exam.model.js";

// Violation threshold before auto-submit (configurable)
const VIOLATION_THRESHOLD = 3;

// Severity mapping
const SEVERITY_MAP = {
  TAB_HIDDEN: "high",
  WINDOW_BLUR: "high",
  ROUTE_CHANGE: "critical",
  EXIT_FULLSCREEN: "medium",
  CONTEXT_MENU: "low",
  COPY_PASTE: "medium",
  DEVTOOLS_OPEN: "high",
};

/**
 * Report a security violation
 * POST /api/security/violations
 */
export const reportViolation = async (req, res) => {
  try {
    const { examId, submissionId, violationType, questionIndex, additionalInfo } = req.body;
    const studentId = req.user._id;

    // Validate submission exists and belongs to student
    const submission = await ExamSubmission.findOne({
      _id: submissionId,
      studentId,
      examId,
      status: "started",
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Active submission not found",
      });
    }

    // Create violation record
    const violation = await SecurityViolation.create({
      studentId,
      examId,
      submissionId,
      violationType,
      severity: SEVERITY_MAP[violationType] || "medium",
      metadata: {
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip || req.headers["x-forwarded-for"],
        questionIndex,
        additionalInfo,
      },
    });

    // Check if threshold exceeded
    const totalViolations = await SecurityViolation.countViolations(submissionId);
    const shouldAutoSubmit = totalViolations >= VIOLATION_THRESHOLD;

    // If threshold exceeded, auto-submit exam
    if (shouldAutoSubmit && submission.status === "started") {
      // Update violation to mark auto-submit triggered
      violation.autoSubmitTriggered = true;
      await violation.save();

      // Auto-submit the exam
      const exam = await Exam.findById(examId);
      submission.submittedAt = new Date();
      submission.status = "autoSubmitted";
      submission.submissionType = "auto";
      submission.flagged = true;
      submission.flagReason = `Auto-submitted due to ${totalViolations} security violations`;

      // Calculate time spent
      const timeSpent = Math.floor((Date.now() - new Date(submission.startedAt)) / 1000);
      submission.timeSpent = timeSpent;

      await submission.save();

      return res.status(200).json({
        success: true,
        message: "Violation logged and exam auto-submitted",
        violation,
        autoSubmitted: true,
        totalViolations,
        submissionId: submission._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Violation logged",
      violation,
      autoSubmitted: false,
      totalViolations,
      remainingAttempts: VIOLATION_THRESHOLD - totalViolations,
    });
  } catch (error) {
    console.error("Report violation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to report violation",
      error: error.message,
    });
  }
};

/**
 * Get violations for a submission
 * GET /api/security/violations/:submissionId
 */
export const getSubmissionViolations = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;

    // Check if user is authorized (student, lecturer, or admin)
    const submission = await ExamSubmission.findById(submissionId).populate("examId");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Authorization check
    const isStudent = submission.studentId.toString() === userId.toString();
    const isLecturer = req.user.role === "lecturer" && submission.examId.lecturerId.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isStudent && !isLecturer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view violations",
      });
    }

    const violations = await SecurityViolation.find({ submissionId })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      violations,
      count: violations.length,
    });
  } catch (error) {
    console.error("Get violations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve violations",
      error: error.message,
    });
  }
};

/**
 * Get all violations for an exam (Lecturer/Admin)
 * GET /api/security/exams/:examId/violations
 */
export const getExamViolations = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user._id;

    // Check authorization
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const isLecturer = req.user.role === "lecturer" && exam.lecturerId.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isLecturer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const violations = await SecurityViolation.find({ examId })
      .populate("studentId", "fullname email matricNumber")
      .populate("submissionId", "status score percentage")
      .sort({ timestamp: -1 });

    // Group by student
    const violationsByStudent = violations.reduce((acc, v) => {
      const studentId = v.studentId._id.toString();
      if (!acc[studentId]) {
        acc[studentId] = {
          student: v.studentId,
          violations: [],
          totalCount: 0,
        };
      }
      acc[studentId].violations.push(v);
      acc[studentId].totalCount++;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      violations,
      violationsByStudent: Object.values(violationsByStudent),
      totalCount: violations.length,
    });
  } catch (error) {
    console.error("Get exam violations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve violations",
      error: error.message,
    });
  }
};

/**
 * Get violation statistics for a student
 * GET /api/security/students/me/violations
 */
export const getMyViolationStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    const violations = await SecurityViolation.find({ studentId })
      .populate("examId", "courseId")
      .populate({
        path: "examId",
        populate: { path: "courseId", select: "courseCode courseTitle" },
      });

    const stats = {
      totalViolations: violations.length,
      byType: {},
      bySeverity: {},
      autoSubmittedExams: violations.filter(v => v.autoSubmitTriggered).length,
    };

    violations.forEach(v => {
      stats.byType[v.violationType] = (stats.byType[v.violationType] || 0) + 1;
      stats.bySeverity[v.severity] = (stats.bySeverity[v.severity] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      stats,
      violations,
    });
  } catch (error) {
    console.error("Get violation stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve violation statistics",
      error: error.message,
    });
  }
};
