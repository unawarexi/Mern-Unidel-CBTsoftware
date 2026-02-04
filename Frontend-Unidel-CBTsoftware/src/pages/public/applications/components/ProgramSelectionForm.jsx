import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Select, Input } from "../../../../components/ui";
import { useGetAllPrograms } from "../../../../hooks/useProgram";
import {
  academicProgramsEnhanced,
  programLevels,
} from "../../../../core/data/academic-programs-enhanced";
import { AlertCircle } from "lucide-react";

import { useApplicationStore } from "../../../../store/ui-store/application-store";

const ProgramSelectionForm = () => {
  const { formData, setFormData, isLoading, programLevel } =
    useApplicationStore();

  // We can still use the API programs for "Program Type" (e.g. Degree vs Diploma) if needed,
  // but for the "Course" selection we strictly use the enhanced mock data filtered by level.
  // Ideally, valid programs should come from backend, but for this task we use the enhanced data.

  const { data: programsData } = useGetAllPrograms();
  const programs = programsData?.data || [];

  // Local state for manual course entry if "Other" is selected
  const [isManualCourse, setIsManualCourse] = useState(
    formData.intendedCourse &&
      !academicProgramsEnhanced[programLevel]?.some((f) =>
        f.departments.some((d) => d.courses.includes(formData.intendedCourse)),
      ),
  );

  const handleProgramChange = (programId) => {
    // This part is for selecting the "Program" entity (like "Full Time Degree") from DB
    const selectedProgram = programs.find((p) => p._id === programId);
    setFormData((prev) => ({
      ...prev,
      programTarget: programId,
      programTargetModel: "Course",
      programType: selectedProgram?.degree?.toLowerCase().includes("diploma")
        ? "diploma"
        : "degree",
    }));
  };

  const handleCourseChange = (e) => {
    const val = e.target.value;
    if (val === "OTHER") {
      setIsManualCourse(true);
      setFormData((prev) => ({ ...prev, intendedCourse: "" }));
    } else {
      setIsManualCourse(false);
      setFormData((prev) => ({ ...prev, intendedCourse: val }));
    }
  };

  const handleModeChange = (mode) => {
    setFormData((prev) => ({
      ...prev,
      modeOfStudy: mode,
    }));
  };

  // Flatten courses based on the CURRENT PROGRAM LEVEL
  const availableCourses = useMemo(() => {
    const currentLevelData = academicProgramsEnhanced[programLevel] || [];
    let courses = [];
    currentLevelData.forEach((faculty) => {
      faculty.departments.forEach((dept) => {
        courses = [...courses, ...dept.courses];
      });
    });
    return courses.sort();
  }, [programLevel]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-orange-800 dark:text-orange-300">
          <p className="font-semibold mb-1">Important Note</p>
          You are applying for: <strong>{programLevel}</strong>. <br />
          Please ensure your <strong>Intended Course</strong> matches your
          JAMB/Previous qualification subject combination.
        </div>
      </div>

      <div className="space-y-6">
        {/* Program Type Selection (DB Entity) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Program Category
          </label>
          <select
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            value={formData.programTarget || ""}
            onChange={(e) => handleProgramChange(e.target.value)}
            disabled={isLoading}
          >
            <option value="">
              {isLoading ? "Loading Programs..." : "Select Program Type"}
            </option>
            {programs.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.degree})
              </option>
            ))}
          </select>
        </div>

        {/* Course Selection (Enhanced Data) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Intended Course of Study ({programLevel})
          </label>
          {!isManualCourse ? (
            <select
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
              value={formData.intendedCourse || ""}
              onChange={handleCourseChange}
            >
              <option value="">Select Course</option>
              {availableCourses.map((course, idx) => (
                <option key={idx} value={course}>
                  {course}
                </option>
              ))}
              <option value="OTHER">Other / Not Listed</option>
            </select>
          ) : (
            <div className="flex flex-col gap-2">
              <Input
                placeholder={`Enter your ${programLevel} course manually`}
                value={formData.intendedCourse || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    intendedCourse: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={() => setIsManualCourse(false)}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 self-start"
              >
                Back to list
              </button>
            </div>
          )}
        </div>

        {/* Mode of Study */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mode of Study
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleModeChange("full-time")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                formData.modeOfStudy === "full-time"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-slate-700 hover:border-blue-300 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <span className="font-semibold text-lg">Full Time</span>
              <span className="text-xs opacity-70">Regular schedule</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("part-time")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                formData.modeOfStudy === "part-time"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "border-gray-200 dark:border-slate-700 hover:border-blue-300 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <span className="font-semibold text-lg">Part Time</span>
              <span className="text-xs opacity-70">Flexible schedule</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramSelectionForm;
