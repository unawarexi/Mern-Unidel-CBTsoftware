import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: ["campus", "events", "academics", "sports", "facilities", "students", "graduation", "research"],
      default: "campus",
    },
    description: {
      type: String,
    },
    altText: {
      type: String,
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    photographer: {
      type: String,
    },
    dateTaken: {
      type: Date,
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
gallerySchema.index({ isPublished: 1, isFeatured: -1, order: 1 });
gallerySchema.index({ category: 1, isPublished: 1 });
gallerySchema.index({ tags: 1 });

export default mongoose.model("Gallery", gallerySchema);
