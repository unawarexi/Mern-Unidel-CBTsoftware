/**
 * Enhanced Academic Programs Data
 * Structure: Program Level -> Faculty -> Department -> Courses
 */

// We will augment the existing courses to include MSc and PhD variants for demonstration
// In a real app, these would be distinct in the database

import { faculties } from "./faculty-mock-data";
import { departmentsByFaculty } from "./department-mock-data";
import { coursesByDepartment } from "./courses-mock-data";

const generateProgramData = () => {
  const levels = ["Undergraduate (BSc)", "Masters (MSc)", "Doctorate (PhD)"];

  // We'll create a structured object
  // {
  //   "Undergraduate (BSc)": [
  //      { faculty: "Science", departments: [ { name: "CS", courses: [...] } ] }
  //   ]
  // }

  const data = {};

  levels.forEach((level) => {
    data[level] = faculties
      .map((faculty) => {
        const departments = departmentsByFaculty[faculty] || [];

        const deptObjects = departments.map((deptName) => {
          // Get base courses or generate generic ones if missing
          let baseCourses = coursesByDepartment[deptName] || [
            `Introduction to ${deptName}`,
            `Advanced ${deptName}`,
            `Research Methods in ${deptName}`,
          ];

          // Modify courses based on level
          let levelCourses = [];
          if (level.includes("BSc")) {
            levelCourses = baseCourses.map((c) => `B.Sc. ${c}`);
          } else if (level.includes("MSc")) {
            levelCourses = baseCourses.map((c) => `M.Sc. Advanced ${c}`);
          } else if (level.includes("PhD")) {
            levelCourses = [`PhD in ${deptName} (Research)`];
          }

          return {
            name: deptName,
            courses: levelCourses,
          };
        });

        return {
          name: faculty,
          departments: deptObjects,
        };
      })
      .filter((f) => f.departments.length > 0);
  });

  return data;
};

export const academicProgramsEnhanced = generateProgramData();
export const programLevels = [
  "Undergraduate (BSc)",
  "Masters (MSc)",
  "Doctorate (PhD)",
];
export const studentTypes = ["Local Student", "International Student"];
