import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  ChevronRight, 
  ArrowUp, 
  MessageCircle, 
  Copy, 
  ExternalLink,
  Menu,
  X,
  Zap,
  Layout,
  Code,
  Box,
  Globe,
  Twitter,
  Linkedin,
  FileText,
  ArrowLeft
} from 'lucide-react';

interface DocumentationViewProps {
  onBack?: () => void;
}

const HeftCoderLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect width="100" height="100" rx="24" fill="#FD6412"/>
    <path d="M52 18L28 54H46L42 82L72 46H54L64 18H52Z" fill="white"/>
  </svg>
);

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('what-is-heftcoder');

  const sidebarItems = [
    {
      title: 'Getting Started',
      items: [
        { id: 'what-is-heftcoder', label: 'What is HeftCoder?' },
        { id: 'agentic-features', label: 'Agentic Features' },
        { id: 'integration', label: 'HeftCoder Integration' },
        { id: 'quickstart', label: 'Quickstart' },
        { id: 'faqs', label: 'FAQs' },
      ]
    },
    {
      title: 'Prompt',
      items: [
        { id: 'text-prompting', label: 'Text Prompting' },
        { id: 'screenshots', label: 'Screenshots and Files' },
        { id: 'figma', label: 'Figma' },
      ]
    },
    {
      title: 'Iterate',
      items: [
        { id: 'code-editing', label: 'Code editing' },
        { id: 'design-mode', label: 'Design mode' },
        { id: 'design-systems', label: 'Design systems' },
        { id: 'images-videos', label: 'Images and videos' },
        { id: 'versions', label: 'Versions' },
      ]
    }
  ];

  const tocItems = [
    { id: 'what-can-you-do', label: 'What can you do with HeftCoder?' },
    { id: 'examples', label: 'Examples' },
    { id: 'who-is-it-for', label: 'Who is HeftCoder for?', sub: [
      { id: 'pm', label: 'Product Managers' },
      { id: 'designers', label: 'Designers' },
      { id: 'engineers', label: 'Engineers' },
      { id: 'data-scientists', label: 'Data Scientists' },
      { id: 'marketing', label: 'Marketing Teams' },
      { id: 'content', label: 'Content Creators' },
      { id: 'support', label: 'Customer Support' },
    ]},
  ];

  return (
    <div className="flex-1 bg-black text-[#a3a3a3] flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-6 bg-black z-50 shrink-0">
        <div className="flex items-center space-x-6">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-[10px] font-bold text-[#737373] hover:text-white transition-all uppercase tracking-widest bg-[#141414] border border-[#262626] px-2.5 py-1.5 rounded-lg group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onBack}>
            <HeftCoderLogo className="w-7 h-7" />
            <div className="h-4 w-px bg-[#262626]" />
            <span className="text-white font-bold text-lg tracking-tight">HeftCoder</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <span className="text-white border-b border-white pb-5 translate-y-2.5">Docs</span>
            <span className="hover:text-white transition-colors cursor-pointer">API</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252] group-hover:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg pl-9 pr-12 py-1.5 text-sm text-white focus:outline-none focus:border-[#404040] w-64 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 text-[10px] font-bold text-[#525252] border border-[#262626] rounded px-1 py-0.5">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] px-4 py-1.5 rounded-lg text-sm font-bold text-white transition-all">
            <MessageSquare size={16} />
            <span>Ask AI</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-[#1a1a1a] overflow-y-auto chat-scroll p-6 hidden lg:block">
          <div className="space-y-10">
            {sidebarItems.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">{section.title}</h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`text-sm py-1.5 px-3 rounded-lg cursor-pointer transition-all ${
                        activeSection === item.id 
                          ? 'text-white font-bold bg-[#111]' 
                          : 'hover:text-white'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto chat-scroll px-8 md:px-16 py-12 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="space-y-6">
              <h1 className="text-5xl font-extrabold text-white tracking-tighter">What is HeftCoder?</h1>
              <p className="text-xl text-[#d4d4d4] leading-relaxed">
                HeftCoder is an AI agent that helps anyone create real code and full-stack apps and agents.
              </p>
              <p className="text-lg text-[#a3a3a3] leading-relaxed">
                Ship features, refine designs, update copy, and create live prototypes, all with a prompt. Deploy to production immediately, or open a pull request for review.
              </p>
            </section>

            {/* Capabilities Section */}
            <section id="what-can-you-do" className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">What can you do with HeftCoder?</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">Describe your idea</span> in your preferred language.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">Create high-fidelity UIs</span> from your wireframes or mockups.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">Connect to backend</span> to build rich, data driven applications.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">Deploy with one click</span> to secure, scalable infrastructure powered by HeftCoder.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">Automatically fix errors</span> in your code with intelligent diagnostics.</span>
                </li>
              </ul>

              {/* Grid Links from Screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#262626] transition-all group cursor-pointer">
                  <h4 className="text-white font-bold mb-2">Getting Started</h4>
                  <p className="text-sm text-[#737373]">Quickstart tutorial to create your first project.</p>
                </div>
                <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#262626] transition-all group cursor-pointer">
                  <h4 className="text-white font-bold mb-2">Prompt Engineering</h4>
                  <p className="text-sm text-[#737373]">Build faster in HeftCoder with effective prompting.</p>
                </div>
                <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#262626] transition-all group cursor-pointer">
                  <h4 className="text-white font-bold mb-2">FAQs</h4>
                  <p className="text-sm text-[#737373]">Find commonly asked questions about HeftCoder.</p>
                </div>
                <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#262626] transition-all group cursor-pointer">
                  <h4 className="text-white font-bold mb-2">Blog</h4>
                  <p className="text-sm text-[#737373]">Stay up to date with new product features and announcements.</p>
                </div>
              </div>

              <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <Layout size={18} className="text-[#525252]" />
                  <span className="text-white font-bold text-sm">Why should I choose HeftCoder instead of other tools?</span>
                </div>
                <ChevronRight size={18} className="text-[#525252] group-hover:translate-x-1 transition-transform" />
              </div>
            </section>

            {/* Examples Section */}
            <section id="examples" className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Examples</h2>
              <p className="text-lg text-[#a3a3a3]">
                You can use HeftCoder to build anything, from landing pages, dashboards, ecommerce stores, AI apps, to full-stack applications.
              </p>
            </section>

            {/* Who is it for Section */}
            <section id="who-is-it-for" className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">Who is HeftCoder for?</h2>
                <p className="text-lg text-[#a3a3a3]">HeftCoder helps teams prototype, build, and ship faster. Here's how different roles are using it:</p>
              </div>

              <div id="pm" className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Product Managers</h3>
                <p className="text-lg text-[#a3a3a3]">Quickly prototype and iterate to align stakeholders, validate ideas early, and gather user feedback before using engineering resources.</p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2 text-[#d4d4d4] hover:text-white cursor-pointer group">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <span className="underline underline-offset-4 decoration-[#262626] group-hover:decoration-white transition-all">Draft project plans and timelines</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#d4d4d4] hover:text-white cursor-pointer group">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <span className="underline underline-offset-4 decoration-[#262626] group-hover:decoration-white transition-all">Generate user interview questions for researching new features</span>
                  </div>
                </div>
              </div>

              <div id="designers" className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Designers</h3>
                <p className="text-lg text-[#a3a3a3]">Turn mockups into real, high-fidelity user interfaces that reflect user flows and constraints.</p>
              </div>

              <div id="engineers" className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Engineers</h3>
                <p className="text-lg text-[#a3a3a3]">Quickly scaffold full-stack apps or components following best practices and modern standards. Focus on solving the harder problems while using HeftCoder as your AI pair programmer.</p>
              </div>

              <div id="data-scientists" className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Data Scientists</h3>
                <p className="text-lg text-[#a3a3a3]">Build and deploy data applications with HeftCoder. Work with Python and SQL to analyze data and create visualizations.</p>
              </div>
            </section>

            {/* Difference Section */}
            <section id="what-makes-different" className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">What makes HeftCoder different?</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">End-to-end Development:</span> Build both UI and backend logic, not just mockups.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">Works with your stack:</span> Use modern tools like Next.js, Tailwind, shadcn/ui, and more.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                  <span className="text-[#d4d4d4]"><span className="font-bold">Team-friendly:</span> Powers collaborative design, product, and engineering workflows.</span>
                </li>
              </ul>
            </section>

            {/* Footer */}
            <footer className="pt-24 pb-12 border-t border-[#1a1a1a]">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                <div className="col-span-full lg:col-span-1">
                  <HeftCoderLogo className="w-8 h-8 opacity-80" />
                </div>
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-white">Product</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="hover:text-white cursor-pointer transition-colors">Home</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Enterprise</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                    <li className="hover:text-white cursor-pointer transition-colors">HeftCoder for Students</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-white">Company</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center space-x-1 hover:text-white cursor-pointer transition-colors"><span>Terms</span> <ExternalLink size={10} /></li>
                    <li className="hover:text-white cursor-pointer transition-colors">AI Policy</li>
                    <li className="flex items-center space-x-1 hover:text-white cursor-pointer transition-colors"><span>Privacy</span> <ExternalLink size={10} /></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-white">Resources</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Docs</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Ambassadors</li>
                    <li className="flex items-center space-x-1 hover:text-white cursor-pointer transition-colors"><span>Community</span> <ExternalLink size={10} /></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-white">Social</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center space-x-2 hover:text-white cursor-pointer transition-colors"><Twitter size={14} /> <span>Twitter</span></li>
                    <li className="flex items-center space-x-2 hover:text-white cursor-pointer transition-colors"><Linkedin size={14} /> <span>LinkedIn</span></li>
                  </ul>
                </div>
              </div>
            </footer>
          </div>
        </main>

        {/* Right TOC Sidebar */}
        <aside className="w-72 border-l border-[#1a1a1a] hidden xl:flex flex-col p-8 overflow-y-auto chat-scroll space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <Menu size={14} />
              <span>On this page</span>
            </h4>
            <div className="space-y-3">
              {tocItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <a 
                    href={`#${item.id}`} 
                    className="text-xs hover:text-white transition-colors block leading-relaxed"
                  >
                    {item.label}
                  </a>
                  {item.sub && (
                    <div className="pl-4 space-y-2 border-l border-[#1a1a1a] ml-1">
                      {item.sub.map((sub) => (
                        <a 
                          key={sub.id} 
                          href={`#${sub.id}`} 
                          className="text-[11px] hover:text-white transition-colors block"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#1a1a1a]" />

          <div className="space-y-4">
            <TocAction icon={ArrowUp} label="Scroll to top" onClick={() => document.querySelector('main')?.scrollTo({top: 0, behavior: 'smooth'})} />
            <TocAction icon={MessageCircle} label="Give feedback" />
            <TocAction icon={Copy} label="Copy page" />
            <TocAction icon={MessageSquare} label="Ask AI about this page" />
            <TocAction icon={ExternalLink} label="Open in chat" />
          </div>
        </aside>
      </div>
    </div>
  );
};

const TocAction: React.FC<{ icon: any, label: string, onClick?: () => void }> = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-3 text-xs text-[#525252] hover:text-white transition-all group"
  >
    <Icon size={14} className="group-hover:scale-110 transition-transform" />
    <span className="font-medium">{label}</span>
  </button>
);