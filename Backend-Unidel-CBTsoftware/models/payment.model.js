import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userRoleModel",
    },
    userRoleModel: {
      type: String,
      required: true,
      enum: ["Student", "Lecturer", "Admin", "Agent"],
    },
    amount: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: [
        "tuition_fees",
        "exam_fees",
        "subscription",
        "hostel_fees",
        "admission_fees",
        "event_fees",
        "field_trip",
        "other",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
    },
    transactionReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.plugin(softDeletePlugin);

export default mongoose.model("Payment", paymentSchema);
