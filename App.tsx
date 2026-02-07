import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { NativeStudioLayout } from './components/NativeStudioLayout';
import { FileExplorer } from './components/FileExplorer';
import { PreviewArea } from './components/PreviewArea';
import { GithubPanel } from './components/GithubPanel';
import { IntegrationsPanel } from './components/IntegrationsPanel';
import { EnvironmentVariablesPanel } from './components/EnvironmentVariablesPanel';
import { SettingsModal } from './components/SettingsModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ProfileView } from './components/ProfileView';
import { PreferencesView } from './components/PreferencesView';
import { DocumentationView } from './components/DocumentationView';
import { BillingView } from './components/BillingView';
import { ChatMessage, FileNode } from './types';
// Fix: Added Layout to the lucide-react imports to resolve missing reference error
import { X, Copy, Trash2, Layout } from 'lucide-react';
import { fetchFileTree, fetchFileContent } from './services/fileClient';
import { getTerminalClient } from './services/terminalClient';

const App: React.FC = () => {
  const [platform, setPlatform] = useState<'web' | 'tablet' | 'ios' | 'android'>('web');
  const [activeTab, setActiveTab] = useState('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState('heftcoder');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileSystem, setFileSystem] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showExplorer, setShowExplorer] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [webConsoleTab, setWebConsoleTab] = useState<'console' | 'terminal'>('console');
  const [isHeaderOverlayOpen, setIsHeaderOverlayOpen] = useState(false);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [chatPosition, setChatPosition] = useState<'Left' | 'Right'>('Left');
  
  // Console state
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const [consoleFilter, setConsoleFilter] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([
    { id: 1, time: '07:29:59.911Z', source: 'SERVER', message: 'Port 8080 is in use, trying another one...', type: 'info' },
    { id: 2, time: '07:30:00.121Z', source: null, message: 'VITE v5.4.21 ready in 208 ms', type: 'success' },
    { id: 3, time: '07:30:00.122Z', source: null, message: '➜  Local:   http://localhost:8081/', type: 'link' },
    { id: 4, time: '07:30:00.123Z', source: null, message: '➜  Network: http://192.168.0.189:8081/', type: 'link' }
  ]);

  // Resizing states
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [consoleHeight, setConsoleHeight] = useState(192);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingConsole, setIsResizingConsole] = useState(false);

  // Terminal state
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const terminalClientRef = useRef(getTerminalClient());

  const isNative = platform === 'ios' || platform === 'android';

  const handleSendMessage = (msg: ChatMessage) => setMessages(prev => [...prev, msg]);
  const handleClearMessages = () => setMessages([]);
  
  const handleTabChange = (tab: string) => {
    if (tab === 'settings') {
      setSettingsActiveTab('heftcoder');
      setIsSettingsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleOpenDomains = () => {
    setSettingsActiveTab('domains');
    setIsSettingsOpen(true);
  };

  const handleCopyLogs = () => {
    const text = consoleLogs.map(log => `${log.time} ${log.source ? `[${log.source}] ` : ''}${log.message}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleClearLogs = () => {
    setConsoleLogs([]);
  };

  const filteredLogs = useMemo(() => {
    if (!consoleFilter) return consoleLogs;
    return consoleLogs.filter(log => 
      log.message.toLowerCase().includes(consoleFilter.toLowerCase()) || 
      (log.source && log.source.toLowerCase().includes(consoleFilter.toLowerCase()))
    );
  }, [consoleLogs, consoleFilter]);

  const startResizingSidebar = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  }, []);

  const startResizingConsole = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingConsole(true);
  }, []);

  // Fetch file tree from backend on mount
  useEffect(() => {
    fetchFileTree().then(files => {
      if (files.length > 0) {
        setFileSystem(files);
      }
    }).catch(() => {
      // Backend not available, file system stays empty (graceful degradation)
    });
  }, []);

  // Connect terminal WebSocket on mount
  useEffect(() => {
    const client = terminalClientRef.current;

    client.onData((data: string) => {
      setTerminalLines(prev => {
        const newLines = [...prev];
        // Split incoming data by newlines and append
        const parts = data.split(/\r?\n/);
        if (parts.length > 0 && newLines.length > 0) {
          // Append first part to last existing line
          newLines[newLines.length - 1] += parts[0];
          // Add remaining parts as new lines
          for (let i = 1; i < parts.length; i++) {
            newLines.push(parts[i]);
          }
        } else {
          newLines.push(...parts);
        }
        // Keep last 500 lines
        return newLines.slice(-500);
      });
    });

    client.onConnect(() => {
      setTerminalLines(prev => [...prev, '$ Connected to workspace terminal']);
    });

    client.onError(() => {
      // Terminal not available — graceful degradation
    });

    client.connect();

    return () => {
      client.disconnect();
    };
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Handle file selection — load content from backend
  const handleFileSelect = useCallback(async (file: FileNode) => {
    if (file.type === 'file') {
      try {
        const content = await fetchFileContent(file.id);
        setSelectedFile({ ...file, content });
      } catch {
        setSelectedFile({ ...file, content: '// Failed to load file content' });
      }
    }
  }, []);

  // Handle folder toggle in file explorer
  const handleToggleFolder = useCallback((folderId: string) => {
    setFileSystem(prev => {
      const toggle = (nodes: FileNode[]): FileNode[] =>
        nodes.map(node => {
          if (node.id === folderId) {
            return { ...node, isOpen: !node.isOpen };
          }
          if (node.children) {
            return { ...node, children: toggle(node.children) };
          }
          return node;
        });
      return toggle(prev);
    });
  }, []);

  // Handle terminal input
  const handleTerminalInput = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && terminalInputRef.current) {
      const command = terminalInputRef.current.value;
      terminalClientRef.current.send(command + '\n');
      terminalInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        const width = chatPosition === 'Left' 
          ? e.clientX - 64 
          : window.innerWidth - e.clientX - 64;
        setSidebarWidth(Math.max(300, Math.min(600, width)));
      }
      if (isResizingConsole) {
        setConsoleHeight(Math.max(40, Math.min(500, window.innerHeight - e.clientY)));
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingConsole(false);
    };

    if (isResizingSidebar || isResizingConsole) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizingSidebar ? 'col-resize' : 'row-resize';
    } else {
      document.body.style.cursor = 'default';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingConsole, chatPosition]);

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-[#e5e5e5] overflow-hidden relative select-none">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onFeedbackClick={() => setIsFeedbackOpen(true)}
        platform={platform}
        onPlatformChange={setPlatform}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {isNative ? (
          <NativeStudioLayout 
            platform={platform}
            messages={messages}
            onSendMessage={handleSendMessage}
            isWorking={isWorking}
            onPlatformChange={setPlatform}
          />
        ) : (
          <>
            <Header 
              onCodeClick={() => setShowExplorer(!showExplorer)} 
              isCodeActive={showExplorer} 
              platform={platform}
              onPlatformChange={setPlatform}
              onOverlayOpenChange={setIsHeaderOverlayOpen}
              onFullPreviewToggle={() => setIsFullPreviewOpen(true)}
              chatPosition={chatPosition}
              onChatPositionChange={setChatPosition}
              onAddCustomDomain={handleOpenDomains}
              onProfileClick={() => setActiveTab('profile')}
              onSettingsClick={() => setActiveTab('preferences')}
              onDocsClick={() => setActiveTab('docs')}
              onBillingClick={() => setActiveTab('billing')}
            />
            
            {activeTab === 'profile' ? (
              <ProfileView onBack={() => setActiveTab('chat')} />
            ) : activeTab === 'preferences' ? (
              <PreferencesView 
                onBack={() => setActiveTab('chat')} 
                chatPosition={chatPosition} 
                onChatPositionChange={setChatPosition} 
              />
            ) : activeTab === 'docs' ? (
              <DocumentationView onBack={() => setActiveTab('chat')} />
            ) : activeTab === 'billing' ? (
              <BillingView onBack={() => setActiveTab('chat')} />
            ) : (
              <div className={`flex-1 flex overflow-hidden ${chatPosition === 'Right' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div style={{ width: `${sidebarWidth}px` }} className={`border-[#1a1a1a] flex flex-col h-full bg-[#0a0a0a] shrink-0 overflow-hidden ${chatPosition === 'Left' ? 'border-r' : 'border-l'}`}>
                  {activeTab === 'chat' ? (
                    <ChatPanel 
                      messages={messages} 
                      onSendMessage={handleSendMessage} 
                      onClearMessages={handleClearMessages}
                      onWorkingStateChange={setIsWorking}
                    />
                  ) : activeTab === 'git' ? (
                    <GithubPanel />
                  ) : activeTab === 'connect' ? (
                    <IntegrationsPanel />
                  ) : activeTab === 'vars' ? (
                    <EnvironmentVariablesPanel />
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-[#525252] text-sm italic">
                      {activeTab} view...
                    </div>
                  )}
                </div>

                {/* Sidebar Resizer */}
                <div 
                  onMouseDown={startResizingSidebar}
                  className={`w-[4px] cursor-col-resize group relative flex-shrink-0 z-10 hover:bg-[#FD6412]/20 transition-colors ${isResizingSidebar ? 'bg-[#FD6412]/30' : ''}`}
                >
                  <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#1a1a1a] group-hover:bg-[#FD6412] transition-colors ${isResizingSidebar ? 'bg-[#FD6412]' : ''}`} />
                </div>
                
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
                  <div className="flex-1 flex overflow-hidden relative">
                    {showExplorer && (
                      <div className="w-64 border-r border-[#1a1a1a] flex flex-col h-full bg-[#0a0a0a] shrink-0">
                        <FileExplorer 
                          files={fileSystem} 
                          selectedFileId={selectedFile?.id || null} 
                          onFileSelect={handleFileSelect}
                          onToggleFolder={handleToggleFolder}
                        />
                      </div>
                    )}
                    <div className="flex-1 relative">
                      <PreviewArea 
                        activeFile={selectedFile} 
                        isWorking={isWorking} 
                        onStopWorking={() => setIsWorking(false)} 
                        hideWorkingBox={isHeaderOverlayOpen}
                        platform={platform}
                        onPlatformChange={setPlatform}
                      />
                    </div>
                  </div>
                  
                  {isConsoleVisible && (
                    <>
                      {/* Console Resizer */}
                      <div 
                        onMouseDown={startResizingConsole}
                        className={`h-[4px] cursor-row-resize group relative flex-shrink-0 z-10 hover:bg-[#FD6412]/20 transition-colors ${isResizingConsole ? 'bg-[#FD6412]/30' : ''}`}
                      >
                        <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#1a1a1a] group-hover:bg-[#FD6412] transition-colors ${isResizingConsole ? 'bg-[#FD6412]' : ''}`} />
                      </div>

                      <div style={{ height: `${consoleHeight}px` }} className="border-t border-[#1a1a1a] bg-[#0a0a0a] flex flex-col shrink-0 overflow-hidden">
                        <div className="flex items-center h-10 px-4 border-b border-[#1a1a1a] space-x-6 relative">
                          <button 
                            onClick={() => setWebConsoleTab('console')}
                            className={`text-[11px] font-bold h-full pt-1.5 transition-colors ${webConsoleTab === 'console' ? 'text-white border-b-2 border-white' : 'text-[#404040] hover:text-white'}`}
                          >
                            Console
                          </button>
                          <button 
                            onClick={() => setWebConsoleTab('terminal')}
                            className={`text-[11px] font-bold h-full pt-1.5 transition-colors ${webConsoleTab === 'terminal' ? 'text-white border-b-2 border-white' : 'text-[#404040] hover:text-white'}`}
                          >
                            Terminal
                          </button>
                          <div className="flex-1" />
                          
                          {/* Filter and Action Buttons */}
                          <div className="flex items-center space-x-2.5">
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="Filter..." 
                                value={consoleFilter}
                                onChange={(e) => setConsoleFilter(e.target.value)}
                                className="text-[10px] text-white font-mono px-3 py-1 bg-[#141414] border border-[#262626] rounded-lg outline-none focus:border-[#404040] w-40 placeholder-[#404040]"
                              />
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button 
                                onClick={handleCopyLogs}
                                className="p-1.5 text-[#525252] hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                                title="Copy logs"
                              >
                                <Copy size={14} />
                              </button>
                              <button 
                                onClick={handleClearLogs}
                                className="p-1.5 text-[#525252] hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                                title="Clear logs"
                              >
                                <Trash2 size={14} />
                              </button>
                              <button 
                                onClick={() => setIsConsoleVisible(false)}
                                className="p-1.5 text-[#525252] hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                                title="Hide panel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 p-4 font-mono text-[11px] text-[#a3a3a3] space-y-1 overflow-auto chat-scroll bg-black/20">
                          {webConsoleTab === 'console' ? (
                            <>
                              {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                  <p key={log.id} className="leading-relaxed">
                                    <span className="text-[#404040] mr-2">{log.time}</span>
                                    {log.source && (
                                      <span className="bg-[#262626] px-1 rounded text-[9px] text-white font-bold mr-2 uppercase">{log.source}</span>
                                    )}
                                    <span className={`
                                      ${log.type === 'success' ? 'text-white' : ''}
                                      ${log.type === 'link' ? 'text-[#525252]' : ''}
                                      ${log.type === 'info' ? 'text-[#a3a3a3]' : ''}
                                    `}>
                                      {log.type === 'link' ? (
                                        <>
                                          {log.message.split('http')[0]}
                                          <span className="text-white underline cursor-pointer">http{log.message.split('http')[1]}</span>
                                        </>
                                      ) : (
                                        log.message
                                      )}
                                    </span>
                                  </p>
                                ))
                              ) : (
                                <p className="text-[#404040] italic">No logs found matching filter.</p>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col h-full">
                              <div ref={terminalScrollRef} className="flex-1 overflow-y-auto chat-scroll">
                                {terminalLines.length === 0 ? (
                                  <p className="text-[#525252] font-mono italic">Connecting to terminal...</p>
                                ) : (
                                  terminalLines.map((line, idx) => (
                                    <p key={idx} className="leading-relaxed whitespace-pre-wrap break-all">{line}</p>
                                  ))
                                )}
                              </div>
                              <div className="flex items-center border-t border-[#1a1a1a] mt-1 pt-1">
                                <span className="text-[#525252] mr-1">$</span>
                                <input
                                  ref={terminalInputRef}
                                  type="text"
                                  className="flex-1 bg-transparent text-[#e5e5e5] font-mono text-[11px] outline-none placeholder-[#404040]"
                                  placeholder="Type a command..."
                                  onKeyDown={handleTerminalInput}
                                  autoComplete="off"
                                  spellCheck={false}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Console Show Button (when hidden) */}
        {!isConsoleVisible && !isNative && activeTab !== 'profile' && activeTab !== 'preferences' && activeTab !== 'docs' && activeTab !== 'billing' && (
          <button 
            onClick={() => setIsConsoleVisible(true)}
            className="fixed bottom-4 right-4 bg-[#141414] border border-[#262626] p-2 rounded-lg text-[#737373] hover:text-white transition-all shadow-2xl z-[100]"
            title="Show Console"
          >
            <Layout size={18} />
          </button>
        )}
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        initialTab={settingsActiveTab}
      />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};

export default App;