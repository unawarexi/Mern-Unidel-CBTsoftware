import Department from "../models/department.model.js";
import Student from "../models/student.model.js";
import Lecturer from "../models/lecturer.model.js";
import Course from "../models/course.model.js";
import { generateDepartmentId, generateDepartmentCode } from "../core/helpers/helper-functions.js";

/**
 * Create a new department (Admin only)
 */
export const createDepartment = async (req, res) => {
  try {
    const { departmentName, faculty, description, levels, hod } = req.body;
    const createdBy = req.user._id;

    // Count existing departments for ID/code generation
    const count = await Department.countDocuments();

    const departmentId = generateDepartmentId(count + 1);
    const departmentCode = generateDepartmentCode(count + 1);

    const department = new Department({
      departmentName,
      departmentCode,
      departmentId,
      faculty,
      description,
      levels,
      hod,
      createdBy,
    });

    await department.save();
    res.status(201).json({ message: "Department created", department });
  } catch (error) {
    res.status(500).json({ message: "Failed to create department", error: error.message });
  }
};

/**
 * Get all departments
 */
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("courses", "courseCode courseTitle")
      .populate("lecturers", "fullname email")
      .populate("students", "fullname email matricNumber")
      .populate("hod", "fullname email");
    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments", error: error.message });
  }
};

/**
 * Get department by ID
 */
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id)
      .populate("courses", "courseCode courseTitle")
      .populate("lecturers", "fullname email")
      .populate("students", "fullname email matricNumber")
      .populate("hod", "fullname email");
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ department });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch department", error: error.message });
  }
};

/**
 * Get departments by student, lecturer, or course
 */
export const getDepartmentsByEntity = async (req, res) => {
  try {
    let { studentId, lecturerId, courseId } = req.query;
    // If lecturerId is "me", use req.user._id
    if (lecturerId === "me" && req.user && req.user.role === "lecturer") {
      lecturerId = req.user._id;
    }
    let filter = {};
    if (studentId) filter.students = studentId;
    if (lecturerId) filter.lecturers = lecturerId;
    if (courseId) filter.courses = courseId;

    const departments = await Department.find(filter)
      .populate("courses", "courseCode courseTitle")
      .populate("lecturers", "fullname email")
      .populate("students", "fullname email matricNumber")
      .populate("hod", "fullname email");
    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments", error: error.message });
  }
};

/**
 * Update department (Admin only)
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    // Accept both {id, data} (from frontend) and direct body
    const updates = req.body.data || req.body;
    // Only allow updating specific arrays and fields
    const allowedFields = [
      "departmentName",
      "departmentCode",
      "departmentId",
      "courses",
      "lecturers",
      "students",
      "levels",
      "hod",
      "faculty",
      "description",
      "isActive",
    ];
    const updateObj = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) updateObj[key] = updates[key];
    }
    const department = await Department.findByIdAndUpdate(id, updateObj, { new: true });
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department updated", department });
  } catch (error) {
    res.status(500).json({ message: "Failed to update department", error: error.message });
  }
};

/**
 * Delete department (Admin only)
 */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department", error: error.message });
  }
};

/**
 * Promote students to next level if they passed all required exams
 * (Assume exam results are available and passing logic is handled elsewhere)
 */
export const promoteStudents = async (req, res) => {
  try {
    const { departmentId, fromLevel, toLevel } = req.body;
    // Find students in department and fromLevel
    const department = await Department.findById(departmentId).populate("students");
    if (!department) return res.status(404).json({ message: "Department not found" });

    // Example: Assume Student model has a 'level' field and 'passedAllExams' method
    const studentsToPromote = await Student.find({
      _id: { $in: department.students },
      level: fromLevel,
      // Add more criteria if needed, e.g. passedAllExams: true
    });

    // Promote each student
    const result = await Promise.all(
      studentsToPromote.map(async (student) => {
        student.level = toLevel;
        await student.save();
        return student._id;
      })
    );

    res.status(200).json({ message: "Students promoted", promoted: result.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to promote students", error: error.message });
  }
};
