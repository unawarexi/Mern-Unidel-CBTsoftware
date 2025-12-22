import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password in queries by default
    },
    matricNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "student",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    documents: [String],
    attachment: [String],
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Student", studentSchema);
