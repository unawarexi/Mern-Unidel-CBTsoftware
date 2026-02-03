import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const careerApplicationSchema = new mongoose.Schema(
  {
    careerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
    cvUrl: {
      type: String,
      required: true,
    },
    coverLetterUrl: {
      type: String,
    },
    cvPublicId: String,
    letterPublicId: String,
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "shortlisted",
        "interview",
        "offered",
        "rejected",
        "withdrawn",
      ],
      default: "pending",
    },
    adminFeedback: {
      type: String,
    },
    interviewDetails: {
      date: Date,
      location: String,
      notes: String,
      link: String, // For remote interviews
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

careerApplicationSchema.plugin(softDeletePlugin);

// Prevent multiple applications for same job with same email
careerApplicationSchema.index({ careerId: 1, email: 1 }, { unique: true });

export default mongoose.model("CareerApplication", careerApplicationSchema);
