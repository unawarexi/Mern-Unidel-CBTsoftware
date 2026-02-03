import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ["stats", "contact", "general", "seo", "social", "branding"],
      default: "general",
    },
    label: {
      type: String,
    },
    description: {
      type: String,
    },
    valueType: {
      type: String,
      enum: ["string", "number", "boolean", "array", "object", "url", "email"],
      default: "string",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
siteSettingsSchema.index({ category: 1, isPublic: 1 });

// Static method to get setting by key
siteSettingsSchema.statics.getSetting = async function (
  key,
  defaultValue = null,
) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set setting
siteSettingsSchema.statics.setSetting = async function (
  key,
  value,
  options = {},
) {
  const {
    category = "general",
    label,
    description,
    valueType = "string",
    isPublic = true,
    updatedBy,
  } = options;

  return this.findOneAndUpdate(
    { key },
    {
      key,
      value,
      category,
      label,
      description,
      valueType,
      isPublic,
      updatedBy,
    },
    { upsert: true, new: true },
  );
};

// Static method to get all settings by category
siteSettingsSchema.statics.getByCategory = async function (
  category,
  publicOnly = true,
) {
  const query = { category };
  if (publicOnly) query.isPublic = true;
  return this.find(query).sort({ order: 1 });
};

// Static method to get public stats
siteSettingsSchema.statics.getPublicStats = async function () {
  const settings = await this.find({ category: "stats", isPublic: true });
  return settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
};

siteSettingsSchema.plugin(softDeletePlugin);

export default mongoose.model("SiteSettings", siteSettingsSchema);
