import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const waitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    interest: {
      type: String,
      enum: ["general", "scholarships", "programs", "applications"],
      default: "general",
    },
    specificProgram: {
      type: String, // Title or Code of program/scholarship
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

waitlistSchema.plugin(softDeletePlugin);

export default mongoose.model("Waitlist", waitlistSchema);
