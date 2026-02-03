import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      index: true,
    },
    programType: {
      type: String,
      enum: ["degree", "diploma", "special-program", "scholarship"],
      required: true,
    },
    programTarget: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "programTargetModel",
    },
    programTargetModel: {
      type: String,
      required: true,
      enum: ["Course", "SpecialProgram", "Scholarship"],
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under-review",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      default: "draft",
    },
    personalInfo: {
      phone: String,
      address: String,
      dateOfBirth: Date,
      gender: String,
      stateOfOrigin: String,
    },
    academicHistory: [
      {
        institution: String,
        qualification: String,
        yearObtained: Number,
        grade: String,
      },
    ],
    documents: [
      {
        name: String,
        url: String,
        public_id: String,
        type: String,
      },
    ],
    submissionDate: {
      type: Date,
    },
    reviewFeedback: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.plugin(softDeletePlugin);

export default mongoose.model("Application", applicationSchema);
