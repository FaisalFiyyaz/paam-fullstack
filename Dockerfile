# Multi-stage Dockerfile for PAAM FullStack Application
# Optimized for both development and production environments

# -------- Base dependencies stage --------
FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Set environment variables
ENV CI=true
ENV NODE_ENV=production

# -------- Dependencies installation stage --------
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies based on lock file
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile; \
  else \
    npm ci --only=production; \
  fi

# -------- Development stage --------
FROM base AS dev
ENV NODE_ENV=development

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# -------- Build stage --------
FROM base AS build
ENV NODE_ENV=production

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Ensure standalone output is configured
RUN node -e "\
const fs = require('fs'); \
let config = {}; \
try { \
  config = require('./next.config.js'); \
} catch (e) { \
  config = {}; \
} \
config.output = 'standalone'; \
fs.writeFileSync('next.config.js', 'module.exports = ' + JSON.stringify(config, null, 2)); \
"

# Build the application
RUN npm run build

# -------- Production stage --------
FROM node:20-alpine AS prod
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build from build stage
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]

# -------- Health check --------
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
