
import React from 'react';
import { Folder, File, ChevronRight, ChevronDown, FileText, Code, Settings as SettingsIcon } from 'lucide-react';
import { FileNode } from '../types';

interface FileExplorerProps {
  files: FileNode[];
  selectedFileId: string | null;
  onFileSelect: (file: FileNode) => void;
  onToggleFolder: (folderId: string) => void;
}

// Fixed missing getFileIcon function
const getFileIcon = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.endsWith('.ts') || lowercaseName.endsWith('.tsx') || lowercaseName.endsWith('.js') || lowercaseName.endsWith('.jsx')) return Code;
  if (lowercaseName.endsWith('.json')) return SettingsIcon;
  if (lowercaseName.endsWith('.md')) return FileText;
  return File;
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  selectedFileId, 
  onFileSelect, 
  onToggleFolder 
}) => {
  const renderTree = (nodes: FileNode[], level: number = 0) => {
    return nodes.map((node) => {
      const isSelected = selectedFileId === node.id;
      const Icon = node.type === 'folder' ? Folder : getFileIcon(node.name);

      return (
        <div key={node.id} className="select-none">
          <div
            onClick={() => node.type === 'folder' ? onToggleFolder(node.id) : onFileSelect(node)}
            className={`flex items-center py-1 px-2 cursor-pointer transition-colors hover:bg-[#1a1a1a] group ${
              isSelected ? 'bg-[#1a1a1a] text-white' : 'text-[#a3a3a3]'
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            <span className="mr-1.5 w-4 h-4 flex items-center justify-center text-[#525252]">
              {node.type === 'folder' && (
                node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              )}
            </span>
            <Icon 
              size={16} 
              className={`mr-2 ${node.type === 'folder' ? 'text-blue-400' : 'text-[#737373] group-hover:text-white'}`} 
            />
            <span className="text-sm truncate font-medium">{node.name}</span>
          </div>
          {node.type === 'folder' && node.isOpen && node.children && (
            <div>{renderTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Title header removed */}
      <div className="flex-1 overflow-y-auto py-2 chat-scroll">
        {files.length === 0 ? (
          <div className="p-4 text-xs text-[#525252] text-center">No files in workspace</div>
        ) : (
          renderTree(files)
        )}
      </div>
    </div>
  );
};
