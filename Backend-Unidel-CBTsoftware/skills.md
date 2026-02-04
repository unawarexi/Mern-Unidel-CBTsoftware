SENTRY INTEGRATION PROMPT — EXPRESS.JS (PRODUCTION-GRADE)

You are a senior backend engineer tasked with integrating Sentry into an existing Express.js application using industry-standard practices.

The integration must be production-ready, secure, and follow correct middleware ordering and observability principles.

🎯 Objectives

Properly integrate Sentry into the Express.js backend

Capture:

Uncaught exceptions

Async errors

Route-level failures

Attach request and user context to errors

Ensure correct middleware ordering

Avoid noise and sensitive data leakage

Make the setup maintainable and environment-aware

🧱 Required Packages

Install and configure:

@sentry/node

@sentry/tracing

Do not use unofficial or deprecated packages.

⚙️ Initialization Requirements

Initialize Sentry before any routes or middleware

Use environment variables for:

SENTRY_DSN

NODE_ENV

Configure:

environment

tracesSampleRate (lower in production)

🧩 Middleware Order (CRITICAL)

Implement middleware in the following exact order:

Sentry.Handlers.requestHandler()

Sentry.Handlers.tracingHandler() (if enabled)

Application middlewares (bodyParser, cors, etc.)

Application routes

Sentry.Handlers.errorHandler()

Final fallback error handler

Incorrect ordering is unacceptable.

🧠 Error Capture Strategy

Automatically capture unhandled errors

Explicitly capture exceptions in:

Controllers

Services

Async flows

Ensure errors are re-thrown or passed to next()

👤 User Context

If authentication exists:

Attach user metadata to Sentry context:

User ID

Email

Role (if available)

Do not attach sensitive data.

🔐 Security & Privacy

Ensure Sentry does NOT log:

Passwords

Tokens

Cookies

PII beyond identifiers

Configure ignore lists for expected errors (e.g. validation, 401s)

📈 Performance & Noise Control

Enable tracing optionally

Reduce sampling rate in production

Avoid capturing expected application errors

🧪 Verification

Add a temporary debug endpoint to verify integration:

Throw a controlled error

Confirm it appears in Sentry dashboard

Remove debug endpoint after verification

📁 Code Quality Expectations

Follow existing project structure

Do not tightly couple Sentry logic to business logic

Add concise comments where decisions affect observability or security

✅ Deliverables

Fully working Sentry integration

Correct middleware order

Environment-aware configuration

Verified error capture

Clean, maintainable implementation

🧭 Guiding Principle

If an error happens in production,
we must know exactly where, why, and for whom it happened —
without exposing secrets.
