
import React, { useState, useEffect } from 'react';
import { 
  Sidebar as SidebarIcon, 
  ArrowLeft, 
  CreditCard, 
  Info, 
  ExternalLink, 
  AlertCircle
} from 'lucide-react';
import { supabase, subscribeToCredits } from '../services/supabase';

interface BillingViewProps {
  onBack?: () => void;
  userId?: string;
  initialCredits?: number;
  username?: string;
}

export const BillingView: React.FC<BillingViewProps> = ({ 
  onBack, 
  userId = 'default-user',
  initialCredits = 17.93,
  username = "klaushart49-9661"
}) => {
  const [credits, setCredits] = useState(initialCredits);
  const [studentEmail, setStudentEmail] = useState('shadcn@vercel.edu');

  // Hard-wiring Supabase to take over and update credits
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

  const handleViewPlans = () => {
    window.location.href = 'https://app.heftcoder.icu/pricing';
  };

  return (
    <div className="flex-1 bg-black text-white p-10 flex flex-col overflow-y-auto chat-scroll animate-in fade-in duration-500">
      {/* Header Navigation */}
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

      <div className="max-w-3xl mx-auto w-full space-y-12 pb-20">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>

        {/* Current Plan Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-[#737373] uppercase tracking-wider">Current Plan</h2>
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-6 flex items-center justify-between shadow-lg group hover:border-[#262626] transition-all">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold">Operator Plan</h3>
                <span className="text-[#737373] font-medium text-sm">$25/mo</span>
              </div>
              <p className="text-xs text-[#737373]">Renews on Mar 3, 2026</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleViewPlans}
                className="px-4 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all"
              >
                View Plans
              </button>
              <button className="px-4 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all">
                Cancel Plan
              </button>
            </div>
          </div>
        </section>

        {/* Credit Balance Section */}
        <section className="space-y-4">
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1a1a1a]">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold">Credit Balance</h3>
                  <p className="text-xs text-[#737373]">
                    Your monthly credits reset in <span className="text-white font-bold">25 days</span>. Credits with the earliest expiration date are used first.
                  </p>
                </div>
                <button className="px-4 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all">
                  Buy Credits
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center pt-2">
                {/* Visual Credit Card */}
                <div className="w-64 h-40 bg-[#121212] border border-[#262626] rounded-2xl relative p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.4)] group overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors" />
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-md bg-[#222] border border-[#333] flex items-center justify-center">
                       <div className="grid grid-cols-2 gap-0.5 opacity-50">
                         <div className="w-2 h-1 bg-[#444] rounded-sm" />
                         <div className="w-2 h-1 bg-[#444] rounded-sm" />
                         <div className="w-2 h-1 bg-[#444] rounded-sm" />
                         <div className="w-2 h-1 bg-[#444] rounded-sm" />
                       </div>
                    </div>
                  </div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-3xl font-bold tracking-tight">${credits.toFixed(2)}</p>
                    <p className="text-[10px] font-mono text-[#525252] tracking-wider uppercase">{username}</p>
                  </div>
                </div>

                {/* Credit Breakdown */}
                <div className="flex-1 w-full space-y-3">
                  <BreakdownItem label="Gifted Credits" value="$10.00" />
                  <BreakdownItem label="Monthly Credits" value="$0.00 / $25.00" bg />
                  <BreakdownItem label="Purchased Credits" value={`$${(credits - 10).toFixed(2)}`} />
                  <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Total Available Credits</span>
                    <span className="text-sm font-bold text-white">${credits.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-recharge footer */}
            <div className="bg-[#0a0a0a] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle size={16} className="text-[#525252]" />
                <p className="text-xs text-[#737373]">
                  <span className="text-white font-bold">Auto-recharge is not enabled.</span> Enable to automatically add credits when your balance is low.
                </p>
              </div>
              <button className="px-4 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all">
                Enable
              </button>
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-[#737373] uppercase tracking-wider">Payment Method</h2>
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-5 flex items-center justify-between group hover:border-[#262626] transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-[#141414] border border-[#1a1a1a] flex items-center justify-center text-[#525252]">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">No payment method added</h4>
                <p className="text-xs text-[#737373]">Add a payment method to your HeftCoder account.</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all">
              Add Card
            </button>
          </div>
        </section>

        {/* Usage Code Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-[#737373] uppercase tracking-wider">Usage Code</h2>
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-5 flex items-center justify-between group hover:border-[#262626] transition-all">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Redeem a Usage Code</h4>
              <p className="text-xs text-[#737373]">Redeem a usage code to claim your gifted credits.</p>
            </div>
            <button className="px-4 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all">
              Redeem Code
            </button>
          </div>
        </section>

        {/* Student Verification Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-[#737373] uppercase tracking-wider">Student Verification</h2>
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-5 space-y-4 group hover:border-[#262626] transition-all">
            <h4 className="text-sm font-bold text-white">Verify your student email to unlock HeftCoder Premium benefits</h4>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input 
                  type="email" 
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-2 text-sm text-[#737373] focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <button className="px-4 py-2 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-[#404040] cursor-not-allowed transition-all">
                Verify Email
              </button>
            </div>
          </div>
        </section>

        {/* Invoices Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-[#737373] uppercase tracking-wider">Invoices</h2>
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-5 flex items-center justify-between group hover:border-[#262626] transition-all">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Invoices</h4>
              <p className="text-xs text-[#737373]">Your invoices are managed on the HeftCoder dashboard.</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-1.5 bg-[#141414] border border-[#262626] rounded-lg text-xs font-bold text-white hover:bg-[#1a1a1a] transition-all group">
              <span>Dashboard</span>
              <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const BreakdownItem: React.FC<{ label: string; value: string; bg?: boolean }> = ({ label, value, bg }) => (
  <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg ${bg ? 'bg-[#121212]' : ''}`}>
    <div className="flex items-center space-x-2">
      <span className="text-[11px] font-medium text-[#737373]">{label}</span>
      <Info size={10} className="text-[#404040]" />
    </div>
    <span className="text-xs font-bold text-white">{value}</span>
  </div>
);
