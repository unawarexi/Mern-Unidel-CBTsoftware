import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Exam from "../../models/exam.model.js";
import ExamSubmission from "../../models/submission.model.js";
import * as Mailer from "../../services/mailer.service.js";
import EmailContentGenerator from "../mail/mail-content.js";

// Configure dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Check and activate exams whose start time has been reached
 */
export const activateScheduledExams = async () => {
  try {
    const now = dayjs();
    
    // Find pending exams whose start time has passed
    const examsToActivate = await Exam.find({
      status: "pending",
      startTime: { $lte: now.toDate() },
    }).populate("courseId", "courseCode courseTitle");

    for (const exam of examsToActivate) {
      exam.status = "active";
      await exam.save();
      console.log(`✅ Exam ${exam._id} activated at ${now.format()}`);
    }

    return examsToActivate.length;
  } catch (error) {
    console.error("Error activating scheduled exams:", error);
    throw error;
  }
};

/**
 * Check and complete exams whose end time has been reached
 */
export const completeExpiredExams = async () => {
  try {
    const now = dayjs();
    
    // Find active exams whose end time has passed
    const examsToComplete = await Exam.find({
      status: "active",
      endTime: { $lte: now.toDate() },
    });

    for (const exam of examsToComplete) {
      exam.status = "completed";
      await exam.save();
      console.log(`✅ Exam ${exam._id} completed at ${now.format()}`);
    }

    return examsToComplete.length;
  } catch (error) {
    console.error("Error completing expired exams:", error);
    throw error;
  }
};

/**
 * Auto-submit submissions for students who haven't submitted when time is up
 */
export const autoSubmitExpiredExams = async () => {
  try {
    const now = dayjs();
    
    // Find active submissions for completed exams
    const expiredSubmissions = await ExamSubmission.find({
      status: "started",
    }).populate({
      path: "examId",
      match: { endTime: { $lte: now.toDate() } },
    });

    const autoSubmitted = [];
    
    for (const submission of expiredSubmissions) {
      if (submission.examId) {
        submission.submittedAt = now.toDate();
        submission.status = "autoSubmitted";
        submission.submissionType = "auto";
        await submission.save();
        autoSubmitted.push(submission._id);
        console.log(`⏰ Auto-submitted submission ${submission._id}`);
      }
    }

    return autoSubmitted.length;
  } catch (error) {
    console.error("Error auto-submitting expired exams:", error);
    throw error;
  }
};

/**
 * Send reminder emails 5 minutes before exam starts
 */
export const sendExamStartReminders = async () => {
  try {
    const now = dayjs();
    const fiveMinutesFromNow = now.add(5, "minute");
    
    // Find exams starting in 5 minutes
    const upcomingExams = await Exam.find({
      status: "pending",
      startTime: {
        $gte: now.toDate(),
        $lte: fiveMinutesFromNow.toDate(),
      },
      reminderSent: { $ne: true }, // Only if reminder not sent
    })
      .populate("courseId", "courseCode courseTitle students")
      .populate("lecturerId", "fullname email");

    const mailGen = new EmailContentGenerator();
    
    for (const exam of upcomingExams) {
      const students = exam.courseId.students || [];
      
      for (const studentId of students) {
        try {
          const Student = (await import("../../models/student.model.js")).default;
          const student = await Student.findById(studentId);
          
          if (student && student.email) {
            const emailContent = mailGen.examReminder({
              studentName: student.fullname,
              examTitle: `${exam.courseId.courseCode} Exam`,
              courseCode: exam.courseId.courseCode,
              courseTitle: exam.courseId.courseTitle,
              startTime: dayjs(exam.startTime).format("MMMM D, YYYY h:mm A"),
              duration: exam.duration,
              timeUntil: "5 minutes",
              timezone: "WAT",
              examId: exam._id,
              studentId: student._id,
            });
            
            await Mailer.sendTemplatedMail(student.email, emailContent);
          }
        } catch (emailError) {
          console.error(`Failed to send reminder to student ${studentId}:`, emailError);
        }
      }
      
      // Mark reminder as sent
      exam.reminderSent = true;
      await exam.save();
      console.log(`📧 Sent start reminders for exam ${exam._id}`);
    }

    return upcomingExams.length;
  } catch (error) {
    console.error("Error sending exam start reminders:", error);
    throw error;
  }
};

