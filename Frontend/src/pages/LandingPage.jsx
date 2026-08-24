import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, TrendingUp, BarChart3, ShieldCheck, ArrowRight, Zap, CheckCircle2, AlertTriangle, Sparkles, MapPin, Calculator, CloudSun } from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();
  const { triggerJudgeDemo } = useAuth();

  return (
    <div className="space-y-16 py-8">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 md:p-14 border border-emerald-800 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 text-amber-300 border border-emerald-600/50 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Price Forecasting Platform for Andhra Pradesh Farmers</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/forecast" className="agri-btn-primary py-3.5 px-6 text-sm">
                <TrendingUp className="w-5 h-5 text-amber-300" />
                <span>{t('btnViewForecast')}</span>
              </Link>
              
              <Link to="/markets" className="agri-btn-secondary py-3.5 px-6 text-sm bg-white/10 text-white hover:bg-white/20 border-white/20">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>{t('btnCheckPrices')}</span>
              </Link>
            </div>

            {/* Impact Metric Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-800/80">
              <div>
                <span className="text-2xl font-black text-amber-400">100%</span>
                <p className="text-xs text-slate-300">AP Market Coverage</p>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400">90 Days</span>
                <p className="text-xs text-slate-300">Forecast Horizon</p>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-400">86.5%</span>
                <p className="text-xs text-slate-300">ML Model R² Score</p>
              </div>
            </div>
          </div>

          {/* HERO DASHBOARD PREVIEW CARD */}
          <div className="lg:col-span-5">
            <div className="agri-card-glass p-6 rounded-2xl relative shadow-2xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌶️</span>
                  <div>
                    <h4 className="font-bold text-white text-base">Guntur Chilli Mandi</h4>
                    <span className="text-[11px] text-emerald-400 font-medium">Teja Red Chilli • 10 Quintals</span>
                  </div>
                </div>
                <span className="bg-amber-500 text-slate-950 font-extrabold px-2.5 py-1 rounded-full text-xs animate-pulse">
                  🟡 WAIT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
                  <span className="text-[11px] text-slate-300 block">CURRENT PRICE</span>
                  <span className="text-xl font-black text-white">₹18,500</span>
                  <span className="text-[10px] text-slate-400 block">per quintal</span>
                </div>
                <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
                  <span className="text-[11px] text-amber-300 block">PREDICTED (15 DAYS)</span>
                  <span className="text-xl font-black text-amber-400">₹20,050</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">+8.4% Expected</span>
                </div>
              </div>

              <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
                <span className="text-amber-200">Potential Additional Revenue:</span>
                <span className="font-black text-amber-400 text-sm">₹15,500</span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Model Confidence: <strong className="text-emerald-300">86%</strong></span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> APMC Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="agri-card p-8 border-l-4 border-l-amber-500 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{t('problemTitle')}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{t('problemSub')}</p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('problemPoint1')}</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('problemPoint2')}</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t('problemPoint3')}</li>
          </ul>
        </div>

        <div className="agri-card p-8 border-l-4 border-l-emerald-600 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{t('solutionTitle')}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{t('solutionSub')}</p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI ML Random Forest model trained on AP market history.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bilingual Telugu + English decision interface.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Clear Sell Now vs Wait vs Partial Selling recommendations.</li>
          </ul>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Comprehensive Decision Support Tools</h2>
          <p className="text-sm text-slate-600">Everything chilli and turmeric farmers need to maximize harvest returns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="agri-card p-6 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">{t('feature1Title')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature1Desc')}</p>
          </div>

          <div className="agri-card p-6 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">{t('feature2Title')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature2Desc')}</p>
          </div>

          <div className="agri-card p-6 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">{t('feature3Title')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature3Desc')}</p>
          </div>

          <div className="agri-card p-6 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">{t('feature4Title')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature4Desc')}</p>
          </div>

          <div className="agri-card p-6 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">{t('feature5Title')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature5Desc')}</p>
          </div>

          <div className="agri-card p-6 space-y-3 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">{t('feature6Title')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature6Desc')}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS WORKFLOW */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-400">{t('howItWorksTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-300">Simple 5-step workflow designed for zero tech complexity.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">1</div>
            <h5 className="font-bold text-xs text-emerald-300">{t('step1Title')}</h5>
            <p className="text-[11px] text-slate-400">{t('step1Desc')}</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">2</div>
            <h5 className="font-bold text-xs text-emerald-300">{t('step2Title')}</h5>
            <p className="text-[11px] text-slate-400">{t('step2Desc')}</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">3</div>
            <h5 className="font-bold text-xs text-emerald-300">{t('step3Title')}</h5>
            <p className="text-[11px] text-slate-400">{t('step3Desc')}</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">4</div>
            <h5 className="font-bold text-xs text-emerald-300">{t('step4Title')}</h5>
            <p className="text-[11px] text-slate-400">{t('step4Desc')}</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">5</div>
            <h5 className="font-bold text-xs text-amber-300">{t('step5Title')}</h5>
            <p className="text-[11px] text-slate-400">{t('step5Desc')}</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black">Ready to test AgriPrice AI?</h2>
        <p className="text-sm text-emerald-100 max-w-lg mx-auto">
          Start exploring price forecasts for Chilli in Guntur or Turmeric in Duggirala right now.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link to="/forecast" className="agri-btn-secondary bg-white text-emerald-900 border-none hover:bg-slate-100">
            <span>Launch AI Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
