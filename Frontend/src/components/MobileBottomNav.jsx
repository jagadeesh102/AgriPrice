import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, TrendingUp, Bell, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/markets', label: 'Markets', icon: Store },
    { path: '/forecast', label: 'Forecast', icon: TrendingUp },
    { path: '/notifications', label: 'Alerts', icon: Bell },
    { path: '/dashboard', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isActive
                ? 'text-emerald-700 font-bold bg-emerald-50 scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
