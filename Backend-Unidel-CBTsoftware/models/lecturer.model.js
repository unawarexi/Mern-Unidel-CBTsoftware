import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema(
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
      select: false,
    },
    lecturerId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    department: [
      {
        type: mongoose.Schema.Types.ObjectId, // <-- Changed from String to ObjectId
        ref: "Department",
        required: true,
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "lecturer",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    level: {
      type: Number,
      default: 100,
    },
    documents: [String],
    attachment: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lecturer", lecturerSchema);
