import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import ExamSubmission from "../models/submission.model.js";
import Exam from "../models/exam.model.js";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";
import SecurityViolation from "../models/security.model.js";

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate grade based on percentage
 */
const calculateGrade = (percentage) => {
  if (percentage >= 70) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 45) return "D";
  if (percentage >= 40) return "E";
  return "F";
};

/**
 * Get time remaining in seconds
 */
const getTimeRemaining = (endTime) => {
  const now = dayjs();
  const end = dayjs(endTime);
  const diffInSeconds = end.diff(now, "second");
  
  if (diffInSeconds <= 0) {
    return {
      expired: true,
      totalSeconds: 0,
      minutes: 0,
      seconds: 0,
      endTime: end.toISOString(),
    };
  }
  
  return {
    expired: false,
    totalSeconds: diffInSeconds,
    minutes: Math.floor(diffInSeconds / 60),
    seconds: diffInSeconds % 60,
    endTime: end.toISOString(),
  };
};

/**
 * Check if exam is currently active
 */
const isExamActive = (exam) => {
  const now = dayjs();
  const start = dayjs(exam.startTime);
  const end = dayjs(exam.endTime);
  
  return now.isAfter(start) && now.isBefore(end) && exam.status === "active";
};

/**
 * Grade a submission by comparing answers with correct answers
 */
const gradeSubmission = async (submission, exam) => {
  let totalScore = 0;
  let totalMarks = 0;

  // Create a map of question IDs to correct answers
  const correctAnswersMap = new Map();
  exam.questions.forEach((q) => {
    correctAnswersMap.set(q._id.toString(), {
      correctAnswer: q.correctAnswer,
      marks: q.marks || 1,
    });
    totalMarks += q.marks || 1;
  });

  // Grade each answer
  submission.answers.forEach((answer) => {
    const questionData = correctAnswersMap.get(answer.questionId);
    if (questionData) {
      const isCorrect = answer.answer.trim().toLowerCase() === questionData.correctAnswer.trim().toLowerCase();
      answer.isCorrect = isCorrect;
      answer.marksAwarded = isCorrect ? questionData.marks : 0;
      totalScore += answer.marksAwarded;
    }
  });

  // Calculate percentage and grade
  const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
  const grade = calculateGrade(percentage);
  const passed = percentage >= (exam.passingPercentage || 50);

  // Update submission
  submission.score = totalScore;
  submission.totalMarks = totalMarks;
  submission.percentage = Math.round(percentage * 100) / 100;
  submission.grade = grade;
  submission.passed = passed;
  submission.status = "graded";
  submission.gradedAt = dayjs().toDate();

  return submission;
};

/**
 * Send grade notification email to student
 */
const sendGradeNotification = async (submission, student, exam, course) => {
  try {
    const mailGen = new EmailContentGenerator();
    const emailContent = mailGen.gradeNotification({
      studentName: student.fullname,
      examTitle: `${course.courseCode} - ${course.courseTitle}`,
      score: submission.score,
      total: submission.totalMarks,
      remarks: submission.passed ? "Congratulations! You passed." : "Unfortunately, you did not pass. Keep studying!",
      viewResultsUrl: `${process.env.FRONTEND_URL}/student/results/${submission._id}`,
      studentId: student._id,
    });

    await Mailer.sendTemplatedMail(student.email, emailContent);
  } catch (error) {
    console.error("Error sending grade notification:", error);
  }
};

// ==================== STUDENT OPERATIONS ====================

/**
 * Start an exam (create submission)
 * POST /api/submissions/start/:examId
 */
