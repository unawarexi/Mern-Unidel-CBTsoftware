import React from "react";
import { motion } from "framer-motion";

import { useApplicationStore } from "../../../../store/ui-store/application-store";
import { useGetAllPrograms } from "../../../../hooks/useProgram";

const ReviewApplication = () => {
  const { formData } = useApplicationStore();
  const { data: programsData } = useGetAllPrograms();
  const programs = programsData?.data || [];
  const selectedProgram = programs.find(
    (p) => p._id === formData.programTarget,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 space-y-4">
        <h3 className="font-semibold text-lg border-b border-gray-200 dark:border-slate-700 pb-2 mb-2 dark:text-white">
          Application Summary
        </h3>

        {/* 1. Personal */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-1">
              Full Name
            </span>
            <span className="font-medium dark:text-white">
              {formData.personalInfo.firstName} {formData.personalInfo.lastName}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-1">
              Phone
            </span>
            <span className="font-medium dark:text-white">
              {formData.personalInfo.phone}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-1">
              Nationality
            </span>
            <span className="font-medium dark:text-white">
              {formData.personalInfo.nationality}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-1">
              State/City
            </span>
            <span className="font-medium dark:text-white">
              {formData.personalInfo.state}, {formData.personalInfo.city}
            </span>
          </div>
        </div>

        {/* 2. Guardian */}
        <div className="pt-2 border-t dark:border-slate-700">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
            Guardian Info
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-1">
                Father/Mother
              </span>
              <span className="font-medium dark:text-white">
                {formData.guardianInfo.fatherName ||
                  formData.guardianInfo.motherName}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-1">
                Contact
              </span>
              <span className="font-medium dark:text-white">
                {formData.guardianInfo.phone}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Program */}
        <div className="pt-2 border-t dark:border-slate-700">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
            Academic Program
          </h4>
          <div className="col-span-2">
            <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider mb-1">
              Selected Course
            </span>
            <span className="font-medium text-lg text-orange-600 dark:text-orange-500">
              {selectedProgram?.name || "Not Selected"}
            </span>
            <span className="text-xs text-gray-400">
              {selectedProgram?.degree} - {formData.modeOfStudy}
            </span>
          </div>
        </div>

        {/* 4. Documents */}
        <div className="pt-2 border-t dark:border-slate-700">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
            Documents Ready
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.examResults?.resultDocument?.name && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-md">
                Exam Result
              </span>
            )}
            {formData.examResults?.jambResult?.registrationNumber && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-md">
                JAMB Result
              </span>
            )}
            {formData.personalInfo?.passportNumber && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-md">
                Int'l Passport
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewApplication;
