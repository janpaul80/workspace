# ============================================================
# HeftCoder Workspace Frontend
# Multi-stage build: Node (build) → Nginx (serve)
# ============================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build args for Vite env vars (injected at build time via define{})
ARG GEMINI_API_KEY=""
ARG SUPABASE_URL=""
ARG SUPABASE_ANON_KEY=""
ARG BACKEND_URL=""

# Make build args available as env vars for Vite loadEnv
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
ENV BACKEND_URL=${BACKEND_URL}

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Vite project
RUN npm run build

# ============================================================
# Stage 2: Serve with Nginx
# ============================================================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
