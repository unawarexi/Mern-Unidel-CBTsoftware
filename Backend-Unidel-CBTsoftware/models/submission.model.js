const mongoose = require("mongoose");

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
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["started", "submitted", "graded"],
      default: "started",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one submission per student per exam
examSubmissionSchema.index({ examId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("ExamSubmission", examSubmissionSchema);
