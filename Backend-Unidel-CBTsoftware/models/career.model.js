import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "remote"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "technology",
        "engineering",
        "business",
        "healthcare",
        "education",
        "finance",
        "other",
      ],
      default: "other",
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    expectations: [
      {
        type: String,
      },
    ],
    qualifications: [
      {
        type: String,
      },
    ],
    salary: {
      type: String,
    },
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    deadline: {
      type: Date,
    },
    applicationLink: {
      type: String,
    },
    applicationEmail: {
      type: String,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "executive"],
      default: "entry",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
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

careerSchema.plugin(softDeletePlugin);

// Indexes
careerSchema.index({ isActive: 1, isFeatured: -1, createdAt: -1 });
careerSchema.index({ type: 1, isActive: 1 });
careerSchema.index({ category: 1, isActive: 1 });
careerSchema.index({ company: 1 });
careerSchema.index({ deadline: 1 });

export default mongoose.model("Career", careerSchema);
