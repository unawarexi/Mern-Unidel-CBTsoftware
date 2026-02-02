import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    departmentCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    departmentId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    levels: [
      {
        level: { type: Number, required: true }, // e.g. 100, 200, 300, 400
        description: String,
      },
    ],
    lecturers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecturer",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
    },
    faculty: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Department", departmentSchema);
