# UNIDEL CBT System - Backend

Node.js/Express backend for secure online examinations with fraud detection, automated grading, and comprehensive analytics.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB 5.0+** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/) (free tier)
- **Email Service** - Gmail with App Password or SendGrid

### Installation

```bash
# Clone repository
git clone https://github.com/unawarexi/Mern-Unidel-CBTsoftware.git
cd Mern-Unidel-CBTsoftware/Backend-Unidel-CBTsoftware

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start server
npm run dev
# Runs on http://localhost:3000
```

### Environment Variables

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/unidel-cbt

# JWT
JWT_SECRET=your_secret_min_32_chars
JWT_EXPIRE=1h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=UNIDEL CBT <noreply@unidel.edu.ng>
```

**Gmail App Password Setup:**
1. Enable 2FA on Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate password for "Mail"
4. Use in `EMAIL_PASSWORD`

---

## Project Structure

```
Backend-Unidel-CBTsoftware/
├── controllers/        # Request handlers
├── models/            # MongoDB schemas
├── routes/            # API endpoints
├── middlewares/       # Auth, error handling
├── services/          # Cloudinary, email
├── core/
│   ├── helpers/       # ID generators
│   ├── mail/          # Email templates
│   ├── security/      # Rate limiting
│   └── utils/         # Exam scheduler, PDF parser
├── index.js           # Entry point
└── package.json
```

---

## ✨ Core Features

### 1. **User Management**

**Auto-Generated Credentials**
```javascript
POST /api/users/students
{
  "fullname": "John Doe",
  "email": "john@student.unidel.edu.ng",
  "department": "Computer Science"
}

Response:
{
  "matricNumber": "UNIDEL/CS/2024/0001",  // Auto-generated
  "password": "randomSecure123",           // Random
  "emailSent": true                        // Sent via email
}
```

**Three-Tier Roles:**
- Admin: System-wide management, approvals
- Lecturer: Create exams, grade submissions
- Student: Take exams, view results

### 2. **Question Bank & Exam System**

**Workflow:**
```
Lecturer Creates → Submit for Approval → Admin Reviews → 
Approved → Lecturer Schedules Exam → Auto-Activated → Auto-Graded
```

**Create Question Bank**
```javascript
POST /api/exams/question-banks
{
  "courseId": "...",
  "title": "Midterm Questions",
  "questions": [
    {
      "question": "What is Node.js?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "marks": 2
    }
  ]
}
```

**Schedule Exam from Approved Bank**
```javascript
POST /api/exams/create-from-question-bank
{
  "questionBankId": "...",
  "duration": 120,
  "startTime": "2024-12-20T09:00:00Z",
  "endTime": "2024-12-20T11:00:00Z"
}
```

**Automatic Lifecycle:**
- `pending` → Scheduled for future (auto-activates at startTime)
- `active` → During exam window
- `completed` → After endTime (auto-completes)

### 3. **Automated Grading**

```javascript
// Grades automatically on submission
const gradeSubmission = (submission, exam) => {
  let score = 0;
  exam.questions.forEach(q => {
    const answer = submission.answers.find(a => a.questionId === q._id);
    if (answer?.answer === q.correctAnswer) {
      score += q.marks;
    }
  });
  const percentage = (score / totalMarks) * 100;
  const grade = calculateGrade(percentage); // A-F
  const passed = percentage >= exam.passingPercentage;
  return { score, percentage, grade, passed };
};
```

**Grade Distribution:**
- A: 70%+
- B: 60-69%
- C: 50-59%
- D: 45-49%
- E: 40-44%
- F: <40%

### 4. **Fraud Detection System**

**Violation Types & Severity:**
- **Critical**: Route changes, exam exit
- **High**: Tab switching, window blur, DevTools
- **Medium**: Fullscreen exit, copy/paste
- **Low**: Context menu (right-click)

**Auto-Submit Logic:**
```javascript
const VIOLATION_THRESHOLD = 3;

if (totalViolations >= VIOLATION_THRESHOLD) {
  submission.status = "autoSubmitted";
  submission.flagged = true;
  submission.flagReason = "Auto-submitted: 3 violations";
  await gradeSubmission(submission, exam);
  await sendEmail(student, autoSubmitNotification);
}
```

**Fraud Analytics:**
```javascript
GET /api/statistics/admin/dashboard

