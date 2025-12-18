import React from 'react'

const Sidebar = () => {
  return (
    <div>
          Student Sidebar Items
          1.Dashboard - Exam status overview Upcoming / active exams Countdown indicator (if exam is active)
          2.My Courses - Enrolled courses Lecturer name Exam availability status
          3. Exams / Assessments - Available exams Completed exams Attempt history
          4. Results - Scores per course Exam breakdown (if enabled)
          5.Profile - Student info (read-only mostly) Change password
          6. Logout - Ends session Important for exam security
          7. Optional (If Time Allows) Notifications Exam reminders System messages
    </div>
  );
}

export default Sidebar