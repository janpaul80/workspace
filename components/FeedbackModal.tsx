
import React, { useState } from 'react';
import { Frown, Meh, Smile, X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [mood, setMood] = useState<'sad' | 'neutral' | 'happy' | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl p-6 flex flex-col space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Give feedback</h2>
          <p className="text-sm text-[#737373] leading-relaxed">
            We’d love to hear what went well or how we can improve the product experience.
          </p>
        </div>

        <div className="relative">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback"
            className="w-full h-32 bg-[#050505] border border-[#1a1a1a] rounded-lg p-4 text-sm text-white placeholder-[#404040] focus:outline-none focus:border-[#404040] transition-colors resize-none shadow-inner"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {[
              { id: 'sad', icon: Frown },
              { id: 'neutral', icon: Meh },
              { id: 'happy', icon: Smile }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMood(item.id as any)}
                className={`p-2 rounded-lg border transition-all ${
                  mood === item.id 
                    ? 'bg-[#1a1a1a] border-white text-white shadow-lg' 
                    : 'bg-transparent border-[#1a1a1a] text-[#525252] hover:text-white hover:border-[#262626]'
                }`}
              >
                <item.icon size={20} />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-[#262626] text-sm font-bold text-white hover:bg-[#1a1a1a] transition-colors"
            >
              Cancel
            </button>
            <button 
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                feedback.trim() 
                  ? 'bg-white text-black hover:bg-[#e5e5e5]' 
                  : 'bg-[#1a1a1a] text-[#525252] cursor-not-allowed border border-[#262626]'
              }`}
              disabled={!feedback.trim()}
              onClick={() => {
                // Here you would typically send the feedback
                onClose();
              }}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1a1a1a]">
          <p className="text-xs text-[#737373]">
            Need assistance? <a href="#" className="text-blue-500 hover:underline">Submit a support case</a> for help with your account or technical issues.
          </p>
        </div>
      </div>
    </div>
  );
};
