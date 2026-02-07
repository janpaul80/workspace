import axios, { AxiosInstance } from 'axios';

export interface StudioAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  model?: string;
}

export interface AgentInvocationRequest {
  prompt: string;
  context?: Record<string, any>;
  conversationHistory?: Array<{ role: string; content: string }>;
  platform?: 'web' | 'ios' | 'android';
}

export interface AgentInvocationResponse {
  content: string;
  agentId: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Microsoft AI Studio Agent Client
 * 
 * Provider-agnostic design: the integration layer abstracts the specific
 * Microsoft API so agents can be swapped or extended without IDE refactoring.
 */
export class MicrosoftStudioService {
  private client: AxiosInstance;
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    const baseURL = process.env.MICROSOFT_STUDIO_API_URL || 'https://models.inference.ai.azure.com';
    this.apiKey = process.env.MICROSOFT_STUDIO_API_KEY || '';
    this.defaultModel = process.env.MICROSOFT_STUDIO_MODEL || 'gpt-4o';

    this.client = axios.create({
      baseURL,
      timeout: 120000, // 2 min for complex agent tasks
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
  }

  /**
   * Check if the service is configured with valid credentials
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * List available agents/models
   */
  async listAgents(): Promise<StudioAgent[]> {
    // Microsoft Studio agents are configured via environment
    // Return the configured agent(s) as available
    const agents: StudioAgent[] = [];

    if (this.isConfigured()) {
      agents.push({
        id: 'ms-studio-primary',
        name: 'Microsoft Studio Agent',
        description: 'Primary AI agent powered by Microsoft AI Studio',
        capabilities: ['code-generation', 'code-review', 'debugging', 'planning', 'mobile-dev', 'web-dev'],
        model: this.defaultModel,
      });
    }

    // Additional agents can be configured via MICROSOFT_STUDIO_AGENTS env var (JSON array)
    const additionalAgents = process.env.MICROSOFT_STUDIO_AGENTS;
    if (additionalAgents) {
      try {
        const parsed = JSON.parse(additionalAgents);
        agents.push(...parsed);
      } catch {
        console.warn('[MSStudio] Failed to parse MICROSOFT_STUDIO_AGENTS env var');
      }
    }

    return agents;
  }

  /**
   * Invoke an agent with a prompt and context
   */
  async invoke(agentId: string, request: AgentInvocationRequest): Promise<AgentInvocationResponse> {
    if (!this.isConfigured()) {
      throw new Error('Microsoft Studio API key not configured');
    }

    // Build the messages array for the chat completion API
    const messages: Array<{ role: string; content: string }> = [];

    // System message with context about the platform and IDE
    const systemContext = this.buildSystemContext(request.platform);
    messages.push({ role: 'system', content: systemContext });

    // Add conversation history if provided
    if (request.conversationHistory) {
      messages.push(...request.conversationHistory);
    }

    // Add the current prompt
    messages.push({ role: 'user', content: request.prompt });

    try {
      const response = await this.client.post('/chat/completions', {
        model: this.defaultModel,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
        ...(request.context || {}),
      });

      const choice = response.data.choices?.[0];
      return {
        content: choice?.message?.content || 'No response from agent.',
        agentId,
        model: response.data.model,
        usage: response.data.usage ? {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      console.error('[MSStudio] Agent invocation failed:', error.response?.data || error.message);
      throw new Error(`Agent invocation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Build system context based on the current platform/layout
   */
  private buildSystemContext(platform?: string): string {
    const baseContext = `You are an AI coding agent integrated into the HeftCoder Workspace IDE. 
You help users build, debug, and deploy applications. 
You can generate code, review code, suggest improvements, and help with project planning.
Always provide clear, actionable responses with code examples when appropriate.`;

    if (platform === 'ios' || platform === 'android') {
      return `${baseContext}

CURRENT CONTEXT: Mobile App Development (${platform === 'ios' ? 'iOS' : 'Android'})
- The user is working in the Mobile Studio layout
- Focus on mobile-specific patterns, components, and best practices
- Consider platform-specific APIs and guidelines (${platform === 'ios' ? 'UIKit/SwiftUI' : 'Jetpack Compose/Android SDK'})
- Provide mobile-optimized code and architecture suggestions`;
    }

    return `${baseContext}

CURRENT CONTEXT: Web Development
- The user is working in the Web Studio layout
- Focus on web technologies: HTML, CSS, JavaScript, TypeScript, React, etc.
- Consider responsive design, accessibility, and performance
- Provide production-ready code suggestions`;
  }

  /**
   * Health check for the Microsoft Studio API
   */
  async healthCheck(): Promise<{ status: string; configured: boolean }> {
    if (!this.isConfigured()) {
      return { status: 'not_configured', configured: false };
    }

    try {
      // Simple test request
      await this.client.post('/chat/completions', {
        model: this.defaultModel,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      });
      return { status: 'healthy', configured: true };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return { status: 'auth_error', configured: true };
      }
      return { status: 'error', configured: true };
    }
  }
}

// Singleton instance
let instance: MicrosoftStudioService | null = null;

export function getMicrosoftStudioService(): MicrosoftStudioService {
  if (!instance) {
    instance = new MicrosoftStudioService();
  }
  return instance;
}
