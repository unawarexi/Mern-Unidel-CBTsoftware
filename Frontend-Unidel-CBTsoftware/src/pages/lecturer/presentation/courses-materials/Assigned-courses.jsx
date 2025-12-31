import React, { useState, useMemo } from "react";
import { BookOpen, Users, FileText, ArrowRight, Search } from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";

const AssignedCourses = () => {
  const { courses = [], isLoading } = useGetLecturerCoursesAction();

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        (course.courseCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.courseTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.department || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        filterDepartment === "All" || course.department === filterDepartment;
      return matchesSearch && matchesDept;
    });
  }, [courses, searchTerm, filterDepartment]);

  // Get unique departments for filter dropdown
  const departmentOptions = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => c.department && set.add(c.department));
    return Array.from(set);
  }, [courses]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Assigned Courses</h2>
          </div>
          <p className="text-gray-600 ml-14">View and manage all courses assigned to you this semester.</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
              />
            </div>
            {/* Filters */}
            <div className="flex gap-3">
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900">
                <option value="All">All</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Course Code</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Title</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Department</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Students</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No assigned courses found.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-orange-600">{course.courseCode}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{course.courseTitle}</td>
                      <td className="px-6 py-4 text-slate-600">{course.department}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="font-semibold">{Array.isArray(course.students) ? course.students.length : 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                            <FileText className="w-4 h-4" />
                            Materials
                          </button>
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedCourses;
