# Unified Container Deployment - Implementation Tracker

## Plan
Combine frontend (nginx) + backend (Node.js) into a single Docker container for Coolify deployment.

## Steps

- [ ] 1. Update `nginx.conf` — change proxy target from `workspace-backend:3001` to `127.0.0.1:3001`
- [ ] 2. Create `docker-entrypoint.sh` — startup script to run backend + nginx
- [ ] 3. Rewrite `Dockerfile` — unified multi-stage build (frontend + backend + runtime)
- [ ] 4. Commit and push to git
- [ ] 5. Trigger Coolify deployment
- [ ] 6. Verify: frontend loads, `/api/health` responds, WebSocket reachable

## Constraints
- No UI/design changes
- No frontend refactors
- No backend logic changes
- Preserve docker-compose.yml for local dev
