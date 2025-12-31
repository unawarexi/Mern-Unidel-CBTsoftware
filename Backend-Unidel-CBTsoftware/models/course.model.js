import mongoose from "mongoose";

const courseMaterialSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Lecturer", required: true },
    uploadedAt: { type: Date, default: Date.now },
    description: { type: String },
    public_id: { type: String }, // for cloudinary deletion
    type: { type: String, default: "document" }, // e.g. pdf, docx, ppt
  },
  { _id: true } // <-- ensure each material is an object with its own _id
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
    department: {
      type: String,
      required: true,
    },
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
    courseMaterials: [courseMaterialSchema], // <-- array of objects
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
