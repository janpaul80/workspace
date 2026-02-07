import axios, { AxiosInstance } from 'axios';

export interface AgentRegistration {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'error';
}

export interface TaskRequest {
  agentId: string;
  prompt: string;
  context?: Record<string, any>;
  platform?: 'web' | 'ios' | 'android';
  sessionId?: string;
}

export interface TaskResponse {
  taskId: string;
  agentId: string;
  status: 'completed' | 'running' | 'failed';
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentHealth {
  agentId: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  latencyMs?: number;
}

/**
 * OpenClaw Orchestrator Client
 * 
 * OpenClaw manages agent registration, task routing, health monitoring,
 * and execution orchestration between the IDE and AI agents.
 */
export class OpenClawService {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.OPENCLAW_BASE_URL || 'http://openclaw:8000';
    const apiKey = process.env.MISTRAL_API_KEY || '';

    this.client = axios.create({
      baseURL,
      timeout: 60000, // 60s for long-running agent tasks
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
    });
  }

  /**
   * Register a new agent with OpenClaw
   */
  async registerAgent(agent: Omit<AgentRegistration, 'status'>): Promise<AgentRegistration> {
    try {
      const response = await this.client.post('/api/v1/agents/register', agent);
      return response.data;
    } catch (error: any) {
      console.error('[OpenClaw] Failed to register agent:', error.message);
      throw new Error(`Agent registration failed: ${error.message}`);
    }
  }

  /**
   * List all registered agents
   */
  async listAgents(): Promise<AgentRegistration[]> {
    try {
      const response = await this.client.get('/api/v1/agents');
      return response.data.agents || response.data || [];
    } catch (error: any) {
      console.error('[OpenClaw] Failed to list agents:', error.message);
      return [];
    }
  }

  /**
   * Route a task to an agent via OpenClaw
   */
  async routeTask(task: TaskRequest): Promise<TaskResponse> {
    try {
      const response = await this.client.post('/api/v1/tasks/route', {
        agent_id: task.agentId,
        prompt: task.prompt,
        context: task.context || {},
        metadata: {
          platform: task.platform || 'web',
          session_id: task.sessionId,
        },
      });
      return {
        taskId: response.data.task_id || response.data.taskId,
        agentId: task.agentId,
        status: response.data.status || 'completed',
        result: response.data.result || response.data.output,
        metadata: response.data.metadata,
      };
    } catch (error: any) {
      console.error('[OpenClaw] Task routing failed:', error.message);
      return {
        taskId: '',
        agentId: task.agentId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  /**
   * Get the status of a running task
   */
  async getTaskStatus(taskId: string): Promise<TaskResponse> {
    try {
      const response = await this.client.get(`/api/v1/tasks/${taskId}/status`);
      return response.data;
    } catch (error: any) {
      console.error('[OpenClaw] Failed to get task status:', error.message);
      throw new Error(`Task status check failed: ${error.message}`);
    }
  }

  /**
   * Check health of a specific agent
   */
  async checkAgentHealth(agentId: string): Promise<AgentHealth> {
    try {
      const start = Date.now();
      const response = await this.client.get(`/api/v1/agents/${agentId}/health`);
      const latencyMs = Date.now() - start;
      return {
        agentId,
        status: response.data.status || 'healthy',
        lastCheck: new Date().toISOString(),
        latencyMs,
      };
    } catch (error: any) {
      return {
        agentId,
        status: 'down',
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Check overall OpenClaw orchestrator health
   */
  async healthCheck(): Promise<{ status: string; version?: string }> {
    try {
      const response = await this.client.get('/api/v1/health');
      return response.data;
    } catch (error: any) {
      return { status: 'unreachable' };
    }
  }

  /**
   * Unregister an agent
   */
  async unregisterAgent(agentId: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/agents/${agentId}`);
    } catch (error: any) {
      console.error('[OpenClaw] Failed to unregister agent:', error.message);
      throw new Error(`Agent unregistration failed: ${error.message}`);
    }
  }
}

// Singleton instance
let instance: OpenClawService | null = null;

export function getOpenClawService(): OpenClawService {
  if (!instance) {
    instance = new OpenClawService();
  }
  return instance;
}
