import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Send,
  Mic,
  ChevronDown,
  Check,
  Zap,
  Bot,
  Trash2,
  AlertTriangle,
  X,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Cpu,
  ChevronRight,
  Search,
  ExternalLink,
  Info,
  ArrowLeft
} from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { chatWithGemini } from '../services/geminiService';
import { invokeAgent } from '../services/agentService';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onClearMessages?: () => void;
  onGenerateTemplate?: () => void;
  onWorkingStateChange?: (isWorking: boolean) => void;
}

const HeftCoderLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect width="100" height="100" rx="24" fill="#FD6412"/>
    <path d="M52 18L28 54H46L42 82L72 46H54L64 18H52Z" fill="white"/>
  </svg>
);

const FigmaIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={(size * 57) / 38} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 25.8478 20.0536 23.3043 21.9289 21.4289C23.8043 19.5536 26.3478 18.5 29 18.5C31.6522 18.5 34.1957 19.5536 36.0711 21.4289C37.9464 23.3043 39 25.8478 39 28.5C39 31.1522 37.9464 33.6957 36.0711 35.5711C34.1957 37.4464 31.6522 38.5 29 38.5C26.3478 38.5 23.8043 37.4464 21.9289 35.5711C20.0536 33.6957 19 31.1522 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 44.8478 1.05357 42.3043 2.92893 40.4289C4.8043 38.5536 7.34784 37.5 10 37.5C12.6522 37.5 15.1957 38.5536 17.0711 40.4289C18.9464 42.3043 20 44.8478 20 47.5C20 50.1522 18.9464 52.6957 17.0711 54.5711C15.1957 56.4464 12.6522 57.5 10 57.5C7.34784 57.5 4.8043 56.4464 2.92893 54.5711C1.05357 52.6957 0 50.1522 0 47.5Z" fill="#0ACF83"/>
    <path d="M0 28.5C0 25.8478 1.05357 23.3043 2.92893 21.4289C4.8043 19.5536 7.34784 18.5 10 18.5H19V38.5H10C7.34784 38.5 4.8043 37.4464 2.92893 35.5711C1.05357 33.6957 0 31.1522 0 28.5Z" fill="#A259FF"/>
    <path d="M0 9.5C0 6.84784 1.05357 4.3043 2.92893 2.42893C4.8043 0.553571 7.34784 0 10 0H19V19H10C7.34784 19 4.8043 17.9464 2.92893 16.0711C1.05357 14.1957 0 11.6522 0 9.5Z" fill="#F24E1E"/>
    <path d="M19 0H29C31.6522 0 34.1957 1.05357 36.0711 2.92893C37.9464 4.3043 39 6.84784 39 9.5C39 12.1522 37.9464 14.6957 36.0711 16.5711C34.1957 18.4464 31.6522 19.5 29 19.5H19V0Z" fill="#FF7262"/>
  </svg>
);

const Context7Icon = ({ size = 10 }: { size?: number }) => (
  <div className={`w-${size} h-${size} bg-[#065f46] rounded-lg flex items-center justify-center relative overflow-hidden`}>
    <div className="text-white font-bold text-xs select-none">7</div>
    <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-white/40" />
    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/40" />
    <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-white/40" />
    <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-white/40" />
  </div>
);

