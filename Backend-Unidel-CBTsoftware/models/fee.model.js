import mongoose from "mongoose";

const otherFeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["per_session", "per_semester", "one_time", "annual"],
      default: "per_session",
    },
  },
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    program: {
      type: String,
      required: true,
      trim: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
    facultyName: {
      type: String,
    },
    level: {
      type: String,
      enum: ["undergraduate", "postgraduate", "diploma", "certificate"],
      default: "undergraduate",
    },
    tuition: {
      type: Number,
      required: true,
    },
    acceptanceFee: {
      type: Number,
      default: 0,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    otherFees: [otherFeeSchema],
    totalFee: {
      type: Number,
    },
    academicSession: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    paymentDeadline: {
      type: Date,
    },
    installmentAllowed: {
      type: Boolean,
      default: true,
    },
    installmentDetails: {
      type: String,
    },
    notes: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
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

// Calculate total fee before saving
feeSchema.pre("save", function (next) {
  let total = this.tuition + this.acceptanceFee + this.registrationFee;
  if (this.otherFees && this.otherFees.length > 0) {
    const otherTotal = this.otherFees.reduce((sum, fee) => sum + fee.amount, 0);
    total += otherTotal;
  }
  this.totalFee = total;
  next();
});

// Indexes
feeSchema.index({ isActive: 1, faculty: 1, level: 1 });
feeSchema.index({ academicSession: 1, isActive: 1 });
feeSchema.index({ program: 1 });

export default mongoose.model("Fee", feeSchema);
