# UNIDEL CBT - Frontend (React Application)

The interactive, high-security frontend for the UNIDEL CBT system. Built with React 18, it provides role-specific dashboards, a proctored exam environment, and real-time performance analytics.

---

## Structural Insight

The frontend follows a highly modular architecture focused on developer productivity and runtime performance:

- **`src/pages`**: Organizes views by role (Student, Lecturer, Admin) and functionality (Auth, Landing).
- **`src/store`**: Centralized state management using **Zustand**. Includes stores for `auth`, `theme`, `ui`, and data domains like `exams` and `submissions`.
- **`src/hooks`**: Custom hooks that bridge the Store with **React Query**, handling all server-side data fetching, caching, and background syncing.
- **`src/core/apis`**: A clean implementation layer for all fetch-based API calls.
- **`src/core/security`**: The proctoring engine that monitors user behavior during examinations.

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

   > [!TIP]
   > Ensure `VITE_API_BASE_URL` matches your backend server URL (usually `http://localhost:3000/api`).

3. **Development Mode**:

   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## Security & Proctoring Engine

Our unique proctoring module ensures exam integrity through multiple client-side monitors:

- **Fullscreen Enforcement**: Detects and enforces fullscreen mode during the entire exam session.
- **Blur & Visibility Detection**: Logs incidents when students switch tabs or navigate away from the window.
- **Browser Event Interception**: Blocks copy/paste, right-click context menus, and developer tools.
- **Automatic Sync**: Uses debounced auto-save (every 2 seconds) to ensure answers are never lost, even during network hiccups.

---

## Technology Stack

| Library           | Role                                                   |
| :---------------- | :----------------------------------------------------- |
| **React 18**      | Core UI Framework                                      |
| **Vite**          | High-performance bundling and development              |
| **Zustand**       | Lightweight, performant state management               |
| **React Query**   | Professional server-state caching and async management |
| **TailwindCSS**   | Design system and utility-first styling                |
| **Framer Motion** | Micro-interactions and smooth dashboard transitions    |
| **Recharts**      | Data visualization for complex analytics               |

---

## 🎯 Frontend TODOs & Roadmap

- [ ] **Live Proctoring Feed**: Real-time view for lecturers to see active students' violation status.
- [ ] **Offline Resilience**: Service worker integration for PWA support, allowing exam completion during connection drops.
- [ ] **MediaStream Proctoring**: Optional screen recording or camera monitoring (experimental).
- [ ] **Accessibility (a11y)**: Full WCAG 2.1 compliance for inclusive examination environments.
- [ ] **Performance Virtualization**: Implementing list virtualization for large data sets (e.g., student rosters).
- [ ] **Mobile App Wrapper**: Capacitor/Cordova integration for native mobile exam taking.

---

**Maintained by**: UNIDEL Frontend Engineers  
**Tech**: React | Vite | Tailwind | Zustand | React Query
