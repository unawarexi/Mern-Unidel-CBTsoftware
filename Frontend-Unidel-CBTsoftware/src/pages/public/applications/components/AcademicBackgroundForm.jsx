import React from "react";
import { motion } from "framer-motion";
import { Input, Button } from "../../../../components/ui";
import { Plus, Trash2 } from "lucide-react";

import { useApplicationStore } from "../../../../store/ui-store/application-store";

const AcademicBackgroundForm = () => {
  const { formData, setFormData } = useApplicationStore();

  const addSchool = () => {
    setFormData((prev) => ({
      ...prev,
      academicHistory: [
        ...prev.academicHistory,
        {
          schoolName: "",
          country: "",
          yearEntry: "",
          yearGraduation: "",
          qualification: "",
        },
      ],
    }));
  };

  const removeSchool = (index) => {
    setFormData((prev) => ({
      ...prev,
      academicHistory: prev.academicHistory.filter((_, i) => i !== index),
    }));
  };

  const updateSchool = (index, field, value) => {
    setFormData((prev) => {
      const newHistory = [...prev.academicHistory];
      newHistory[index] = { ...newHistory[index], [field]: value };
      return { ...prev, academicHistory: newHistory };
    });
  };

  // Ensure at least one school exists
  React.useEffect(() => {
    if (formData.academicHistory.length === 0) {
      addSchool();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl">
        <p className="text-blue-800 dark:text-blue-400 text-sm">
          List all secondary/high schools attended. Start with the most recent.
        </p>
      </div>

      {formData.academicHistory.map((school, index) => (
        <div
          key={index}
          className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 relative group"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              School #{index + 1}
            </h4>
            {formData.academicHistory.length > 1 && (
              <button
                onClick={() => removeSchool(index)}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="School Name"
                placeholder="Name of Institution"
                value={school.schoolName || ""}
                onChange={(e) =>
                  updateSchool(index, "schoolName", e.target.value)
                }
              />
            </div>

            <Input
              label="Country"
              placeholder="e.g. Nigeria"
              value={school.country || ""}
              onChange={(e) => updateSchool(index, "country", e.target.value)}
            />
            <Input
              label="Qualification Obtained"
              placeholder="e.g. SSCE, WAEC, Diploma"
              value={school.qualification || ""}
              onChange={(e) =>
                updateSchool(index, "qualification", e.target.value)
              }
            />

            <Input
              label="Year of Entry"
              type="number"
              placeholder="YYYY"
              value={school.yearEntry || ""}
              onChange={(e) => updateSchool(index, "yearEntry", e.target.value)}
            />
            <Input
              label="Year of Graduation"
              type="number"
              placeholder="YYYY"
              value={school.yearGraduation || ""}
              onChange={(e) =>
                updateSchool(index, "yearGraduation", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addSchool}
        className="w-full border-dashed border-2 py-4"
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Add Another School
      </Button>
    </motion.div>
  );
};

export default AcademicBackgroundForm;
