import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Globe, 
  ChevronDown, 
  Code2, 
  Send,
  Check,
  Signal,
  Wifi,
  Battery,
  ArrowLeft,
  Info,
  LayoutList,
  Plus,
  Mic,
  Zap,
  Bot,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { invokeAgent } from '../services/agentService';

interface NativeStudioLayoutProps {
  platform: 'ios' | 'android';
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  isWorking: boolean;
  onPlatformChange: (platform: 'web' | 'tablet' | 'ios' | 'android') => void;
}

const FigmaIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={(size * 57) / 38} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 25.8478 20.0536 23.3043 21.9289 21.4289C23.8043 19.5536 26.3478 18.5 29 18.5C31.6522 18.5 34.1957 19.5536 36.0711 21.4289C37.9464 23.3043 39 25.8478 39 28.5C39 31.1522 37.9464 33.6957 36.0711 35.5711C34.1957 37.4464 31.6522 38.5 29 38.5C26.3478 38.5 23.8043 37.4464 21.9289 35.5711C20.0536 33.6957 19 31.1522 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 44.8478 1.05357 42.3043 2.92893 40.4289C4.8043 38.5536 7.34784 37.5 10 37.5C12.6522 37.5 15.1957 38.5536 17.0711 40.4289C18.9464 42.3043 20 44.8478 20 47.5C20 50.1522 18.9464 52.6957 17.0711 54.5711C15.1957 56.4464 12.6522 57.5 10 57.5C7.34784 57.5 4.8043 56.4464 2.92893 54.5711C1.05357 52.6957 0 50.1522 0 47.5Z" fill="#0ACF83"/>
    <path d="M0 28.5C0 25.8478 1.05357 23.3043 2.92893 21.4289C4.8043 19.5536 7.34784 18.5 10 18.5H19V38.5H10C7.34784 38.5 4.8043 37.4464 2.92893 35.5711C1.05357 33.6957 0 31.1522 0 28.5Z" fill="#A259FF"/>
    <path d="M0 9.5C0 6.84784 1.05357 4.3043 2.92893 2.42893C4.8043 0.553571 7.34784 0 10 0H19V19H10C7.34784 19 4.8043 17.9464 2.92893 16.0711C1.05357 14.1957 0 11.6522 0 9.5Z" fill="#F24E1E"/>
    <path d="M19 0H29C31.6522 0 34.1957 1.05357 36.0711 2.92893C37.9464 4.3043 39 6.84784 39 9.5C39 12.1522 37.9464 14.6957 36.0711 16.5711C34.1957 18.4464 31.6522 19.5 29 19.5H19V0Z" fill="#FF7262"/>
  </svg>
);

