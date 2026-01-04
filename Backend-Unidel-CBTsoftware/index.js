import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB, disconnectDB } from "./config/db-config.js";
// import globalRateLimiter from "./core/security/rate-limiter.js";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import courseRoutes from "./routes/course.routes.js";
import examRoutes from "./routes/exam.routes.js";
import departmentRoutes from "./routes/department.routes.js"; // Add department routes import
import submissionRoutes from "./routes/submission.routes.js";
import statisticsRoutes from "./routes/statistics.route.js";
import { startExamScheduler } from "./core/utils/time-lapse.util.js";

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiter
// app.use(globalRateLimiter);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/statistics", statisticsRoutes);

// 404 handler middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

app.use(errorHandler);

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
