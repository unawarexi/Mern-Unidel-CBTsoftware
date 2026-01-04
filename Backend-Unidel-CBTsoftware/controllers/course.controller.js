import Course from "../models/course.model.js";
import Student from "../models/student.model.js";
import Lecturer from "../models/lecturer.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.service.js";

// @desc    Create new course
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, department, lecturers } = req.body;

    if (!courseTitle || !department) {
      return res.status(400).json({
        success: false,
        message: "Please provide course title and department",
      });
    }

    // Ensure department is an array
    const departmentArray = Array.isArray(department) ? department : [department];

    // Validate all department IDs exist
    const Department = (await import("../models/department.model.js")).default;
    const validDepartments = await Department.find({ _id: { $in: departmentArray } });
    
    if (validDepartments.length !== departmentArray.length) {
      return res.status(400).json({
        success: false,
        message: "One or more department IDs are invalid",
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

    // Generate unique course code based on first department code
    const firstDept = validDepartments[0];
    const courseCode = await generateCourseCode(firstDept.departmentCode);

    // Create course
    const course = await Course.create({
      courseCode,
      courseTitle,
      department: departmentArray,
      lecturers: lecturers || [],
    });

    // Populate before sending response
    await course.populate("lecturers", "fullname email lecturerId");
    await course.populate("department", "departmentName departmentCode");

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

// Helper function to generate course code based on department name
const generateCourseCode = async (deptName) => {
  const prefix = deptName.substring(0, 3).toUpperCase();
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

// @desc    Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("lecturers", "fullname email lecturerId")
      .populate("students", "fullname email matricNumber")
      .populate("department", "departmentName departmentCode")
      .sort({ createdAt: -1 });

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
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("lecturers", "fullname email lecturerId")
      .populate("students", "fullname email matricNumber")
      .populate("department", "departmentName departmentCode");

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

    // Validate department if provided
    if (department) {
      const departmentArray = Array.isArray(department) ? department : [department];
      const Department = (await import("../models/department.model.js")).default;
      const validDepartments = await Department.find({ _id: { $in: departmentArray } });
      
      if (validDepartments.length !== departmentArray.length) {
        return res.status(400).json({
          success: false,
          message: "One or more department IDs are invalid",
        });
      }
      course.department = departmentArray;
    }

    // Update fields
    if (courseTitle) course.courseTitle = courseTitle;

    await course.save();
    await course.populate("lecturers", "fullname email lecturerId");
    await course.populate("department", "departmentName departmentCode");

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

// @desc    Upload course material (lecturer only)
// @route   POST /api/courses/:id/materials
// @access  Lecturer only
export const uploadCourseMaterial = async (req, res) => {
  try {
    const courseId = req.params.id;
    // Use req.user._id for MongoDB _id, not req.user.userId
    const lecturerId = req.user._id ? req.user._id.toString() : req.user.userId;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Only allow lecturers assigned to this course
    // Compare as strings for ObjectId
    if (!course.lecturers.some((l) => l.toString() === lecturerId)) {
      return res.status(403).json({ success: false, message: "You are not assigned to this course" });
    }

    // Only allow document files
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const allowedDocs = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt"];
    const ext = req.file.originalname.split(".").pop().toLowerCase();
    if (!allowedDocs.includes(`.${ext}`)) {
      return res.status(400).json({ success: false, message: "Only document files are allowed" });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname, `/courses/${course.courseCode}/materials`);

    // Add to courseMaterials array
    course.courseMaterials.push({
      filename: req.file.originalname,
      url: uploadResult.url,
      uploadedBy: lecturerId,
      public_id: uploadResult.public_id,
      type: ext,
      description: req.body.description || "",
      category: req.body.type || "document", // <-- store the semantic type/category
    });
    await course.save();

    res.status(201).json({
      success: true,
      message: "Course material uploaded",
      material: course.courseMaterials[course.courseMaterials.length - 1],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete course material (lecturer only)
// @route   DELETE /api/courses/:id/materials/:materialId
// @access  Lecturer only
export const deleteCourseMaterial = async (req, res) => {
  try {
    const courseId = req.params.id;
    const materialId = req.params.materialId;
    const lecturerId = req.user.userId;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Only allow lecturers assigned to this course
    if (!course.lecturers.some((l) => l.toString() === lecturerId)) {
      return res.status(403).json({ success: false, message: "You are not assigned to this course" });
    }

    const material = course.courseMaterials.id(materialId);
    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    // Only allow uploader or course lecturer to delete
    if (material.uploadedBy.toString() !== lecturerId) {
      return res.status(403).json({ success: false, message: "You can only delete your own uploads" });
    }

    // Delete from Cloudinary
    if (material.public_id) {
      await deleteFromCloudinary(material.public_id, "raw");
    }

    material.remove();
    await course.save();

    res.status(200).json({ success: true, message: "Material deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Assign students and lecturers to a course
 */
export const assignToCourse = async (req, res) => {
  try {
    const { id } = req.params; // course id
    const { students = [], lecturers = [] } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Add lecturers
    if (lecturers.length) {
      course.lecturers = Array.from(new Set([...course.lecturers.map(String), ...lecturers]));
      // Update each lecturer's courses
      await Lecturer.updateMany(
        { _id: { $in: lecturers } },
        { $addToSet: { courses: course._id } }
      );
    }

    // Add students
    if (students.length) {
      course.students = Array.from(new Set([...course.students.map(String), ...students]));
      // Update each student's courses
      await Student.updateMany(
        { _id: { $in: students } },
        { $addToSet: { courses: course._id } }
      );
    }

    await course.save();
    res.status(200).json({ message: "Assigned successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign", error: error.message });
  }
};

/**
 * Remove students and lecturers from a course
 */
export const removeFromCourse = async (req, res) => {
  try {
    const { id } = req.params; // course id
    const { students = [], lecturers = [] } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Remove lecturers
    if (lecturers.length) {
      course.lecturers = course.lecturers.filter(
        (lid) => !lecturers.includes(lid.toString())
      );
      // Remove course from each lecturer's courses
      await Lecturer.updateMany(
        { _id: { $in: lecturers } },
        { $pull: { courses: course._id } }
      );
    }

    // Remove students
    if (students.length) {
      course.students = course.students.filter(
        (sid) => !students.includes(sid.toString())
      );
      // Remove course from each student's courses
      await Student.updateMany(
        { _id: { $in: students } },
        { $pull: { courses: course._id } }
      );
    }

    await course.save();
    res.status(200).json({ message: "Removed successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove", error: error.message });
  }
};