export const NativeStudioLayout: React.FC<NativeStudioLayoutProps> = ({ 
  platform, 
  messages, 
  onSendMessage, 
  isWorking,
  onPlatformChange 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Plan' | 'Agents'>('Plan');
  const [generateImagesEnabled, setGenerateImagesEnabled] = useState(true);

  const platformMenuRef = useRef<HTMLDivElement>(null);
  const platformButtonRef = useRef<HTMLButtonElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);
  const modeButtonRef = useRef<HTMLButtonElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (platformMenuRef.current && !platformMenuRef.current.contains(target) && 
          platformButtonRef.current && !platformButtonRef.current.contains(target)) {
        setIsPlatformMenuOpen(false);
      }
      if (modeMenuRef.current && !modeMenuRef.current.contains(target) && 
          modeButtonRef.current && !modeButtonRef.current.contains(target)) {
        setIsModeMenuOpen(false);
      }
      if (plusMenuRef.current && !plusMenuRef.current.contains(target) && 
          plusButtonRef.current && !plusButtonRef.current.contains(target)) {
        setIsPlusMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: MessageRole.USER, content: inputValue };
    onSendMessage(userMsg);
    setInputValue('');

    if (selectedMode === 'Agents') {
      setIsLoading(true);
      try {
        const conversationHistory = messages.map(m => ({
          role: m.role === MessageRole.USER ? 'user' : 'assistant',
          content: m.content,
        }));
        const response = await invokeAgent({
          prompt: inputValue,
          conversationHistory,
          platform: platform,
        });
        onSendMessage({ id: Date.now().toString(), role: MessageRole.AI, content: response.content });
      } catch (error: any) {
        onSendMessage({
          id: Date.now().toString(),
          role: MessageRole.AI,
          content: `Agent error: ${error.message || 'Failed to reach agent backend.'}`,
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black animate-in fade-in duration-500 overflow-hidden select-none">
      <header className="h-14 flex items-center justify-between px-4 border-b border-[#1a1a1a] bg-[#0a0a0a] shrink-0">
        <div className="flex items-center space-x-2">
           <button 
             onClick={() => onPlatformChange('web')}
             className="flex items-center space-x-2 px-3 py-1.5 hover:bg-[#1a1a1a] rounded-lg cursor-pointer text-[#737373] hover:text-white transition-all border border-transparent hover:border-[#262626] group mr-2"
           >
             <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
             <span className="text-xs font-bold">Back to Web</span>
           </button>
           <div className="h-4 w-px bg-[#262626] mr-2" />
           <div className="flex items-center space-x-2 px-3 py-1.5 hover:bg-[#1a1a1a] rounded-lg cursor-pointer text-sm font-bold text-white group">
             <Globe size={14} className="text-[#737373]" />
             <span>Mobile Studio</span>
             <ChevronDown size={14} className="text-[#404040]" />
           </div>
        </div>

        <div className="flex items-center space-x-1 p-0.5 bg-[#141414] border border-[#262626] rounded-lg relative">
          <button 
            onClick={() => onPlatformChange('web')}
            className="p-1.5 px-3 rounded-md transition-colors text-[#737373] hover:text-white hover:bg-[#1a1a1a]"
          >
            <Monitor size={16} />
          </button>
          <button 
            ref={platformButtonRef}
            onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
            className="p-1.5 px-3 rounded-md bg-[#262626] text-white shadow-lg flex items-center space-x-1"
          >
            <Smartphone size={16} />
            <ChevronDown size={12} className={`transition-transform duration-200 ${isPlatformMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isPlatformMenuOpen && (
            <div ref={platformMenuRef} className="absolute top-full left-0 mt-3 w-40 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl shadow-2xl py-1.5 z-[200] animate-in fade-in zoom-in-95 duration-100">
                <button 
                    onClick={() => { onPlatformChange('ios'); setIsPlatformMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-white hover:bg-[#1a1a1a] transition-colors group"
                >
                    <span className="font-bold">iOS Studio</span>
                    {platform === 'ios' && <Check size={14} className="text-white" />}
                </button>
                <button 
                    onClick={() => { onPlatformChange('android'); setIsPlatformMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-white hover:bg-[#1a1a1a] transition-colors group"
                >
                    <span className="font-bold">Android Studio</span>
                    {platform === 'android' && <Check size={14} className="text-white" />}
                </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-[#262626] rounded-xl text-xs font-bold text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a] transition-all">
            <Code2 size={14} />
            <span>Code</span>
          </button>
          <button className="flex items-center space-x-6 py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-[#e5e5e5] shadow-lg px-6">
            <span>Publish</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[420px] border-r border-[#1a1a1a] flex flex-col bg-[#0a0a0a] shrink-0">
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-base font-bold text-white uppercase tracking-tight">Mobile Build</h2>
               <LayoutList size={18} className="text-[#525252]" />
            </div>
            <div className="flex-1 overflow-y-auto chat-scroll pr-2 space-y-4">
               {messages.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-20">
                    <Smartphone size={40} />
                    <p className="text-sm font-bold">Start your mobile project</p>
                 </div>
               )}
               {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] rounded-2xl px-4 py-2 text-sm ${msg.role === MessageRole.USER ? 'bg-[#1a1a1a] text-white' : 'text-[#d4d4d4]'}`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* New Integrated Chat Box Design */}
            <div className="mt-6 bg-[#141414] border border-[#1a1a1a] rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col space-y-3 relative">
               <textarea 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                   }
                 }}
                 placeholder="Ask a follow-up..." 
                 className="w-full bg-transparent border-none focus:ring-0 text-sm outline-none placeholder-[#525252] resize-none h-12 py-1 chat-scroll" 
               />
               
               <div className="flex items-center justify-between pt-1">
                 <div className="flex items-center space-x-4">
                    {/* Plus Button and Dropdown */}
                    <div className="relative">
                      <button 
                        ref={plusButtonRef}
                        type="button"
                        onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                        className={`text-[#737373] hover:text-white transition-colors p-0.5 ${isPlusMenuOpen ? 'text-white' : ''}`}
                      >
                        <Plus size={18} />
                      </button>

                      {isPlusMenuOpen && (
                        <div 
                          ref={plusMenuRef}
                          className="absolute bottom-full mb-4 left-0 w-[240px] bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200"
                        >
                          <button type="button" className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors group">
                            <div className="flex items-center space-x-3">
                              <FigmaIcon size={14} />
                              <span className="font-medium text-xs">Create from Figma</span>
                            </div>
                            <span className="bg-[#064e3b] text-[#34d399] text-[9px] font-bold px-1.5 py-0.5 rounded">Premium</span>
                          </button>
                          
                          <button type="button" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors">
                            <Upload size={16} className="text-[#a3a3a3]" />
                            <span className="font-medium text-xs">Upload from computer</span>
                          </button>

                          <div className="h-px bg-[#1a1a1a] my-2" />

                          <div className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer group" onClick={() => setGenerateImagesEnabled(!generateImagesEnabled)}>
                            <div className="flex items-center space-x-3">
                              <ImageIcon size={16} className="text-[#a3a3a3]" />
                              <span className="font-medium text-xs">Generate Images</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${generateImagesEnabled ? 'bg-blue-600' : 'bg-[#262626]'}`}>
                              <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${generateImagesEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </div>

                          <button type="button" className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors group">
                            <div className="flex items-center space-x-3">
                              <BookOpen size={16} className="text-[#a3a3a3]" />
                              <span className="font-medium text-xs">Instructions</span>
                            </div>
                            <ChevronRight size={14} className="text-[#404040]" />
                          </button>

                          <button type="button" className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors group">
                            <div className="flex items-center space-x-3">
                              <Cpu size={16} className="text-[#a3a3a3]" />
                              <span className="font-medium text-xs">MCPs</span>
                            </div>
                            <ChevronRight size={14} className="text-[#404040]" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button className="text-[#737373] hover:text-white transition-colors">
                      <Mic size={18} />
                    </button>
                    
                    {/* Plan Pill Dropdown */}
                    <div className="relative">
                      <button 
                        ref={modeButtonRef}
                        type="button"
                        onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                        className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border transition-all text-[11px] font-bold ${
                          isModeMenuOpen ? 'bg-[#1a1a1a] border-[#404040] text-white shadow-lg' : 'border-[#262626] bg-[#0d0d0d] text-[#737373] hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                      >
                        {selectedMode === 'Plan' ? <Zap size={12} className="text-orange-400" /> : <Bot size={12} className="text-blue-400" />}
                        <span>{selectedMode}</span>
                        <ChevronDown size={12} className={`transition-transform duration-200 ${isModeMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isModeMenuOpen && (
                        <div 
                          ref={modeMenuRef}
                          className="absolute bottom-full mb-4 left-0 w-36 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl py-1.5 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200"
                        >
                          <button
                            type="button"
                            onClick={() => { setSelectedMode('Plan'); setIsModeMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[#141414] ${selectedMode === 'Plan' ? 'text-white font-bold' : 'text-[#737373]'}`}
                          >
                            <div className="flex items-center space-x-2">
                              <Zap size={12} className={selectedMode === 'Plan' ? 'text-orange-400' : ''} />
                              <span>Plan</span>
                            </div>
                            {selectedMode === 'Plan' && <Check size={12} className="text-white" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSelectedMode('Agents'); setIsModeMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[#141414] ${selectedMode === 'Agents' ? 'text-white font-bold' : 'text-[#737373]'}`}
                          >
                            <div className="flex items-center space-x-2">
                              <Bot size={12} className={selectedMode === 'Agents' ? 'text-blue-400' : ''} />
                              <span>Agents</span>
                            </div>
                            {selectedMode === 'Agents' && <Check size={12} className="text-white" />}
                          </button>
                        </div>
                      )}
                    </div>
                 </div>

                 {/* Send Button */}
                 <button 
                   onClick={handleSend}
                   className="flex items-center space-x-2 px-5 py-2 bg-white text-black rounded-xl hover:bg-[#e5e5e5] transition-all shadow-lg active:scale-95"
                 >
                   <Send size={14} />
                   <span className="text-xs font-bold">Send</span>
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Main Preview Container */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          {/* Mobile Device */}
          <div className="w-[210px] h-[430px] bg-[#1a1a1a] rounded-[36px] p-[6px] relative shadow-[0_30px_80px_rgba(0,0,0,0.85)] -translate-x-32 transition-transform duration-500 ease-in-out">
            <div className="w-full h-full bg-black rounded-[30px] relative overflow-hidden flex flex-col">
              {/* Status Bar */}
              <div className="h-8 w-full flex items-center justify-between px-6 z-50 shrink-0">
                <div className="text-[9px] font-bold text-white select-none">9:41</div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl" />
                <div className="flex items-center space-x-1 text-white scale-[0.75] origin-right">
                  <Signal size={12} strokeWidth={2.5} />
                  <Wifi size={12} strokeWidth={2.5} />
                  <Battery size={16} strokeWidth={2} />
                </div>
              </div>
              
              {/* Screen Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 p-4">
                <div className="w-2.5 h-2.5 bg-white/20 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                <p className="text-[9px] text-[#525252] font-mono tracking-[0.15em] uppercase italic animate-pulse">
                  Initializing {platform === 'ios' ? 'iOS' : 'Android'}...
                </p>
              </div>

              {/* Home Indicator */}
              <div className="h-6 w-full flex items-center justify-center pb-1.5">
                <div className="w-24 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* On-Device Test Card */}
          <div className="absolute right-12 top-12 w-72 p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in slide-in-from-right-10 duration-700">
            <h2 className="text-2xl font-bold text-white tracking-tight">On-Device Test</h2>
            
            <div className="bg-white p-5 rounded-3xl w-full aspect-square flex items-center justify-center group cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-xl">
                <div className="w-full h-full border-[8px] border-black flex flex-wrap opacity-90 group-hover:opacity-100">
                  {Array.from({length: 256}).map((_, i) => (
                    <div key={i} className={`w-[6.25%] h-[6.25%] ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
            </div>

            <div className="p-4 bg-[#141414] border border-[#262626] rounded-2xl flex items-start space-x-4">
                <Info size={18} className="text-[#525252] mt-1 shrink-0" />
                <p className="text-[12px] text-[#737373] leading-relaxed">
                  Scan to preview your app live on your actual <span className="text-white font-bold">{platform === 'ios' ? 'iPhone' : 'Android'}</span> device.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};