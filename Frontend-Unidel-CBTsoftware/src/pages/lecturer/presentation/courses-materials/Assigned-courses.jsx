import React from "react";
import { BookOpen, Users, FileText, ArrowRight } from "lucide-react";

const assignedCourses = [
  {
    _id: "1",
    courseCode: "CSC101",
    courseTitle: "Introduction to Computer Science",
    department: "Computer Science",
    students: 40,
  },
  {
    _id: "2",
    courseCode: "MTH102",
    courseTitle: "Calculus II",
    department: "Mathematics",
    students: 35,
  },
  // ...more dummy data
];

const AssignedCourses = () => (
  <div className="w-full min-h-screen bg-white p-4 md:p-8">
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
        <BookOpen className="w-7 h-7 text-orange-600" />
        Assigned Courses
      </h2>
      <p className="text-slate-600 text-sm md:text-base">
        View and manage all courses assigned to you this semester.
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-slate-200 rounded-xl">
        <thead>
          <tr className="bg-slate-50">
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Course Code</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Title</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Department</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Students</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignedCourses.map((course) => (
            <tr key={course._id} className="border-t border-slate-100 hover:bg-orange-50 transition">
              <td className="py-3 px-4 font-bold text-orange-700">{course.courseCode}</td>
              <td className="py-3 px-4">{course.courseTitle}</td>
              <td className="py-3 px-4">{course.department}</td>
              <td className="py-3 px-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" /> {course.students}
              </td>
              <td className="py-3 px-4">
                <button className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition">
                  <FileText className="w-4 h-4" /> Materials
                </button>
                <button className="inline-flex items-center gap-1 px-3 py-1 ml-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition">
                  <ArrowRight className="w-4 h-4" /> Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AssignedCourses;
