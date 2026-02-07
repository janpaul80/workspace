#!/bin/sh
set -e

echo "[entrypoint] Starting HeftCoder Workspace..."

# Start the Node.js backend in the background
echo "[entrypoint] Starting backend on port 3001..."
cd /app/server
node index.js &
BACKEND_PID=$!

# Wait briefly for backend to initialize
sleep 2

# Verify backend started
if kill -0 $BACKEND_PID 2>/dev/null; then
  echo "[entrypoint] Backend started (PID: $BACKEND_PID)"
else
  echo "[entrypoint] WARNING: Backend may have failed to start"
fi

# Start nginx in the foreground
echo "[entrypoint] Starting nginx on port 80..."
exec nginx -g "daemon off;"
