import React, { useRef } from "react";
import { FileText, UploadCloud } from "lucide-react";

const UploadMaterials = () => {
  const fileInputRef = useRef();

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <UploadCloud className="w-7 h-7 text-orange-600" />
          Upload Course Material
        </h2>
        <p className="text-slate-600 text-sm md:text-base">
          Add new lecture notes, assignments, or resources for your students.
        </p>
      </div>
      <form className="max-w-lg bg-orange-50 rounded-xl p-6 border border-orange-100 shadow-sm space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-slate-700">File</label>
          <input
            type="file"
            ref={fileInputRef}
            className="block w-full border border-slate-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Description</label>
          <input
            type="text"
            placeholder="e.g. Week 2 Lecture Notes"
            className="block w-full border border-slate-200 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-slate-700">Type</label>
          <select className="block w-full border border-slate-200 rounded-lg px-3 py-2">
            <option value="document">Document (pdf, docx, ppt)</option>
            <option value="assignment">Assignment</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Upload Material
        </button>
      </form>
    </div>
  );
};

export default UploadMaterials;