export const startExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user._id;

    // Get exam details with full course population
    const exam = await Exam.findById(examId)
      .populate({
        path: "courseId",
        select: "courseCode courseTitle students department",
      })
      .populate("lecturerId", "fullname email");

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    // Check if exam is active using dayjs
    if (!isExamActive(exam)) {
      const now = dayjs();
      const start = dayjs(exam.startTime);
      const end = dayjs(exam.endTime);
      
      if (now.isBefore(start)) {
        return res.status(400).json({
          success: false,
          message: "Exam has not started yet",
          startTime: exam.startTime,
        });
      }
      
      if (now.isAfter(end)) {
        return res.status(400).json({
          success: false,
          message: "Exam has ended",
          endTime: exam.endTime,
        });
      }
      
      return res.status(400).json({
        success: false,
        message: "Exam is not currently active",
        status: exam.status,
      });
    }

    // Check if student is enrolled in the course
    if (!exam.courseId || !exam.courseId.students) {
      return res.status(500).json({
        success: false,
        message: "Course data incomplete",
      });
    }

    const isEnrolled = exam.courseId.students.some(
      (s) => s.toString() === studentId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
        courseCode: exam.courseId.courseCode,
      });
    }

    // Check if submission already exists
    const existingSubmission = await ExamSubmission.findOne({ examId, studentId });

    if (existingSubmission) {
      const timeRemaining = getTimeRemaining(exam.endTime);
      
      return res.status(200).json({
        success: true,
        message: "Exam already started",
        submission: existingSubmission,
        exam: {
          _id: exam._id,
          courseCode: exam.courseId?.courseCode,
          courseTitle: exam.courseId?.courseTitle,
          duration: exam.duration,
          startTime: exam.startTime,
          endTime: exam.endTime,
          questions: exam.questions.map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options,
            marks: q.marks,
          })),
        },
        timeRemaining,
        serverTime: dayjs().toISOString(),
      });
    }

    // Create new submission with dayjs
    const startTime = dayjs();

    const submission = await ExamSubmission.create({
      examId,
      studentId,
      answers: [],
      startedAt: startTime.toDate(),
      ipAddress: req.ip || req.headers["x-forwarded-for"],
      userAgent: req.headers["user-agent"],
    });

    const timeRemaining = getTimeRemaining(exam.endTime);

    res.status(201).json({
      success: true,
      message: "Exam started successfully",
      submission,
      exam: {
        _id: exam._id,
        courseCode: exam.courseId?.courseCode,
        courseTitle: exam.courseId?.courseTitle,
        duration: exam.duration,
        startTime: exam.startTime,
        endTime: exam.endTime,
        questions: exam.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          marks: q.marks,
        })),
      },
      timeRemaining,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Start exam error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Save answer to a question (auto-save)
 * PUT /api/submissions/:id/answer
 */
export const saveAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, answer } = req.body;
    const studentId = req.user._id;

    const submission = await ExamSubmission.findOne({ _id: id, studentId }).populate("examId");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.status !== "started") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify submitted exam",
      });
    }

    // Check if exam time has expired
    const timeRemaining = getTimeRemaining(submission.examId.endTime);
    if (timeRemaining.expired) {
      return res.status(400).json({
        success: false,
        message: "Exam time has expired",
        timeRemaining,
      });
    }

    // Check if answer already exists
    const existingAnswerIndex = submission.answers.findIndex((a) => a.questionId === questionId);

    if (existingAnswerIndex !== -1) {
      // Update existing answer
      submission.answers[existingAnswerIndex].answer = answer;
    } else {
      // Add new answer
      submission.answers.push({ questionId, answer });
    }

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Answer saved",
      submission,
      timeRemaining,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Save answer error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Submit exam
 * POST /api/submissions/:id/submit
 */
