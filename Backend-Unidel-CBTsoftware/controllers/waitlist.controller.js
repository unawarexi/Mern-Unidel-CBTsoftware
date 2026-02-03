import Waitlist from "../models/waitlist.model.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import { sendTemplatedMail } from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";

export const subscribe = async (req, res, next) => {
  try {
    const { email, interest, specificProgram, fullName } = req.body;

    // Check if already on waitlist for this interest
    const existing = await Waitlist.findOne({ email, interest });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed to this waitlist",
      });
    }

    const subscription = await Waitlist.create({
      email,
      interest,
      specificProgram,
      fullName,
    });

    // Send confirmation email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.waitlistConfirmation({
        fullName,
        interest,
        userId: req.user?.userId, // Pass if logged in
      });
      await sendTemplatedMail(email, emailContent);
    } catch (e) {
      console.error("Waitlist email failed:", e.message);
    }

    res.status(201).json({
      success: true,
      data: subscription,
      message: "Subscribed successfully",
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const { interest } = req.query;
    const filter = interest ? { interest } : {};
    const subscriptions = await Waitlist.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Waitlist.findById(req.params.id);
    if (!subscription) return next(new AppError("Subscription not found", 404));
    await subscription.softDelete();
    res.status(200).json({ success: true, message: "Subscription removed" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export default {
  subscribe,
  getSubscriptions,
  deleteSubscription,
};
