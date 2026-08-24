import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';
import { Sprout, TrendingUp, BarChart3, Calculator, CloudSun, Shield, LogIn, LogOut, Menu, X, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar() {
  const { t } = useLanguage();
  const { user, logoutUser, triggerJudgeDemo } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('navHome'), icon: Sprout },
    { path: '/dashboard', label: t('navDashboard'), icon: BarChart3 },
    { path: '/forecast', label: t('navForecast'), icon: TrendingUp },
    { path: '/markets', label: t('navMarkets'), icon: Sprout },
    { path: '/calculator', label: t('navCalculator'), icon: Calculator },
    { path: '/weather', label: t('navWeather'), icon: CloudSun },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">
                AgriPrice <span className="text-amber-600 font-black">AI</span>
              </span>
              <span className="block text-[10px] text-emerald-700 font-semibold tracking-wider uppercase -mt-1">
                Andhra Pradesh
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-100 text-emerald-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />

            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="agri-btn-secondary py-2 px-4 text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('navLogin')}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={logoutUser}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-700" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {!user ? (
              <>
                <button
                  onClick={() => {
                    triggerJudgeDemo();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>1-Click Judge Demo</span>
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="agri-btn-secondary w-full justify-center py-2 text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('navLogin')}</span>
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('navLogout')} ({user.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