export const submitExam = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    let submission = await ExamSubmission.findOne({ _id: id, studentId }).populate({
      path: "examId",
      populate: { path: "courseId", select: "courseCode courseTitle" },
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.status !== "started") {
      return res.status(400).json({
        success: false,
        message: "Exam already submitted",
      });
    }

    const exam = submission.examId;
    const now = dayjs();
    const startTime = dayjs(submission.startedAt);

    // Calculate time spent in seconds
    const timeSpent = now.diff(startTime, "second");
    submission.timeSpent = timeSpent;
    submission.submittedAt = now.toDate();
    submission.status = "submitted";
    submission.submissionType = "manual";

    // Check for violations and flag if necessary
    const violationCount = await SecurityViolation.countViolations(submission._id);
    if (violationCount > 0) {
      submission.flagged = true;
      submission.flagReason = `${violationCount} security violation(s) detected during exam`;
    }

    // Grade the submission
    submission = await gradeSubmission(submission, exam);
    await submission.save();

    // Update exam statistics
    await updateExamStatistics(exam._id);

    // Send confirmation email
    const student = await Student.findById(studentId);
    if (student) {
      try {
        const mailGen = new EmailContentGenerator();
        const emailContent = mailGen.submissionConfirmation({
          studentName: student.fullname,
          examTitle: `${exam.courseId.courseCode} - ${exam.courseId.courseTitle}`,
          submittedAt: dayjs(submission.submittedAt).format("MMMM D, YYYY h:mm A"),
          submissionId: submission._id,
          studentId: student._id,
        });
        await Mailer.sendTemplatedMail(student.email, emailContent);
      } catch (emailError) {
        console.error("Error sending submission confirmation:", emailError);
      }

      // Send grade notification
      await sendGradeNotification(submission, student, exam, exam.courseId);
    }

    res.status(200).json({
      success: true,
      message: "Exam submitted and graded successfully",
      submission,
      violations: violationCount,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Submit exam error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get student's submission for an exam
 * GET /api/submissions/exam/:examId
 */
export const getStudentSubmission = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user._id;

    const submission = await ExamSubmission.findOne({ examId, studentId }).populate({
      path: "examId",
      populate: { path: "courseId", select: "courseCode courseTitle" },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "No submission found for this exam",
      });
    }

    // Get time remaining if exam is still active
    const exam = await Exam.findById(examId);
    const timeRemaining = exam ? getTimeRemaining(exam.endTime) : null;

    res.status(200).json({
      success: true,
      submission,
      timeRemaining,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Get submission error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all submissions for a student
 * GET /api/submissions/student/me
 */
export const getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { studentId };
    if (status) query.status = status;

    const submissions = await ExamSubmission.find(query)
      .populate({
        path: "examId",
        populate: { path: "courseId", select: "courseCode courseTitle" },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ExamSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: submissions,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Get my submissions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== LECTURER OPERATIONS ====================

/**
 * Get all submissions for an exam (Lecturer)
 * GET /api/submissions/exam/:examId/all
 */
export const getExamSubmissions = async (req, res) => {
  try {
    const { examId } = req.params;
    const lecturerId = req.user._id;
    const { status, page = 1, limit = 50 } = req.query;

    const exam = await Exam.findOne({ _id: examId, lecturerId });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or you don't have access",
      });
    }

    const query = { examId };
    if (status) query.status = status;

    const submissions = await ExamSubmission.find(query)
      .populate("studentId", "fullname email matricNumber")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ submittedAt: -1 });

    const total = await ExamSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: submissions,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Get exam submissions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get exam statistics and analytics (Lecturer)
 * GET /api/submissions/exam/:examId/statistics
 */
export const getExamStatistics = async (req, res) => {
  try {
    const { examId } = req.params;
    const lecturerId = req.user._id;

    const exam = await Exam.findOne({ _id: examId, lecturerId }).populate("courseId", "courseCode courseTitle students");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or you don't have access",
      });
    }

    const submissions = await ExamSubmission.find({ examId, status: { $in: ["submitted", "graded", "autoSubmitted"] } }).populate(
      "studentId",
      "fullname email matricNumber"
    );

    const totalStudents = exam.courseId.students.length;
    const totalSubmissions = submissions.length;
    const completionRate = totalStudents > 0 ? (totalSubmissions / totalStudents) * 100 : 0;

    const passedSubmissions = submissions.filter((s) => s.passed);
    const failedSubmissions = submissions.filter((s) => !s.passed);

    const passRate = totalSubmissions > 0 ? (passedSubmissions.length / totalSubmissions) * 100 : 0;
    const failRate = totalSubmissions > 0 ? (failedSubmissions.length / totalSubmissions) * 100 : 0;

    const totalScore = submissions.reduce((sum, s) => sum + s.percentage, 0);
    const averageScore = totalSubmissions > 0 ? totalScore / totalSubmissions : 0;

    const gradeDistribution = submissions.reduce((acc, s) => {
      acc[s.grade] = (acc[s.grade] || 0) + 1;
      return acc;
    }, {});

    const sortedByScore = [...submissions].sort((a, b) => b.percentage - a.percentage);
    const highestScore = sortedByScore[0] || null;
    const lowestScore = sortedByScore[sortedByScore.length - 1] || null;

    const averageTimeSpent =
      totalSubmissions > 0 ? submissions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / totalSubmissions : 0;

    const passedStudents = passedSubmissions.map((s) => ({
      name: s.studentId.fullname,
      email: s.studentId.email,
      matricNumber: s.studentId.matricNumber,
      score: s.score,
      percentage: s.percentage,
      grade: s.grade,
    }));

    const failedStudents = failedSubmissions.map((s) => ({
      name: s.studentId.fullname,
      email: s.studentId.email,
      matricNumber: s.studentId.matricNumber,
      score: s.score,
      percentage: s.percentage,
      grade: s.grade,
    }));

    res.status(200).json({
      success: true,
      statistics: {
        overview: {
          totalStudents,
          totalSubmissions,
          completionRate: Math.round(completionRate * 100) / 100,
          passRate: Math.round(passRate * 100) / 100,
          failRate: Math.round(failRate * 100) / 100,
          averageScore: Math.round(averageScore * 100) / 100,
          averageTimeSpent: Math.round(averageTimeSpent),
        },
        gradeDistribution,
        performance: {
          highestScore: highestScore
            ? {
                student: highestScore.studentId.fullname,
                score: highestScore.score,
                percentage: highestScore.percentage,
                grade: highestScore.grade,
              }
            : null,
          lowestScore: lowestScore
            ? {
                student: lowestScore.studentId.fullname,
                score: lowestScore.score,
                percentage: lowestScore.percentage,
                grade: lowestScore.grade,
              }
            : null,
        },
        passedStudents,
        failedStudents,
      },
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Get exam statistics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Flag a submission (Lecturer)
 * PUT /api/submissions/:id/flag
 */
export const flagSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const lecturerId = req.user._id;

    const submission = await ExamSubmission.findById(id)
      .populate("examId")
      .populate("studentId", "fullname email");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.examId.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    submission.flagged = true;
    submission.flagReason = reason;
    await submission.save();

    // Send notification to student
    try {
      const exam = await Exam.findById(submission.examId._id).populate("courseId", "courseCode courseTitle");
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.submissionFlagged({
        studentName: submission.studentId.fullname,
        examTitle: `${exam.courseId.courseCode} — ${exam.courseId.courseTitle}`,
        flagReason: reason,
        studentId: submission.studentId._id,
      });
      await Mailer.sendTemplatedMail(submission.studentId.email, emailContent);
    } catch (emailError) {
      console.error("Error sending flagged submission email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Submission flagged successfully",
      submission,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Flag submission error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Add feedback to a submission (Lecturer)
 * PUT /api/submissions/:id/feedback
 */
export const addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const lecturerId = req.user._id;

    const submission = await ExamSubmission.findById(id)
      .populate("examId")
      .populate("studentId", "fullname email");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    if (submission.examId.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add feedback",
      });
    }

    submission.lecturerFeedback = feedback;
    await submission.save();

    // Send notification to student
    try {
      const exam = await Exam.findById(submission.examId._id).populate("courseId", "courseCode courseTitle");
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.feedbackReceived({
        studentName: submission.studentId.fullname,
        examTitle: `${exam.courseId.courseCode} — ${exam.courseId.courseTitle}`,
        feedback,
        submissionId: submission._id,
        studentId: submission.studentId._id,
      });
      await Mailer.sendTemplatedMail(submission.studentId.email, emailContent);
    } catch (emailError) {
      console.error("Error sending feedback email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Feedback added successfully",
      submission,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Add feedback error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN OPERATIONS ====================

/**
 * Get all submissions (Admin)
 * GET /api/submissions/admin/all
 */
export const getAllSubmissions = async (req, res) => {
  try {
    const { status, examId, studentId, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (examId) query.examId = examId;
    if (studentId) query.studentId = studentId;

    const submissions = await ExamSubmission.find(query)
      .populate("studentId", "fullname email matricNumber")
      .populate({
        path: "examId",
        populate: { path: "courseId", select: "courseCode courseTitle" },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ExamSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: submissions,
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Get all submissions error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get system-wide submission statistics (Admin)
 * GET /api/submissions/admin/statistics
 */
export const getSystemStatistics = async (req, res) => {
  try {
    const totalSubmissions = await ExamSubmission.countDocuments();
    const gradedSubmissions = await ExamSubmission.countDocuments({ status: "graded" });
    const passedSubmissions = await ExamSubmission.countDocuments({ passed: true });
    const failedSubmissions = await ExamSubmission.countDocuments({ passed: false, status: "graded" });

    const avgScoreResult = await ExamSubmission.aggregate([
      { $match: { status: "graded" } },
      { $group: { _id: null, avgScore: { $avg: "$percentage" } } },
    ]);

    const averageScore = avgScoreResult.length > 0 ? avgScoreResult[0].avgScore : 0;

    const recentSubmissions = await ExamSubmission.find()
      .populate("studentId", "fullname email")
      .populate({
        path: "examId",
        populate: { path: "courseId", select: "courseCode courseTitle" },
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      statistics: {
        totalSubmissions,
        gradedSubmissions,
        passedSubmissions,
        failedSubmissions,
        averageScore: Math.round(averageScore * 100) / 100,
        recentSubmissions,
      },
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Get system statistics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a submission (Admin only)
 * DELETE /api/submissions/:id
 */
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ExamSubmission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    await updateExamStatistics(submission.examId);

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
      serverTime: dayjs().toISOString(),
    });
  } catch (error) {
    console.error("Delete submission error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Update exam statistics after submission changes
 */
const updateExamStatistics = async (examId) => {
  try {
    const submissions = await ExamSubmission.find({
      examId,
      status: { $in: ["submitted", "graded", "autoSubmitted"] },
    });

    const totalSubmissions = submissions.length;
    const totalScore = submissions.reduce((sum, s) => sum + s.percentage, 0);
    const averageScore = totalSubmissions > 0 ? totalScore / totalSubmissions : 0;

    await Exam.findByIdAndUpdate(examId, {
      totalSubmissions,
      averageScore: Math.round(averageScore * 100) / 100,
    });
  } catch (error) {
    console.error("Error updating exam statistics:", error);
  }
};
