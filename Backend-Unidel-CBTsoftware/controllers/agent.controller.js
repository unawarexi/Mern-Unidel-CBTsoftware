import Agent from "../models/agent.model.js";
import Student from "../models/student.model.js";
import Exam from "../models/exam.model.js";
import QuestionBank from "../models/question.model.js";
import * as Mailer from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";
import { emitToRoom } from "../services/socketIO.service.js";

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
    res.status(200).json({
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

// @desc    Get all agents (Admin Only)
export const getAgents = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.approvalStatus = status;

    const agents = await Agent.find(query).sort("-createdAt");
    res.status(200).json({ success: true, count: agents.length, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Agent Status (Approve/Reject) (Admin Only)
export const updateAgentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent not found" });
    }

    agent.approvalStatus = status;
    agent.isVerified = status === "approved";
    if (status === "approved") {
      agent.verifiedBy = req.user.userId;
    } else {
      agent.verifiedBy = undefined;
    }

    await agent.save();

    // Send notification to agent
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.agentStatusUpdate({
        agentName: agent.fullname,
        status: agent.approvalStatus,
        userId: agent._id,
      });
      await Mailer.sendTemplatedMail(agent.email, emailContent);

      // Real-time notification
      emitToRoom("admin_notifications", "agent:updated", agent);
    } catch (err) {
      console.error("Error sending agent notification:", err);
    }

    res.status(200).json({
      success: true,
      message: `Agent status updated to ${status}`,
      data: agent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
