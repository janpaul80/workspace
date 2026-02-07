import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  ChevronDown,
  X,
  FileCode,
  Download,
  Smartphone,
  Check
} from 'lucide-react';
import { FileNode } from '../types';

interface PreviewAreaProps {
  activeFile?: FileNode | null;
  isWorking?: boolean;
  onStopWorking?: () => void;
  platform?: 'web' | 'tablet' | 'ios' | 'android';
  onPlatformChange?: (platform: 'web' | 'tablet' | 'ios' | 'android') => void;
  hideWorkingBox?: boolean;
}

const GeometricHub = () => (
  <div className="relative flex items-center justify-center animate-in fade-in zoom-in duration-1000">
    <div className="absolute w-24 h-24 bg-white/5 blur-xl rounded-full animate-pulse" />
    <div className="relative flex items-center justify-center">
      <div className="w-14 h-14 border border-white/20 rotate-45 animate-[orbit-rotate_10s_linear_infinite]" />
      <div className="absolute w-10 h-10 border border-white/40 -rotate-45 animate-[orbit-rotate_8s_linear_infinite_reverse]" />
      <div className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
    </div>
  </div>
);

export const PreviewArea: React.FC<PreviewAreaProps> = ({ 
  activeFile, 
  isWorking, 
  onStopWorking, 
  platform = 'web', 
  onPlatformChange,
  hideWorkingBox = false 
}) => {
  const [isPreviewMenuOpen, setIsPreviewMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setIsPreviewMenuOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) setIsMobileMenuOpen(false);
    };
    if (isPreviewMenuOpen || isMobileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPreviewMenuOpen, isMobileMenuOpen]);

  const codingLines = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      width: Math.floor(Math.random() * 60) + 20 + '%',
      color: ['#FD6412', '#737373', '#1a1a1a', '#404040', '#ffffff'][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, []);

  const RadarBackground = () => (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[160, 320, 480, 640, 800, 960].map((size, i) => (
          <div 
            key={i} 
            className="absolute border border-white/5 rounded-full"
            style={{ width: `${size}px`, height: `${size}px`, opacity: 1 - (i * 0.12) }}
          >
            <div className="absolute inset-0 animate-[orbit-rotate_12s_linear_infinite]" style={{ animationDuration: `${5 + i * 1.5}s` }}>
              <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]" style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 animate-[orbit-rotate_8s_linear_infinite]">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[300px] -translate-y-1/2 bg-gradient-to-r from-white/[0.04] to-transparent origin-left rotate-180" style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }} />
        </div>
      </div>
      <div className="relative z-20">
        <GeometricHub />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="h-10 border-b border-[#1a1a1a] flex items-center justify-between px-4 bg-[#0a0a0a] z-[50]">
        <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 p-0.5 bg-[#141414] border border-[#262626] rounded-lg relative">
                <div 
                    onClick={() => onPlatformChange?.('web')}
                    className={`p-1 px-2 rounded-md shadow transition-all cursor-pointer ${platform === 'web' ? 'bg-[#262626] text-white' : 'text-[#737373] hover:text-white'}`}
                >
                    <Monitor size={14} />
                </div>

                <div className="relative">
                  <div 
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className={`p-1 px-2 rounded-md shadow transition-all cursor-pointer flex items-center space-x-1 ${platform !== 'web' ? 'bg-[#262626] text-white' : 'text-[#737373] hover:text-white'}`}
                  >
                      <Smartphone size={14} />
                      <ChevronDown size={12} className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isMobileMenuOpen && (
                    <div ref={mobileMenuRef} className="absolute top-full left-0 mt-3 w-40 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl shadow-2xl py-1.5 z-[200] animate-in fade-in zoom-in-95 duration-100">
                      <button 
                        onClick={() => { onPlatformChange?.('ios'); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-white hover:bg-[#1a1a1a] transition-colors"
                      >
                        <span className="font-bold">iOS Studio</span>
                        {platform === 'ios' && <Check size={14} className="text-white" />}
                      </button>
                      <button 
                        onClick={() => { onPlatformChange?.('android'); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-white hover:bg-[#1a1a1a] transition-colors"
                      >
                        <span className="font-bold">Android Studio</span>
                        {platform === 'android' && <Check size={14} className="text-white" />}
                      </button>
                    </div>
                  )}
                </div>
            </div>
            <div className="flex items-center space-x-2 text-[#737373]">
                <button className="hover:text-white transition-colors"><ChevronLeft size={14} /></button>
                <button className="hover:text-white transition-colors"><ChevronRight size={14} /></button>
            </div>
        </div>
      </div>

      <div className="flex-1 relative bg-black flex flex-col overflow-hidden">
        {activeFile ? (
          <div className="flex-1 flex flex-col z-10 bg-black animate-in fade-in duration-300">
            <div className="h-9 flex items-center px-4 bg-[#0d0d0d] border-b border-[#1a1a1a] space-x-2">
              <FileCode size={14} className="text-[#a3a3a3]" />
              <span className="text-xs text-[#a3a3a3] font-medium">{activeFile.name}</span>
              <div className="flex-1" />
              <button className="text-[#737373] hover:text-white p-1 transition-colors"><Download size={14} /></button>
            </div>
            <pre className="flex-1 p-6 font-mono text-sm overflow-auto text-[#d4d4d4] bg-black leading-relaxed chat-scroll">
              <code>{activeFile.content || "// No content"}</code>
            </pre>
          </div>
        ) : (
          <RadarBackground />
        )}

        <div className={`absolute bottom-10 right-8 w-64 bg-[#0f0f0f] border border-[#262626] rounded-xl shadow-2xl p-4 z-[100] transition-all duration-500 ${isWorking ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-95'} ${hideWorkingBox ? 'opacity-0 pointer-events-none scale-95 translate-y-4' : 'opacity-100 scale-100'}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-full h-32 bg-[#0a0a0a] rounded-lg border border-[#262626] relative overflow-hidden">
                    <div className={`absolute inset-0 code-scroller ${isWorking ? 'active' : ''} p-3 transition-opacity duration-500 ${isWorking ? 'opacity-100' : 'opacity-20'}`}>
                        {[...codingLines, ...codingLines].map((line, idx) => (
                            <div key={idx} className="code-line" style={{ width: line.width, backgroundColor: line.color, opacity: line.opacity }} />
                        ))}
                    </div>
                </div>
                <button onClick={onStopWorking} className="p-1 text-[#737373] ml-2 cursor-pointer hover:text-white transition-colors">
                  <X size={14} />
                </button>
            </div>
            <div className="space-y-1">
                <h3 className={`text-sm font-bold flex items-center space-x-2 transition-colors duration-300 ${isWorking ? 'text-white' : 'text-[#737373]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isWorking ? 'bg-green-500 animate-pulse' : 'bg-[#262626]'}`} />
                    <span>{isWorking ? 'Working' : 'Idle'}</span>
                </h3>
            </div>
        </div>
      </div>
    </div>
  );
};