
# HeftCoder Workspace IDE - Implementation TODO

## Phase 1: Backend Server ✅
- [x] `server/package.json` — Dependencies (express, ws, node-pty, axios, dotenv, uuid, cors)
- [x] `server/tsconfig.json` — TypeScript configuration
- [x] `server/services/terminalService.ts` — node-pty terminal session management
- [x] `server/services/fileService.ts` — File system operations (tree, read, write, delete, mkdir)
- [x] `server/services/openclawService.ts` — OpenClaw orchestrator client (register, route, health)
- [x] `server/services/microsoftStudioService.ts` — Microsoft AI Studio client (invoke, list, health)
- [x] `server/index.ts` — Express + WebSocket server with all routes wired

## Phase 2: Frontend Services ✅
- [x] `services/agentService.ts` — Client-side agent invocation (invokeAgent, listAgents, health)
- [x] `services/terminalClient.ts` — WebSocket terminal client (connect, send, resize, callbacks)
- [x] `services/fileClient.ts` — HTTP file client (fetchFileTree, fetchFileContent, saveFileContent)
- [x] `env.d.ts` — Vite environment type definitions

## Phase 3: Frontend Wiring ✅
- [x] `vite.config.ts` — Proxy config for /api and /ws, new env var definitions
- [x] `App.tsx` — File tree fetch on mount, terminal WebSocket connection, file select with content loading, folder toggle, terminal input handler, real terminal output display
- [x] `components/ChatPanel.tsx` — Agent mode routing (Agents → invokeAgent, Plan → chatWithGemini)
- [x] `components/NativeStudioLayout.tsx` — Agent mode routing for mobile layouts

## Phase 4: Docker & Deployment ✅
- [x] `Dockerfile` — Frontend multi-stage build (Node → Nginx)
- [x] `server/Dockerfile` — Backend with node-pty build dependencies
- [x] `nginx.conf` — Nginx config with /api proxy, /ws WebSocket proxy, SPA fallback
- [x] `docker-compose.yml` — 3 services (frontend, backend, openclaw) with volumes and networking
- [x] `.env.example` — Template with all required environment variables
- [x] `.gitignore` — Updated for server/node_modules, server/dist, Docker files

## Phase 5: Verification & Testing
- [x] Install frontend dependencies (`npm install`) — 147 packages, 0 vulnerabilities
- [x] Install backend dependencies (`cd server && npm install`) — 104 packages, 0 vulnerabilities
- [x] Verify frontend build (`npx vite build`) — dist/index.html + dist/assets/index-BWKK9_iS.js
- [x] Verify backend TypeScript compilation (`npx tsc --noEmit`) — 0 errors (fixed req.params wildcard typing)
- [x] Start backend server (`npx tsx index.ts`) — Running on port 3001
- [x] Test `/api/health` endpoint — Returns status: ok, services health
- [x] Test `/api/files` endpoint — Returns workspace file tree
- [x] Test Vite proxy (frontend:5173 → backend:3001) — `/api/health` proxied correctly
- [x] Frontend dev server loads — HTTP 200 on localhost:5173
- [ ] Test terminal WebSocket connection (deferred — requires browser)
- [ ] Test agent invocation flow (deferred — requires API keys)
- [ ] Test Docker build (deferred — requires Docker daemon)
- [ ] Test docker-compose up (deferred — requires Docker + API keys)
- [ ] Deploy to Coolify (deferred — requires server access + .env)

## Design Integrity ✅
- NO UI changes made to any component
- NO layout modifications
- NO refactoring of existing code
- All wiring is additive (imports + logic hooks only)

## Files NOT Modified (Preserved As-Is)
- `components/Header.tsx`
- `components/Sidebar.tsx`
- `components/PreviewArea.tsx`
- `components/FileExplorer.tsx`
- `components/SettingsModal.tsx`
- `components/FeedbackModal.tsx`
- `components/ProfileView.tsx`
- `components/PreferencesView.tsx`
- `components/DocumentationView.tsx`
- `components/BillingView.tsx`
- `components/IntegrationsPanel.tsx`
- `components/EnvironmentVariablesPanel.tsx`
- `components/TemplatePanel.tsx`
- `components/GithubPanel.tsx`
- `services/geminiService.ts`
- `services/supabase.ts`
- `types.ts`
- `index.tsx`
- `index.html`
- `metadata.json`
