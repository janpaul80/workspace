import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Palette, 
  Github, 
  Plug2, 
  Variable, 
  LayoutTemplate, 
  Settings,
  Mail,
  Search,
  Home,
  Library,
  LayoutGrid,
  Shapes,
  Columns,
  ChevronDown,
  ChevronRight,
  GitBranch,
  MoreHorizontal,
  ChevronUp,
  Monitor,
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onFeedbackClick?: () => void;
  platform: 'web' | 'tablet' | 'ios' | 'android';
  onPlatformChange: (platform: 'web' | 'tablet' | 'ios' | 'android') => void;
}

const HeftCoderLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect width="100" height="100" rx="24" fill="#FD6412"/>
    <path d="M52 18L28 54H46L42 82L72 46H54L64 18H52Z" fill="white"/>
  </svg>
);

const LogoMenuIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect width="100" height="100" rx="20" fill="#1a1a1a"/>
    <path d="M52 18L28 54H46L42 82L72 46H54L64 18H52Z" fill="white"/>
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onFeedbackClick, platform, onPlatformChange }) => {
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const logoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && logoButtonRef.current && !logoButtonRef.current.contains(event.target as Node)) {
        setIsLogoMenuOpen(false);
      }
    };
    if (isLogoMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLogoMenuOpen]);

  const items = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'design', icon: Palette, label: 'Design' },
    { id: 'git', icon: Github, label: 'Git' },
    { id: 'connect', icon: Plug2, label: 'Connect' },
    { id: 'vars', icon: Variable, label: 'Vars' },
    { id: 'template', icon: LayoutTemplate, label: 'Template' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-16 h-full flex flex-col items-center py-4 space-y-4 border-r border-[#1a1a1a] bg-[#0a0a0a] relative z-[300]">
      <div className="mb-4 relative">
        <button 
          ref={logoButtonRef}
          onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
          className={`hover:opacity-80 transition-all ${isLogoMenuOpen ? 'scale-90' : 'scale-100'}`}
        >
          <HeftCoderLogo className="w-9 h-9" />
        </button>

        {isLogoMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute left-14 top-0 w-64 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200"
          >
            <div className="p-3 flex items-center justify-between border-b border-[#1a1a1a]">
              <div className="flex items-center space-x-2"><LogoMenuIcon className="w-6 h-6" /></div>
              <div className="flex flex-col -space-y-1 text-[#525252]"><ChevronUp size={10} /><ChevronDown size={10} /></div>
            </div>

            <div className="p-3">
              <button className="w-full py-1.5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-[13px] font-medium text-white hover:bg-[#141414] transition-colors">
                New Chat
              </button>
            </div>

            <div className="flex flex-col px-2 pb-4 space-y-0.5">
              <MenuNavItem icon={Search} label="Search" />
              <MenuNavItem icon={Home} label="Home" />
              <MenuNavItem icon={Library} label="Library" />
            </div>
          </div>
        )}
      </div>

      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`group relative p-2 rounded-lg transition-colors ${activeTab === item.id ? 'text-white' : 'text-[#737373] hover:text-white'}`}
        >
          <item.icon size={22} strokeWidth={1.5} />
          {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />}
        </button>
      ))}

      <div className="mt-auto pb-2">
        <button onClick={onFeedbackClick} className="group relative p-2 text-[#737373] hover:text-white transition-colors">
          <Mail size={22} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

const MenuNavItem: React.FC<{ icon: any, label: string }> = ({ icon: Icon, label }) => (
  <button className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#0d0d0d] transition-colors group">
    <Icon size={16} strokeWidth={1.5} className="text-[#737373] group-hover:text-white transition-colors" />
    <span className="text-[13px] font-medium">{label}</span>
  </button>
);