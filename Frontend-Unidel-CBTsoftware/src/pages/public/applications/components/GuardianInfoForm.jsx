import React from "react";
import { motion } from "framer-motion";
import { Input } from "../../../../components/ui";

import { useApplicationStore } from "../../../../store/ui-store/application-store";

const GuardianInfoForm = () => {
  const { formData, setFormData } = useApplicationStore();

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      guardianInfo: {
        ...prev.guardianInfo,
        [field]: value,
      },
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-4 rounded-xl mb-4">
        <p className="text-orange-800 dark:text-orange-400 text-sm">
          Please provide details of your parents or legal guardian. This is
          mandatory for admission processing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Father's Full Name"
          placeholder="Surname Firstname"
          value={formData.guardianInfo.fatherName || ""}
          onChange={(e) => handleChange("fatherName", e.target.value)}
        />
        <Input
          label="Mother's Full Name"
          placeholder="Surname Firstname"
          value={formData.guardianInfo.motherName || ""}
          onChange={(e) => handleChange("motherName", e.target.value)}
        />
      </div>

      <div className="border-t border-gray-100 dark:border-slate-800 my-4 pt-4">
        <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white">
          Legal Guardian (If different from parents)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Guardian's Name"
            placeholder="Surname Firstname"
            value={formData.guardianInfo.guardianName || ""}
            onChange={(e) => handleChange("guardianName", e.target.value)}
          />
          <Input
            label="Relationship"
            placeholder="e.g. Uncle, Sister"
            value={formData.guardianInfo.relationship || ""}
            onChange={(e) => handleChange("relationship", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Guardian/Parent Phone"
          type="tel"
          placeholder="+234..."
          value={formData.guardianInfo.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <Input
          label="Guardian/Parent Email"
          type="email"
          placeholder="example@email.com"
          value={formData.guardianInfo.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      <Input
        label="Guardian/Parent Address"
        placeholder="Full residential address"
        value={formData.guardianInfo.address || ""}
        onChange={(e) => handleChange("address", e.target.value)}
      />
    </motion.div>
  );
};

export default GuardianInfoForm;
