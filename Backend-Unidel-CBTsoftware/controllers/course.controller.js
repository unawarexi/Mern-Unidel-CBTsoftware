import Course from "../models/course.model.js";
import Lecturer from "../models/lecturer.model.js";

// Generate unique course code
const generateCourseCode = async (department) => {
  const prefix = department.substring(0, 3).toUpperCase();
  let isUnique = false;
  let courseCode = "";

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    courseCode = `${prefix}${randomNum}`;
    const existing = await Course.findOne({ courseCode });
    if (!existing) isUnique = true;
  }

  return courseCode;
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Admin only
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, department, lecturers } = req.body;

    // Validate required fields
    if (!courseTitle || !department) {
      return res.status(400).json({
        success: false,
        message: "Please provide course title and department",
      });
    }

    // Validate lecturers if provided
    if (lecturers && lecturers.length > 0) {
      const validLecturers = await Lecturer.find({
        _id: { $in: lecturers },
      });

      if (validLecturers.length !== lecturers.length) {
        return res.status(400).json({
          success: false,
          message: "One or more lecturer IDs are invalid",
        });
      }
    }

    // Generate unique course code
    const courseCode = await generateCourseCode(department);

    // Create course
    const course = await Course.create({
      courseCode,
      courseTitle,
      department,
      lecturers: lecturers || [],
    });

    // Populate lecturers
    await course.populate("lecturers", "fullname email lecturerId");

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Admin, Lecturer
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("lecturers", "fullname email lecturerId").populate("students", "fullname email studentId").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Admin, Lecturer
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("lecturers", "fullname email lecturerId").populate("students", "fullname email studentId");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin only
export const updateCourse = async (req, res) => {
  try {
    const { courseTitle, department } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update fields
    if (courseTitle) course.courseTitle = courseTitle;
    if (department) course.department = department;

    await course.save();
    await course.populate("lecturers", "fullname email lecturerId");

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin only
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

// @desc    Assign lecturers to course
// @route   POST /api/courses/:id/assign-lecturers
// @access  Admin only
export const assignLecturers = async (req, res) => {
  try {
    const { lecturers } = req.body;

    if (!lecturers || !Array.isArray(lecturers) || lecturers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of lecturer IDs",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Validate lecturers exist
    const validLecturers = await Lecturer.find({
      _id: { $in: lecturers },
    });

    if (validLecturers.length !== lecturers.length) {
      return res.status(400).json({
        success: false,
        message: "One or more lecturer IDs are invalid",
      });
    }

    // Add lecturers (avoid duplicates)
    lecturers.forEach((lecturerId) => {
      if (!course.lecturers.includes(lecturerId)) {
        course.lecturers.push(lecturerId);
      }
    });

    await course.save();
    await course.populate("lecturers", "fullname email lecturerId");

    res.status(200).json({
      success: true,
      message: "Lecturers assigned successfully",
      data: course,
    });
  } catch (error) {
    console.error("Assign lecturers error:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning lecturers",
      error: error.message,
    });
  }
};

// @desc    Remove lecturers from course
// @route   POST /api/courses/:id/remove-lecturers
// @access  Admin only
export const removeLecturers = async (req, res) => {
  try {
    const { lecturers } = req.body;

    if (!lecturers || !Array.isArray(lecturers) || lecturers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of lecturer IDs",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Remove lecturers
    course.lecturers = course.lecturers.filter((lecturerId) => !lecturers.includes(lecturerId.toString()));

    await course.save();
    await course.populate("lecturers", "fullname email lecturerId");

    res.status(200).json({
      success: true,
      message: "Lecturers removed successfully",
      data: course,
    });
  } catch (error) {
    console.error("Remove lecturers error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing lecturers",
      error: error.message,
    });
  }
};
