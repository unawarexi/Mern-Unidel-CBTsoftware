import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    },
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin", "superadmin"],
    },
    documents: [String],
    imagesAttachment: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", adminSchema);
