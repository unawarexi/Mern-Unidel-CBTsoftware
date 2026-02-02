import mongoose from "mongoose";

const violationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSubmission",
      required: true,
    },
    violationType: {
      type: String,
      enum: [
        "TAB_HIDDEN",
        "WINDOW_BLUR",
        "ROUTE_CHANGE",
        "EXIT_FULLSCREEN",
        "CONTEXT_MENU",
        "COPY_PASTE",
        "DEVTOOLS_OPEN"
      ],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      questionIndex: Number,
      additionalInfo: mongoose.Schema.Types.Mixed,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    autoSubmitTriggered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
violationSchema.index({ studentId: 1, examId: 1 });
violationSchema.index({ submissionId: 1, violationType: 1 });
violationSchema.index({ timestamp: -1 });

// Method to count violations for a submission
violationSchema.statics.countViolations = async function(submissionId) {
  return await this.countDocuments({ submissionId });
};

// Method to check if threshold exceeded
violationSchema.statics.hasExceededThreshold = async function(submissionId, threshold = 3) {
  const count = await this.countViolations(submissionId);
  return count >= threshold;
};

export default mongoose.model("SecurityViolation", violationSchema);
