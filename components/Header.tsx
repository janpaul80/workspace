import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Share2, 
  Globe,
  User,
  Settings,
  BookOpen,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Code2,
  ExternalLink,
  Monitor,
  Smartphone,
  Check,
  Coins,
  FileText,
  Users,
  MessageSquare
} from 'lucide-react';
import { supabase, subscribeToCredits } from '../services/supabase';

interface HeaderProps {
  onCodeClick: () => void;
  isCodeActive?: boolean;
  platform: 'web' | 'tablet' | 'ios' | 'android';
  onPlatformChange: (platform: 'web' | 'tablet' | 'ios' | 'android') => void;
  onOverlayOpenChange?: (isOpen: boolean) => void;
  onFullPreviewToggle?: () => void;
  chatPosition: 'Left' | 'Right';
  onChatPositionChange: (pos: 'Left' | 'Right') => void;
  onAddCustomDomain?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onDocsClick?: () => void;
  onBillingClick?: () => void;
  userId?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onCodeClick, 
  isCodeActive, 
  platform, 
  onPlatformChange, 
  onOverlayOpenChange,
  onFullPreviewToggle,
  chatPosition,
  onChatPositionChange,
  onAddCustomDomain,
  onProfileClick,
  onSettingsClick,
  onDocsClick,
  onBillingClick,
  userId = 'default-user'
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPublishMenuOpen, setIsPublishMenuOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('dark');
  const [credits, setCredits] = useState(17.93);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const publishMenuRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      const subscription = subscribeToCredits(userId, (newCredits) => {
        setCredits(newCredits);
      });
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) setIsUserMenuOpen(false);
      if (publishMenuRef.current && !publishMenuRef.current.contains(target)) setIsPublishMenuOpen(false);
      if (shareMenuRef.current && !shareMenuRef.current.contains(target)) setIsShareMenuOpen(false);
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)) setIsMobileDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => { window.location.href = 'https://app.heftcoder.icu'; };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-[#0a0a0a] border-[#1a1a1a] text-[#e5e5e5] relative z-[100]">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm bg-[#141414] px-3 py-1.5 rounded-lg border border-[#262626]">
          <Globe size={14} className="text-[#737373]" />
          <span className="font-bold text-xs">Vibe Coding App</span>
        </div>

        {/* Platform Switcher */}
        <div className="flex items-center space-x-1 p-0.5 bg-[#141414] border border-[#262626] rounded-lg">
          <button 
            onClick={() => onPlatformChange('web')}
            className={`p-1.5 px-2.5 rounded-md transition-all ${platform === 'web' ? 'bg-[#262626] text-white shadow-lg' : 'text-[#737373] hover:text-white'}`}
          >
            <Monitor size={14} />
          </button>
          
          <div className="relative" ref={mobileDropdownRef}>
            <button 
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className={`p-1.5 px-2.5 rounded-md transition-all flex items-center space-x-1 ${platform !== 'web' ? 'bg-[#262626] text-white shadow-lg' : 'text-[#737373] hover:text-white'}`}
            >
              <Smartphone size={14} />
              <ChevronDown size={12} className={`transition-transform duration-200 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMobileDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl shadow-2xl py-1.5 z-[200] animate-in fade-in zoom-in-95 duration-100">
                <button 
                  onClick={() => { onPlatformChange('ios'); setIsMobileDropdownOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="font-bold">iOS Studio</span>
                  {platform === 'ios' && <Check size={14} className="text-white" />}
                </button>
                <button 
                  onClick={() => { onPlatformChange('android'); setIsMobileDropdownOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="font-bold">Android Studio</span>
                  {platform === 'android' && <Check size={14} className="text-white" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={onCodeClick}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border transition-colors text-xs font-medium ${isCodeActive ? 'bg-[#1a1a1a] border-[#404040] text-white shadow-lg' : 'border-[#262626] text-[#a3a3a3] hover:bg-[#1a1a1a]'}`}
        >
          <Code2 size={14} />
          <span>Code</span>
        </button>

        <div className="relative" ref={shareMenuRef}>
          <button 
            onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md border border-[#262626] text-[#a3a3a3] hover:bg-[#1a1a1a] text-xs font-medium"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>

        <button className="bg-white text-black px-4 py-1.5 rounded-md text-xs font-bold hover:bg-[#e5e5e5] transition-colors">
          Publish
        </button>
        
        <button 
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-8 h-8 rounded-full overflow-hidden border border-[#262626] flex items-center justify-center bg-[#141414] text-[#737373] hover:text-white transition-all"
        >
          <User size={16} />
        </button>

        {isUserMenuOpen && (
          <div ref={userMenuRef} className="absolute right-4 top-14 w-64 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl py-2 z-[200]">
            <div className="px-4 py-2 border-b border-[#1a1a1a] mb-1">
              <span className="text-xs text-[#737373] block truncate">user@mail.com</span>
            </div>
            <button onClick={onProfileClick} className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-[#1a1a1a] text-xs text-[#a3a3a3] hover:text-white transition-colors">
              <User size={14} /> <span>Profile</span>
            </button>
            <button onClick={onBillingClick} className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#1a1a1a] text-xs text-[#a3a3a3] hover:text-white transition-colors">
              <div className="flex items-center space-x-3"><Coins size={14} /> <span>Credits</span></div>
              <span className="font-bold text-white">{credits.toFixed(2)}</span>
            </button>
            <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-4 py-2 border-t border-[#1a1a1a] text-xs text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut size={14} /> <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};