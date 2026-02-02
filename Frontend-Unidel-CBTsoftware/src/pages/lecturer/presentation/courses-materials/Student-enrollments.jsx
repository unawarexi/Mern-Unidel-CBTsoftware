import React, { useState, useMemo } from "react";
import { Users, CheckCircle2, Search, Filter } from "lucide-react";
import { useGetLecturerStudentsAction } from "../../../../store/user-store";

const StudentEnrollments = () => {
  const { students = [], isLoading: loadingStudents } = useGetLecturerStudentsAction();

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        (student.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.matricNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel =
        filterLevel === "All" || String(student.level) === String(filterLevel);
      return matchesSearch && matchesLevel;
    });
  }, [students, searchTerm, filterLevel]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Student Enrollments</h2>
          </div>
          <p className="text-gray-600 ml-14">List of students enrolled in your courses.</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
              />
            </div>
            {/* Filters */}
            <div className="flex gap-3">
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900">
                <option>All</option>
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
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
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Full Name</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Course(s)</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Matric Number</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Level</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingStudents ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No students enrolled.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-medium">{student.fullname || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-orange-600">{(student.coursesInfo || []).map((c) => c.courseCode).join(", ") || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{student.matricNumber || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{student.email || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-semibold">{student.level || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-md">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-semibold">Active</span>
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

export default StudentEnrollments;
