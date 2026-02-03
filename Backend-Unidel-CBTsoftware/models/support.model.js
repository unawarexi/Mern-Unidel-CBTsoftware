import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const supportSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["support", "complaint", "feedback", "technical"],
      default: "support",
    },
    category: {
      type: String,
      enum: ["admission", "exam", "lecturer", "finance", "account", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "pending", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },
    sender: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "sender.role",
      },
      role: {
        type: String,
        enum: ["Student", "Lecturer", "Admin", "Public"],
        default: "Public",
      },
      name: String,
      email: {
        type: String,
        required: true,
      },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    responses: [
      {
        responder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        publicId: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

supportSchema.plugin(softDeletePlugin);

// Auto-generate ticket ID before saving if not present
supportSchema.pre("validate", function (next) {
  if (!this.ticketId) {
    const prefix = this.type === "complaint" ? "CMP" : "SUP";
    const random = Math.floor(1000 + Math.random() * 9000);
    this.ticketId = `${prefix}-${Date.now().toString().slice(-6)}-${random}`;
  }
  next();
});

export default mongoose.model("Support", supportSchema);
