import Exam from "../models/exam.model.js";
import QuestionBank from "../models/question.model.js";
import Lecturer from "../models/lecturer.model.js";
import Course from "../models/course.model.js";
import Student from "../models/student.model.js";

import { uploadToCloudinary } from "../services/cloudinary.service.js";
import fs from "fs/promises";
import {
  extractTextFromPDFBuffer,
  extractTextFromDocxBuffer,
  extractTextFromDocxPath,
  extractQuestionsFromFile,
} from "../core/utils/pdf-docx-export.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";




// ==================== QUESTION BANK MANAGEMENT ====================

/**
 * Create a new question bank (draft)
 */
export const createQuestionBank = async (req, res) => {
  try {
    const { courseId, title, description, questions, sourceType } = req.body;
    const lecturerId = req.user._id; // From auth middleware

    // Validate course and lecturer
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer || !lecturer.courses.includes(courseId)) {
      return res.status(403).json({ message: "Not authorized for this course" });
    }

    const questionBank = new QuestionBank({
      lecturerId,
      courseId,
      title,
      description,
      questions: questions || [],
      status: "draft",
      sourceType: sourceType || "manual",
    });

    await questionBank.save();

    res.status(201).json({
      message: "Question bank created successfully",
      questionBank,
    });
  } catch (error) {
    console.error("Create question bank error:", error);
    res.status(500).json({ message: "Failed to create question bank", error: error.message });
  }
};

/**
 * Get all question banks for a lecturer
 */
export const getLecturerQuestionBanks = async (req, res) => {
  try {
    const lecturerId = req.user._id;
    const { status, courseId } = req.query;

    const filter = { lecturerId };
    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;

    const questionBanks = await QuestionBank.find(filter).populate("courseId", "name code").sort({ createdAt: -1 });

    res.status(200).json({
      message: "Question banks retrieved successfully",
      questionBanks,
      count: questionBanks.length,
    });
  } catch (error) {
    console.error("Get question banks error:", error);
    res.status(500).json({ message: "Failed to retrieve question banks", error: error.message });
  }
};

/**
 * Get single question bank by ID
 */
export const getQuestionBankById = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const questionBank = await QuestionBank.findById(id)
      .populate("courseId", "courseCode courseTitle name code")
      .populate("lecturerId", "fullname email")
      .populate("adminReview.reviewedBy", "fullname email");

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    // Allow access if admin or owner
    const ownerId = questionBank.lecturerId?._id?.toString?.() || questionBank.lecturerId?.toString?.();
    if (req.user.role !== "admin" && ownerId !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized to access this question bank" });
    }

    res.status(200).json({
      message: "Question bank retrieved successfully",
      questionBank,
    });
  } catch (error) {
    console.error("Get question bank error:", error);
    res.status(500).json({ message: "Failed to retrieve question bank", error: error.message });
  }
};

/**
 * Update question bank (add/edit/delete questions)
 */
export const updateQuestionBank = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;
    const { title, description, questions } = req.body;

    const questionBank = await QuestionBank.findById(id);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (questionBank.status === "approved") {
      return res.status(400).json({ message: "Cannot edit approved question bank" });
    }

    if (title) questionBank.title = title;
    if (description) questionBank.description = description;
    if (questions) questionBank.questions = questions;

    await questionBank.save();

    res.status(200).json({
      message: "Question bank updated successfully",
      questionBank,
    });
  } catch (error) {
    console.error("Update question bank error:", error);
    res.status(500).json({ message: "Failed to update question bank", error: error.message });
  }
};

/**
 * Add single question to question bank
 */
export const addQuestionToBank = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;
    const { question, options, correctAnswer, marks, difficulty, topic } = req.body;

    const questionBank = await QuestionBank.findById(id);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (questionBank.status === "approved") {
      return res.status(400).json({ message: "Cannot edit approved question bank" });
    }

    questionBank.questions.push({
      question,
      options,
      correctAnswer,
      marks: marks || 1,
      difficulty: difficulty || "medium",
      topic,
    });

    await questionBank.save();

    res.status(200).json({
      message: "Question added successfully",
      questionBank,
    });
  } catch (error) {
    console.error("Add question error:", error);
    res.status(500).json({ message: "Failed to add question", error: error.message });
  }
};

