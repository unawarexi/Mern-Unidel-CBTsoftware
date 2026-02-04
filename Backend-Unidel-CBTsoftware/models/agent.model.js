import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const agentSchema = new mongoose.Schema(
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
    organisation: {
      type: String,
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "inactive",
    },
    subscriptionType: {
      type: String,
      enum: ["1-month", "4-months", "1-year"],
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    role: {
      type: String,
      default: "agent",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

agentSchema.plugin(softDeletePlugin);

export default mongoose.model("Agent", agentSchema);
