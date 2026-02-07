
import React, { useState, useEffect } from 'react';
import { X, Github, Globe, Activity, ChevronDown, ExternalLink, MoreHorizontal, Link as LinkIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

const HeftCoderLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect width="100" height="100" rx="24" fill="#FD6412"/>
    <path d="M52 18L28 54H46L42 82L72 46H54L64 18H52Z" fill="white"/>
  </svg>
);

const DomainCard: React.FC<{ 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  buttonLabel: string;
  gradient?: string;
}> = ({ title, subtitle, icon, buttonLabel, gradient }) => (
  <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5 flex items-center justify-between group hover:border-[#262626] transition-all">
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-[#1a1a1a] overflow-hidden ${gradient || 'bg-[#141414]'}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
          {title}
          <div className="w-4 h-4 rounded bg-[#1a1a1a] flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-[#333]" />
          </div>
        </h4>
        <p className="text-xs text-[#737373] mt-0.5">{subtitle}</p>
      </div>
    </div>
    <button className="px-4 py-1.5 border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all whitespace-nowrap">
      {buttonLabel}
    </button>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialTab = 'heftcoder' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showBuiltWith, setShowBuiltWith] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const menuItems = [
    { id: 'heftcoder', label: 'HeftCoder Project', icon: () => <HeftCoderLogo /> },
    { id: 'github', label: 'GitHub Repository', icon: () => <Github size={16} /> },
    { id: 'domains', label: 'Domains', icon: () => <Globe size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: () => <Activity size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-[640px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Sidebar */}
        <div className="w-64 border-r border-[#1a1a1a] bg-[#050505] p-4 flex flex-col">
          <h2 className="text-sm font-bold text-white mb-6 px-3">Settings</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#1a1a1a] text-white shadow-sm' 
                    : 'text-[#737373] hover:text-white hover:bg-[#0f0f0f]'
                }`}
              >
                <item.icon />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-[#1a1a1a] shrink-0">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {activeTab === 'heftcoder' && <HeftCoderLogo className="w-5 h-5" />}
              {menuItems.find(i => i.id === activeTab)?.label}
            </h3>
            <button 
              onClick={onClose}
              className="p-1 text-[#737373] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto chat-scroll p-8">
            {activeTab === 'heftcoder' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Connected Project Card */}
                <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5 flex items-center justify-between group hover:border-[#262626] transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <HeftCoderLogo className="w-10 h-10 shadow-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-none mb-1.5">heftcoder-workspace</h4>
                      <p className="text-xs text-[#737373]">Connected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-[#050505] border border-[#262626] rounded-lg px-3 py-1.5">
                      <div className="w-2 h-2 bg-[#22c55e] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <span className="text-xs font-bold text-white">Connected</span>
                      <ChevronDown size={14} className="text-[#525252]" />
                    </div>
                  </div>
                </div>

                {/* Built with HeftCoder Toggle */}
                <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Built with HeftCoder Button</h4>
                      <p className="text-xs text-[#737373]">Show the built with HeftCoder branding on your project.</p>
                    </div>
                    <button 
                      onClick={() => setShowBuiltWith(!showBuiltWith)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                        showBuiltWith ? 'bg-[#FD6412]' : 'bg-[#262626]'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-transform duration-200 ${
                        showBuiltWith ? 'translate-x-5 bg-white' : 'translate-x-0 bg-[#737373]'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'domains' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Domains</h2>
                    <p className="text-sm text-[#737373]">Publish your project to custom domains.</p>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all">
                    <span>How domains work</span>
                    <ExternalLink size={12} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Overview Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#737373] px-1 uppercase tracking-wider">Overview</h3>
                  <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5 flex items-center justify-between group hover:border-[#262626] transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#141414] border border-[#262626]">
                        <Globe size={18} className="text-[#a3a3a3]" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-white">No URL subdomain</span>
                        <div className="px-2 py-0.5 bg-[#FD6412]/10 border border-[#FD6412]/30 rounded text-[10px] font-bold text-[#FD6412] uppercase tracking-wide">
                          Unpublished
                        </div>
                      </div>
                    </div>
                    <button className="p-1.5 text-[#525252] hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Add/Purchase Section */}
                <div className="space-y-4">
                  <DomainCard 
                    title="Add existing domain"
                    subtitle="Connect a domain you already own."
                    buttonLabel="Connect domain"
                    icon={<LinkIcon size={20} className="text-white" />}
                    gradient="bg-gradient-to-br from-[#4b3e3e] to-[#2d2424]"
                  />
                  <DomainCard 
                    title="Purchase new domain"
                    subtitle="Buy a new domain through IONOS."
                    buttonLabel="Buy new domain"
                    icon={<Globe size={20} className="text-white" />}
                    gradient="bg-gradient-to-br from-[#3e4b4b] to-[#242d2d]"
                  />
                </div>
              </div>
            )}

            {activeTab !== 'heftcoder' && activeTab !== 'domains' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
                <p className="text-sm font-medium text-white italic">{menuItems.find(i => i.id === activeTab)?.label} configuration coming soon</p>
                <p className="text-xs text-[#737373]">These settings will be available in a future update.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
