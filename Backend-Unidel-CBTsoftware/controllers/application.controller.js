import Application from "../models/application.model.js";
import { AppError } from "../middlewares/error-handler.middleware.js";
import { sendTemplatedMail } from "../services/mailer.service.js";
import EmailContentGenerator from "../core/mail/mail-content.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

export const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({
      ...req.body,
      studentId: req.user.userId, // Assume student is logged in
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const { status, program } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (program) filter.programTarget = program;

    const applications = await Application.find(filter)
      .populate("programTarget")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user.userId })
      .populate("programTarget")
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "programTarget",
    );
    if (!application) return next(new AppError("Application not found", 404));

    // Authorization check
    if (
      req.user.role !== "admin" &&
      application.studentId.toString() !== req.user.userId
    ) {
      return next(new AppError("Not authorized", 403));
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return next(new AppError("Application not found", 404));

    // Only allow updating drafts or if admin
    if (req.user.role !== "admin" && application.status !== "draft") {
      return next(
        new AppError("Cannot update application after submission", 400),
      );
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const submitApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return next(new AppError("Application not found", 404));

    // Global Validation before Submission
    const isInternational = application.personalInfo?.nationality !== "Nigeria"; // Configurable default

    // 1. Mandatory Fields Check
    if (
      !application.guardianInfo?.fatherName &&
      !application.guardianInfo?.motherName
    ) {
      return next(
        new AppError(
          "Parent/Guardian information is required before submission",
          400,
        ),
      );
    }
    if (
      !application.academicHistory ||
      application.academicHistory.length === 0
    ) {
      return next(
        new AppError("Academic history is required before submission", 400),
      );
    }
    if (!application.examResults?.examType) {
      return next(
        new AppError("Exam results (WAEC/NECO/etc) are required", 400),
      );
    }

    // 2. International Specific Validation
    if (isInternational) {
      if (!application.personalInfo?.passportNumber) {
        return next(
          new AppError(
            "International students must provide a Valid Passport Number",
            400,
          ),
        );
      }
      if (
        !application.internationalInfo?.visaInformation?.intendedStudyCountry
      ) {
        return next(
          new AppError(
            "Visa Information is required for international students",
            400,
          ),
        );
      }
    }

    application.status = "submitted";
    application.submissionDate = new Date();
    await application.save();

    // Send submission email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.studentApplicationSubmission({
        firstName: application.personalInfo?.firstName,
        applicationId: application._id.toString().slice(-8).toUpperCase(),
        program: application.programTarget,
        userId: application.studentId,
      });
      await sendTemplatedMail(application.email, emailContent);
    } catch (e) {
      console.error("App submission email failed:", e.message);
    }

    res
      .status(200)
      .json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const adminReview = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewFeedback: feedback,
        reviewedBy: req.user.userId,
      },
      { new: true },
    );
    if (!application) return next(new AppError("Application not found", 404));

    // Send review email
    try {
      const mailGen = new EmailContentGenerator();
      const emailContent = mailGen.studentApplicationReview({
        firstName: application.personalInfo?.firstName,
        status,
        feedback,
        userId: application.studentId,
      });
      await sendTemplatedMail(application.email, emailContent);
    } catch (e) {
      console.error("App review email failed:", e.message);
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const softDeleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return next(new AppError("Application not found", 404));
    await application.softDelete();
    res
      .status(200)
      .json({ success: true, message: "Application soft-deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const uploadApplicationFile = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("No file uploaded", 400));

    const { id } = req.params;
    const { field } = req.query; // e.g. "personalInfo.passportPhoto"

    if (!field)
      return next(new AppError("Field path is required in query params", 400));

    const application = await Application.findById(id);
    if (!application) return next(new AppError("Application not found", 404));

    // Authorization check
    if (
      req.user.role !== "admin" &&
      application.studentId.toString() !== req.user.userId
    ) {
      return next(
        new AppError(
          "Not authorized to upload files for this application",
          403,
        ),
      );
    }

    const folder = `projects/unidel/applications/${id}`;
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      folder,
    );

    // Update specific field using dot notation
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      {
        $set: {
          [field]: { url: uploadResult.url, public_id: uploadResult.public_id },
        },
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "File uploaded and linked successfully",
      data: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        application: updatedApplication,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export default {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  submitApplication,
  adminReview,
  softDeleteApplication,
  getAllApplications,
  uploadApplicationFile,
};
