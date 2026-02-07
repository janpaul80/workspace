/**
 * File Client - Client-side HTTP client for workspace file operations
 * 
 * Communicates with the backend file system API to provide
 * real file tree, read, and write capabilities in the IDE.
 */

import { FileNode } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

interface FileTreeResponse {
  files: Array<{
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileTreeResponse['files'];
  }>;
}

/**
 * Convert backend file tree format to the frontend FileNode format
 */
function mapToFileNodes(
  nodes: FileTreeResponse['files'],
  parentPath: string = ''
): FileNode[] {
  return nodes.map(node => ({
    id: node.id || `${parentPath}${node.name}`,
    name: node.name,
    type: node.type,
    isOpen: false,
    children: node.children ? mapToFileNodes(node.children, `${node.id}/`) : undefined,
  }));
}

/**
 * Fetch the workspace file tree
 */
export async function fetchFileTree(): Promise<FileNode[]> {
  try {
    const response = await fetch(`${API_BASE}/api/files`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file tree (${response.status})`);
    }

    const data: FileTreeResponse = await response.json();
    return mapToFileNodes(data.files);
  } catch (error) {
    console.warn('[FileClient] Could not fetch file tree:', error);
    return [];
  }
}

/**
 * Read a file's content from the workspace
 */
export async function fetchFileContent(filePath: string): Promise<string> {
  const response = await fetch(`${API_BASE}/api/files/${encodeURIComponent(filePath)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to read file: ${filePath}`);
  }

  const data = await response.json();
  return data.content;
}

/**
 * Write content to a file in the workspace
 */
export async function saveFileContent(filePath: string, content: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/files/${encodeURIComponent(filePath)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to save file: ${filePath}`);
  }
}

/**
 * Delete a file or directory from the workspace
 */
export async function deleteWorkspaceFile(filePath: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/files/${encodeURIComponent(filePath)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to delete: ${filePath}`);
  }
}

/**
 * Create a new directory in the workspace
 */
export async function createWorkspaceDirectory(dirPath: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/files/mkdir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: dirPath }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Failed to create directory: ${dirPath}`);
  }
}
