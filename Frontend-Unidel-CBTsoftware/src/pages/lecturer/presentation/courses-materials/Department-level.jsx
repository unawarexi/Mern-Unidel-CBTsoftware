import React from "react";
import { BookOpen, Users, User } from "lucide-react";

const departmentCourses = [
  {
    _id: "c1",
    courseCode: "CSC101",
    courseTitle: "Intro to Computer Science",
    students: 40,
    lecturers: ["Dr. Alice", "Mr. Bob"],
  },
  {
    _id: "c2",
    courseCode: "CSC201",
    courseTitle: "Data Structures",
    students: 35,
    lecturers: ["Dr. Alice"],
  },
  // ...more dummy data
];

const DepartmentLevel = () => (
  <div className="w-full min-h-screen bg-white p-4 md:p-8">
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
        <BookOpen className="w-7 h-7 text-blue-900" />
        Department Overview
      </h2>
      <p className="text-slate-600 text-sm md:text-base">
        Overview of courses, students, and lecturers in your department.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {departmentCourses.map((course) => (
        <div key={course._id} className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-700" />
            <span className="font-bold text-blue-900 text-lg">{course.courseCode}</span>
            <span className="text-slate-700">{course.courseTitle}</span>
          </div>
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <Users className="w-5 h-5" /> {course.students} Students
            </div>
            <div className="flex items-center gap-2 text-purple-700 font-semibold">
              <User className="w-5 h-5" /> {course.lecturers.length} Lecturer{course.lecturers.length > 1 ? "s" : ""}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Lecturers: {course.lecturers.join(", ")}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DepartmentLevel;
