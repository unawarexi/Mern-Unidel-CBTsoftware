import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { env, isProduction } from "./env.config.js";

Sentry.init({
  dsn: env.SENTRY_DSN,
  integrations: [
    // Enable HTTP calls tracing
    Sentry.httpIntegration(),
    // Enable Express.js middleware tracing
    Sentry.expressIntegration(),
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: isProduction() ? 0.2 : 1.0, // Capture 100% of the transactions in dev, 20% in prod
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  environment: env.NODE_ENV,
});

export default Sentry;
