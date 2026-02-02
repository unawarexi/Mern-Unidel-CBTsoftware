/**
 * Admin Content Routes - CRUD operations for landing page content
 * Requires admin authentication
 */
import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rate-limiter.middleware.js";
import {
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
} from "../controllers/admin-content.controller.js";

const router = express.Router();

// Protect all routes - requires admin or superadmin
router.use(protect);
router.use(authorize("admin", "superadmin"));
router.use(apiLimiter);

// ============================================================================
// FACULTIES
// ============================================================================

router.route("/faculties")
  .get(getAllFaculties)
  .post(createFaculty);

router.route("/faculties/:id")
  .put(updateFaculty)
  .delete(deleteFaculty);

// ============================================================================
// SCHOLARSHIPS
// ============================================================================

router.route("/scholarships")
  .get(getAllScholarships)
  .post(createScholarship);

router.route("/scholarships/:id")
  .put(updateScholarship)
  .delete(deleteScholarship);

// ============================================================================
// CAREERS
// ============================================================================

router.route("/careers")
  .get(getAllCareers)
  .post(createCareer);

router.route("/careers/:id")
  .put(updateCareer)
  .delete(deleteCareer);

// ============================================================================
// NEWS
// ============================================================================

router.route("/news")
  .get(getAllNews)
  .post(createNews);

router.route("/news/:id")
  .put(updateNews)
  .delete(deleteNews);

// ============================================================================
// EVENTS
// ============================================================================

router.route("/events")
  .get(getAllEvents)
  .post(createEvent);

router.route("/events/:id")
  .put(updateEvent)
  .delete(deleteEvent);

// ============================================================================
// GALLERY
// ============================================================================

router.route("/gallery")
  .get(getAllGalleryImages)
  .post(createGalleryImage);

router.route("/gallery/:id")
  .put(updateGalleryImage)
  .delete(deleteGalleryImage);

// ============================================================================
// FEES
// ============================================================================

router.route("/fees")
  .get(getAllFees)
  .post(createFee);

router.route("/fees/:id")
  .put(updateFee)
  .delete(deleteFee);

// ============================================================================
// SITE SETTINGS
// ============================================================================

router.route("/settings")
  .get(getSiteSettings)
  .post(updateSiteSetting);

router.post("/settings/bulk", bulkUpdateSettings);

router.delete("/settings/:id", deleteSiteSetting);

export default router;
