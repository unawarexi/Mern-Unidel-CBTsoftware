import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userModel",
      required: true,
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Admin", "Lecturer", "Student"],
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        // Student Reports
        "exam-results",
        "exam-history",
        "semester-results",
        "transcript",
        "account-summary",
        // Lecturer Reports
        "course-performance",
        "exam-analysis",
        "question-stats",
        "student-roster",
        // Admin Reports
        "system-overview",
        "user-management",
        "exam-audit",
        "department-summary",
        "faculty-summary",
        // Legacy
        "analytics",
        "semester-summary",
        "account-report",
        "school-assessment",
        // Public Reports
        "faculties-report",
        "programs-report",
        "fees-report",
        "events-report",
        "scholarships-report",
        "careers-report",
      ],
    },
    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    links: {
      pdf: String,
      csv: String,
      xlsx: String,
      docx: String,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for faster retrieval of user reports
reportSchema.index({ userId: 1, type: 1, generatedAt: -1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
