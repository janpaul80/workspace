import os from 'os';
import { WebSocket } from 'ws';

// node-pty is a native module, imported dynamically to handle environments where it may not be available
let pty: any;
try {
  pty = await import('node-pty');
} catch (e) {
  console.warn('[TerminalService] node-pty not available, terminal functionality will be disabled');
}

export interface TerminalSession {
  id: string;
  process: any; // IPty instance
  ws: WebSocket;
}

const sessions = new Map<string, TerminalSession>();

/**
 * Get the default shell for the current platform
 */
function getDefaultShell(): string {
  if (os.platform() === 'win32') {
    return process.env.COMSPEC || 'cmd.exe';
  }
  return process.env.SHELL || '/bin/bash';
}

/**
 * Spawn a new terminal session and bind it to a WebSocket connection
 */
export function createTerminalSession(sessionId: string, ws: WebSocket): TerminalSession | null {
  if (!pty) {
    ws.send(JSON.stringify({ type: 'error', data: 'Terminal not available on this server' }));
    return null;
  }

  const shell = getDefaultShell();
  const cwd = process.env.WORKSPACE_DIR || process.cwd();

  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: cwd,
    env: {
      ...process.env,
      TERM: 'xterm-256color',
    },
  });

  const session: TerminalSession = {
    id: sessionId,
    process: ptyProcess,
    ws,
  };

  // Forward PTY output to WebSocket
  ptyProcess.onData((data: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'output', data }));
    }
  });

  ptyProcess.onExit(({ exitCode, signal }: { exitCode: number; signal?: number }) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'exit', exitCode, signal }));
    }
    sessions.delete(sessionId);
  });

  sessions.set(sessionId, session);
  return session;
}

/**
 * Handle incoming WebSocket messages for a terminal session
 */
export function handleTerminalMessage(sessionId: string, message: string): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  try {
    const parsed = JSON.parse(message);

    switch (parsed.type) {
      case 'input':
        session.process.write(parsed.data);
        break;

      case 'resize':
        if (parsed.cols && parsed.rows) {
          session.process.resize(parsed.cols, parsed.rows);
        }
        break;

      default:
        // Treat raw string as input
        session.process.write(parsed.data || '');
        break;
    }
  } catch {
    // If not JSON, treat as raw input
    session.process.write(message);
  }
}

/**
 * Destroy a terminal session
 */
export function destroyTerminalSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    try {
      session.process.kill();
    } catch {
      // Process may already be dead
    }
    sessions.delete(sessionId);
  }
}

/**
 * Get all active session IDs
 */
export function getActiveSessions(): string[] {
  return Array.from(sessions.keys());
}
