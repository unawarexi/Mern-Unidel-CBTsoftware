import Exam from "../models/exam.model.js";
import QuestionBank from "../models/question.model.js";

// @desc    Create Exam (Agent only)
// @route   POST /api/agents/exams
// @access  Private (Agent)
export const createAgentExam = async (req, res) => {
  try {
    const {
      courseId,
      duration,
      startTime,
      endTime,
      questions,
      questionBankId,
    } = req.body;
    const agentId = req.user.userId;

    let examQuestions = questions;

    // If questionBankId provided, use questions from there (and verify agent owns it)
    if (questionBankId) {
      const qb = await QuestionBank.findOne({ _id: questionBankId, agentId });
      if (!qb) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Question bank not found or unauthorized",
          });
      }
      examQuestions = qb.questions;
    }

    const exam = await Exam.create({
      courseId,
      agentId,
      duration,
      startTime,
      endTime,
      questions: examQuestions,
      status: "pending",
    });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Agent Exams (Agent and Admin)
// @route   GET /api/agents/exams
// @access  Private (Agent/Admin)
export const getAgentExams = async (req, res) => {
  try {
    const query =
      req.user.role === "agent"
        ? { agentId: req.user.userId }
        : { agentId: { $ne: null } };
    const exams = await Exam.find(query).populate(
      "courseId",
      "courseCode courseTitle",
    );
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Agent Exam (Agent only)
// @route   PUT /api/agents/exams/:id
// @access  Private (Agent)
export const updateAgentExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      agentId: req.user.userId,
    });
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found or unauthorized" });
    }

    if (exam.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot edit completed exam" });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (key !== "agentId") exam[key] = updates[key];
    });

    await exam.save();
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Agent Exam (Agent only)
// @route   DELETE /api/agents/exams/:id
// @access  Private (Agent)
export const deleteAgentExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      agentId: req.user.userId,
    });
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found or unauthorized" });
    }

    await exam.deleteOne();
    res.status(200).json({ success: true, message: "Exam deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
