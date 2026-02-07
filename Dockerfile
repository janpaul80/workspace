# ============================================================
# HeftCoder Workspace — Unified Container
# Multi-stage: Frontend build → Backend build → Runtime (Node + Nginx)
# ============================================================

# ---- Stage 1: Build Frontend ----
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Build args for Vite env vars (injected at build time)
ARG GEMINI_API_KEY=""
ARG SUPABASE_URL=""
ARG SUPABASE_ANON_KEY=""
ARG BACKEND_URL=""

ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
ENV BACKEND_URL=${BACKEND_URL}

# Copy frontend package files and install
COPY package.json package-lock.json* ./
RUN npm install

# Copy frontend source
COPY index.html index.tsx App.tsx types.ts vite.config.ts tsconfig.json env.d.ts metadata.json ./
COPY components/ ./components/
COPY services/ ./services/

# Build the Vite project
RUN npm run build

# ---- Stage 2: Build Backend ----
FROM node:20-alpine AS backend-builder

# Install build tools for native modules (node-pty)
RUN apk add --no-cache python3 make g++ linux-headers

WORKDIR /app/server

# Copy backend package files and install ALL deps (need devDeps for tsc)
COPY server/package.json server/package-lock.json* ./
RUN npm install

# Copy backend source
COPY server/tsconfig.json ./
COPY server/index.ts ./
COPY server/services/ ./services/

# Compile TypeScript to JavaScript
RUN npx tsc --outDir dist

# Prune devDependencies after build
RUN npm prune --omit=dev

# ---- Stage 3: Runtime (Node.js + Nginx) ----
FROM node:20-alpine

# Install nginx and native module runtime deps
RUN apk add --no-cache nginx bash python3 make g++

# Remove default nginx config
RUN rm -f /etc/nginx/http.d/default.conf /etc/nginx/conf.d/default.conf

# Ensure nginx directories exist
RUN mkdir -p /etc/nginx/conf.d /usr/share/nginx/html /run/nginx

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Set up backend
WORKDIR /app/server

# Copy compiled backend JS + production node_modules (includes native node-pty)
COPY --from=backend-builder /app/server/dist/ ./
COPY --from=backend-builder /app/server/node_modules/ ./node_modules/

# Copy package.json for ESM "type": "module" resolution
COPY server/package.json ./package.json

# Copy the entrypoint script and ensure LF line endings
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Create workspace directory for file operations
RUN mkdir -p /app/server/workspace

# Expose port 80 (nginx)
EXPOSE 80

# Start both backend and nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
