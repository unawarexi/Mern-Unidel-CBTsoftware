// mail-content.js - Email content generator for UNIDEL Computer Based Test (CBT) platform

class EmailContentGenerator {
  constructor() {
    this.baseUrl = process.env.BASE_URL || "https://cbt.unidel.edu.ng";
    this.supportEmail = "support@unidel.edu.ng";
    this.unsubscribeBaseUrl = `${this.baseUrl}/unsubscribe`;
    this.logoUrl = process.env.UNIDEL_LOGO_URL || "https://via.placeholder.com/80"; // Fallback placeholder
  }

  generateUnsubscribeLink(userId, emailType) {
    return `${this.unsubscribeBaseUrl}?user=${userId || ""}&type=${emailType || "general"}`;
  }

  // 1) Admin-created account (student or lecturer)
  adminCreatedAccountEmail(userData) {
    const roleLabel = (userData.role || "student").toLowerCase() === "lecturer" ? "Lecturer" : "Student";
    return {
      EMAIL_TITLE: `Welcome to UNIDEL CBT — Your ${roleLabel} Account`,
      GREETING: `Hello ${roleLabel},`,
      MAIN_CONTENT: `
        <p>Your account for the UNIDEL Computer Based Test (CBT) platform has been created by an administrator.</p>
        <p>Please reset your temporary password before logging in for the first time.</p>
      `,
      CONTENT_SECTIONS: [
        {
          title: "Account Details",
          content: `
            <ul style="margin-left:18px;color:#475569;">
              <li><strong>Name:</strong> ${userData.fullName || "—"}</li>
              <li><strong>Role:</strong> ${roleLabel}</li>
              <li><strong>Email (username):</strong> ${userData.email || "—"}</li>
              <li><strong>Temporary password:</strong> ${userData.tempPassword || "Set by admin"}</li>
            </ul>
          `,
        },
        {
          title: "Important",
          content: `
            <p style="color:#92400E;">For security, click the button below to set a new password before signing in.</p>
            <p style="color:#6b7280;font-size:13px;">If you did not expect this account, contact the CBT support: <a href="mailto:${this.supportEmail}">${this.supportEmail}</a>.</p>
          `,
        },
      ],
      BUTTONS: [
        {
          text: "Set Your Password",
          url: userData.resetUrl || `${this.baseUrl}/auth/reset-password`,
          primary: true,
        },
      ],
      // ADDITIONAL_CONTENT: `
      //   <p style="color:#6b7280;font-size:13px;">If you did not expect this account, contact the CBT support: <a href="mailto:${this.supportEmail}">${this.supportEmail}</a>.</p>
      // `,

      FEATURE_CARDS: true, // Show feature cards only on account creation
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(userData.userId, "account"),
    };
  }

  // 2) Password reset request
  passwordResetRequest(userData) {
    return {
      EMAIL_TITLE: "UNIDEL CBT — Reset Your Password",
      GREETING: `Hello ${userData.fullName || ""},`,
      MAIN_CONTENT: `
        <p>We received a request to reset your password. Click the button below to create a new password. This link will expire for security reasons.</p>
      `,
      BUTTONS: [
        {
          text: "Reset Password",
          url: userData.resetUrl,
          primary: true,
        },
      ],
      ADDITIONAL_CONTENT: `
        <p style="color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this message or contact ${this.supportEmail}.</p>
      `,
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(userData.userId, "security"),
    };
  }

  // 3) Password changed confirmation
  passwordChangedConfirmation(userData) {
    return {
      EMAIL_TITLE: "UNIDEL CBT — Password Changed",
      GREETING: `Hello ${userData.fullName || ""},`,
      MAIN_CONTENT: `
        <p>Your UNIDEL CBT password was successfully changed on ${userData.changeTime || new Date().toLocaleString()}.</p>
      `,
      CONTENT_SECTIONS: [
        {
          title: "Change Details",
          content: `
            <ul style="margin-left:18px;color:#475569;">
              <li><strong>IP Address:</strong> ${userData.ipAddress || "Unknown"}</li>
              <li><strong>Device / Browser:</strong> ${userData.userAgent || "Unknown"}</li>
            </ul>
          `,
        },
      ],
      ADDITIONAL_CONTENT: `
        <p style="color:#DC2626;">If you did not make this change, contact ${this.supportEmail} immediately.</p>
      `,
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(userData.userId, "security"),
    };
  }

