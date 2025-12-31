import React from "react";
import { FileText, Download, Trash2, User } from "lucide-react";

const courseMaterials = [
  {
    _id: "m1",
    filename: "Lecture1.pdf",
    type: "pdf",
    url: "#",
    uploadedBy: "Dr. Alice",
    uploadedAt: "2024-06-01",
    description: "Week 1 Lecture Notes",
  },
  {
    _id: "m2",
    filename: "Assignment1.docx",
    type: "docx",
    url: "#",
    uploadedBy: "Dr. Alice",
    uploadedAt: "2024-06-03",
    description: "Assignment 1",
  },
  // ...more dummy data
];

const CourseMaterials = () => (
  <div className="w-full min-h-screen bg-white p-4 md:p-8">
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
        <FileText className="w-7 h-7 text-orange-600" />
        Course Materials
      </h2>
      <p className="text-slate-600 text-sm md:text-base">
        All uploaded materials for this course.
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-slate-200 rounded-xl">
        <thead>
          <tr className="bg-slate-50">
            <th className="py-3 px-4 text-left font-semibold text-slate-700">File Name</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Type</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Uploaded By</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Date</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Description</th>
            <th className="py-3 px-4 text-left font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courseMaterials.map((mat) => (
            <tr key={mat._id} className="border-t border-slate-100 hover:bg-orange-50 transition">
              <td className="py-3 px-4 font-medium">{mat.filename}</td>
              <td className="py-3 px-4 uppercase">{mat.type}</td>
              <td className="py-3 px-4 flex items-center gap-1">
                <User className="w-4 h-4 text-blue-700" /> {mat.uploadedBy}
              </td>
              <td className="py-3 px-4">{mat.uploadedAt}</td>
              <td className="py-3 px-4">{mat.description}</td>
              <td className="py-3 px-4 flex gap-2">
                <a href={mat.url} className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition">
                  <Download className="w-4 h-4" /> Download
                </a>
                <button className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CourseMaterials;
