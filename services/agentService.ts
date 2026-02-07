/**
 * Agent Service - Client-side
 * 
 * Communicates with the backend API to invoke AI agents
 * via OpenClaw orchestrator and Microsoft Studio.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface AgentInvokeRequest {
  prompt: string;
  agentId?: string;
  context?: Record<string, any>;
  conversationHistory?: Array<{ role: string; content: string }>;
  platform?: 'web' | 'ios' | 'android';
  sessionId?: string;
}

export interface AgentInvokeResponse {
  content: string;
  source: string;
  agentId?: string;
  model?: string;
  taskId?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AgentInfo {
  id: string;
  name: string;
  description?: string;
  capabilities?: string[];
  status?: string;
  model?: string;
}

export interface AgentHealth {
  agentId: string;
  status: string;
  lastCheck: string;
  latencyMs?: number;
}

/**
 * Invoke an AI agent with a prompt
 */
export async function invokeAgent(request: AgentInvokeRequest): Promise<AgentInvokeResponse> {
  const response = await fetch(`${API_BASE}/api/agents/invoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Agent invocation failed (${response.status})`);
  }

  return response.json();
}

/**
 * List all available agents
 */
export async function listAgents(): Promise<{ registered: AgentInfo[]; available: AgentInfo[] }> {
  const response = await fetch(`${API_BASE}/api/agents`);

  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }

  const data = await response.json();
  return data.agents || { registered: [], available: [] };
}

/**
 * Check health of a specific agent
 */
export async function getAgentHealth(agentId: string): Promise<AgentHealth> {
  const response = await fetch(`${API_BASE}/api/agents/${agentId}/health`);

  if (!response.ok) {
    throw new Error('Failed to check agent health');
  }

  return response.json();
}

/**
 * Register an agent with OpenClaw
 */
export async function registerAgent(agentId: string): Promise<AgentInfo> {
  const response = await fetch(`${API_BASE}/api/agents/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Agent registration failed');
  }

  const data = await response.json();
  return data.agent;
}

/**
 * Check overall backend health
 */
export async function checkHealth(): Promise<any> {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) {
    throw new Error('Backend health check failed');
  }
  return response.json();
}
