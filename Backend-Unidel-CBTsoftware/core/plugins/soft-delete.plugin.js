/**
 * Mongoose plugin for soft delete functionality.
 * Adds `isDeleted` and `deletedAt` fields to the schema.
 * Automatically filters out deleted documents from find queries.
 */
const softDeletePlugin = (schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  // Middleware to filter out deleted documents
  const filterDeleted = function () {
    if (this.getQuery().isDeleted === undefined) {
      this.where({ isDeleted: false });
    }
  };

  schema.pre("find", filterDeleted);
  schema.pre("findOne", filterDeleted);
  schema.pre("findOneAndUpdate", filterDeleted);
  schema.pre("countDocuments", filterDeleted);
  schema.pre("aggregate", function () {
    // Check if the first stage is already filtering by isDeleted
    const firstStage = this.pipeline()[0];
    if (
      !firstStage ||
      !firstStage.$match ||
      firstStage.$match.isDeleted === undefined
    ) {
      this.pipeline().unshift({ $match: { isDeleted: false } });
    }
  });

  // Method to soft delete a document
  schema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  // Method to restore a soft-deleted document
  schema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };

  // Static method to find including deleted
  schema.statics.findWithDeleted = function () {
    return this.find().setOptions({ isDeleted: null });
  };
};

export default softDeletePlugin;
