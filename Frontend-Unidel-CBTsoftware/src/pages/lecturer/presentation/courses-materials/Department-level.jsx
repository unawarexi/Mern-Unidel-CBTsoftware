/* eslint-disable no-unused-vars */
import React from "react";
import { BookOpen, Users, User } from "lucide-react";
import { useGetDepartmentsByEntityAction } from "../../../../store/department-store";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";

const DepartmentLevel = () => {
  const { courses = [] } = useGetLecturerCoursesAction();
  const { departments = [], isLoading } = useGetDepartmentsByEntityAction({ lecturerId: "me" });
  const department = departments[0];

  const deptCourses = courses;
  const deptLecturers = department?.lecturers || [];
  const deptStudents = department?.students || [];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Department Overview</h2>
          </div>
          <p className="text-slate-600 ml-14">Overview of your assigned department's courses, students, and lecturers.</p>
        </div>

        {department && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Department</span>
                <p className="text-lg font-bold text-slate-900 mt-1">{department.departmentName}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Faculty</span>
                <p className="text-lg font-bold text-slate-900 mt-1">{department.faculty}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Department Code</span>
                <p className="text-lg font-bold text-orange-600 mt-1">{department.departmentCode}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Description</span>
                <p className="text-slate-700 mt-1">{department.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deptCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <span className="font-bold text-orange-600 text-lg block">{course.courseCode}</span>
                    <span className="text-slate-900 font-medium">{course.courseTitle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded">
                    <Users className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-900">{Array.isArray(course.students) ? course.students.length : 0}</span>
                    <span className="text-sm text-slate-500 ml-1">Students</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded">
                    <User className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-900">{Array.isArray(course.lecturers) ? course.lecturers.length : 0}</span>
                    <span className="text-sm text-slate-500 ml-1">Lecturer{Array.isArray(course.lecturers) && course.lecturers.length > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lecturers</span>
                <p className="text-sm text-slate-700 mt-1">{Array.isArray(course.lecturers) ? course.lecturers.map((l) => l.fullname || l.email || l).join(", ") : "None"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentLevel;
