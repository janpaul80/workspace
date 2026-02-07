
import React from 'react';
import { Github } from 'lucide-react';

interface GithubPanelProps {
  onConnect?: () => void;
}

export const GithubPanel: React.FC<GithubPanelProps> = ({ onConnect }) => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-[#1a1a1a] space-x-2">
        <Github size={18} className="text-white" />
        <span className="text-sm font-semibold text-white">GitHub</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-center mb-6">
          <Github size={24} className="text-[#a3a3a3]" />
        </div>

        <h2 className="text-base font-bold text-white mb-3">No GitHub Repository</h2>
        
        <p className="text-sm text-[#737373] max-w-[280px] leading-relaxed mb-8">
          This chat isn't connected to a repository. Select an existing repository or create a new one.
        </p>

        <button 
          onClick={onConnect}
          className="px-6 py-2 bg-transparent border border-[#262626] rounded-lg text-sm font-semibold text-white hover:bg-[#1a1a1a] transition-all duration-200"
        >
          Connect
        </button>
      </div>
    </div>
  );
};
