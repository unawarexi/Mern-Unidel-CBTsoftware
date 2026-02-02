import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
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
    excerpt: {
      type: String,
      required: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["announcements", "academic", "research", "events", "sports", "alumni", "general"],
      default: "general",
    },
    author: {
      type: String,
      default: "University Relations",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    featuredImage: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    icon: {
      type: String,
      default: "Newspaper",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
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
newsSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Indexes
newsSchema.index({ isPublished: 1, isFeatured: -1, publishedAt: -1 });
newsSchema.index({ category: 1, isPublished: 1 });
newsSchema.index({ slug: 1 });
newsSchema.index({ tags: 1 });

export default mongoose.model("News", newsSchema);
