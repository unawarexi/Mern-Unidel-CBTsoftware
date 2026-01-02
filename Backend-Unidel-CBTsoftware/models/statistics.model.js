import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
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
    role: {
      type: String,
      required: true,
      enum: ["admin", "superadmin", "lecturer", "student"],
    },
    action: {
      type: String,
      required: true,
      enum: [
        // Auth actions
        "login",
        "logout",
        "password_change",
        "password_reset",
        "first_login",
        // User management
        "user_created",
        "user_updated",
        "user_deleted",
        // Course actions
        "course_created",
        "course_updated",
        "course_deleted",
        "course_enrolled",
        "course_material_uploaded",
        // Exam actions
        "exam_created",
        "exam_updated",
        "exam_published",
        "exam_deleted",
        "exam_started",
        "exam_submitted",
        // Question bank
        "question_bank_created",
        "question_bank_submitted",
        "question_bank_approved",
        "question_bank_rejected",
        // Department
        "department_created",
        "department_updated",
        // Submissions
        "submission_graded",
        "submission_flagged",
        "feedback_added",
        // System
        "file_uploaded",
        "file_deleted",
        "system_error",
      ],
    },
    entityType: {
      type: String,
      enum: ["User", "Course", "Exam", "QuestionBank", "Submission", "Department", "File", "System"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: String,
    userAgent: String,
    location: String,
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ role: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
