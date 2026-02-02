/**
 * Public Controller - Serves public landing page data
 * No authentication required for these endpoints
 */
import Faculty from "../models/faculty.model.js";
import Department from "../models/department.model.js";
import Scholarship from "../models/scholarship.model.js";
import Career from "../models/career.model.js";
import News from "../models/news.model.js";
import Event from "../models/event.model.js";
import Gallery from "../models/gallery.model.js";
import Fee from "../models/fee.model.js";
import SiteSettings from "../models/site-settings.model.js";
import Student from "../models/student.model.js";
import Lecturer from "../models/lecturer.model.js";
import Exam from "../models/exam.model.js";
import Course from "../models/course.model.js";
import { cacheGet, cacheSet, CACHE_TTL } from "../services/redis.service.js";

import ExamSubmission from "../models/submission.model.js";

// ============================================================================
// HOMEPAGE AGGREGATE DATA
// ============================================================================

/**
 * Get all homepage data in a single request
 * @route GET /api/public/home
 */
export const getHomePageData = async (req, res) => {
  try {
    // Try cache first
    const cacheKey = "public:homepage";
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json({ success: true, data: cached, cached: true });
    }

    // Fetch all data in parallel
    const [stats, faculties, featuredNews, upcomingEvents, scholarships] =
      await Promise.all([
        getAggregatedStats(),
        Faculty.find({ isActive: true })
          .select(
            "name code dean description icon color totalStudents totalPrograms order",
          )
          .sort({ order: 1 })
          .lean(),
        News.find({ isPublished: true, isFeatured: true })
          .select(
            "title excerpt category author featuredImage icon publishedAt slug",
          )
          .sort({ publishedAt: -1 })
          .limit(3)
          .lean(),
        Event.find({ isPublished: true, startDate: { $gte: new Date() } })
          .select(
            "title description startDate time location category isFeatured slug",
          )
          .sort({ startDate: 1 })
          .limit(5)
          .lean(),
        Scholarship.find({ isActive: true, isFeatured: true })
          .select("title description coverage deadline icon")
          .sort({ order: 1 })
          .limit(4)
          .lean(),
      ]);

    const data = {
      stats,
      faculties,
      featuredNews,
      upcomingEvents,
      scholarships,
    };

    // Cache for 5 minutes
    await cacheSet(cacheKey, data, 300);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[Public] Homepage data error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load homepage data" });
  }
};

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get platform statistics
 * @route GET /api/public/stats
 */
export const getPublicStats = async (req, res) => {
  try {
    const cacheKey = "public:stats";
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json({ success: true, data: cached, cached: true });
    }

    const stats = await getAggregatedStats();

    await cacheSet(cacheKey, stats, 300);

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("[Public] Stats error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load statistics" });
  }
};

/**
 * Helper function to aggregate stats from database
 */
async function getAggregatedStats() {
  const [
    totalStudents,
    totalLecturers,
    totalCourses,
    totalExams,
    totalFaculties,
    totalDepartments,
    siteStats,
  ] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    Lecturer.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    Exam.countDocuments({ status: "published" }),
    Faculty.countDocuments({ isActive: true }),
    Department.countDocuments({ isActive: true }),
    SiteSettings.getPublicStats(),
  ]);

  // Chart Data: Exam Success Rate
  const totalSubmissions = await ExamSubmission.countDocuments();
  const passedSubmissions = await ExamSubmission.countDocuments({
    passed: true,
  });
  const failedSubmissions = totalSubmissions - passedSubmissions;

  const successRate =
    totalSubmissions > 0
      ? Math.round((passedSubmissions / totalSubmissions) * 100)
      : 0;
  const failureRate = 100 - successRate;

  const examSuccessData = [
    { name: "Passed", value: successRate, color: "#f97316" },
    { name: "Failed", value: failureRate, color: "#e5e7eb" },
  ];

  // Chart Data: Department Participation
  const deptAggregation = await Student.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "deptInfo",
      },
    },
    { $unwind: "$deptInfo" },
    {
      $group: {
        _id: "$deptInfo.departmentName",
        students: { $sum: 1 },
      },
    },
    { $sort: { students: -1 } },
    { $limit: 6 },
    {
      $project: {
        dept: "$_id",
        students: 1,
        _id: 0,
      },
    },
  ]);

  // Chart Data: Monthly Performance (Last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthlyAgg = await ExamSubmission.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        exams: { $sum: 1 },
        passed: { $sum: { $cond: ["$passed", 1, 0] } },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyPerformanceData = monthlyAgg.map((item) => ({
    month: monthNames[item._id.month - 1],
    exams: item.exams,
    success: item.exams > 0 ? Math.round((item.passed / item.exams) * 100) : 0,
  }));

  // Ensure transparency highlights are available
  const transparencyHighlights = [
    { label: "Real-Time Monitoring", value: "100% of exams tracked live" },
    { label: "Automated Grading", value: "Zero human bias in scoring" },
    { label: "Secure Platform", value: "Bank-grade encryption" },
    { label: "Instant Results", value: "Available within minutes" },
    { label: "Question Randomization", value: "Prevents exam malpractice" },
    { label: "Audit Trail", value: "Complete exam history logs" },
  ];

  return {
    totalStudents,
    totalLecturers,
    totalCourses,
    totalExams,
    totalFaculties,
    totalDepartments,
    examSuccessData,
    departmentData: deptAggregation,
    monthlyPerformanceData,
    transparencyHighlights,
    ...siteStats,
  };
}

