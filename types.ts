
export enum MessageRole {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type?: 'text' | 'image' | 'video' | 'error';
  mediaUrl?: string;
  isThinking?: boolean;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface UserProfile {
  email: string;
  credits: number;
  language: string;
  theme: 'dark' | 'light' | 'system';
}