/**
 * Update specific question in question bank
 */
export const updateQuestionInBank = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const lecturerId = req.user._id;
    const updates = req.body;

    const questionBank = await QuestionBank.findById(id);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (questionBank.status === "approved") {
      return res.status(400).json({ message: "Cannot edit approved question bank" });
    }

    const questionIndex = questionBank.questions.findIndex((q) => q._id.toString() === questionId);

    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update question fields
    Object.keys(updates).forEach((key) => {
      questionBank.questions[questionIndex][key] = updates[key];
    });

    await questionBank.save();

    res.status(200).json({
      message: "Question updated successfully",
      questionBank,
    });
  } catch (error) {
    console.error("Update question error:", error);
    res.status(500).json({ message: "Failed to update question", error: error.message });
  }
};

/**
 * Delete specific question from question bank
 */
export const deleteQuestionFromBank = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const lecturerId = req.user._id;

    const questionBank = await QuestionBank.findById(id);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (questionBank.status === "approved") {
      return res.status(400).json({ message: "Cannot edit approved question bank" });
    }

    questionBank.questions = questionBank.questions.filter((q) => q._id.toString() !== questionId);

    await questionBank.save();

    res.status(200).json({
      message: "Question deleted successfully",
      questionBank,
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};

/**
 * Submit question bank for admin approval
 */
export const submitForApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const questionBank = await QuestionBank.findById(id);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (questionBank.questions.length === 0) {
      return res.status(400).json({ message: "Cannot submit empty question bank" });
    }

    if (questionBank.status === "approved") {
      return res.status(400).json({ message: "Question bank already approved" });
    }

    questionBank.status = "pending_approval";
    await questionBank.save();

    res.status(200).json({
      message: "Question bank submitted for approval",
      questionBank,
    });
  } catch (error) {
    console.error("Submit for approval error:", error);
    res.status(500).json({ message: "Failed to submit for approval", error: error.message });
  }
};

/**
 * Delete question bank
 */
export const deleteQuestionBank = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const questionBank = await QuestionBank.findById(id);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (questionBank.status === "approved") {
      return res.status(400).json({ message: "Cannot delete approved question bank" });
    }

    await QuestionBank.findByIdAndDelete(id);

    res.status(200).json({
      message: "Question bank deleted successfully",
    });
  } catch (error) {
    console.error("Delete question bank error:", error);
    res.status(500).json({ message: "Failed to delete question bank", error: error.message });
  }
};

// ==================== ADMIN APPROVAL ====================

/**
 * Get all question banks pending approval (Admin only)
 */
export const getPendingApprovals = async (req, res) => {
  try {
    const questionBanks = await QuestionBank.find({ status: "pending_approval" }).populate("lecturerId", "fullname email department").populate("courseId", "name code").sort({ createdAt: -1 });

    res.status(200).json({
      message: "Pending approvals retrieved successfully",
      questionBanks,
      count: questionBanks.length,
    });
  } catch (error) {
    console.error("Get pending approvals error:", error);
    res.status(500).json({ message: "Failed to retrieve pending approvals", error: error.message });
  }
};

/**
 * Approve question bank (Admin only)
 */
export const approveQuestionBank = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;
    const { comments } = req.body;

    const questionBank = await QuestionBank.findById(id)
      .populate("lecturerId", "fullname email")
      .populate("courseId", "courseCode courseTitle");

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.status !== "pending_approval") {
      return res.status(400).json({ message: "Question bank not pending approval" });
    }

    questionBank.status = "approved";
    questionBank.adminReview = {
      reviewedBy: adminId,
      reviewedAt: new Date(),
      comments: comments || "Approved",
      status: "approved",
    };

    await questionBank.save();

    // Send approval email to lecturer
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.questionBankApproved({
        lecturerName: questionBank.lecturerId.fullname,
        questionBankTitle: questionBank.title,
        courseCode: questionBank.courseId.courseCode,
        courseTitle: questionBank.courseId.courseTitle,
        totalQuestions: questionBank.questions.length,
        approvedBy: req.user.fullname || "Admin",
        questionBankId: questionBank._id,
        lecturerId: questionBank.lecturerId._id,
      });
      await Mailer.sendTemplatedMail(questionBank.lecturerId.email, emailContent);
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
    }

    res.status(200).json({
      message: "Question bank approved successfully. Lecturer can now schedule exams from it.",
      questionBank,
    });
  } catch (error) {
    console.error("Approve question bank error:", error);
    res.status(500).json({ message: "Failed to approve question bank", error: error.message });
  }
};

