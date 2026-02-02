import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lecturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
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
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    endWarningSent: {
      type: Boolean,
      default: false,
    },
    passingPercentage: {
      type: Number,
      default: 50,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Exam", examSchema);
