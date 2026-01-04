import mongoose from "mongoose";

const courseMaterialSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Lecturer", required: true },
    uploadedAt: { type: Date, default: Date.now },
    description: { type: String },
    public_id: { type: String },
    type: { type: String, default: "document" },
    category: { type: String, default: "document" },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
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
    courseMaterials: [courseMaterialSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
