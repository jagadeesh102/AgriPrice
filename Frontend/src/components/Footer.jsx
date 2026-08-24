import React from 'react';
import { Sprout, ShieldAlert, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-emerald-950 text-slate-300 pt-12 pb-16 md:pb-8 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-emerald-900/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                AgriPrice <span className="text-amber-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 max-w-md leading-relaxed">
              AI-powered agricultural price forecasting and decision support platform engineered specifically for chilli and turmeric farmers in Andhra Pradesh.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 font-semibold bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-800 w-fit">
              <span>🌾 Guntur • Duggirala • Vijayawada • Kurnool • Kadapa • Anantapur</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3 text-emerald-300">Quick Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="/dashboard" className="hover:text-amber-400 transition-colors">Farmer Dashboard</a></li>
              <li><a href="/forecast" className="hover:text-amber-400 transition-colors">AI Price Forecast</a></li>
              <li><a href="/markets" className="hover:text-amber-400 transition-colors">AP Market Comparison</a></li>
              <li><a href="/calculator" className="hover:text-amber-400 transition-colors">Net Revenue Calculator</a></li>
              <li><a href="/how-ai-works" className="hover:text-amber-400 transition-colors">How AI Model Works</a></li>
            </ul>
          </div>

          {/* Responsible AI Disclaimer */}
          <div>
            <h5 className="font-bold text-amber-400 text-sm mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              {t('disclaimerTitle')}
            </h5>
            <p className="text-[11px] text-slate-400 leading-normal">
              {t('disclaimerBody')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgriPrice AI. Built for Andhra Pradesh Farmers.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Farmer's Decision Agen
          </p>
        </div>
      </div>
    </footer>
  );
}
