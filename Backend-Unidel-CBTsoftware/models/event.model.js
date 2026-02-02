import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
    },
    category: {
      type: String,
      enum: ["academic", "research", "career", "student-life", "admissions", "alumni", "sports", "cultural"],
      default: "academic",
    },
    featuredImage: {
      type: String,
    },
    organizer: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    registrationLink: {
      type: String,
    },
    registrationDeadline: {
      type: Date,
    },
    maxAttendees: {
      type: Number,
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    ticketPrice: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
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

// Generate slug from title
eventSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Indexes
eventSchema.index({ isPublished: 1, isFeatured: -1, startDate: 1 });
eventSchema.index({ category: 1, isPublished: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ slug: 1 });

export default mongoose.model("Event", eventSchema);