/**
 * Reject question bank (Admin only)
 */
export const rejectQuestionBank = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;
    const { comments } = req.body;

    if (!comments) {
      return res.status(400).json({ message: "Comments required for rejection" });
    }

    const questionBank = await QuestionBank.findById(id)
      .populate("lecturerId", "fullname email")
      .populate("courseId", "courseCode courseTitle");

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.status !== "pending_approval") {
      return res.status(400).json({ message: "Question bank not pending approval" });
    }

    questionBank.status = "rejected";
    questionBank.adminReview = {
      reviewedBy: adminId,
      reviewedAt: new Date(),
      comments,
      status: "rejected",
    };

    await questionBank.save();

    // Send rejection email to lecturer
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.questionBankRejected({
        lecturerName: questionBank.lecturerId.fullname,
        questionBankTitle: questionBank.title,
        courseCode: questionBank.courseId.courseCode,
        courseTitle: questionBank.courseId.courseTitle,
        comments,
        reviewedBy: req.user.fullname || "Admin",
        questionBankId: questionBank._id,
        lecturerId: questionBank.lecturerId._id,
      });
      await Mailer.sendTemplatedMail(questionBank.lecturerId.email, emailContent);
    } catch (emailError) {
      console.error("Error sending rejection email:", emailError);
    }

    res.status(200).json({
      message: "Question bank rejected",
      questionBank,
    });
  } catch (error) {
    console.error("Reject question bank error:", error);
    res.status(500).json({ message: "Failed to reject question bank", error: error.message });
  }
};

// ==================== EXAM MANAGEMENT ====================

/**
 * Create exam from approved question bank
 */
export const createExamFromQuestionBank = async (req, res) => {
  try {
    const { questionBankId, duration, startTime, endTime, selectedQuestions } = req.body;
    const lecturerId = req.user._id;

    const questionBank = await QuestionBank.findById(questionBankId);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.status !== "approved") {
      return res.status(400).json({ message: "Question bank not approved yet" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Select questions (use all if not specified)
    let examQuestions = questionBank.questions;
    if (selectedQuestions && selectedQuestions.length > 0) {
      examQuestions = questionBank.questions.filter((q) => selectedQuestions.includes(q._id.toString()));
    }

    const exam = new Exam({
      courseId: questionBank.courseId,
      lecturerId,
      duration,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      questions: examQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
      })),
      status: "pending",
    });

    await exam.save();

    res.status(201).json({
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error("Create exam error:", error);
    res.status(500).json({ message: "Failed to create exam", error: error.message });
  }
};

/**
 * Create exam manually (without question bank)
 */
export const createExam = async (req, res) => {
  try {
    const { courseId, duration, startTime, endTime, questions } = req.body;
    const lecturerId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const exam = new Exam({
      courseId,
      lecturerId,
      duration,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      questions,
      status: "pending",
    });

    await exam.save();

    res.status(201).json({
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error("Create exam error:", error);
    res.status(500).json({ message: "Failed to create exam", error: error.message });
  }
};

/**
 * Get all exams for lecturer
 */
export const getLecturerExams = async (req, res) => {
  try {
    const lecturerId = req.user._id;
    const { status, courseId } = req.query;

    const filter = { lecturerId };
    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;

    const exams = await Exam.find(filter).populate("courseId", "name code").sort({ startTime: -1 });

    res.status(200).json({
      message: "Exams retrieved successfully",
      exams,
      count: exams.length,
    });
  } catch (error) {
    console.error("Get exams error:", error);
    res.status(500).json({ message: "Failed to retrieve exams", error: error.message });
  }
};

/**
 * Get exam by ID
 */
export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id).populate("courseId", "name code").populate("lecturerId", "fullname email");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Hide correct answers for students
    if (req.user.role === "student") {
      exam.questions = exam.questions.map((q) => ({
        question: q.question,
        options: q.options,
        marks: q.marks,
        _id: q._id,
      }));
    }

    res.status(200).json({
      message: "Exam retrieved successfully",
      exam,
    });
  } catch (error) {
    console.error("Get exam error:", error);
    res.status(500).json({ message: "Failed to retrieve exam", error: error.message });
  }
};

