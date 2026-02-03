import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const specialProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String, // e.g. "6 months", "2 years"
    },
    category: {
      type: String,
      enum: ["academic", "vocational", "professional", "short-course"],
      default: "academic",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    fee: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
    },
    requirements: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

specialProgramSchema.plugin(softDeletePlugin);

export default mongoose.model("SpecialProgram", specialProgramSchema);