  // 4) Exam registration notice (student registered for an exam/course)
  examRegistration(regData) {
    const examDetails = [
      { label: "Course", value: `${regData.courseCode || ""} — ${regData.courseTitle || ""}` },
      { label: "Exam", value: regData.examTitle || regData.examName || "—" },
      { label: "Start Time", value: regData.startTime || "—" },
      { label: "Duration", value: regData.duration ? `${regData.duration} minutes` : "—" },
      { label: "Exam ID", value: regData.examId || "—" },
    ];

    return {
      EMAIL_TITLE: "UNIDEL CBT — Exam Registration Confirmed",
      GREETING: `Hello ${regData.studentName || ""},`,
      MAIN_CONTENT: `
        <p>You have been registered for the following exam. Please review the details and make sure you're prepared.</p>
      `,
      EXAM_DETAILS: examDetails,
      BUTTONS: [
        {
          text: "View Exam Details",
          url: regData.viewExamUrl || `${this.baseUrl}/exams/${regData.examId || ""}`,
          primary: true,
        },
      ],
      INFO_BOX: {
        type: "warning",
        title: "Note",
        content: `Arrive/Log in at least 15 minutes before the start time. Contact ${this.supportEmail} for issues.`,
      },
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(regData.studentId, "exam-registration"),
    };
  }

