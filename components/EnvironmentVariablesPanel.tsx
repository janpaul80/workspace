
import React from 'react';
import { Search, Plus, ListFilter, Eye, MoreHorizontal } from 'lucide-react';

interface VariableCardProps {
  name: string;
  isMasked?: boolean;
}

const VariableCard: React.FC<VariableCardProps> = ({ name, isMasked = true }) => (
  <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 space-y-2 hover:border-[#262626] transition-colors cursor-pointer group">
    <div className="flex items-center justify-between">
      <span className="font-mono text-[13px] font-bold text-white tracking-tight uppercase">{name}</span>
      <button className="text-[#525252] hover:text-white transition-colors">
        <MoreHorizontal size={16} />
      </button>
    </div>
    <div className="flex items-center space-x-2">
      <button className="text-[#737373] hover:text-white transition-colors">
        <Eye size={14} />
      </button>
      <span className="text-[#a3a3a3] text-xs tracking-[0.2em] pt-0.5 font-mono">
        ••••••••••••••••••••••••••••
      </span>
    </div>
    <div className="text-[10px] text-[#525252] font-medium">
      All Environments
    </div>
  </div>
);

export const EnvironmentVariablesPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#1a1a1a]">
        <h2 className="text-sm font-semibold text-white">Environment Variables</h2>
        <div className="flex items-center space-x-3 text-[#737373]">
          <button className="hover:text-white transition-colors">
            <ListFilter size={18} />
          </button>
          <button className="hover:text-white transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252] group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search variables..." 
            className="w-full bg-[#050505] border border-[#1a1a1a] rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#525252] focus:outline-none focus:border-[#404040] transition-all"
          />
        </div>
      </div>

      {/* Variable List */}
      <div className="flex-1 overflow-y-auto chat-scroll px-3 space-y-2 pb-4">
        <VariableCard name="DIRECT_LINE_SECRET" />
        <VariableCard name="MISTRAL_API_KEY" />
        {/* Placeholder for others */}
        <VariableCard name="GEMINI_API_KEY" />
        <VariableCard name="DATABASE_URL" />
      </div>
    </div>
  );
};
