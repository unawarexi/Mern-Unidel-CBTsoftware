/**
 * Public Routes - Unauthenticated endpoints for landing pages
 * Serves cached, aggregated data for frontend
 */
import express from "express";
import {
  getHomePageData,
  getPublicStats,
  getFacultiesWithDepartments,
  getFacultyByCode,
  getScholarships,
  getCareers,
  getCareerById,
  getNews,
  getNewsBySlug,
  getEvents,
  getEventBySlug,
  getGallery,
  getFees,
} from "../controllers/public.controller.js";

const router = express.Router();

// ============================================================================
// HOMEPAGE & STATS
// ============================================================================

// Aggregate homepage data
router.get("/home", getHomePageData);

// Platform statistics
router.get("/stats", getPublicStats);

// ============================================================================
// FACULTIES & DEPARTMENTS
// ============================================================================

// All faculties with departments
router.get("/faculties", getFacultiesWithDepartments);

// Single faculty by code
router.get("/faculties/:code", getFacultyByCode);

// ============================================================================
// SCHOLARSHIPS
// ============================================================================

router.get("/scholarships", getScholarships);

// ============================================================================
// CAREERS
// ============================================================================

router.get("/careers", getCareers);
router.get("/careers/:id", getCareerById);

// ============================================================================
// NEWS
// ============================================================================

router.get("/news", getNews);
router.get("/news/:slug", getNewsBySlug);

// ============================================================================
// EVENTS
// ============================================================================

router.get("/events", getEvents);
router.get("/events/:slug", getEventBySlug);

// ============================================================================
// GALLERY
// ============================================================================

router.get("/gallery", getGallery);

// ============================================================================
// FEES
// ============================================================================

router.get("/fees", getFees);

export default router;
