
import React, { useState } from 'react';
import { Sidebar as SidebarIcon, ChevronDown, ArrowLeft } from 'lucide-react';

interface PreferencesViewProps {
  onBack?: () => void;
  chatPosition: 'Left' | 'Right';
  onChatPositionChange: (pos: 'Left' | 'Right') => void;
}

export const PreferencesView: React.FC<PreferencesViewProps> = ({ onBack, chatPosition, onChatPositionChange }) => {
  const [suggestions, setSuggestions] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(true);
  const [customInstructions, setCustomInstructions] = useState('');

  return (
    <div className="flex-1 bg-black text-white p-10 flex flex-col overflow-y-auto chat-scroll animate-in fade-in duration-500">
      {/* Header Navigation */}
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button className="text-[#a3a3a3] hover:text-white transition-all transform hover:scale-110">
            <SidebarIcon size={22} strokeWidth={2} />
          </button>
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-xs font-bold text-[#737373] hover:text-white transition-all uppercase tracking-widest bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-lg group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to App</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
          <p className="text-sm text-[#737373]">
            To manage account settings like your email, visit your{' '}
            <a href="#" className="text-[#a3a3a3] underline hover:text-white transition-colors">
              HeftCoder account settings
            </a>.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-sm font-bold text-[#737373] uppercase tracking-wider">General</h2>
          
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl">
            {/* Suggestions */}
            <div className="p-6 flex items-center justify-between border-b border-[#1a1a1a]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Suggestions</h3>
                <p className="text-xs text-[#737373]">Get relevant in-chat suggestions to refine your project.</p>
              </div>
              <Toggle enabled={suggestions} onToggle={() => setSuggestions(!suggestions)} />
            </div>

            {/* Sound Notifications */}
            <div className="p-6 flex items-center justify-between border-b border-[#1a1a1a]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Sound Notifications</h3>
                <p className="text-xs text-[#737373]">A new sound will play when v0 is finished responding and the window is not focused.</p>
              </div>
              <Toggle enabled={soundNotifications} onToggle={() => setSoundNotifications(!soundNotifications)} />
            </div>

            {/* Chat Position */}
            <div className="p-6 flex items-center justify-between border-b border-[#1a1a1a]">
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Chat Position</h3>
                <p className="text-xs text-[#737373]">Choose which side of the screen the chat is on.</p>
              </div>
              <div className="relative group">
                <select 
                  value={chatPosition}
                  onChange={(e) => onChatPositionChange(e.target.value as 'Left' | 'Right')}
                  className="appearance-none bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-1.5 pr-10 text-sm font-medium text-white focus:outline-none focus:border-white/20 transition-all cursor-pointer"
                >
                  <option value="Left">Left</option>
                  <option value="Right">Right</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Custom Instructions</h3>
                <p className="text-xs text-[#737373]">Manage your custom user rules or preferences for the LLM.</p>
              </div>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="These instructions get sent to v0 in all chats across all projects."
                className="w-full h-32 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 text-sm text-white placeholder-[#404040] focus:outline-none focus:border-[#404040] transition-colors resize-none shadow-inner"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? 'bg-[#3b82f6]' : 'bg-[#262626]'
    }`}
  >
    <div className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-transform duration-200 shadow-sm ${
      enabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-[#737373]'
    }`} />
  </button>
);
