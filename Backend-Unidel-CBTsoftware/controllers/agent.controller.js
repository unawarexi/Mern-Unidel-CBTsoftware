import Agent from "../models/agent.model.js";
import Student from "../models/student.model.js";
import Exam from "../models/exam.model.js";
import QuestionBank from "../models/question.model.js";

/**
 * Data Isolation Logic:
 * - Agents can only see and manage their own data.
 * - Admins can see Agent data but in read-only mode (handled in routes/middleware).
 */

// @desc    Get all students linked to the agent
export const getMyStudents = async (req, res) => {
  try {
    const students = await Student.find({ agentId: req.user.userId });
    res
      .status(200)
      .json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all exams linked to the agent
export const getMyExams = async (req, res) => {
  try {
    const exams = await Exam.find({ agentId: req.user.userId });
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all question banks linked to the agent
export const getMyQuestionBanks = async (req, res) => {
  try {
    const questionBanks = await QuestionBank.find({ agentId: req.user.userId });
    res
      .status(200)
      .json({
        success: true,
        count: questionBanks.length,
        data: questionBanks,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get agent subscription status
export const getMySubscription = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user.userId).select(
      "subscriptionStatus subscriptionType subscriptionExpiresAt",
    );
    res.status(200).json({ success: true, data: agent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Agent (Admin Only)
export const verifyAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    agent.isVerified = true;
    agent.verifiedBy = req.user.userId;
    await agent.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Agent verified successfully",
        data: agent,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
