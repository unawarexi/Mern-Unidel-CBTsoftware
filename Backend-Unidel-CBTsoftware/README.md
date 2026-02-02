# UNIDEL CBT - Backend (Main API)

The engine behind the UNIDEL Computer-Based Test system. This repository manages secure data persistence, exam proctoring algorithms, automated lifecycle scheduling, and professional report generation.

---

## 🏗️ Structural Insight

Built with high cohesion and modern Node.js best practices, the backend follows a clear separation of concerns:

- **`controllers/`**: Orchestrates request/response flows. All heavy business logic resides here.
- **`models/`**: Definitive Mongoose schemas with built-in validation.
- **`routes/`**: Clean endpoint definitions mapped to role-based access control.
- **`middlewares/`**: Handles JWT security, error normalization, and rate limiting.
- **`services/`**: External integrations for Cloudinary (storage) and Nodemailer (communication).
- **`core/`**: The "Brain" of the system:
  - `utils/exam-scheduler.js`: Background worker managing exam states.
  - `utils/pdf-renderer.js`: Headless browser rendering of Handlebars templates.
  - `helpers/`: Unified ID generation logic (Matric numbers, Employee IDs).

---

## 🚀 Setup Instructions

### One-Liner (Quick Install)

```bash
npm install && cp .env.example .env && npm run dev
```

### Detailed Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:

   ```bash
   cp .env.example .env
   ```

   > [!IMPORTANT]
   > Open the `.env` file and configure your `MONGO_URI`, `JWT_SECRET`, and Cloudinary/Email credentials.

3. **Development Mode**:

   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm start
   ```

---

## 🔥 Key Logic Modules

### 1. Automated Exam Lifecycle

The system features a custom, light-weight cron service that polls for scheduled exams.

- **Pending → Active**: Automatically shifts status at the exact `startTime`.
- **Active → Completed**: Gracefully handles time expiry and submissions.
- **Communications**: Triggers multi-stage emails (24h reminder, 5min warning).

### 2. Proctored Security Flow

The backend processes real-time violation logs from the frontend.

- **Threshold Detection**: Automatically marks submissions as `autoSubmitted` after X violations.
- **Metadata Logging**: Captures IP, User-Agent, and exact question state during incidents.

### 3. File Extraction & AI

- **Multi-Format Parsing**: Extracts questions from PDF, DOCX, and Excel files.
- **HuggingFace Integration**: Bridges text descriptions to AI-generated images and automated question drafting.

---

## 🛠️ API Overview (Core Endpoints)

| Category        | Typical Endpoint                  | Purpose                             |
| :-------------- | :-------------------------------- | :---------------------------------- |
| **Auth**        | `POST /api/auth/login`            | Secure JWT + Cookie auth            |
| **Exams**       | `POST /api/exams/create`          | Schedule exams from approved banks  |
| **Submissions** | `PUT /api/submissions/:id/answer` | Debounced state-syncing for answers |
| **Reports**     | `POST /api/reports/generate`      | Render professional PDF documents   |
| **Stats**       | `GET /api/statistics/admin`       | Deep-dive analytics for dashboards  |

---

## 🎯 Backend TODOs & Roadmap

- [ ] **Redis Caching**: Implement Redis layer for frequently queried analytical dashboard stats.
- [ ] **Socket.io Migration**: Replace polling with WebSockets for real-time exam proctoring alerts.
- [ ] **Unified Search**: Implement a centralized search service for complex user/exam filtering.
- [ ] **Database Integrity**: Add Mongoose pre-save hooks for complex cross-collection validation.
- [ ] **Automated Backups**: Scripted nightly MongoDB dumps to secure cloud storage.
- [ ] **Unit Testing**: Comprehensive Jest/Supertest coverage for critical transaction paths.

---

**Maintained by**: UNIDEL Technical Team  
**Tech**: Node.js | Express | MongoDB | Puppeteer | Handlebars