Response includes:
{
  security: {
    overview: {
      totalViolations: 156,
      autoSubmittedExams: 12,
      violationRate: "2.57%"
    },
    highRisk: {
      students: [...],      // Top violators with names
      courses: [...],       // Courses with high violations
      departments: [...]    // Departments ranked by risk
    },
    violationsByType: [...]
  }
}
```

### 5. **Email Notifications**

**Automated Emails:**
- Account creation with credentials
- Exam reminder (24 hours before)
- Exam end warning (5 minutes before)
- Submission confirmation
- Grade notification

**Example:**
```javascript
// Sent automatically when admin creates student
Subject: Your UNIDEL CBT Account

Hi John,
Your account has been created.

Email: john@student.unidel.edu.ng
Matric Number: UNIDEL/CS/2024/0001
Password: randomSecure123

Login: http://localhost:5173/login
```

### 6. **Statistics & Analytics**

**Admin Dashboard:**
```javascript
GET /api/statistics/admin/dashboard?period=month

Response:
{
  overview: {
    users: { totalStudents, totalLecturers, newStudents, ... },
    exams: { totalExams, activeExams, completedExams },
    submissions: { totalSubmissions, passRate, averageScore }
  },
  trends: {
    activity: [...],      // Daily/weekly activity
    topActiveUsers: [...]
  },
  security: {
    overview: { totalViolations, autoSubmittedExams, violationRate },
    highRisk: { students, courses, departments }
  }
}
```

**Lecturer Dashboard:**
- Exams by course performance
- Students with violations in their courses
- Violation types distribution
- Grading statistics

**Student Dashboard:**
- Personal performance trends
- Pass/fail rates
- Courses where they violated most (self-awareness)
- Violation rank/percentile vs peers

---

## API Endpoints

### Authentication
```javascript
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/change-password
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Users
```javascript
POST   /api/users/students
GET    /api/users/students
PUT    /api/users/students/:id
DELETE /api/users/students/:id

POST   /api/users/lecturers
GET    /api/users/lecturers

POST   /api/users/admins
GET    /api/users/admins
```

### Exams & Question Banks
```javascript
POST   /api/exams/question-banks
GET    /api/exams/question-banks/lecturer
POST   /api/exams/question-banks/:id/submit
GET    /api/exams/question-banks/pending-approvals
POST   /api/exams/question-banks/:id/approve
POST   /api/exams/question-banks/:id/reject

POST   /api/exams/create-from-question-bank
GET    /api/exams/lecturer
GET    /api/exams/student/active
```

### Submissions
```javascript
POST   /api/submissions/start/:examId
PUT    /api/submissions/:id/answer
POST   /api/submissions/:id/submit
GET    /api/submissions/exam/:examId/all
GET    /api/submissions/student/me
```

### Statistics
```javascript
GET    /api/statistics/admin/dashboard?period=month
GET    /api/statistics/lecturer/dashboard?period=week
GET    /api/statistics/student/dashboard?period=month
GET    /api/statistics/fraud/analytics
```

### Security
```javascript
POST   /api/security/violations
GET    /api/security/violations/:submissionId
GET    /api/security/students/me/violations
GET    /api/security/exams/:examId/violations
```

---

## Database Schema

**Key Models:**
- `Student`: Matric number, courses, department
- `Lecturer`: Employee ID, courses, departments
- `Admin`: Organization, role (admin/superadmin)
- `Course`: Code, lecturers, students, materials
- `Department`: Levels, HOD, courses
- `QuestionBank`: Questions, status, admin review
- `Exam`: Duration, times, questions, status
- `ExamSubmission`: Answers, score, grade, flags
- `SecurityViolation`: Type, severity, auto-submit flag
- `ActivityLog`: User actions, timestamps, metadata

---

## Security

- **JWT Authentication**: HttpOnly cookies
- **Password Hashing**: Bcrypt (10 rounds)
- **CORS**: Configured for frontend origin
- **Input Validation**: Mongoose schemas
- **Rate Limiting**: Optional global limiter
- **Fraud Detection**: 3-strike auto-submit
- **Violation Logging**: All suspicious actions tracked

---

## ⚙️ Background Jobs

**Exam Scheduler** (runs every minute):
```javascript
// Auto-activates exams at startTime
// Auto-completes exams at endTime
// Sends reminders 24h before
// Sends warnings 5min before end
```

---

## Troubleshooting

**MongoDB Connection Failed**
```bash
# Check MongoDB is running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS

# Verify connection string
MONGO_URI=mongodb://localhost:27017/unidel-cbt
```

**Email Not Sending**
```bash
# Gmail: Use App Password, not account password
# SendGrid: Verify API key is active
# Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD
```

**JWT Secret Error**
```bash
# Generate secure secret (32+ chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Port Already in Use**
```bash
# Change PORT in .env or kill process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

---

## License

Proprietary - University of Delta (UNIDEL)

---

**Built for UNIDEL CBT System**
