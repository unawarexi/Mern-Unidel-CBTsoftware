/**
 * Admin Content Controller - CRUD operations for landing page content
 * Requires admin authentication
 */
import Faculty from "../models/faculty.model.js";
import Scholarship from "../models/scholarship.model.js";
import Career from "../models/career.model.js";
import News from "../models/news.model.js";
import Event from "../models/event.model.js";
import Gallery from "../models/gallery.model.js";
import Fee from "../models/fee.model.js";
import SiteSettings from "../models/site-settings.model.js";
import { cacheDelete, cacheDeletePattern } from "../services/redis.service.js";
import { AppError } from "../middlewares/error-handler.middleware.js";

// ============================================================================
// FACULTIES
// ============================================================================

export const createFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    await cacheDeletePattern("public:faculties*");
    await cacheDelete("public:homepage");
    res.status(201).json({ success: true, data: faculty });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faculty) return next(new AppError("Faculty not found", 404));
    await cacheDeletePattern("public:faculties*");
    await cacheDelete("public:homepage");
    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return next(new AppError("Faculty not found", 404));
    await cacheDeletePattern("public:faculties*");
    await cacheDelete("public:homepage");
    res.status(200).json({ success: true, message: "Faculty deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllFaculties = async (req, res, next) => {
  try {
    const faculties = await Faculty.find()
      .populate("departments", "departmentName departmentCode")
      .sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: faculties });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// ============================================================================
// SCHOLARSHIPS
// ============================================================================

export const createScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    await cacheDeletePattern("public:scholarships*");
    await cacheDelete("public:homepage");
    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!scholarship) return next(new AppError("Scholarship not found", 404));
    await cacheDeletePattern("public:scholarships*");
    await cacheDelete("public:homepage");
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) return next(new AppError("Scholarship not found", 404));
    await cacheDeletePattern("public:scholarships*");
    res.status(200).json({ success: true, message: "Scholarship deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllScholarships = async (req, res, next) => {
  try {
    const scholarships = await Scholarship.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: scholarships });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// ============================================================================
// CAREERS
// ============================================================================

export const createCareer = async (req, res, next) => {
  try {
    const career = await Career.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    res.status(201).json({ success: true, data: career });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!career) return next(new AppError("Career not found", 404));
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return next(new AppError("Career not found", 404));
    res.status(200).json({ success: true, message: "Career deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllCareers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [careers, total] = await Promise.all([
      Career.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Career.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      data: careers,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// ============================================================================
// NEWS
// ============================================================================

export const createNews = async (req, res, next) => {
  try {
    const news = await News.create({
      ...req.body,
      createdBy: req.user.userId,
      authorId: req.user.userId,
    });
    await cacheDelete("public:homepage");
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!news) return next(new AppError("News not found", 404));
    await cacheDelete("public:homepage");
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return next(new AppError("News not found", 404));
    await cacheDelete("public:homepage");
    res.status(200).json({ success: true, message: "News deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllNews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [news, total] = await Promise.all([
      News.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      News.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      data: news,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// ============================================================================
// EVENTS
// ============================================================================

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    await cacheDelete("public:homepage");
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return next(new AppError("Event not found", 404));
    await cacheDelete("public:homepage");
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return next(new AppError("Event not found", 404));
    await cacheDelete("public:homepage");
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [events, total] = await Promise.all([
      Event.find()
        .sort({ startDate: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Event.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      data: events,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// ============================================================================
// GALLERY
// ============================================================================

export const createGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    await cacheDeletePattern("public:gallery*");
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!image) return next(new AppError("Image not found", 404));
    await cacheDeletePattern("public:gallery*");
    res.status(200).json({ success: true, data: image });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return next(new AppError("Image not found", 404));
    await cacheDeletePattern("public:gallery*");
    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllGalleryImages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [images, total] = await Promise.all([
      Gallery.find()
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Gallery.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      data: images,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// ============================================================================
// FEES
// ============================================================================

export const createFee = async (req, res, next) => {
  try {
    const fee = await Fee.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    await cacheDeletePattern("public:fees*");
    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!fee) return next(new AppError("Fee not found", 404));
    await cacheDeletePattern("public:fees*");
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return next(new AppError("Fee not found", 404));
    await cacheDeletePattern("public:fees*");
    res.status(200).json({ success: true, message: "Fee deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getAllFees = async (req, res, next) => {
  try {
    const fees = await Fee.find()
      .populate("faculty", "name code")
      .sort({ facultyName: 1, program: 1 });
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

// ============================================================================
// SITE SETTINGS
// ============================================================================

export const getSiteSettings = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const settings = await SiteSettings.find(query).sort({ category: 1, order: 1 });
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const updateSiteSetting = async (req, res, next) => {
  try {
    const { key, value, category, label, description, valueType, isPublic } = req.body;
    
    const setting = await SiteSettings.setSetting(key, value, {
      category,
      label,
      description,
      valueType,
      isPublic,
      updatedBy: req.user.userId,
    });

    await cacheDeletePattern("public:*");
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const bulkUpdateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    
    const updates = await Promise.all(
      settings.map((s) =>
        SiteSettings.setSetting(s.key, s.value, {
          ...s,
          updatedBy: req.user.userId,
        })
      )
    );

    await cacheDeletePattern("public:*");
    res.status(200).json({ success: true, data: updates });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteSiteSetting = async (req, res, next) => {
  try {
    const setting = await SiteSettings.findByIdAndDelete(req.params.id);
    if (!setting) return next(new AppError("Setting not found", 404));
    await cacheDeletePattern("public:*");
    res.status(200).json({ success: true, message: "Setting deleted" });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export default {
  // Faculties
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAllFaculties,
  // Scholarships
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getAllScholarships,
  // Careers
  createCareer,
  updateCareer,
  deleteCareer,
  getAllCareers,
  // News
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
  // Events
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  // Gallery
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getAllGalleryImages,
  // Fees
  createFee,
  updateFee,
  deleteFee,
  getAllFees,
  // Settings
  getSiteSettings,
  updateSiteSetting,
  bulkUpdateSettings,
  deleteSiteSetting,
};