  // 5) Exam start reminder (few hours before)
  examReminder(reminderData) {
    return {
      EMAIL_TITLE: `UNIDEL CBT — Exam starts in ${reminderData.timeUntil || "a few hours"}`,
      GREETING: `Hello ${reminderData.studentName || ""},`,
      MAIN_CONTENT: `
        <p>This is a reminder that your exam <strong>${reminderData.examTitle || ""}</strong> will start at <strong>${reminderData.startTime || ""}</strong> (${reminderData.timezone || "local time"}).</p>
      `,
      EXAM_DETAILS: [
        { label: "Course", value: `${reminderData.courseCode || ""} — ${reminderData.courseTitle || ""}` },
        { label: "Start Time", value: reminderData.startTime || "—" },
        { label: "Duration", value: reminderData.duration ? `${reminderData.duration} minutes` : "—" },
      ],
      INFO_BOX: {
        type: "warning",
        title: "Before the exam",
        content: `Ensure your device is charged, stable internet connection is available, and you have your ID ready. Exams are timed and monitored.`,
      },
      BUTTONS: [
        {
          text: "View Exam Instructions",
          url: reminderData.instructionsUrl || `${this.baseUrl}/exams/${reminderData.examId || ""}/instructions`,
          primary: true,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(reminderData.studentId, "exam-reminder"),
    };
  }

  // 6) Submission confirmation
  submissionConfirmation(subData) {
    return {
      EMAIL_TITLE: `UNIDEL CBT — Submission Received for ${subData.examTitle || ""}`,
      GREETING: `Hello ${subData.studentName || ""},`,
      MAIN_CONTENT: `
        <p>We have received your submission for <strong>${subData.examTitle || ""}</strong> on ${subData.submittedAt || new Date().toLocaleString()}.</p>
      `,
      CONTENT_SECTIONS: [
        {
          title: "Submission Details",
          content: `
            <ul style="margin-left:18px;color:#475569;">
              <li><strong>Exam:</strong> ${subData.examTitle || "—"}</li>
              <li><strong>Submitted at:</strong> ${subData.submittedAt || "—"}</li>
              <li><strong>Reference ID:</strong> ${subData.submissionId || "—"}</li>
            </ul>
          `,
        },
      ],
      BUTTONS: [
        {
          text: "View Submission",
          url: subData.viewSubmissionUrl || `${this.baseUrl}/submissions/${subData.submissionId || ""}`,
          primary: true,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(subData.studentId, "submissions"),
    };
  }

  // 7) Grade / result notification
  gradeNotification(gradeData) {
    const percent = gradeData.score != null && gradeData.total != null ? ((gradeData.score / gradeData.total) * 100).toFixed(2) : null;
    return {
      EMAIL_TITLE: `UNIDEL CBT — Your result for ${gradeData.examTitle || ""} is available`,
      GREETING: `Hello ${gradeData.studentName || ""},`,
      MAIN_CONTENT: `
        <p>Your exam has been graded. See your score and feedback below.</p>
      `,
      CONTENT_SECTIONS: [
        {
          title: "Result",
          content: `
            <ul style="margin-left:18px;color:#475569;">
              <li><strong>Exam:</strong> ${gradeData.examTitle || "—"}</li>
              <li><strong>Score:</strong> ${gradeData.score != null ? `${gradeData.score}` : "—"} / ${gradeData.total || "—"}</li>
              <li><strong>Percentage:</strong> ${percent != null ? `${percent}%` : "—"}</li>
              <li><strong>Remarks:</strong> ${gradeData.remarks || "—"}</li>
            </ul>
          `,
        },
      ],
      BUTTONS: [
        {
          text: "View Full Result",
          url: gradeData.viewResultsUrl || `${this.baseUrl}/results/${gradeData.examId || ""}`,
          primary: true,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(gradeData.studentId, "grades"),
    };
  }

  // 8) General notification (simple template)
  generalNotification(notificationData) {
    return {
      EMAIL_TITLE: notificationData.title || "UNIDEL CBT — Notification",
      GREETING: `Hello ${notificationData.recipientName || ""},`,
      MAIN_CONTENT: notificationData.message || "",
      CONTENT_SECTIONS: notificationData.sections || [],
      BUTTONS: notificationData.buttons || [],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(notificationData.recipientId, "notifications"),
    };
  }

  // 9) Question bank approved (Lecturer)
  questionBankApproved(data) {
    return {
      EMAIL_TITLE: "UNIDEL CBT — Question Bank Approved",
      GREETING: `Hello ${data.lecturerName || ""},`,
      MAIN_CONTENT: `
        <p>Your question bank <strong>"${data.questionBankTitle || ""}"</strong> has been approved by the administrator.</p>
        <p>You can now schedule exams using this question bank.</p>
      `,
      CONTENT_SECTIONS: [
        {
          title: "Question Bank Details",
          content: `
            <ul style="margin-left:18px;color:#475569;">
              <li><strong>Title:</strong> ${data.questionBankTitle || "—"}</li>
              <li><strong>Course:</strong> ${data.courseCode || ""} — ${data.courseTitle || ""}</li>
              <li><strong>Total Questions:</strong> ${data.totalQuestions || "—"}</li>
              <li><strong>Approved By:</strong> ${data.approvedBy || "Admin"}</li>
            </ul>
          `,
        },
      ],
      BUTTONS: [
        {
          text: "View Question Bank",
          url: data.viewUrl || `${this.baseUrl}/question-banks/${data.questionBankId || ""}`,
          primary: true,
        },
        {
          text: "Schedule Exam",
          url: data.scheduleUrl || `${this.baseUrl}/exams/create?qbId=${data.questionBankId || ""}`,
          primary: false,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.lecturerId, "question-banks"),
    };
  }

  // 10) Question bank rejected (Lecturer)
  questionBankRejected(data) {
    return {
      EMAIL_TITLE: "UNIDEL CBT — Question Bank Needs Revision",
      GREETING: `Hello ${data.lecturerName || ""},`,
      MAIN_CONTENT: `
        <p>Your question bank <strong>"${data.questionBankTitle || ""}"</strong> requires revision before approval.</p>
      `,
      INFO_BOX: {
        type: "alert",
        title: "Admin Comments",
        content: data.comments || "Please review and resubmit.",
      },
      CONTENT_SECTIONS: [
        {
          title: "Question Bank Details",
          content: `
            <ul style="margin-left:18px;color:#475569;">
              <li><strong>Title:</strong> ${data.questionBankTitle || "—"}</li>
              <li><strong>Course:</strong> ${data.courseCode || ""} — ${data.courseTitle || ""}</li>
              <li><strong>Reviewed By:</strong> ${data.reviewedBy || "Admin"}</li>
            </ul>
          `,
        },
      ],
      BUTTONS: [
        {
          text: "Edit Question Bank",
          url: data.editUrl || `${this.baseUrl}/question-banks/${data.questionBankId || ""}/edit`,
          primary: true,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.lecturerId, "question-banks"),
    };
  }

  // 11) Exam published notification (Students in course)
  examPublished(data) {
    return {
      EMAIL_TITLE: `UNIDEL CBT — New Exam Available: ${data.examTitle || ""}`,
      GREETING: `Hello ${data.studentName || ""},`,
      MAIN_CONTENT: `
        <p>A new exam has been published for your course <strong>${data.courseCode || ""} — ${data.courseTitle || ""}</strong>.</p>
      `,
      EXAM_DETAILS: [
        { label: "Exam Title", value: data.examTitle || "—" },
        { label: "Start Time", value: data.startTime || "—" },
        { label: "End Time", value: data.endTime || "—" },
        { label: "Duration", value: data.duration ? `${data.duration} minutes` : "—" },
        { label: "Total Questions", value: data.totalQuestions || "—" },
      ],
      INFO_BOX: {
        type: "warning",
        title: "Important",
        content: "Make sure to log in at least 15 minutes before the exam starts. Late submissions will not be accepted.",
      },
      BUTTONS: [
        {
          text: "View Exam Details",
          url: data.viewUrl || `${this.baseUrl}/exams/${data.examId || ""}`,
          primary: true,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.studentId, "exams"),
    };
  }

  // 12) Security violation warning (Student)
  securityViolation(data) {
    return {
      EMAIL_TITLE: "UNIDEL CBT — Security Violation Detected",
      GREETING: `Hello ${data.studentName || ""},`,
      MAIN_CONTENT: `
        <p>A security violation was detected during your exam <strong>${data.examTitle || ""}</strong>.</p>
      `,
      INFO_BOX: {
        type: "alert",
        title: "⚠️ Warning",
        content: `
          Violation Type: <strong>${data.violationType || "Unknown"}</strong><br>
          Total Violations: <strong>${data.totalViolations || 0}</strong><br>
          Remaining Attempts: <strong>${data.remainingAttempts || 0}</strong>
        `,
      },
      CONTENT_SECTIONS: [
        {
          content: `
            <p style="color:#DC2626;">If you reach ${data.violationThreshold || 3} violations, your exam will be automatically submitted.</p>
            <p>Violations include: switching tabs, minimizing browser, copying/pasting, opening developer tools, etc.</p>
          `,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.studentId, "security"),
    };
  }

  // 13) Course enrollment notification (Student)
  courseEnrollment(data) {
    return {
      EMAIL_TITLE: "UNIDEL CBT — Enrolled in New Course",
      GREETING: `Hello ${data.studentName || ""},`,
      MAIN_CONTENT: `
        <p>You have been enrolled in <strong>${data.courseCode || ""} — ${data.courseTitle || ""}</strong>.</p>
      `,
      CONTENT_SECTIONS: [
        {
          title: "Course Information",
          content: `
            <ul style="margin-left:18px;color:#475569;">
              <li><strong>Course Code:</strong> ${data.courseCode || "—"}</li>
              <li><strong>Course Title:</strong> ${data.courseTitle || "—"}</li>
              <li><strong>Department:</strong> ${data.department || "—"}</li>
              <li><strong>Lecturer(s):</strong> ${data.lecturers || "—"}</li>
            </ul>
          `,
        },
      ],
      BUTTONS: [
        {
          text: "View Course",
          url: data.viewUrl || `${this.baseUrl}/courses/${data.courseId || ""}`,
          primary: true,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.studentId, "courses"),
    };
  }

  // 14) Submission flagged (Student)
  submissionFlagged(data) {
    return {
      EMAIL_TITLE: "UNIDEL CBT — Exam Submission Flagged for Review",
      GREETING: `Hello ${data.studentName || ""},`,
      MAIN_CONTENT: `
        <p>Your submission for <strong>${data.examTitle || ""}</strong> has been flagged for manual review.</p>
      `,
      INFO_BOX: {
        type: "alert",
        title: "Reason",
        content: data.flagReason || "Security violations detected during exam.",
      },
      CONTENT_SECTIONS: [
        {
          content: `
            <p>This does not necessarily mean you will receive a penalty. A lecturer or administrator will review your submission.</p>
            <p>If you believe this is an error, please contact ${this.supportEmail}.</p>
          `,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.studentId, "submissions"),
    };
  }

  // 15) Lecturer feedback added (Student)
  feedbackReceived(data) {
    return {
      EMAIL_TITLE: `UNIDEL CBT — Feedback for ${data.examTitle || ""}`,
      GREETING: `Hello ${data.studentName || ""},`,
      MAIN_CONTENT: `
        <p>Your lecturer has added feedback to your submission for <strong>${data.examTitle || ""}</strong>.</p>
      `,
      CONTENT_SECTIONS: [
        {
          title: "Lecturer Feedback",
          content: `<p style="background:#F9FAFB;padding:12px;border-radius:6px;">${data.feedback || "No feedback provided."}</p>`,
        },
      ],
      BUTTONS: [
        {
          text: "View Submission",
          url: data.viewUrl || `${this.baseUrl}/submissions/${data.submissionId || ""}`,
          primary: true,
        },
      ],
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.studentId, "feedback"),
    };
  }

  // Example: Exam results with attachments
  examResultsWithAttachments(data) {
    return {
      EMAIL_TITLE: `UNIDEL CBT — Exam Results Available`,
      GREETING: `Hello ${data.studentName || ""},`,
      MAIN_CONTENT: `
        <p>Your exam results for <strong>${data.examTitle || ""}</strong> are now available.</p>
      `,
      BUTTONS: [
        {
          text: "View Results",
          url: data.viewUrl || `${this.baseUrl}/results/${data.examId || ""}`,
          primary: true,
        },
      ],
      // Only include ATTACHMENTS if there are actual files
      ATTACHMENTS: data.attachments || undefined, // undefined will hide the section
      UNSUBSCRIBE_LINK: this.generateUnsubscribeLink(data.studentId, "results"),
    };
  }

  // Utility helpers
  generateFooterContent(unsubscribeLink) {
    return `
      <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
        <p>This message was sent by UNIDEL CBT. If you no longer wish to receive these emails, <a href="${unsubscribeLink}">unsubscribe here</a>.</p>
        <p>UNIDEL CBT | University of Delta</p>
        <p>Support: <a href="mailto:${this.supportEmail}">${this.supportEmail}</a></p>
      </div>
    `;
  }

  generateSignature(senderName = "UNIDEL CBT Team") {
    return `
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #E5E7EB;">
        <p style="margin:0;color:#374151;">Best regards,<br><strong>${senderName}</strong></p>
      </div>
    `;
  }

  formatContent(content, type = "html") {
    if (type === "plain") {
      return content.replace(/<[^>]*>/g, "").replace(/\n\s*\n/g, "\n");
    }
    return content.replace(/\n/g, "<br>");
  }

  validateEmailData(emailType, data) {
    const requiredFields = {
      accountCreated: ["fullName", "email", "role", "resetUrl"],
      passwordReset: ["fullName", "resetUrl"],
      examRegistration: ["studentName", "courseCode", "examTitle", "startTime"],
      examReminder: ["studentName", "examTitle", "startTime"],
      submissionConfirmation: ["studentName", "examTitle", "submittedAt"],
      gradeNotification: ["studentName", "examTitle", "score", "total"],
    };

    const required = requiredFields[emailType];
    if (!required) return true;
    return required.every((field) => data && data.hasOwnProperty(field) && data[field] !== null && data[field] !== "");
  }

  // Add method to get logo URL for templates
  getLogoUrl() {
    return this.logoUrl;
  }
}

// Export using ES modules
export default EmailContentGenerator;