// ============================================================================
// FACULTIES & DEPARTMENTS
// ============================================================================

/**
 * Get all faculties with their departments
 * @route GET /api/public/faculties
 */
export const getFacultiesWithDepartments = async (req, res) => {
  try {
    const cacheKey = "public:faculties";
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json({ success: true, data: cached, cached: true });
    }

    const faculties = await Faculty.find({ isActive: true })
      .populate({
        path: "departments",
        match: { isActive: true },
        select: "departmentName departmentCode hod description",
        populate: {
          path: "hod",
          select: "name",
        },
      })
      .sort({ order: 1 })
      .lean();

    // Enrich with statistics
    const enrichedFaculties = await Promise.all(
      faculties.map(async (faculty) => {
        const deptIds = faculty.departments.map((d) => d._id);
        const [studentCount, programCount] = await Promise.all([
          Student.countDocuments({
            department: { $in: deptIds },
            isActive: true,
          }),
          Course.countDocuments({
            department: { $in: deptIds },
            isActive: true,
          }),
        ]);

        return {
          ...faculty,
          totalStudents: studentCount,
          totalPrograms: programCount,
          departmentCount: faculty.departments.length,
        };
      }),
    );

    await cacheSet(cacheKey, enrichedFaculties, 600);

    res.status(200).json({ success: true, data: enrichedFaculties });
  } catch (error) {
    console.error("[Public] Faculties error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load faculties" });
  }
};

/**
 * Get single faculty with departments
 * @route GET /api/public/faculties/:code
 */
export const getFacultyByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const faculty = await Faculty.findOne({
      code: code.toUpperCase(),
      isActive: true,
    })
      .populate({
        path: "departments",
        match: { isActive: true },
        select: "departmentName departmentCode hod description levels",
        populate: {
          path: "hod",
          select: "name email",
        },
      })
      .lean();

    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    console.error("[Public] Faculty error:", error);
    res.status(500).json({ success: false, message: "Failed to load faculty" });
  }
};

// ============================================================================
// SCHOLARSHIPS
// ============================================================================

/**
 * Get active scholarships
 * @route GET /api/public/scholarships
 */
