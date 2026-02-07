# ============================================================
# HeftCoder Workspace Backend
# ============================================================
FROM node:20-bookworm AS builder

WORKDIR /app

# Install build dependencies for node-pty
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npx tsc || true

# ============================================================
# Production stage
# ============================================================
FROM node:20-bookworm-slim

WORKDIR /app

# Install runtime dependencies for node-pty and terminal
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    bash \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install production dependencies
COPY package.json ./
RUN npm install --production

# Rebuild node-pty for this platform
RUN npm rebuild node-pty

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/*.ts ./

# Create workspace directory
RUN mkdir -p /app/workspace

ENV NODE_ENV=production
ENV WORKSPACE_DIR=/app/workspace
ENV BACKEND_PORT=3001

EXPOSE 3001

# Use tsx for running TypeScript directly in production
# (since node-pty native bindings need the right context)
RUN npm install -g tsx

CMD ["tsx", "index.ts"]
