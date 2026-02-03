import CareerApplication from "../models/career-application.model.js";
import Career from "../models/career.model.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import { sendTemplatedMail } from "../services/mailer.service.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

import EmailContentGenerator from "../core/mail/mail-content.js";

export const applyForJob = async (req, res, next) => {
  try {
    const { careerId, fullName, email, phone, coverLetter } = req.body;

    const career = await Career.findById(careerId);
    if (!career) return next(new AppError("Job not found", 404));

    // Check if deadline passed
    if (career.deadline && new Date() > new Date(career.deadline)) {
      return next(new AppError("Application deadline has passed", 400));
    }

    // Handle file uploads
    let cvUrl, cvPublicId, letterUrl, letterPublicId;

    if (!req.files || !req.files.cv) {
      return next(new AppError("CV file is required", 400));
    }

    // Upload CV
    const cvResult = await uploadToCloudinary(
      req.files.cv[0].buffer,
      req.files.cv[0].originalname,
      "careers/cvs",
    );
    cvUrl = cvResult.secure_url;
    cvPublicId = cvResult.public_id;

    // Upload Cover Letter (optional)
    if (req.files.letter) {
      const letterResult = await uploadToCloudinary(
        req.files.letter[0].buffer,
        req.files.letter[0].originalname,
        "careers/letters",
      );
      letterUrl = letterResult.secure_url;
      letterPublicId = letterResult.public_id;
    }

    const application = await CareerApplication.create({
      careerId,
      fullName,
      email,
      phone,
      coverLetter,
      cvUrl,
      cvPublicId,
      letterUrl,
      letterPublicId,
    });

    // Send confirmation email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.careerApplicationSubmission({
        fullName,
        jobTitle: career.title,
        applicationId: application._id.toString().slice(-8).toUpperCase(),
      });
      await sendTemplatedMail(email, emailContent);
    } catch (e) {
      console.error("Job app email failed:", e.message);
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000)
      return next(
        new AppError("You have already applied for this position", 400),
      );
    next(new AppError(error.message, 400));
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const { careerId, status } = req.query;
    const filter = {};
    if (careerId) filter.careerId = careerId;
    if (status) filter.status = status;

    const applications = await CareerApplication.find(filter)
      .populate("careerId", "title company")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminFeedback, interviewDetails } = req.body;
    const application = await CareerApplication.findById(
      req.params.id,
    ).populate("careerId");
    if (!application) return next(new AppError("Application not found", 404));

    application.status = status;
    if (adminFeedback) application.adminFeedback = adminFeedback;
    if (interviewDetails) application.interviewDetails = interviewDetails;
    application.reviewedBy = req.user.userId;

    await application.save();

    // Send notification email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.careerApplicationStatusUpdate({
        fullName: application.fullName,
        jobTitle: application.careerId.title,
        status: status,
        feedback: adminFeedback,
        interview: status === "interview" ? interviewDetails : undefined,
        userId: application.userId, // if available
      });
      await sendTemplatedMail(application.email, emailContent);
    } catch (e) {
      console.error("Job status email failed:", e.message);
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export default {
  applyForJob,
  getAllApplications,
  updateApplicationStatus,
};
