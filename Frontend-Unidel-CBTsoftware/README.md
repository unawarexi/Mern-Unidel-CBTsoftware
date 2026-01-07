# UNIDEL CBT System - Frontend

Modern React application for conducting secure online examinations with real-time monitoring and comprehensive analytics.

---

##  Quick Start

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/Mern-Unidel-CBTsoftware.git
cd Mern-Unidel-CBTsoftware/Frontend-Unidel-CBTsoftware

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
# Opens at http://localhost:5173
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=UNIDEL CBT System
VITE_APP_ENV=development
```

---

##  Project Structure

```
src/
├── assets/              # Images, fonts, static files
├── components/          # Shared UI components
├── core/
│   ├── apis/           # API integration layer
│   ├── security/       # Fraud detection system
│   ├── services/       # Utilities (debounce, throttle)
│   └── utils/          # Helper functions
├── pages/
│   ├── auth/           # Login, password reset
│   ├── admin/          # Admin dashboard & management
│   ├── lecturer/       # Lecturer dashboard & tools
│   └── student/        # Student exam interface
├── store/              # Zustand state management
├── layouts/            # Layout components
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

---

##  Key Features

### 1. **Role-Based Dashboards**

**Admin Dashboard**
- System-wide statistics and user management
- Question bank approvals
- Fraud analytics with violation tracking
- Course and department management
- Real-time activity monitoring

**Lecturer Dashboard**
- Create and manage question banks
- Schedule exams from approved banks
- View student performance metrics
- Grade submissions with feedback
- Monitor exam violations per course

**Student Dashboard**
- View available and active exams
- Take exams with auto-save functionality
- Track performance and grades
- View course materials
- Personal violation statistics for self-awareness

### 2. **Secure Exam System**

**Exam Interface**
- Fullscreen mode enforcement
- Real-time countdown timer
- Auto-save every 2 seconds (debounced)
- Question navigation with progress tracking
- Flag questions for review
- Automatic submission on time expiry

**Fraud Detection**
```javascript
// Client-side monitoring
- Tab switching detection
- Window blur/focus tracking
- Fullscreen exit detection
- Copy/paste blocking
- DevTools detection
- Browser navigation blocking
- Auto-submit after 3 violations
```

### 3. **Interactive Analytics**

**Charts & Visualizations**
- Activity trends (Area + Bar charts)
- Performance radar charts
- Department/course distribution (Bar charts)
- Exam status pie charts
- Submission performance metrics
- Peak usage hours analysis

**Fraud Analytics Dashboard**
- Top violators with student details
- High-risk courses and departments
- Violation types breakdown
- Real-time violation tracking
- Auto-submit statistics

---

## ️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool (fast HMR)
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching/caching
- **Zustand** - Lightweight state management
- **Recharts** - Chart library
- **Lucide React** - Icon library
- **Day.js** - Date manipulation
- **React Router** - Client-side routing

---

##  API Integration

### State Management Pattern

```javascript
// Store (Zustand) → API Layer → React Query → Backend

// Example: Fetching exams
const { activeExams, isLoading } = useGetActiveExamsForStudentAction();
// ↓
// store/exam-store.js → core/apis/exam-api.js → Backend API
```

### API Layers

```javascript
// 1. Raw API functions (core/apis/)
export const getActiveExamsForStudent = async () => {
  const response = await fetch(`${BASE_URL}/exams/student/active`, {
    credentials: "include",
  });
  return response.json();
};

// 2. React Query hooks
export const useGetActiveExamsForStudent = () => {
  return useQuery({
    queryKey: ["activeExams"],
    queryFn: getActiveExamsForStudent,
  });
};

// 3. Store actions (store/)
export const useGetActiveExamsForStudentAction = () => {
  const { data, isLoading, error, refetch } = useGetActiveExamsForStudent();
  return { activeExams: data?.exams || [], isLoading, error, refetch };
};
```

---

##  UI Components

### Key Components

**Dashboards**
- Admin/Lecturer/Student overview pages
- Interactive stat cards with animations
- Real-time data refresh
- Responsive grid layouts

**Exam Interface**
- Question display with options
- Navigation sidebar with question grid
- Progress indicators
- Violation warnings
- Submit confirmation modal

**Analytics**
- Chart components (Bar, Line, Pie, Radar, Area)
- Performance metrics cards
- Trend visualizations
- Fraud detection displays

**Modals**
- Exam warning modal (rules & penalties)
- Submit confirmation
- Violation warnings
- Loading states

---

##  Security Features

### Client-Side Fraud Detection

```javascript
// Initialize fraud detection
const fraudDetection = new FraudDetectionSystem({
  examId,
  submissionId,
  onViolation: async (data) => {
    const response = await reportViolation(data);
    if (response.autoSubmitted) {
      // Handle auto-submit
      navigate("/student/exams/completed");
    }
  },
});

fraudDetection.init();
fraudDetection.requestFullscreen();
```

**Monitored Events**
- `visibilitychange` - Tab switching
- `blur` - Window focus loss
- `fullscreenchange` - Fullscreen exit
- `contextmenu` - Right-click attempts
- `copy/paste` - Clipboard events
- `popstate` - Back button navigation
- DevTools detection (size threshold)

### Violation Tracking

```javascript
// Student sees their own violations
GET /api/security/students/me/violations

Response:
{
  totalViolations: 2,
  autoSubmittedExams: 0,
  rank: 245,
  percentile: "80.4",
  violationsByType: [
    { _id: "TAB_HIDDEN", count: 2, severity: "high" }
  ],
  violationsByCourse: [...]
}
```

---

##  Build & Deploy

### Production Build

```bash
# Create optimized build
npm run build
# Output: dist/

# Preview production build
npm run preview
```

### Deployment Options

**Vercel** (Recommended)
```bash
npm i -g vercel
vercel --prod
```

**Netlify**
```bash
npm run build
# Drag dist/ folder to Netlify
```

**Traditional Server**
```bash
npm run build
# Serve dist/ with nginx/apache
```

### Environment Variables (Production)

```env
VITE_API_BASE_URL=https://api.unidel.edu.ng/api
VITE_APP_ENV=production
```

---

##  Troubleshooting

**Port already in use**
```bash
# Kill process on port 5173
# macOS/Linux: lsof -ti:5173 | xargs kill -9
# Windows: netsh interface ipv4 show excludedportrange protocol=tcp
```

**API connection failed**
- Check `VITE_API_BASE_URL` in `.env`
- Ensure backend is running
- Verify CORS settings on backend

**Charts not rendering**
- Clear browser cache
- Check console for Recharts errors
- Verify data structure matches chart requirements

**Fraud detection not working**
- Check browser permissions for fullscreen
- Ensure `reportViolation` API is accessible
- Verify `submissionId` is set correctly

---

##  License

Proprietary - University of Delta (UNIDEL)

---

**Built with ️ for UNIDEL CBT System**
