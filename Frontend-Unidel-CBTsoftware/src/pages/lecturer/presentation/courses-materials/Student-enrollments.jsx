import React from "react";
import { Users, GraduationCap, CheckCircle2 } from "lucide-react";

const students = [
  {
    _id: "s1",
    fullname: "Jane Doe",
    matricNumber: "CSU/2021/001",
    email: "jane.doe@example.com",
    status: "active",
  },
  {
    _id: "s2",
    fullname: "John Smith",
    matricNumber: "CSU/2021/002",
    email: "john.smith@example.com",
    status: "active",
  },
  // ...more dummy data
];

const StudentEnrollments = () => (
  <div className="w-full min-h-screen bg-white p-4 md:p-8">
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
        <Users className="w-7 h-7 text-green-600" />
        Student Enrollments
      </h2>
      <p className="text-slate-600 text-sm md:text-base">
        List of students enrolled in your course.
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-slate-200 rounded-xl">
        <thead>
          <tr className="bg-slate-50">
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Matric Number</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Email</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-t border-slate-100 hover:bg-green-50 transition">
              <td className="py-3 px-4 font-medium">{student.fullname}</td>
              <td className="py-3 px-4">{student.matricNumber}</td>
              <td className="py-3 px-4">{student.email}</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StudentEnrollments;