/**
 * Send warning emails 5 minutes before exam ends
 */
export const sendExamEndWarnings = async () => {
  try {
    const now = dayjs();
    const fiveMinutesFromNow = now.add(5, "minute");
    
    // Find active exams ending in 5 minutes
    const endingExams = await Exam.find({
      status: "active",
      endTime: {
        $gte: now.toDate(),
        $lte: fiveMinutesFromNow.toDate(),
      },
      endWarningSent: { $ne: true }, // Only if warning not sent
    })
      .populate("courseId", "courseCode courseTitle")
      .populate("lecturerId", "fullname email");

    const mailGen = new EmailContentGenerator();
    
    for (const exam of endingExams) {
      // Find students with active submissions
      const activeSubmissions = await ExamSubmission.find({
        examId: exam._id,
        status: "started",
      }).populate("studentId", "fullname email");
      
      for (const submission of activeSubmissions) {
        try {
          const student = submission.studentId;
          
          if (student && student.email) {
            const emailContent = mailGen.generalNotification({
              title: "⏰ Exam Ending Soon - 5 Minutes Remaining",
              recipientName: student.fullname,
              message: `
                <p><strong>Your exam is about to end!</strong></p>
                <p>You have <strong>5 minutes</strong> remaining to complete and submit your exam:</p>
                <p><strong>Course:</strong> ${exam.courseId.courseCode} - ${exam.courseId.courseTitle}</p>
                <p><strong>End Time:</strong> ${dayjs(exam.endTime).format("MMMM D, YYYY h:mm A")}</p>
                <p style="color: #DC2626;">Please review your answers and submit before time runs out. Unsubmitted exams will be auto-submitted.</p>
              `,
              recipientId: student._id,
            });
            
            await Mailer.sendTemplatedMail(student.email, emailContent);
          }
        } catch (emailError) {
          console.error(`Failed to send end warning to student ${submission.studentId}:`, emailError);
        }
      }
      
      // Mark warning as sent
      exam.endWarningSent = true;
      await exam.save();
      console.log(`⚠️ Sent end warnings for exam ${exam._id}`);
    }

    return endingExams.length;
  } catch (error) {
    console.error("Error sending exam end warnings:", error);
    throw error;
  }
};

/**
 * Master scheduler that runs all timer-based operations
 */
export const runExamScheduler = async () => {
  try {
    console.log("⏰ Running exam scheduler...");
    
    await activateScheduledExams();
    await completeExpiredExams();
    await autoSubmitExpiredExams();
    await sendExamStartReminders();
    await sendExamEndWarnings();
    
    console.log("✅ Exam scheduler completed");
  } catch (error) {
    console.error("❌ Exam scheduler error:", error);
  }
};

/**
 * Start the scheduler to run every minute
 */
export const startExamScheduler = () => {
  // Run immediately
  runExamScheduler();
  
  // Then run every minute
  setInterval(runExamScheduler, 60 * 1000); // Every 1 minute
  
  console.log("🚀 Exam scheduler started - running every minute");
};

/**
 * Calculate time remaining for an exam
 */
export const getTimeRemaining = (endTime) => {
  const now = dayjs();
  const end = dayjs(endTime);
  const diffInSeconds = end.diff(now, "second");
  
  if (diffInSeconds <= 0) {
    return { 
      expired: true, 
      totalSeconds: 0, 
      minutes: 0, 
      seconds: 0,
      endTime: end.toISOString(),
    };
  }
  
  return { 
    expired: false, 
    totalSeconds: diffInSeconds,
    minutes: Math.floor(diffInSeconds / 60), 
    seconds: diffInSeconds % 60,
    endTime: end.toISOString(),
  };
};

/**
 * Check if exam is currently active
 */
export const isExamActive = (exam) => {
  const now = dayjs();
  const start = dayjs(exam.startTime);
  const end = dayjs(exam.endTime);
  
  return now.isAfter(start) && now.isBefore(end) && exam.status === "active";
};
