
import React from 'react';
import { Globe, ChevronDown, Layout, Sidebar as SidebarIcon, ArrowLeft } from 'lucide-react';

interface ProfileViewProps {
  onBack?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  // Mock data for activity heatmap (7 rows for days, many columns for weeks)
  const rows = 7;
  const columns = 53; // Slightly more for better coverage
  const activityData = Array.from({ length: rows * columns }).map(() => Math.random());

  return (
    <div className="flex-1 bg-black text-white p-10 flex flex-col overflow-y-auto chat-scroll animate-in fade-in duration-500">
      {/* Top Navigation Row */}
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

      <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto w-full">
        {/* Left Column: Profile Info */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col space-y-8">
          <div className="space-y-6">
            {/* Profile Avatar with vibrant gradient */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#38bdf8] via-[#818cf8] to-[#c084fc] shadow-[0_0_30px_rgba(56,189,248,0.15)]" />
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">klaushart49-9661</h1>
              <p className="text-[15px] text-[#737373]">@klaushart49-9661</p>
            </div>
          </div>

          <div className="h-px bg-[#1a1a1a] w-full" />

          <div className="flex items-center justify-between text-[15px]">
            <span className="text-[#a3a3a3] font-medium">Total prompts</span>
            <span className="font-bold text-white">86</span>
          </div>

          <div className="space-y-3 pt-4">
            <ProfileButton label="Edit Profile" />
            <ProfileButton label="Set Profile to Private" />
            <ProfileButton label="2025 VibeCheck" />
          </div>
        </div>

        {/* Right Column: Activity & Showcase */}
        <div className="flex-1 space-y-16">
          {/* Activity Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold tracking-wide">Activity</h2>
              <button className="flex items-center space-x-2 text-xs font-bold text-[#737373] hover:text-white transition-colors uppercase tracking-widest">
                <span>Last 12 months</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Heatmap Container precisely styled as requested */}
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 shadow-inner">
              <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                {activityData.map((val, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-[1px] transition-colors duration-500 ${
                      val > 0.96 ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 
                      val > 0.9 ? 'bg-[#737373]' : 
                      'bg-[#141414]'
                    }`}
                    style={{ minWidth: '10px' }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Showcase Section */}
          <section className="space-y-6">
            <h2 className="text-[15px] font-bold tracking-wide">Showcase</h2>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl h-80 flex flex-col items-center justify-center space-y-6 text-center px-12 group hover:border-[#262626] transition-colors shadow-inner">
              <div className="w-14 h-14 rounded-xl border border-[#1a1a1a] flex items-center justify-center text-[#404040] group-hover:text-[#a3a3a3] transition-colors bg-[#080808]">
                <Globe size={28} strokeWidth={1.5} />
              </div>
              <p className="text-[15px] text-[#525252] font-semibold tracking-tight">No community submissions to display</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ProfileButton: React.FC<{ label: string }> = ({ label }) => (
  <button className="w-full py-2.5 border border-[#1a1a1a] rounded-xl text-sm font-bold text-white hover:bg-[#111] hover:border-[#333] transition-all shadow-sm active:scale-95">
    {label}
  </button>
);