const GleanIcon = ({ size = 10 }: { size?: number }) => (
  <div className={`w-${size} h-${size} bg-[#2563eb] rounded-lg flex items-center justify-center`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-75">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="white" />
    </svg>
  </div>
);

const HexIcon = ({ size = 10 }: { size?: number }) => (
  <div className={`w-${size} h-${size} bg-[#1e1b4b] rounded-lg flex items-center justify-center border border-white/10`}>
    <span className="text-white font-black text-[10px] select-none">HEX</span>
  </div>
);

const LinearIcon = ({ size = 10 }: { size?: number }) => (
  <div className={`w-${size} h-${size} bg-white rounded-lg flex items-center justify-center`}>
    <div className="w-6 h-6 rounded-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full h-[2px] bg-white/20 my-[1px]" />
      <div className="w-full h-[2px] bg-white/20 my-[1px]" />
      <div className="w-full h-[2px] bg-white/20 my-[1px]" />
    </div>
  </div>
);

const ZapierIcon = ({ size = 10 }: { size?: number }) => (
  <div className={`w-${size} h-${size} bg-[#ff4f00] rounded-lg flex items-center justify-center`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.5 8.5H20L15 13L16.5 20L12 16L7.5 20L9 13L4 8.5H10.5L12 2Z" fill="white" />
    </svg>
  </div>
);

const SanityIcon = () => (
  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
    <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
      <div className="w-5 h-3 border-2 border-white rotate-12 skew-x-12" />
    </div>
  </div>
);

const SentryIcon = () => (
  <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-white/5">
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" />
       <path d="M12 8V16" />
       <path d="M8 12H16" />
     </svg>
  </div>
);

const NotionIcon = () => (
  <div className="w-10 h-10 bg-[#f7f7f7] rounded-lg flex items-center justify-center border border-black/10">
    <div className="w-6 h-6 bg-black rounded-[2px] flex items-center justify-center text-white font-bold text-sm select-none">N</div>
  </div>
);

const MCPItem: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  isCustom?: boolean;
  onAddClick?: () => void;
}> = ({ icon, title, description, isCustom, onAddClick }) => (
  <div 
    onClick={onAddClick}
    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-between group hover:border-[#262626] transition-all cursor-pointer"
  >
    <div className="flex items-center space-x-4">
      {isCustom ? (
        <div className="w-10 h-10 rounded-lg border border-dashed border-[#404040] flex items-center justify-center text-[#737373] group-hover:text-white group-hover:border-white transition-colors">
          <Plus size={20} />
        </div>
      ) : (
        icon
      )}
      <div className="text-left">
        <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
        <p className="text-xs text-[#737373] mt-1 line-clamp-1">{description}</p>
      </div>
    </div>
    {!isCustom && (
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddClick?.();
        }}
        className="p-1.5 rounded-full border border-[#262626] text-[#737373] group-hover:text-white group-hover:border-white transition-all"
      >
        <Plus size={16} />
      </button>
    )}
  </div>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  onSendMessage, 
  onClearMessages,
  onGenerateTemplate, 
  onWorkingStateChange 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Plan' | 'Agents'>('Plan');
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);
  const [isMCPModalOpen, setIsMCPModalOpen] = useState(false);
  const [activeMCPModal, setActiveMCPModal] = useState<'Linear' | 'Context7' | 'Glean' | 'Hex' | 'Custom' | null>(null);
  const [gleanStep, setGleanStep] = useState<'setup' | 'config'>('setup');
  const [mcpSearch, setMcpSearch] = useState('');
  const [generateImagesEnabled, setGenerateImagesEnabled] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);
  const modeButtonRef = useRef<HTMLButtonElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (modeMenuRef.current && !modeMenuRef.current.contains(target) && 
          modeButtonRef.current && !modeButtonRef.current.contains(target)) {
        setIsModeMenuOpen(false);
      }
      if (plusMenuRef.current && !plusMenuRef.current.contains(target) && 
          plusButtonRef.current && !plusButtonRef.current.contains(target)) {
        setIsPlusMenuOpen(false);
      }
    };
    if (isModeMenuOpen || isPlusMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModeMenuOpen, isPlusMenuOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: MessageRole.USER, content: inputValue };
    onSendMessage(userMsg);
    setInputValue('');
    setIsLoading(true);
    if (onWorkingStateChange) onWorkingStateChange(true);

    try {
      if (selectedMode === 'Agents') {
        // Route through AI agent via OpenClaw / Microsoft Studio
        const conversationHistory = messages.map(m => ({
          role: m.role === MessageRole.USER ? 'user' : 'assistant',
          content: m.content,
        }));
        const response = await invokeAgent({
          prompt: inputValue,
          conversationHistory,
          platform: 'web',
        });
        onSendMessage({ id: Date.now().toString(), role: MessageRole.AI, content: response.content });
      } else {
        // Default Plan mode: use Gemini
        const history = messages.map(m => ({
          role: m.role === MessageRole.USER ? 'user' : 'model' as 'user' | 'model',
          parts: [{ text: m.content }]
        }));
        const aiResponse = await chatWithGemini(inputValue, history);
        onSendMessage({ id: Date.now().toString(), role: MessageRole.AI, content: aiResponse });
      }
    } catch (error: any) {
      const errorMsg = selectedMode === 'Agents' 
        ? `Agent error: ${error.message || 'Failed to reach agent backend.'}`
        : "Error communicating with Gemini.";
      onSendMessage({ id: Date.now().toString(), role: MessageRole.AI, content: errorMsg, type: 'error' });
    } finally {
      setIsLoading(false);
      if (onWorkingStateChange) {
        setTimeout(() => onWorkingStateChange(false), 5000);
      }
    }
  };

  const handlePlusClick = () => {
    setIsPlusMenuOpen(!isPlusMenuOpen);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setIsPlusMenuOpen(false);
  };

  const handleFigmaClick = () => {
    setIsFigmaModalOpen(true);
    setIsPlusMenuOpen(false);
  };

  const handleMCPClick = () => {
    setIsMCPModalOpen(true);
    setIsPlusMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onSendMessage({
        id: Date.now().toString(),
        role: MessageRole.USER,
        // Fix: Added explicit type assertion to handle 'unknown' type in map callback
        content: `Attached ${files.length} file(s): ${Array.from(files).map((f: any) => f.name).join(', ')}`
      });
    }
  };

  const confirmClear = () => {
    if (onClearMessages) onClearMessages();
    setIsClearDialogOpen(false);
  };

  const handleFigmaSignIn = () => {
    setIsFigmaModalOpen(false);
    window.location.href = 'https://www.figma.com/login';
  };

  const mcpList = [
    { title: 'Context7', description: 'Documentation and context tools.', icon: <Context7Icon /> },
    { title: 'Glean', description: 'Knowledge management and search platform.', icon: <GleanIcon /> },
    { title: 'Hex', description: 'Data science and analytics platform.', icon: <HexIcon /> },
    { title: 'Linear', description: 'Project management and issue tracking.', icon: <LinearIcon /> },
    { title: 'Notion', description: 'Knowledge base and productivity tools.', icon: <NotionIcon /> },
    { title: 'Sanity', description: 'Content management system.', icon: <SanityIcon /> },
    { title: 'Sentry', description: 'Error tracking and performance monitoring.', icon: <SentryIcon /> },
    { title: 'Zapier', description: 'Workflow automation and app integration.', icon: <ZapierIcon /> }
  ];

  const filteredMCPs = mcpList.filter(m => 
    m.title.toLowerCase().includes(mcpSearch.toLowerCase()) || 
    m.description.toLowerCase().includes(mcpSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] relative">
      {/* Header with Clear Button */}
      <div className="h-12 shrink-0 border-b border-[#1a1a1a] flex items-center justify-between px-4 bg-[#0a0a0a] z-10">
        <div className="flex items-center space-x-2">
          <MessageRoleIcon role={MessageRole.AI} />
          <span className="text-xs font-bold text-white tracking-wider uppercase">History</span>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={() => setIsClearDialogOpen(true)}
            className="p-1.5 text-[#525252] hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
            title="Clear history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 chat-scroll">
        <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full pt-20 text-[#525252] text-center">
                <Bot size={40} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">How can I help you build today?</p>
                <p className="text-xs mt-1 opacity-50">Start a new project or ask a question.</p>
              </div>
            )}
            
            {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col space-y-2 ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[95%] rounded-2xl px-4 py-2 text-sm ${msg.role === MessageRole.USER ? 'bg-[#1a1a1a] text-white' : 'text-[#d4d4d4]'}`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-[#737373] text-xs animate-pulse px-2">
                <div className="w-2 h-2 bg-[#737373] rounded-full" />
                <span>Thinking...</span>
              </div>
            )}
        </div>
      </div>

      {/* Input box section */}
      <div className="px-4 pb-4 mt-auto">
        <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#1a1a1a] rounded-xl p-3 shadow-lg relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept=".pdf,.fig,image/*,.doc,.docx" 
              onChange={handleFileChange}
            />
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask a follow-up..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none placeholder-[#525252] h-12 outline-none chat-scroll"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1a1a]/50">
                <div className="flex items-center space-x-4 text-[#737373]">
                    {/* Plus Button and Dropdown */}
                    <div className="relative">
                      <button 
                        ref={plusButtonRef}
                        type="button" 
                        onClick={handlePlusClick}
                        className={`hover:text-white transition-colors p-0.5 ${isPlusMenuOpen ? 'text-white' : ''}`} 
                        title="Add context"
                      >
                        <Plus size={18} />
                      </button>

                      {isPlusMenuOpen && (
                        <div 
                          ref={plusMenuRef}
                          className="absolute bottom-full mb-3 left-0 w-[260px] bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] py-2 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200"
                        >
                          <button 
                            type="button"
                            onClick={handleFigmaClick}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <FigmaIcon size={14} />
                              <span className="font-medium">Create from Figma</span>
                            </div>
                            <span className="bg-[#064e3b] text-[#34d399] text-[10px] font-bold px-1.5 py-0.5 rounded">Premium</span>
                          </button>
                          
                          <button 
                            type="button"
                            onClick={handleUploadClick}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors"
                          >
                            <Upload size={16} className="text-[#a3a3a3]" />
                            <span className="font-medium">Upload from computer</span>
                          </button>

                          <div className="h-px bg-[#1a1a1a] my-2" />

                          <div className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer group" onClick={() => setGenerateImagesEnabled(!generateImagesEnabled)}>
                            <div className="flex items-center space-x-3">
                              <ImageIcon size={16} className="text-[#a3a3a3]" />
                              <span className="font-medium">Generate Images</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${generateImagesEnabled ? 'bg-blue-600' : 'bg-[#262626]'}`}>
                              <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${generateImagesEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </div>

                          <button 
                            type="button"
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <BookOpen size={16} className="text-[#a3a3a3]" />
                              <span className="font-medium">Instructions</span>
                            </div>
                            <ChevronRight size={14} className="text-[#404040]" />
                          </button>

                          <button 
                            type="button"
                            onClick={handleMCPClick}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-[#1a1a1a] transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <Cpu size={16} className="text-[#a3a3a3]" />
                              <span className="font-medium">MCPs</span>
                            </div>
                            <ChevronRight size={14} className="text-[#404040]" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      type="button" 
                      className="hover:text-white transition-colors p-0.5"
                      title="Voice input"
                    >
                      <Mic size={18} />
                    </button>

                    {/* Mode Selector Dropdown */}
                    <div className="relative">
                      <button 
                        ref={modeButtonRef}
                        type="button"
                        onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                        className={`flex items-center space-x-2 px-2.5 py-1 rounded-lg border transition-all text-[11px] font-bold ${
                          isModeMenuOpen ? 'bg-[#1a1a1a] border-[#404040] text-white' : 'border-[#262626] text-[#737373] hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                      >
                        {selectedMode === 'Plan' ? <Zap size={12} className="text-orange-400" /> : <Bot size={12} className="text-blue-400" />}
                        <span>{selectedMode}</span>
                        <ChevronDown size={12} className={`transition-transform duration-200 ${isModeMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isModeMenuOpen && (
                        <div 
                          ref={modeMenuRef}
                          className="absolute bottom-full mb-3 left-0 w-36 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                        >
                          <button
                            type="button"
                            onClick={() => { setSelectedMode('Plan'); setIsModeMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[#141414] ${selectedMode === 'Plan' ? 'text-white' : 'text-[#737373]'}`}
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
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[#141414] ${selectedMode === 'Agents' ? 'text-white' : 'text-[#737373]'}`}
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
                <button 
                    type="submit"
                    className={`flex items-center space-x-2 px-5 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-black hover:bg-[#e5e5e5] shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={isLoading}
                >
                    <Send size={14} className="text-black" />
                    <span>Send</span>
                </button>
            </div>
        </form>
      </div>

      {/* Sign In with Figma Modal */}
      {isFigmaModalOpen && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-8 w-[400px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col space-y-6">
              <div className="w-14 h-14 bg-black rounded-xl border border-[#1a1a1a] flex items-center justify-center shadow-inner">
                <FigmaIcon size={24} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Sign in with Figma</h3>
                <p className="text-sm text-[#737373] leading-relaxed">
                  To import from Figma, you need to sign in with your Figma account.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button 
                  onClick={() => setIsFigmaModalOpen(false)}
                  className="px-6 py-2 rounded-xl border border-[#262626] bg-[#0a0a0a] text-sm font-bold text-white hover:bg-[#1a1a1a] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFigmaSignIn}
                  className="px-6 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-[#e5e5e5] transition-all shadow-lg active:scale-95"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New MCP Connection Modal */}
      {isMCPModalOpen && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 w-[520px] max-h-[90%] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 pr-8">
                <h3 className="text-2xl font-bold text-white tracking-tight">Add New MCP Connection</h3>
                <p className="text-sm text-[#737373] leading-relaxed">
                  Connect MCP servers to v0 to access external data, APIs, and specialized functionality.
                </p>
              </div>
              <button 
                onClick={() => setIsMCPModalOpen(false)}
                className="p-1.5 text-[#525252] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-6">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525252]" />
              <input 
                type="text" 
                placeholder="Search connections..." 
                value={mcpSearch}
                onChange={(e) => setMcpSearch(e.target.value)}
                className="w-full bg-[#141414] border border-[#1a1a1a] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#404040] transition-colors placeholder-[#404040]"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 chat-scroll">
              <MCPItem 
                title="Custom MCP" 
                description="Add MCP server details manually" 
                icon={null} 
                isCustom 
                onAddClick={() => {
                  setActiveMCPModal('Custom');
                  setIsMCPModalOpen(false);
                }}
              />
              
              {filteredMCPs.map((mcp, idx) => (
                <MCPItem 
                  key={idx}
                  title={mcp.title} 
                  description={mcp.description} 
                  icon={mcp.icon} 
                  onAddClick={() => {
                    setActiveMCPModal(mcp.title as any);
                    setIsMCPModalOpen(false);
                    if (mcp.title === 'Glean') setGleanStep('setup');
                  }}
                />
              ))}

              {filteredMCPs.length === 0 && (
                <div className="py-12 text-center text-[#525252] italic text-sm">
                  No connections found for "{mcpSearch}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MCP Configuration Modals */}
      {activeMCPModal && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 w-[460px] max-h-[calc(100%-2rem)] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-y-auto chat-scroll scrollbar-hide">
            
            {/* Header Icons Section - Skips for Custom as per Screenshot 2 */}
            {activeMCPModal !== 'Custom' && (
              <div className="flex flex-col items-center space-y-6 mb-6">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-black rounded-xl border border-[#1a1a1a] flex items-center justify-center shadow-inner">
                    <HeftCoderLogo className="w-7 h-7" />
                  </div>
                  <div className="flex space-x-1 text-[#404040]">
                    <div className="w-1 h-1 rounded-full bg-current" />
                    <div className="w-1 h-1 rounded-full bg-current" />
                    <div className="w-1 h-1 rounded-full bg-current" />
                  </div>
                  <div className="w-14 h-14 bg-black rounded-xl border border-[#1a1a1a] flex items-center justify-center shadow-inner overflow-hidden">
                    {activeMCPModal === 'Linear' && <LinearIcon size={14} />}
                    {activeMCPModal === 'Context7' && <Context7Icon size={14} />}
                    {activeMCPModal === 'Glean' && <GleanIcon size={14} />}
                    {activeMCPModal === 'Hex' && <HexIcon size={14} />}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Add {activeMCPModal} MCP Connection</h3>
                  {!(activeMCPModal === 'Glean' && gleanStep === 'setup') && (
                    <p className="text-sm text-[#737373] leading-relaxed">
                      {activeMCPModal === 'Linear' && 'Project management and issue tracking.'}
                      {activeMCPModal === 'Context7' && 'Documentation and context tools.'}
                      {activeMCPModal === 'Glean' && 'Knowledge management and search platform.'}
                      {activeMCPModal === 'Hex' && 'Data science and analytics platform.'}
                      <span className="text-blue-500 hover:underline cursor-pointer inline-flex items-center gap-1 ml-1">View Docs <ExternalLink size={12} /></span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Custom MCP Modal Header - Screenshot 2 */}
            {activeMCPModal === 'Custom' && (
              <div className="flex flex-col mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">Add Custom MCP Connection</h3>
              </div>
            )}

            {/* Modal Body Content */}
            <div className="flex-grow">
              {activeMCPModal === 'Glean' && gleanStep === 'setup' ? (
                /* Glean Setup Flow (Screenshot 4) */
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white">Setup Glean</h4>
                    <p className="text-sm text-[#737373]">Follow these steps to set up your Glean connection.</p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-sm font-bold text-white tracking-tight">Before you begin</h5>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      Your Glean workspace administrator must enable the MCP connector before you can connect. If its already been enabled you can skip this screen.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-sm font-bold text-white tracking-tight">Admin setup required</h5>
                    <ol className="space-y-3 text-sm text-[#737373]">
                      <li>1. Ask your Glean admin to visit the <span className="text-blue-500 cursor-pointer hover:underline">Setting up Glean MCP Servers documentation</span></li>
                      <li>2. Enable the "MCP Server" connector</li>
                      <li>3. Once enabled, you can proceed with OAuth authorization and provide the URL your administrator has.</li>
                    </ol>
                  </div>

                  <div className="bg-[#1e293b]/40 border border-[#2563eb]/20 rounded-xl p-5 flex items-start space-x-4">
                    <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-100/70 leading-relaxed">
                      If you're a Glean admin, you can enable this yourself. Otherwise, please contact your workspace administrator.
                    </p>
                  </div>
                </div>
              ) : (
                /* Standard Config Form (Screenshots 2, 5, 6) */
                <div className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#737373] uppercase tracking-wider ml-1">Name</label>
                    <input 
                      type="text" 
                      defaultValue={activeMCPModal === 'Custom' ? '' : activeMCPModal}
                      placeholder={activeMCPModal === 'Custom' ? 'Ex. My Custom MCP' : undefined}
                      className="w-full bg-[#141414] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#404040] transition-colors placeholder-[#404040]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#737373] uppercase tracking-wider ml-1">URL</label>
                    <input 
                      type="text" 
                      defaultValue={
                        activeMCPModal === 'Linear' ? 'https://mcp.linear.app/mcp' :
                        activeMCPModal === 'Context7' ? 'https://mcp.context7.com/mcp' :
                        activeMCPModal === 'Glean' ? 'https://mcp.website.com/mcp' :
                        activeMCPModal === 'Hex' ? 'https://app.hex.tech/mcp' :
                        ''
                      }
                      placeholder={activeMCPModal === 'Custom' ? 'https://mcp.website.com/mcp' : undefined}
                      className="w-full bg-[#141414] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#404040] transition-colors placeholder-[#404040]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#737373] uppercase tracking-wider ml-1">Authentication</label>
                    <div className="grid grid-cols-4 gap-1 p-1 bg-[#141414] border border-[#1a1a1a] rounded-xl">
                      {['None', 'Bearer', 'Headers', 'OAuth'].map((mode) => {
                        const isSelected = 
                          ((activeMCPModal === 'Context7' || activeMCPModal === 'Custom') && mode === 'None') ||
                          (activeMCPModal === 'Linear' && mode === 'OAuth') ||
                          (activeMCPModal === 'Glean' && mode === 'OAuth') ||
                          (activeMCPModal === 'Hex' && mode === 'OAuth');
                          
                        return (
                          <button 
                            key={mode}
                            className={`py-2 text-xs font-bold rounded-lg transition-all ${isSelected ? 'bg-[#262626] text-white shadow-sm' : 'text-[#525252] hover:text-white'}`}
                          >
                            {mode}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-black border border-[#1a1a1a] rounded-xl p-12 flex items-center justify-center text-center">
                    <p className="text-sm text-[#525252] font-medium leading-relaxed">
                      {(activeMCPModal === 'Context7' || activeMCPModal === 'Custom') ? 'No authentication method selected.' : "You'll be redirected to authorize after saving this MCP"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons Section */}
            <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-[#1a1a1a]">
              {activeMCPModal === 'Glean' && gleanStep === 'setup' ? (
                <>
                  <button 
                    onClick={() => setActiveMCPModal(null)}
                    className="px-6 py-2.5 rounded-xl border border-[#262626] bg-[#0a0a0a] text-sm font-bold text-white hover:bg-[#1a1a1a] transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setGleanStep('config')}
                    className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-[#e5e5e5] transition-all shadow-lg active:scale-95"
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveMCPModal(null)}
                    className="px-6 py-2.5 rounded-xl border border-[#262626] bg-[#0a0a0a] text-sm font-bold text-white hover:bg-[#1a1a1a] transition-all min-w-[100px]"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setActiveMCPModal(null)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg min-w-[100px] ${
                      activeMCPModal === 'Custom' 
                        ? 'bg-[#1a1a1a] text-[#404040] border border-[#262626] cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-[#e5e5e5] active:scale-95'
                    }`}
                    disabled={activeMCPModal === 'Custom'}
                  >
                    {activeMCPModal === 'Context7' ? 'Add' : activeMCPModal === 'Custom' ? 'Add' : 'Authorize'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {isClearDialogOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-red-400/10 border border-red-400/20 rounded-full flex items-center justify-center text-red-400">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Clear history?</h3>
                <p className="text-xs text-[#737373]">This will permanently delete all messages in this conversation.</p>
              </div>
              <div className="flex items-center space-x-2 w-full pt-2">
                <button 
                  onClick={() => setIsClearDialogOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-[#1a1a1a] text-xs font-bold text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClear}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/10"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageRoleIcon: React.FC<{ role: MessageRole }> = ({ role }) => {
  if (role === MessageRole.AI) {
    return (
      <div className="w-5 h-5 rounded-md bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
        <Bot size={12} className="text-white" />
      </div>
    );
  }
  return null;
};