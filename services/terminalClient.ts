/**
 * Terminal Client - Client-side WebSocket connection to the backend PTY terminal
 * 
 * Provides a real terminal experience inside the IDE by connecting
 * to the backend's node-pty WebSocket endpoint.
 */

type TerminalDataCallback = (data: string) => void;
type TerminalEventCallback = (event: any) => void;

const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 
  `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

export class TerminalClient {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private onDataCallbacks: TerminalDataCallback[] = [];
  private onConnectCallbacks: TerminalEventCallback[] = [];
  private onDisconnectCallbacks: TerminalEventCallback[] = [];
  private onErrorCallbacks: TerminalEventCallback[] = [];
  private pendingInput: string[] = [];

  /**
   * Connect to the terminal WebSocket
   */
  connect(sessionId?: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const url = sessionId 
      ? `${WS_BASE}/ws/terminal?sessionId=${sessionId}`
      : `${WS_BASE}/ws/terminal`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.onConnectCallbacks.forEach(cb => cb({ sessionId: this.sessionId }));

        // Send any pending input
        while (this.pendingInput.length > 0) {
          const input = this.pendingInput.shift();
          if (input) this.send(input);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          switch (parsed.type) {
            case 'output':
              this.onDataCallbacks.forEach(cb => cb(parsed.data));
              break;

            case 'session':
              this.sessionId = parsed.sessionId;
              break;

            case 'exit':
              this.onDataCallbacks.forEach(cb => cb(`\r\n[Process exited with code ${parsed.exitCode}]\r\n`));
              break;

            case 'error':
              this.onErrorCallbacks.forEach(cb => cb(parsed));
              this.onDataCallbacks.forEach(cb => cb(`\r\n[Error: ${parsed.data}]\r\n`));
              break;

            default:
              // Raw data
              if (parsed.data) {
                this.onDataCallbacks.forEach(cb => cb(parsed.data));
              }
              break;
          }
        } catch {
          // If not JSON, treat as raw terminal output
          this.onDataCallbacks.forEach(cb => cb(event.data));
        }
      };

      this.ws.onclose = (event) => {
        this.onDisconnectCallbacks.forEach(cb => cb({ code: event.code, reason: event.reason }));

        // Auto-reconnect if not intentionally closed
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
          setTimeout(() => this.connect(this.sessionId || undefined), delay);
        }
      };

      this.ws.onerror = (error) => {
        this.onErrorCallbacks.forEach(cb => cb(error));
      };
    } catch (error) {
      this.onErrorCallbacks.forEach(cb => cb(error));
    }
  }

  /**
   * Send input to the terminal
   */
  send(data: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'input', data }));
    } else {
      // Queue input for when connection is established
      this.pendingInput.push(data);
    }
  }

  /**
   * Resize the terminal
   */
  resize(cols: number, rows: number): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'resize', cols, rows }));
    }
  }

  /**
   * Register a callback for terminal output data
   */
  onData(callback: TerminalDataCallback): () => void {
    this.onDataCallbacks.push(callback);
    return () => {
      this.onDataCallbacks = this.onDataCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for connection events
   */
  onConnect(callback: TerminalEventCallback): () => void {
    this.onConnectCallbacks.push(callback);
    return () => {
      this.onConnectCallbacks = this.onConnectCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for disconnection events
   */
  onDisconnect(callback: TerminalEventCallback): () => void {
    this.onDisconnectCallbacks.push(callback);
    return () => {
      this.onDisconnectCallbacks = this.onDisconnectCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for error events
   */
  onError(callback: TerminalEventCallback): () => void {
    this.onErrorCallbacks.push(callback);
    return () => {
      this.onErrorCallbacks = this.onErrorCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Disconnect from the terminal
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.sessionId = null;
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get the current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }
}

// Singleton instance for the IDE
let instance: TerminalClient | null = null;

export function getTerminalClient(): TerminalClient {
  if (!instance) {
    instance = new TerminalClient();
  }
  return instance;
}
