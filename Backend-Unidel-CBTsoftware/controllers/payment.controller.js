import Payment from "../models/payment.model.js";
import Agent from "../models/agent.model.js";

// @desc    Initiate Payment
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const { amount, purpose, metadata } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Map role to model name for refPath
    const modelMap = {
      admin: "Admin",
      superadmin: "Admin",
      lecturer: "Lecturer",
      student: "Student",
      agent: "Agent",
    };

    const payment = await Payment.create({
      userId,
      userRoleModel: modelMap[userRole],
      amount,
      purpose,
      metadata,
      status: "pending",
    });

    // Here you would integrate with a payment gateway like Paystack/Flutterwave
    // For now, we simulate success for subscriptions
    if (purpose === "subscription") {
      // In a real app, this happens after webhook confirmation
      payment.status = "success";
      payment.transactionReference = `SUB-${Date.now()}`;
      await payment.save();

      // Update agent subscription
      if (userRole === "agent") {
        const agent = await Agent.findById(userId);
        const type = metadata?.subscriptionType || "1-month";
        const months = type === "1-month" ? 1 : type === "4-months" ? 4 : 12;

        agent.subscriptionStatus = "active";
        agent.subscriptionType = type;
        agent.subscriptionExpiresAt = new Date(
          Date.now() + months * 30 * 24 * 60 * 60 * 1000,
        );
        await agent.save();
      }
    }

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get My Payments
// @route   GET /api/payments/my
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId }).sort(
      "-createdAt",
    );
    res
      .status(200)
      .json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Payments (Admin Only)
// @route   GET /api/payments
// @access  Private (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "fullname email")
      .sort("-createdAt");
    res
      .status(200)
      .json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
