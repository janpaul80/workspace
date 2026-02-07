
import React, { useState } from 'react';

interface TemplatePanelProps {
  onCancel?: () => void;
}

export const TemplatePanel: React.FC<TemplatePanelProps> = ({ onCancel }) => {
  const [selectedOption, setSelectedOption] = useState<'new' | 'update'>('new');

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] p-6">
      <div className="flex flex-col space-y-1 mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Publish as Template</h2>
        <p className="text-sm text-[#737373]">Create a new template, or update an existing template</p>
      </div>

      <div className="space-y-3 flex-1">
        {/* New Template Option */}
        <button
          onClick={() => setSelectedOption('new')}
          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
            selectedOption === 'new' 
              ? 'bg-[#0f0f0f] border-[#262626] ring-1 ring-[#404040]' 
              : 'bg-transparent border-[#1a1a1a] hover:border-[#262626]'
          }`}
        >
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-bold text-white">New Template</span>
            <span className="text-xs text-[#737373]">Create a brand new template.</span>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selectedOption === 'new' ? 'border-white' : 'border-[#262626]'
          }`}>
            {selectedOption === 'new' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
          </div>
        </button>

        {/* Update Existing Option - Dimmed/Disabled style from screenshot */}
        <button
          onClick={() => setSelectedOption('update')}
          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all opacity-40 cursor-not-allowed ${
            selectedOption === 'update' 
              ? 'bg-[#0f0f0f] border-[#262626]' 
              : 'bg-transparent border-[#1a1a1a]'
          }`}
          disabled
        >
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-bold text-[#d4d4d4]">Update an Existing Template</span>
            <span className="text-xs text-[#525252]">Push updates to an existing template.</span>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-[#1a1a1a]" />
        </button>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end space-x-3 mt-auto pt-6 border-t border-[#1a1a1a]">
        <button 
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-[#262626] text-sm font-bold text-white hover:bg-[#1a1a1a] transition-colors"
        >
          Cancel
        </button>
        <button 
          className="px-5 py-2 rounded-lg bg-[#1a1a1a] text-[#525252] text-sm font-bold cursor-not-allowed border border-[#262626]"
          disabled
        >
          Continue
        </button>
      </div>
    </div>
  );
};
