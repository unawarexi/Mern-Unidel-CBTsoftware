import React, { useState, useMemo } from "react";
import { BookOpen, Users, FileText, ArrowRight, Search } from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";

const AssignedCourses = () => {
  const { courses = [], isLoading } = useGetLecturerCoursesAction();

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");

  // Helper function to get department names from course
  const getDepartmentNames = (course) => {
    if (!course.department) return "N/A";
    if (Array.isArray(course.department)) {
      return course.department
        .map((dept) => {
          if (typeof dept === "object" && dept.departmentName) {
            return dept.departmentName;
          }
          return dept;
        })
        .join(", ");
    }
    if (typeof course.department === "object" && course.department.departmentName) {
      return course.department.departmentName;
    }
    return course.department;
  };

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const deptNames = getDepartmentNames(course).toLowerCase();
      const matchesSearch =
        (course.courseCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.courseTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        deptNames.includes(searchTerm.toLowerCase());
      const matchesDept = filterDepartment === "All" || deptNames.includes(filterDepartment.toLowerCase());
      return matchesSearch && matchesDept;
    });
  }, [courses, searchTerm, filterDepartment]);

  // Get unique departments for filter dropdown
  const departmentOptions = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.department) {
        if (Array.isArray(c.department)) {
          c.department.forEach((dept) => {
            const deptName = typeof dept === "object" && dept.departmentName ? dept.departmentName : dept;
            if (deptName) set.add(deptName);
          });
        } else {
          const deptName = typeof c.department === "object" && c.department.departmentName ? c.department.departmentName : c.department;
          if (deptName) set.add(deptName);
        }
      }
    });
    return Array.from(set);
  }, [courses]);

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-orange-500 rounded-lg">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900">Assigned Courses</h2>
          </div>
          <p className="text-xs sm:text-base text-gray-600 ml-0 sm:ml-14">View and manage all courses assigned to you this semester.</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
              />
            </div>
            {/* Filters */}
            <div className="flex gap-2 sm:gap-3">
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900">
                <option value="All">All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
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
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base">Course</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden md:table-cell">Department</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden sm:table-cell">Students</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 sm:py-12 text-center text-slate-400 text-xs sm:text-base">
                      Loading...
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 sm:py-12 text-center text-slate-400 text-xs sm:text-base">
                      No assigned courses found.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="font-bold text-orange-600 text-[10px] sm:text-base">{course.courseCode}</div>
                        <div className="text-[10px] sm:text-sm text-slate-900 truncate max-w-[120px] sm:max-w-none">{course.courseTitle}</div>
                        <div className="md:hidden text-[9px] text-slate-500 mt-0.5 truncate max-w-[120px]">{getDepartmentNames(course)}</div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-slate-600 text-[10px] sm:text-base hidden md:table-cell">
                        <div className="max-w-[120px] truncate">{getDepartmentNames(course)}</div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1 sm:gap-2 text-slate-700 text-[10px] sm:text-base">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                          <span className="font-semibold">{Array.isArray(course.students) ? course.students.length : 0}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button className="inline-flex items-center gap-1 px-1.5 sm:px-4 py-1 sm:py-2 bg-orange-500 text-white rounded-lg text-[10px] sm:text-sm font-medium hover:bg-orange-600 transition-colors">
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Materials</span>
                          </button>
                          <button className="inline-flex items-center gap-1 px-1.5 sm:px-4 py-1 sm:py-2 bg-slate-900 text-white rounded-lg text-[10px] sm:text-sm font-medium hover:bg-slate-800 transition-colors">
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Details</span>
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
