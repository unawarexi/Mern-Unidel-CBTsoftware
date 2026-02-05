import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const questionBankSchema = new mongoose.Schema(
  {
    lecturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
          validate: [(arr) => arr.length >= 2, "At least 2 options required"],
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          default: 1,
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        topic: String,
        attachment: {
          url: String,
          publicId: String,
          type: {
            type: String,
            default: "image",
          },
        },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "rejected"],
      default: "draft",
    },
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      reviewedAt: Date,
      comments: String, // <-- already present, used for admin feedback
      status: String,
    },
    sourceType: {
      type: String,
      enum: ["manual", "ai_generated", "file_upload"],
      default: "manual",
    },
    sourceFile: {
      filename: String,
      originalName: String,
      uploadedAt: Date,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
  },
  {
    timestamps: true,
  },
);

questionBankSchema.plugin(softDeletePlugin);

export default mongoose.model("QuestionBank", questionBankSchema);
