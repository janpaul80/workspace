# ============================================================
# HeftCoder Workspace — Single-Stage Unified Container
# ============================================================
FROM node:20-alpine

# Install system dependencies: nginx, bash, and native build tools for node-pty
RUN apk add --no-cache \
    nginx \
    bash \
    python3 \
    make \
    g++ \
    linux-headers

# Remove default nginx config and set up directories
RUN rm -f /etc/nginx/http.d/default.conf /etc/nginx/conf.d/default.conf \
    && mkdir -p /etc/nginx/conf.d /usr/share/nginx/html /run/nginx

# ---- Build Frontend ----
WORKDIR /build/frontend

# Copy frontend package files
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source files
COPY index.html index.tsx App.tsx types.ts vite.config.ts tsconfig.json metadata.json ./
COPY components/ ./components/
COPY services/ ./services/

# Copy env.d.ts if it exists
COPY env.d.ts* ./

# Build frontend with Vite
RUN npm run build

# Copy built frontend to nginx html directory
RUN cp -r dist/* /usr/share/nginx/html/

# ---- Build Backend ----
WORKDIR /build/backend

# Copy backend package files and install
COPY server/package.json ./
RUN npm install

# Copy backend source
COPY server/tsconfig.json ./
COPY server/index.ts ./
COPY server/services/ ./services/

# Compile TypeScript
RUN npx tsc --outDir dist

# Prune dev dependencies
RUN npm prune --omit=dev

# ---- Set up runtime ----
# Copy compiled backend to final location
RUN mkdir -p /app/server \
    && cp -r dist/* /app/server/ \
    && cp -r node_modules /app/server/node_modules \
    && cp package.json /app/server/package.json

# Create workspace directory
RUN mkdir -p /app/server/workspace

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint and fix line endings
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Clean up build artifacts to reduce image size
RUN rm -rf /build

WORKDIR /app/server

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
