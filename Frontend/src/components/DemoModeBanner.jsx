import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Award } from 'lucide-react';

export default function DemoModeBanner() {
  const { user, triggerJudgeDemo } = useAuth();

  if (user && user.is_demo_mode) {
    return (
      <div className="bg-amber-500 text-slate-950 font-medium text-xs md:text-sm py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
        <Award className="w-4 h-4 shrink-0" />
        <span><strong>DEMO MODE ON:</strong> Pre-loaded as Jagadeesh (10 Quintals Chilli, Guntur Mandi).</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-900 text-white text-xs md:text-sm py-1.5 px-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
        <span><strong>What is it?</strong> Experience instant AI price prediction & recommendation flow.</span>
      </div>
      <button
        onClick={triggerJudgeDemo}
        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
      >
        <span>⚡ 1-Click Demo</span>
      </button>
    </div>
  );
}
