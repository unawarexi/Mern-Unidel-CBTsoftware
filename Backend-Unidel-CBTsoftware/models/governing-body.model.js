import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const governingBodySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    acronym: {
      type: String,
      uppercase: true,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
    accreditedDepartments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    lastAuditDate: {
      type: Date,
    },
    nextAuditDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

governingBodySchema.plugin(softDeletePlugin);

export default mongoose.model("GoverningBody", governingBodySchema);
