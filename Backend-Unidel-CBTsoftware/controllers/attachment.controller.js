import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.service.js";
import Admin from "../models/admin.model.js";
import Lecturer from "../models/lecturer.model.js";
import Student from "../models/student.model.js";

// Helper function to get the correct model based on role
const getModelByRole = (role) => {
  const models = {
    admin: Admin,
    superadmin: Admin,
    lecturer: Lecturer,
    student: Student,
  };
  return models[role];
};

// Helper function to determine if file is a document
const isDocument = (filename) => {
  const documentExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".rtf", ".odt", ".ods", ".odp", ".csv"];
  const ext = filename.toLowerCase().split(".").pop();
  return documentExtensions.some((docExt) => docExt === `.${ext}`);
};

/**
 * Upload single file
 * POST /api/attachments/upload
 * Body: file (multipart/form-data)
 * Auth: Required (user must be authenticated)
 */
export const uploadSingleFile = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Get user info from auth middleware (assuming req.user is set by auth middleware)
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Get the appropriate model
    const UserModel = getModelByRole(userRole);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // Upload file to Cloudinary
    const folder = `projects/unidel/${userRole}s/${userId}`;
    const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, folder);

    // Determine which array to update
    const isDoc = isDocument(req.file.originalname);
    const updateField = isDoc ? "documents" : "attachment";

    // Update user model
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { [updateField]: uploadResult.url },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileInfo: uploadResult,
        savedIn: updateField,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

/**
 * Upload multiple files
 * POST /api/attachments/upload-multiple
 * Body: files (multipart/form-data, multiple files)
 * Auth: Required (user must be authenticated)
 */
export const uploadMultipleFiles = async (req, res) => {
  try {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Get user info from auth middleware
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Get the appropriate model
    const UserModel = getModelByRole(userRole);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const folder = `projects/workspace/${userRole}s/${userId}`;
    const uploadResults = [];
    const documentUrls = [];
    const attachmentUrls = [];

    // Upload all files to Cloudinary
    for (const file of req.files) {
      try {
        const uploadResult = await uploadToCloudinary(file.buffer, file.originalname, folder);

        // Categorize based on file type
        const isDoc = isDocument(file.originalname);
        if (isDoc) {
          documentUrls.push(uploadResult.url);
        } else {
          attachmentUrls.push(uploadResult.url);
        }

        uploadResults.push({
          ...uploadResult,
          savedIn: isDoc ? "documents" : "attachment",
        });
      } catch (uploadError) {
        console.error(`Error uploading ${file.originalname}:`, uploadError);
        uploadResults.push({
          filename: file.originalname,
          error: uploadError.message,
          success: false,
        });
      }
    }

    // Update user model with all URLs
    const updateQuery = {};
    if (documentUrls.length > 0) {
      updateQuery.$push = { documents: { $each: documentUrls } };
    }
    if (attachmentUrls.length > 0) {
      if (updateQuery.$push) {
        updateQuery.$push.attachment = { $each: attachmentUrls };
      } else {
        updateQuery.$push = { attachment: { $each: attachmentUrls } };
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateQuery, { new: true }).select("-password");

    return res.status(200).json({
      success: true,
      message: `${uploadResults.filter((r) => !r.error).length} file(s) uploaded successfully`,
      data: {
        uploadedFiles: uploadResults,
        documentsAdded: documentUrls.length,
        attachmentsAdded: attachmentUrls.length,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload files",
      error: error.message,
    });
  }
};

/**
 * Get all user attachments
 * GET /api/attachments
 * Auth: Required
 */
export const getUserAttachments = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    const UserModel = getModelByRole(userRole);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const user = await UserModel.findById(userId).select("documents attachment fullname email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        documents: user.documents || [],
        attachments: user.attachment || [],
        totalDocuments: (user.documents || []).length,
        totalAttachments: (user.attachment || []).length,
      },
    });
  } catch (error) {
    console.error("Get attachments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve attachments",
      error: error.message,
    });
  }
};

/**
 * Delete a specific attachment
 * DELETE /api/attachments/:fileUrl
 * Auth: Required
 */
export const deleteAttachment = async (req, res) => {
  try {
    const { fileUrl } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File URL is required",
      });
    }

    const UserModel = getModelByRole(userRole);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // Decode the URL
    const decodedUrl = decodeURIComponent(fileUrl);

    // Find user and check if file exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check which array contains the file
    const inDocuments = user.documents?.includes(decodedUrl);
    const inAttachments = user.attachment?.includes(decodedUrl);

    if (!inDocuments && !inAttachments) {
      return res.status(404).json({
        success: false,
        message: "File not found in user records",
      });
    }

    // Extract public_id from URL
    const urlParts = decodedUrl.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const publicIdParts = urlParts.slice(urlParts.indexOf("projects"));
    const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");

    // Determine resource type
    const resourceType = decodedUrl.includes("/video/") ? "video" : decodedUrl.includes("/image/") ? "image" : "raw";

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(publicId, resourceType);
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
      // Continue to remove from database even if Cloudinary deletion fails
    }

    // Remove from appropriate array
    const updateField = inDocuments ? "documents" : "attachment";
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { [updateField]: decodedUrl },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: {
        deletedFrom: updateField,
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error("Delete attachment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete attachment",
      error: error.message,
    });
  }
};
