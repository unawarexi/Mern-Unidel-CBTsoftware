import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    coverage: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
    },
    deadlineText: {
      type: String,
      default: "Rolling",
    },
    icon: {
      type: String,
      default: "Award",
    },
    category: {
      type: String,
      enum: ["merit", "need", "international", "stem", "leadership", "other"],
      default: "merit",
    },
    applicationLink: {
      type: String,
    },
    requirements: [
      {
        type: String,
      },
    ],
    fundAmount: {
      type: Number,
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
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
  }
);

// Indexes
scholarshipSchema.index({ isActive: 1, isFeatured: -1, order: 1 });
scholarshipSchema.index({ category: 1, isActive: 1 });
scholarshipSchema.index({ deadline: 1 });

export default mongoose.model("Scholarship", scholarshipSchema);
