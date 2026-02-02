# ============================================================================
# UNIDEL CBT Backend - Production Dockerfile
# Multi-stage build for optimized image
# ============================================================================

# Stage 1: Build dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 cbt

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY --chown=cbt:nodejs . .

# Remove dev files
RUN rm -rf .git .env.* *.md

# Switch to non-root user
USER cbt

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node scripts/healthcheck.js || exit 1

# Start the application
CMD ["node", "index.js"]
