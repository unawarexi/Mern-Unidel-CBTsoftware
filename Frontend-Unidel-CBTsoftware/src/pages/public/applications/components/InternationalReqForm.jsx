import React from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Input, Select } from "../../../../components/ui";

import { UploadCloud, CheckCircle } from "lucide-react";
import { cn } from "../../../../core/lib/cn";

import { useApplicationStore } from "../../../../store/ui-store/application-store";

const InternationalReqForm = () => {
  const { formData, setFormData, handleFileUpload, appId } =
    useApplicationStore();
  const handleBioChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleInternationalFile = (fieldPath, file) => {
    // We pass the raw file to handleFileUpload
    handleFileUpload(file, fieldPath);
  };

  const handleVisaChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      internationalInfo: {
        ...prev.internationalInfo,
        visaInformation: {
          ...prev.internationalInfo?.visaInformation,
          [field]: value,
        },
      },
    }));
  };

  const handleSponsorChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      internationalInfo: {
        ...prev.internationalInfo,
        sponsorship: {
          ...prev.internationalInfo?.sponsorship,
          [field]: value,
        },
      },
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-4 rounded-xl">
        <p className="text-purple-800 dark:text-purple-400 text-sm">
          <b>International Students:</b> Please provide valid travel and visa
          documents.
        </p>
      </div>

      {/* Passport Details */}
      <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-slate-700">
        International Passport Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Passport Number"
          placeholder="e.g. A12345678"
          value={formData.personalInfo.passportNumber || ""}
          onChange={(e) => handleBioChange("passportNumber", e.target.value)}
        />
        <Input
          label="Country of Issue"
          placeholder="e.g. Ghana"
          value={formData.personalInfo.passportCountryOfIssue || ""}
          onChange={(e) =>
            handleBioChange("passportCountryOfIssue", e.target.value)
          }
        />
        <Input
          label="Expiry Date"
          type="date"
          value={
            formData.personalInfo.passportExpiryDate
              ? new Date(formData.personalInfo.passportExpiryDate)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          onChange={(e) =>
            handleBioChange("passportExpiryDate", e.target.value)
          }
        />

        {/* Passport Bio Data Page Upload */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Passport Bio-Data Page (Scan)
          </label>
          <div
            className={cn(
              "h-24 border-2 border-dashed rounded-xl flex items-center justify-center transition-all overflow-hidden relative",
              formData.personalInfo.passportBioDataPage instanceof File ||
                formData.personalInfo.passportBioDataPage?.url
                ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                : "border-gray-300 dark:border-slate-700 hover:border-blue-500 text-gray-400",
            )}
          >
            {formData.personalInfo.passportBioDataPage instanceof File ||
            formData.personalInfo.passportBioDataPage?.url ? (
              <div className="flex flex-col items-center gap-1 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-[10px] font-medium">
                  Passport Scan Ready
                </span>
                <span className="text-[9px] opacity-70">
                  {formData.personalInfo.passportBioDataPage.name ||
                    "File attached"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5" />
                <span>Click to upload Passport Scan</span>
              </div>
            )}
            <input
              id="bio-upload"
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                e.target.files[0] &&
                handleInternationalFile(
                  "personalInfo.passportBioDataPage",
                  e.target.files[0],
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Visa Info */}
      <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-slate-700 pt-4">
        Visa & Study Intent
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Intended Study Country"
          value="Nigeria" // Fixed for Unidel
          disabled
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Visa Type Required
          </label>
          <select
            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={
              formData.internationalInfo?.visaInformation?.visaType || "Student"
            }
            onChange={(e) => handleVisaChange("visaType", e.target.value)}
          >
            <option value="Student">Student Visa (STR)</option>
            <option value="Tourist">Tourist (Not Applicable)</option>
          </select>
        </div>
        <Input
          label="Intended Arrival Date"
          type="date"
          value={
            formData.internationalInfo?.visaInformation?.intendedArrivalDate
              ? new Date(
                  formData.internationalInfo?.visaInformation
                    ?.intendedArrivalDate,
                )
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          onChange={(e) =>
            handleVisaChange("intendedArrivalDate", e.target.value)
          }
        />
      </div>

      {/* Sponsorship */}
      <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 dark:border-slate-700 pt-4">
        Sponsorship & Funding
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Source of Funding
          </label>
          <select
            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.internationalInfo?.sponsorship?.source || ""}
            onChange={(e) => handleSponsorChange("source", e.target.value)}
          >
            <option value="">Select Source</option>
            <option value="self">Self Funded</option>
            <option value="parent">Parent/Guardian</option>
            <option value="government">Government</option>
            <option value="scholarship">Scholarship</option>
          </select>
        </div>
        <Input
          label="Sponsor Name"
          placeholder="Full Name"
          value={formData.internationalInfo?.sponsorship?.sponsorName || ""}
          onChange={(e) => handleSponsorChange("sponsorName", e.target.value)}
        />
      </div>
    </motion.div>
  );
};

export default InternationalReqForm;
