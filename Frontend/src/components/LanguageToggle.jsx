import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-sm font-semibold transition-all shadow-xs cursor-pointer"
      title="Switch Language / భాషను మార్చండి"
    >
      <Globe className="w-4 h-4 text-emerald-700" />
      <span>{lang === 'en' ? 'EN' : 'తెలుగు'}</span>
      <span className="text-xs text-emerald-600 font-normal">| {lang === 'en' ? 'తెలుగు' : 'EN'}</span>
    </button>
  );
}