/**
 * Update exam
 */
export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;
    const updates = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (exam.status === "completed") {
      return res.status(400).json({ message: "Cannot edit completed exam" });
    }

    Object.keys(updates).forEach((key) => {
      if (key !== "_id" && key !== "lecturerId" && key !== "courseId") {
        exam[key] = updates[key];
      }
    });

    await exam.save();

    res.status(200).json({
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    console.error("Update exam error:", error);
    res.status(500).json({ message: "Failed to update exam", error: error.message });
  }
};

/**
 * Publish exam (make it active)
 */
export const publishExam = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const exam = await Exam.findById(id)
      .populate("courseId", "courseCode courseTitle students");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (exam.status === "completed") {
      return res.status(400).json({ message: "Cannot publish completed exam" });
    }

    exam.status = "active";
    await exam.save();

    // Send notification to all enrolled students
    if (exam.courseId && exam.courseId.students && exam.courseId.students.length > 0) {
      const mailGen = new EmailContentGenerator();
      const students = await Student.find({ _id: { $in: exam.courseId.students } }).select("fullname email");
      
      for (const student of students) {
        try {
          const emailContent = mailGen.examPublished({
            studentName: student.fullname,
            examTitle: `${exam.courseId.courseCode} Exam`,
            courseCode: exam.courseId.courseCode,
            courseTitle: exam.courseId.courseTitle,
            startTime: exam.startTime.toLocaleString(),
            endTime: exam.endTime.toLocaleString(),
            duration: exam.duration,
            totalQuestions: exam.questions.length,
            examId: exam._id,
            studentId: student._id,
          });
          await Mailer.sendTemplatedMail(student.email, emailContent);
        } catch (emailError) {
          console.error(`Error sending exam notification to ${student.email}:`, emailError);
        }
      }
    }

    res.status(200).json({
      message: "Exam published successfully",
      exam,
    });
  } catch (error) {
    console.error("Publish exam error:", error);
    res.status(500).json({ message: "Failed to publish exam", error: error.message });
  }
};

/**
 * Delete exam
 */
export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Allow deletion of active exams but not completed ones with submissions
    if (exam.status === "completed" && exam.totalSubmissions > 0) {
      return res.status(400).json({ 
        message: "Cannot delete completed exam with student submissions. Contact admin to archive it." 
      });
    }

    await Exam.findByIdAndDelete(id);

    res.status(200).json({
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete exam error:", error);
    res.status(500).json({ message: "Failed to delete exam", error: error.message });
  }
};

/**
 * Get active exams for students
 */
export const getActiveExamsForStudent = async (req, res) => {
  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId).populate("courses");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get course IDs where student is enrolled
    const courseIds = student.courses.map((c) => c._id);
    const now = new Date();

    // Find all active exams for enrolled courses
    const exams = await Exam.find({
      courseId: { $in: courseIds },
      status: { $in: ["pending", "active"] }, // Include both pending (upcoming) and active
    })
      .populate({
        path: "courseId",
        select: "courseCode courseTitle department students",
      })
      .populate("lecturerId", "fullname email")
      .select("-questions.correctAnswer") // Hide correct answers
      .sort({ startTime: 1 }); // Sort by start time ascending

    // Double-check that student is actually enrolled in each course
    const filteredExams = exams.filter((exam) => {
      if (!exam.courseId || !exam.courseId.students) return false;
      return exam.courseId.students.some(
        (s) => s.toString() === studentId.toString()
      );
    });

    res.status(200).json({
      success: true,
      message: "Active exams retrieved successfully",
      exams: filteredExams,
      count: filteredExams.length,
    });
  } catch (error) {
    console.error("Get active exams error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve active exams", 
      error: error.message 
    });
  }
};


