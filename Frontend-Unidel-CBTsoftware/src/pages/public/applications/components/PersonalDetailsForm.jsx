import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Input, Select } from "../../../../components/ui";
import { cn } from "../../../../core/lib/cn";
import { toast } from "react-hot-toast";
import FileUpload from "../../../../components/ui/FileUpload"; // [NEW]

import { useApplicationStore } from "../../../../store/ui-store/application-store";

const PersonalDetailsForm = () => {
  const { formData, setFormData, handleFileUpload, appId } =
    useApplicationStore();

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // We pass the raw file to handleFileUpload which now stores it locally
    handleFileUpload(file, "personalInfo.passportPhoto");
  };

  const getPreview = (fileField) => {
    if (!fileField) return null;
    if (fileField instanceof File) {
      return URL.createObjectURL(fileField);
    }
    return fileField.url;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-3 dark:border-slate-800">
          Personal Information
        </h3>
        {/* ... existing fields ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Enter first name"
            value={formData.personalInfo.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          <Input
            label="Middle Name (Optional)"
            placeholder="Enter middle name"
            value={formData.personalInfo.middleName || ""}
            onChange={(e) => handleChange("middleName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Last Name"
            placeholder="Enter last name"
            value={formData.personalInfo.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={
              formData.personalInfo.dateOfBirth
                ? new Date(formData.personalInfo.dateOfBirth)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              className="w-full px-4 py-2 bg-white border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.personalInfo.gender || ""}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+234..."
            value={formData.personalInfo.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nationality"
            placeholder="e.g. Nigerian"
            value={formData.personalInfo.nationality || ""}
            onChange={(e) => handleChange("nationality", e.target.value)}
          />
          <Input
            label="Country of Residence"
            placeholder="e.g. Nigeria"
            value={formData.personalInfo.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="State/Province"
            placeholder="State"
            value={formData.personalInfo.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
          />
          <Input
            label="City"
            placeholder="City"
            value={formData.personalInfo.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>

        <Input
          label="Residential Address"
          placeholder="Full residential address"
          value={formData.personalInfo.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Passport Photograph
          </label>
          <FileUpload
            label="Upload Passport Photo"
            subLabel="JPG, PNG (max 5MB)"
            accept={{ "image/*": [".jpeg", ".png", ".jpg"] }}
            selectedFile={formData.personalInfo.passportPhoto}
            onFileSelect={(file) =>
              handleFileUpload(file, "personalInfo.passportPhoto")
            }
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalDetailsForm;
