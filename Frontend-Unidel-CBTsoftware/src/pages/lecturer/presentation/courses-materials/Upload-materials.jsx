import React, { useState, useRef } from "react";
import { FileText, UploadCloud, X, AlertCircle, CheckCircle, BookOpen } from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";
import { useUploadCourseMaterialAction } from "../../../../store/course-store"; // <-- import upload action

const UploadMaterials = () => {
  const { courses = [], isLoading } = useGetLecturerCoursesAction();
  const { uploadMaterial, isLoading: isUploading, error: uploadError } = useUploadCourseMaterialAction(); // <-- use upload action
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    courseId: "",
    description: "",
    type: "document",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "File size must be less than 10MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
      setErrors((prev) => ({ ...prev, file: null }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = "Please select a course";
    if (!formData.description.trim()) newErrors.description = "Please provide a description";
    if (!formData.file) newErrors.file = "Please select a file to upload";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // Simulate progress bar (optional, can be removed if not needed)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // --- ACTUAL UPLOAD ---
      await uploadMaterial({
        courseId: formData.courseId,
        file: formData.file,
        description: formData.description,
        type: formData.type,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");

      setTimeout(() => {
        setFormData({
          courseId: "",
          description: "",
          type: "document",
          file: null,
        });
        setUploadStatus(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (error) {
      setUploadStatus("error");
      setErrors({ submit: error.message || "Upload failed. Please try again." });
    }
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UploadCloud className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Course Material</h1>
          </div>
          <p className="text-gray-600">Add new lecture notes, assignments, or resources for your students</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Course <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.courseId}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, courseId: e.target.value }));
                    setErrors((prev) => ({ ...prev, courseId: null }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.courseId ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white`}
                  disabled={isLoading || uploadStatus === "uploading"}
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseCode} - {course.courseTitle}
                    </option>
                  ))}
                </select>
              </div>
              {errors.courseId && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.courseId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Material Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                disabled={uploadStatus === "uploading"}
              >
                <option value="document">Lecture Notes / Document</option>
                <option value="assignment">Assignment</option>
                <option value="reading">Reading Material</option>
                <option value="slides">Presentation Slides</option>
                <option value="tutorial">Tutorial / Practice</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Week 2 Lecture Notes - Introduction to Data Structures"
                value={formData.description}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, description: e.target.value }));
                  setErrors((prev) => ({ ...prev, description: null }));
                }}
                className={`w-full px-4 py-3 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                disabled={uploadStatus === "uploading"}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload File <span className="text-red-500">*</span>
              </label>

              {!formData.file ? (
                <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed ${errors.file ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"} rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors`}>
                  <UploadCloud className={`w-12 h-12 mx-auto mb-3 ${errors.file ? "text-red-400" : "text-gray-400"}`} />
                  <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, DOCX, PPTX, or other documents (Max 10MB)</p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formData.file.name}</p>
                        <p className="text-sm text-gray-600">{getFileSize(formData.file.size)}</p>
                      </div>
                    </div>
                    <button type="button" onClick={removeFile} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" disabled={uploadStatus === "uploading"}>
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xlsx,.xls" disabled={uploadStatus === "uploading"} />

              {errors.file && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.file}
                </p>
              )}
            </div>

            {uploadStatus === "uploading" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Uploading...</span>
                  <span className="text-sm font-medium text-blue-900">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 font-medium">Material uploaded successfully!</p>
              </div>
            )}

            {(errors.submit || uploadError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{errors.submit || uploadError?.message}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploadStatus === "uploading" || uploadStatus === "success" || isUploading}
              className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadStatus === "uploading" || isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : uploadStatus === "success" ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Uploaded Successfully
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Upload Material
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Upload Guidelines
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 ml-7">
            <li>• Supported formats: PDF, DOCX, PPTX, TXT, XLSX, XLS</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Provide clear, descriptive titles for easy identification</li>
            <li>• Materials will be immediately available to enrolled students</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterials;
