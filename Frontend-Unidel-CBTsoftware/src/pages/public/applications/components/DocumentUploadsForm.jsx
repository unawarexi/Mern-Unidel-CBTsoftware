import React from "react";
import { motion } from "framer-motion";
import { Input, Select } from "../../../../components/ui";
import FileUpload from "../../../../components/ui/FileUpload";

import { toast } from "react-hot-toast";
import { useApplicationStore } from "../../../../store/ui-store/application-store";

const DocumentUploadsForm = () => {
  const { formData, setFormData, handleFileUpload, studentType, programLevel } =
    useApplicationStore();

  // Helper flags
  const isLocal = studentType === "Local Student";
  const isUndergrad = programLevel === "Undergraduate (BSc)";
  const isMSc = programLevel === "Masters (MSc)";
  const isPhD = programLevel === "Doctorate (PhD)";
  const isPostgrad = isMSc || isPhD;

  // Helper to handle file selection
  const handleFileChange = (section, field, file) => {
    handleFileUpload(file, `${section}.${field}`);
  };

  const handleExamChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      examResults: {
        ...prev.examResults,
        [field]: value,
      },
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="space-y-2 mb-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Academic Credentials
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please upload the certificates required for{" "}
          <strong>{programLevel}</strong>.
        </p>
      </div>

      {/* 1. Degree Certificates (For Postgraduate) */}
      {isPostgrad && (
        <div className="space-y-6 border-b pb-8 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            University Degrees
          </h3>

          {/* BSc / HND Certificate */}
          <div className="space-y-4">
            <FileUpload
              label="Upload First Degree Certificate (BSc/HND)"
              subLabel="Required for MSc & PhD applications"
              selectedFile={formData.examResults?.bscCertificate}
              onFileSelect={(file) =>
                handleFileChange("examResults", "bscCertificate", file)
              }
            />
          </div>

          {/* Transcript (Usually required for both) */}
          <div className="space-y-4">
            <FileUpload
              label="Upload Academic Transcript"
              subLabel="Official transcript from previous institution"
              selectedFile={formData.examResults?.transcript}
              onFileSelect={(file) =>
                handleFileChange("examResults", "transcript", file)
              }
            />
          </div>

          {/* MSc Certificate (For PhD Only) */}
          {isPhD && (
            <FileUpload
              label="Upload Masters Certificate (MSc/MA)"
              subLabel="Required for PhD applications"
              selectedFile={formData.examResults?.mscCertificate}
              onFileSelect={(file) =>
                handleFileChange("examResults", "mscCertificate", file)
              }
            />
          )}
        </div>
      )}

      {/* 2. Secondary School Results (Always relevant, critical for Undergrad) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-slate-700">
          Secondary School Results {isPostgrad && "(O-Level)"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Exam Type
            </label>
            <select
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.examResults?.examType || ""}
              onChange={(e) => handleExamChange("examType", e.target.value)}
            >
              <option value="">Select Exam</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
              <option value="GCSE">GCSE</option>
              <option value="IB">International Baccalaureate</option>
              <option value="SAT">SAT</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <Input
            label="Exam Year"
            placeholder="YYYY"
            value={formData.examResults?.examYear || ""}
            onChange={(e) => handleExamChange("examYear", e.target.value)}
          />
          <Input
            label="Example Number / Candidate ID"
            placeholder="e.g. 40223145AB"
            value={formData.examResults?.examNumber || ""}
            onChange={(e) => handleExamChange("examNumber", e.target.value)}
          />
        </div>

        {/* Result Upload */}
        <FileUpload
          label="Upload Result Certificate (PDF/Image)"
          subLabel="Max size: 5MB"
          selectedFile={formData.examResults?.resultDocument}
          onFileSelect={(file) =>
            handleFileChange("examResults", "resultDocument", file)
          }
        />
      </div>

      {/* 3. JAMB Results (Only for Local Undergrad) */}
      {isLocal && isUndergrad && (
        <div className="space-y-4 pt-4 border-t dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            JAMB / UTME Result
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Registration Number"
              placeholder="JAMB Reg No."
              value={formData.examResults?.jambResult?.registrationNumber || ""}
              onChange={(e) => {
                const newJamb = {
                  ...formData.examResults?.jambResult,
                  registrationNumber: e.target.value,
                };
                handleExamChange("jambResult", newJamb);
              }}
            />
            <Input
              label="Score"
              type="number"
              placeholder="e.g. 250"
              value={formData.examResults?.jambResult?.score || ""}
              onChange={(e) => {
                const newJamb = {
                  ...formData.examResults?.jambResult,
                  score: e.target.value,
                };
                handleExamChange("jambResult", newJamb);
              }}
            />
          </div>
          {/* JAMB Upload */}
          <FileUpload
            label="Upload JAMB Slip"
            selectedFile={formData.examResults?.jambResult}
            onFileSelect={(file) =>
              handleFileChange("examResults", "jambResult", file)
            }
          />
        </div>
      )}
    </motion.div>
  );
};

export default DocumentUploadsForm;