export const getScholarships = async (req, res) => {
  try {
    const { category } = req.query;

    const cacheKey = `public:scholarships:${category || "all"}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json({ success: true, data: cached, cached: true });
    }

    const query = { isActive: true };
    if (category && category !== "all") {
      query.category = category;
    }

    const scholarships = await Scholarship.find(query)
      .select(
        "title description eligibility coverage deadline deadlineText icon category applicationLink isFeatured",
      )
      .sort({ isFeatured: -1, order: 1 })
      .lean();

    // Get scholarship stats
    const stats = await SiteSettings.find({
      category: "stats",
      key: {
        $in: [
          "annualScholarshipFund",
          "scholarshipBeneficiaries",
          "studentsOnAid",
          "scholarshipPrograms",
        ],
      },
      isPublic: true,
    });

    const data = {
      scholarships,
      stats: stats.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}),
    };

    await cacheSet(cacheKey, data, 300);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[Public] Scholarships error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load scholarships" });
  }
};

// ============================================================================
// CAREERS
// ============================================================================

/**
 * Get active career postings
 * @route GET /api/public/careers
 */
export const getCareers = async (req, res) => {
  try {
    const { type, category, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };
    if (type && type !== "all") query.type = type;
    if (category && category !== "all") query.category = category;

    const [careers, total] = await Promise.all([
      Career.find(query)
        .select(
          "title company companyLogo location type category description salary deadline isFeatured createdAt",
        )
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      Career.countDocuments(query),
    ]);

    // Get career stats
    const careerStats = await SiteSettings.find({
      category: "stats",
      key: {
        $in: [
          "employmentRate",
          "partnerCompanies",
          "jobsPostedAnnually",
          "avgStartingSalary",
        ],
      },
      isPublic: true,
    });

    res.status(200).json({
      success: true,
      data: {
        careers,
        stats: careerStats.reduce(
          (acc, s) => ({ ...acc, [s.key]: s.value }),
          {},
        ),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[Public] Careers error:", error);
    res.status(500).json({ success: false, message: "Failed to load careers" });
  }
};

/**
 * Get single career posting
 * @route GET /api/public/careers/:id
 */
export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).lean();

    if (!career) {
      return res
        .status(404)
        .json({ success: false, message: "Career posting not found" });
    }

    res.status(200).json({ success: true, data: career });
  } catch (error) {
    console.error("[Public] Career error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load career posting" });
  }
};

// ============================================================================
// NEWS
// ============================================================================

/**
 * Get published news articles
 * @route GET /api/public/news
 */
export const getNews = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };
    if (category && category !== "all") query.category = category;

    const [news, total, featured] = await Promise.all([
      News.find(query)
        .select(
          "title excerpt category author featuredImage icon publishedAt slug isFeatured",
        )
        .sort({ isFeatured: -1, publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      News.countDocuments(query),
      News.find({ isPublished: true, isFeatured: true })
        .select(
          "title excerpt category author featuredImage icon publishedAt slug",
        )
        .sort({ publishedAt: -1 })
        .limit(2)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        news,
        featured,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[Public] News error:", error);
    res.status(500).json({ success: false, message: "Failed to load news" });
  }
};

/**
 * Get single news article
 * @route GET /api/public/news/:slug
 */
export const getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).lean();

    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News article not found" });
    }

    // Get related news
    const related = await News.find({
      isPublished: true,
      category: news.category,
      _id: { $ne: news._id },
    })
      .select("title excerpt featuredImage publishedAt slug")
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    res.status(200).json({ success: true, data: { ...news, related } });
  } catch (error) {
    console.error("[Public] News error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load news article" });
  }
};

// ============================================================================
// EVENTS
// ============================================================================

/**
 * Get published events
 * @route GET /api/public/events
 */
export const getEvents = async (req, res) => {
  try {
    const { category, upcoming = true, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };
    if (category && category !== "all") query.category = category;
    if (upcoming === "true" || upcoming === true) {
      query.startDate = { $gte: new Date() };
    }

    const [events, total, featured] = await Promise.all([
      Event.find(query)
        .select(
          "title description startDate endDate time location category featuredImage isFeatured slug",
        )
        .sort({ isFeatured: -1, startDate: 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      Event.countDocuments(query),
      Event.find({
        isPublished: true,
        isFeatured: true,
        startDate: { $gte: new Date() },
      })
        .select("title description startDate time location category slug")
        .sort({ startDate: 1 })
        .limit(3)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        events,
        featured,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[Public] Events error:", error);
    res.status(500).json({ success: false, message: "Failed to load events" });
  }
};

/**
 * Get single event
 * @route GET /api/public/events/:slug
 */
export const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).lean();

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error("[Public] Event error:", error);
    res.status(500).json({ success: false, message: "Failed to load event" });
  }
};

// ============================================================================
// GALLERY
// ============================================================================

/**
 * Get gallery images
 * @route GET /api/public/gallery
 */
export const getGallery = async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;

    const cacheKey = `public:gallery:${category || "all"}:${page}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json({ success: true, data: cached, cached: true });
    }

    const query = { isPublished: true };
    if (category && category !== "all") query.category = category;

    const [images, total] = await Promise.all([
      Gallery.find(query)
        .select("title imageUrl thumbnailUrl category description isFeatured")
        .sort({ isFeatured: -1, order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      Gallery.countDocuments(query),
    ]);

    const data = {
      images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };

    await cacheSet(cacheKey, data, 300);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[Public] Gallery error:", error);
    res.status(500).json({ success: false, message: "Failed to load gallery" });
  }
};

// ============================================================================
// FEES
// ============================================================================

/**
 * Get fee structure
 * @route GET /api/public/fees
 */
export const getFees = async (req, res) => {
  try {
    const { faculty, level, session } = req.query;

    const cacheKey = `public:fees:${faculty || "all"}:${level || "all"}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res
        .status(200)
        .json({ success: true, data: cached, cached: true });
    }

    const query = { isActive: true };
    if (faculty) query.faculty = faculty;
    if (level && level !== "all") query.level = level;
    if (session) query.academicSession = session;

    const fees = await Fee.find(query)
      .populate("faculty", "name code")
      .select(
        "program faculty facultyName level tuition acceptanceFee registrationFee otherFees totalFee academicSession",
      )
      .sort({ facultyName: 1, program: 1 })
      .lean();

    // Group by faculty
    const groupedFees = fees.reduce((acc, fee) => {
      const facultyName = fee.faculty?.name || fee.facultyName || "Other";
      if (!acc[facultyName]) acc[facultyName] = [];
      acc[facultyName].push(fee);
      return acc;
    }, {});

    // Get other mandatory fees from settings
    const otherFees = await SiteSettings.find({
      category: "general",
      key: { $regex: /^fee_/ },
      isPublic: true,
    }).lean();

    const data = {
      fees: groupedFees,
      otherMandatoryFees: otherFees.map((f) => ({
        name: f.label || f.key.replace("fee_", "").replace(/_/g, " "),
        ...f.value,
      })),
      currentSession:
        session ||
        new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
    };

    await cacheSet(cacheKey, data, 600);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[Public] Fees error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load fee structure" });
  }
};

export default {
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
};
