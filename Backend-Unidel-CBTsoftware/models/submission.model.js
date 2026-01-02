import mongoose from "mongoose";

const examSubmissionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: null,
        },
        marksAwarded: {
          type: Number,
          default: 0,
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F", ""],
      default: "",
    },
    passed: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    gradedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["started", "submitted", "graded", "autoSubmitted"],
      default: "started",
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    submissionType: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
    },
    ipAddress: String,
    userAgent: String,
    flagged: {
      type: Boolean,
      default: false,
    },
    flagReason: String,
    lecturerFeedback: String,
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one submission per student per exam
examSubmissionSchema.index({ examId: 1, studentId: 1 }, { unique: true });

// Index for efficient querying
examSubmissionSchema.index({ status: 1, examId: 1 });
examSubmissionSchema.index({ studentId: 1, status: 1 });

export default mongoose.model("ExamSubmission", examSubmissionSchema);
