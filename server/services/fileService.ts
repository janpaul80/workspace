import fs from 'fs/promises';
import path from 'path';

export interface FileTreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
}

// Directories and files to exclude from the file tree
const EXCLUDED = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.cache',
  '.env',
  '.env.local',
  '.DS_Store',
  'Thumbs.db',
]);

/**
 * Get the workspace root directory
 */
function getWorkspaceRoot(): string {
  return process.env.WORKSPACE_DIR || path.join(process.cwd(), 'workspace');
}

/**
 * Ensure the workspace directory exists
 */
export async function ensureWorkspace(): Promise<void> {
  const root = getWorkspaceRoot();
  try {
    await fs.access(root);
  } catch {
    await fs.mkdir(root, { recursive: true });
    // Create a default starter file
    await fs.writeFile(
      path.join(root, 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
</head>
<body>
  <h1>Hello from HeftCoder!</h1>
</body>
</html>`,
      'utf-8'
    );
  }
}

/**
 * Build a file tree from a directory recursively
 */
export async function getFileTree(dirPath?: string): Promise<FileTreeNode[]> {
  const root = dirPath || getWorkspaceRoot();
  const nodes: FileTreeNode[] = [];

  try {
    const entries = await fs.readdir(root, { withFileTypes: true });

    for (const entry of entries) {
      if (EXCLUDED.has(entry.name)) continue;

      const fullPath = path.join(root, entry.name);
      const relativePath = path.relative(getWorkspaceRoot(), fullPath);
      const id = relativePath.replace(/\\/g, '/');

      if (entry.isDirectory()) {
        const children = await getFileTree(fullPath);
        nodes.push({
          id,
          name: entry.name,
          type: 'folder',
          children,
        });
      } else {
        nodes.push({
          id,
          name: entry.name,
          type: 'file',
        });
      }
    }
  } catch (err) {
    console.error(`[FileService] Error reading directory ${root}:`, err);
  }

  // Sort: folders first, then files, alphabetically
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

/**
 * Read a file's content
 */
export async function readFile(filePath: string): Promise<string> {
  const root = getWorkspaceRoot();
  const resolved = path.resolve(root, filePath);

  // Security: ensure the resolved path is within the workspace
  if (!resolved.startsWith(path.resolve(root))) {
    throw new Error('Access denied: path is outside workspace');
  }

  return fs.readFile(resolved, 'utf-8');
}

/**
 * Write content to a file (creates directories as needed)
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  const root = getWorkspaceRoot();
  const resolved = path.resolve(root, filePath);

  // Security: ensure the resolved path is within the workspace
  if (!resolved.startsWith(path.resolve(root))) {
    throw new Error('Access denied: path is outside workspace');
  }

  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, content, 'utf-8');
}

/**
 * Delete a file or directory
 */
export async function deleteFile(filePath: string): Promise<void> {
  const root = getWorkspaceRoot();
  const resolved = path.resolve(root, filePath);

  if (!resolved.startsWith(path.resolve(root))) {
    throw new Error('Access denied: path is outside workspace');
  }

  const stat = await fs.stat(resolved);
  if (stat.isDirectory()) {
    await fs.rm(resolved, { recursive: true });
  } else {
    await fs.unlink(resolved);
  }
}

/**
 * Create a new directory
 */
export async function createDirectory(dirPath: string): Promise<void> {
  const root = getWorkspaceRoot();
  const resolved = path.resolve(root, dirPath);

  if (!resolved.startsWith(path.resolve(root))) {
    throw new Error('Access denied: path is outside workspace');
  }

  await fs.mkdir(resolved, { recursive: true });
}
