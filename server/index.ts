import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url';

import {
  createTerminalSession,
  handleTerminalMessage,
  destroyTerminalSession,
  getActiveSessions,
} from './services/terminalService.js';

import {
  ensureWorkspace,
  getFileTree,
  readFile,
  writeFile,
  deleteFile,
  createDirectory,
} from './services/fileService.js';

import { getOpenClawService } from './services/openclawService.js';
import { getMicrosoftStudioService } from './services/microsoftStudioService.js';

const app = express();
const PORT = parseInt(process.env.BACKEND_PORT || '3001', 10);

// Middleware
app.use(cors({
  origin: process.env.WORKSPACE_BASE_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ============================================================
// Health Check
// ============================================================
app.get('/api/health', async (_req, res) => {
  const openclaw = getOpenClawService();
  const msStudio = getMicrosoftStudioService();

  const [openclawHealth, msHealth] = await Promise.all([
    openclaw.healthCheck(),
    msStudio.healthCheck(),
  ]);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      openclaw: openclawHealth,
      microsoftStudio: msHealth,
      terminal: { activeSessions: getActiveSessions().length },
    },
  });
});

// ============================================================
// File System Routes
// ============================================================
app.get('/api/files', async (_req, res) => {
  try {
    const tree = await getFileTree();
    res.json({ files: tree });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/*', async (req: any, res) => {
  try {
    const filePath = req.params[0] || req.params[''];
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' });
    }
    const content = await readFile(filePath);
    res.json({ path: filePath, content });
  } catch (error: any) {
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/files/*', async (req: any, res) => {
  try {
    const filePath = req.params[0] || req.params[''];
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' });
    }
    const { content } = req.body;
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content must be a string' });
    }
    await writeFile(filePath, content);
    res.json({ success: true, path: filePath });
  } catch (error: any) {
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/files/*', async (req: any, res) => {
  try {
    const filePath = req.params[0] || req.params[''];
    if (!filePath) {
      return res.status(400).json({ error: 'File path required' });
    }
    await deleteFile(filePath);
    res.json({ success: true, path: filePath });
  } catch (error: any) {
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/files/mkdir', async (req, res) => {
  try {
    const { path: dirPath } = req.body;
    if (!dirPath) {
      return res.status(400).json({ error: 'Directory path required' });
    }
    await createDirectory(dirPath);
    res.json({ success: true, path: dirPath });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// Agent Routes (via OpenClaw Orchestrator)
// ============================================================

// List all registered agents
app.get('/api/agents', async (_req, res) => {
  try {
    const openclaw = getOpenClawService();
    const msStudio = getMicrosoftStudioService();

    const [openclawAgents, studioAgents] = await Promise.all([
      openclaw.listAgents(),
      msStudio.listAgents(),
    ]);

    res.json({
      agents: {
        registered: openclawAgents,
        available: studioAgents,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Register a Microsoft Studio agent with OpenClaw
app.post('/api/agents/register', async (req, res) => {
  try {
    const openclaw = getOpenClawService();
    const msStudio = getMicrosoftStudioService();

    const { agentId } = req.body;
    const agents = await msStudio.listAgents();
    const agent = agents.find(a => a.id === agentId);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const registered = await openclaw.registerAgent({
      id: agent.id,
      name: agent.name,
      provider: 'microsoft-studio',
      endpoint: process.env.MICROSOFT_STUDIO_API_URL || 'https://models.inference.ai.azure.com',
      capabilities: agent.capabilities,
    });

    res.json({ agent: registered });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Invoke an agent (routes through OpenClaw, falls back to direct MS Studio call)
app.post('/api/agents/invoke', async (req, res) => {
  try {
    const { prompt, agentId, context, conversationHistory, platform } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const openclaw = getOpenClawService();
    const msStudio = getMicrosoftStudioService();

    // Try routing through OpenClaw first
    let result;
    try {
      const openclawHealth = await openclaw.healthCheck();
      if (openclawHealth.status === 'ok' || openclawHealth.status !== 'unreachable') {
        result = await openclaw.routeTask({
          agentId: agentId || 'ms-studio-primary',
          prompt,
          context,
          platform,
          sessionId: req.body.sessionId,
        });

        if (result.status === 'completed' && result.result) {
          return res.json({
            content: result.result,
            source: 'openclaw',
            taskId: result.taskId,
            agentId: result.agentId,
          });
        }
      }
    } catch (openclawError) {
      console.warn('[API] OpenClaw routing failed, falling back to direct agent call');
    }

    // Fallback: Direct Microsoft Studio invocation
    if (msStudio.isConfigured()) {
      const response = await msStudio.invoke(agentId || 'ms-studio-primary', {
        prompt,
        context,
        conversationHistory,
        platform,
      });

      return res.json({
        content: response.content,
        source: 'microsoft-studio-direct',
        agentId: response.agentId,
        model: response.model,
        usage: response.usage,
      });
    }

    // If nothing is configured, return a helpful error
    res.status(503).json({
      error: 'No agent backend available. Configure MICROSOFT_STUDIO_API_KEY or ensure OpenClaw is running.',
    });
  } catch (error: any) {
    console.error('[API] Agent invocation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Check agent health
app.get('/api/agents/:agentId/health', async (req, res) => {
  try {
    const openclaw = getOpenClawService();
    const health = await openclaw.checkAgentHealth(req.params.agentId);
    res.json(health);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get task status
app.get('/api/tasks/:taskId/status', async (req, res) => {
  try {
    const openclaw = getOpenClawService();
    const status = await openclaw.getTaskStatus(req.params.taskId);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// Create HTTP Server + WebSocket for Terminal
// ============================================================
const server = http.createServer(app);

const wss = new WebSocketServer({ 
  server,
  path: '/ws/terminal',
});

wss.on('connection', (ws: WebSocket, req) => {
  // Parse session ID from query string, or generate one
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const sessionId = url.searchParams.get('sessionId') || uuidv4();

  console.log(`[Terminal] New connection: ${sessionId}`);

  // Create a PTY session bound to this WebSocket
  const session = createTerminalSession(sessionId, ws);

  if (session) {
    // Send session info to client
    ws.send(JSON.stringify({ type: 'session', sessionId }));
  }

  ws.on('message', (data) => {
    handleTerminalMessage(sessionId, data.toString());
  });

  ws.on('close', () => {
    console.log(`[Terminal] Connection closed: ${sessionId}`);
    destroyTerminalSession(sessionId);
  });

  ws.on('error', (err) => {
    console.error(`[Terminal] WebSocket error for ${sessionId}:`, err.message);
    destroyTerminalSession(sessionId);
  });
});

// ============================================================
// Startup
// ============================================================
async function start() {
  // Ensure workspace directory exists
  await ensureWorkspace();

  // Auto-register Microsoft Studio agents with OpenClaw on startup
  try {
    const msStudio = getMicrosoftStudioService();
    const openclaw = getOpenClawService();

    if (msStudio.isConfigured()) {
      const agents = await msStudio.listAgents();
      const openclawHealth = await openclaw.healthCheck();

      if (openclawHealth.status !== 'unreachable') {
        for (const agent of agents) {
          try {
            await openclaw.registerAgent({
              id: agent.id,
              name: agent.name,
              provider: 'microsoft-studio',
              endpoint: process.env.MICROSOFT_STUDIO_API_URL || 'https://models.inference.ai.azure.com',
              capabilities: agent.capabilities,
            });
            console.log(`[Startup] Registered agent: ${agent.name}`);
          } catch {
            console.warn(`[Startup] Could not register agent ${agent.name} with OpenClaw (may already exist)`);
          }
        }
      } else {
        console.warn('[Startup] OpenClaw is unreachable, skipping agent registration');
      }
    } else {
      console.warn('[Startup] Microsoft Studio API key not configured');
    }
  } catch (err: any) {
    console.warn('[Startup] Agent auto-registration skipped:', err.message);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] HeftCoder Workspace Backend running on port ${PORT}`);
    console.log(`[Server] Terminal WebSocket available at ws://0.0.0.0:${PORT}/ws/terminal`);
    console.log(`[Server] API available at http://0.0.0.0:${PORT}/api`);
  });
}

start().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
