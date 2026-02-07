
import React from 'react';
import { Info, Plus, ExternalLink } from 'lucide-react';

interface IntegrationCardProps {
  name: string;
  category: string;
  icon: React.ReactNode;
  actionLabel: string;
  isInstalled?: boolean;
}

const HeftCoderLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect width="100" height="100" rx="24" fill="#FD6412"/>
    <path d="M52 18L28 54H46L42 82L72 46H54L64 18H52Z" fill="white"/>
  </svg>
);

const IntegrationCard: React.FC<IntegrationCardProps> = ({ name, category, icon, actionLabel, isInstalled }) => (
  <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-4 flex flex-col h-full hover:border-[#262626] transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#141414] border border-[#262626]">
        {icon}
      </div>
      <Info size={14} className="text-[#525252] cursor-help" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-bold text-white truncate">{name}</h3>
      <p className="text-[11px] text-[#737373] mt-0.5">{category}</p>
    </div>
    <button className={`mt-4 w-full py-1.5 rounded-lg text-xs font-bold border transition-colors ${
      isInstalled 
        ? 'border-[#262626] text-white hover:bg-[#1a1a1a]' 
        : 'border-[#262626] text-white hover:bg-[#1a1a1a]'
    }`}>
      {actionLabel}
    </button>
  </div>
);

export const IntegrationsPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-[#1a1a1a]">
        <span className="text-sm font-semibold text-white">Integrations</span>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-8">
        {/* Managed Section */}
        <section>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-4 flex flex-col hover:border-[#262626] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                   <HeftCoderLogo className="w-10 h-10 rounded-full" />
                </div>
                <Info size={14} className="text-[#525252]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">HeftCoder AI Gateway</h3>
              <p className="text-[11px] text-[#737373]">AI</p>
              <button className="mt-4 w-full py-1.5 border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-colors">
                Install
              </button>
            </div>
          </div>
        </section>

        <div className="h-px bg-[#1a1a1a] w-full" />

        {/* All Integrations Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-sm font-bold text-white">All Integrations</h2>
            <Info size={12} className="text-[#525252]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <IntegrationCard 
              name="Upstash Search" 
              category="AI" 
              icon={<div className="w-6 h-6 rounded-full bg-[#fcd34d] flex items-center justify-center text-black font-bold">O</div>} 
              actionLabel="Install" 
            />
            <IntegrationCard 
              name="Upstash for Re..." 
              category="Database" 
              icon={<div className="grid grid-cols-2 gap-0.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-full"/><div className="w-2.5 h-2.5 bg-red-500 rounded-sm"/><div className="w-2.5 h-2.5 bg-red-500 rounded-sm"/><div className="w-2.5 h-2.5 bg-red-500 rounded-full"/></div>} 
              actionLabel="Install" 
            />
            <IntegrationCard 
              name="Neon" 
              category="Database" 
              icon={<div className="w-6 h-6 border-2 border-[#00e599] rounded rotate-45 flex items-center justify-center"><div className="w-3 h-3 bg-[#00e599] -rotate-45"/></div>} 
              actionLabel="Install" 
            />
            <IntegrationCard 
              name="Supabase" 
              category="Database" 
              icon={<svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#3ecf8e]"><path d="M21.362 9.354H12V.396L2.638 14.646H12v8.958z"/></svg>} 
              actionLabel="Install" 
            />
          </div>
        </section>
      </div>
    </div>
  );
};
