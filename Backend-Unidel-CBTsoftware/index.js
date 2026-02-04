import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB, disconnectDB } from "./config/db-config.js";

// Import middlewares
import {
  securityHeaders,
  corsConfig,
  configureTrustProxy,
} from "./middlewares/security.middleware.js";
import {
  requestId,
  requestLogger,
} from "./middlewares/request-logger.middleware.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/error-handler.middleware.js";
import Sentry from "./config/sentry.config.js";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import courseRoutes from "./routes/course.routes.js";
import examRoutes from "./routes/exam.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import statisticsRoutes from "./routes/statistics.route.js";
import securityRoutes from "./routes/security.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminContentRoutes from "./routes/admin-content.routes.js";
import reportRoutes from "./routes/report.routes.js";
import specialProgramRoutes from "./routes/special-program.routes.js";
import governingBodyRoutes from "./routes/governing-body.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import supportRoutes from "./routes/support.routes.js";
import careerApplicationRoutes from "./routes/career-application.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { startExamScheduler } from "./core/utils/time-lapse.util.js";

// Create Express app
const app = express();

// Trust proxy (for reverse proxy setups)
configureTrustProxy(app);

// Security middleware
app.use(securityHeaders());
app.use(corsConfig());

// Request ID and logging
app.use(requestId);
app.use(requestLogger);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- HEALTH CHECK ---
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// --- SENTRY DEBUG ROUTE ---
app.get("/api/debug-sentry", (req, res) => {
  throw new Error("Sentry Debug Error: System Test");
});

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin/content", adminContentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/programs", specialProgramRoutes);
app.use("/api/governing-bodies", governingBodyRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/careers/apply", careerApplicationRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/payments", paymentRoutes);

// 404 handler
app.use(notFoundHandler);

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

// Global error handler
app.use(globalErrorHandler);

// Remove direct app.listen here and use an async starter
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT ?? 3000;
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);

      // Start exam scheduler after server starts
      startExamScheduler();
    });

    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log("Shutdown complete");
        process.exit(0);
      });

      // Force exit if not closed within X ms
      setTimeout(() => {
        console.error("Forcing shutdown");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      gracefulShutdown("uncaughtException");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export default app;
