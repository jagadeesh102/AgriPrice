import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Database, Cpu, TrendingUp, CheckCircle2, ArrowDown, ShieldAlert } from 'lucide-react';

export default function HowAiWorksPage() {
  const { t } = useLanguage();

  const pipelineSteps = [
    {
      step: '1. DATA INGESTION',
      title: 'AP Market & Weather Data Collection',
      desc: 'Daily prices, arrival volumes, rainfall, and temperature records are collected across Guntur, Duggirala, Vijayawada, Kurnool, Kadapa, and Anantapur.',
      icon: Database,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      step: '2. PREPROCESSING & LAG FEATURES',
      title: 'Time-Series Feature Extraction',
      desc: 'Computes 7-day rolling averages, 14-day price lag indicators, seasonal indices, and market arrival trend indicators.',
      icon: Cpu,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      step: '3. ML MODEL TRAINING',
      title: 'Random Forest / Gradient Boosting',
      desc: 'Machine learning regressor learns complex non-linear interactions between weather events, arrival surges, seasonal demand, and price spikes.',
      icon: Sparkles,
      color: 'bg-amber-100 text-amber-800'
    },
    {
      step: '4. PRICE FORECAST & CONFIDENCE BOUNDS',
      title: 'Multi-Horizon Price Range Prediction',
      desc: 'Predicts expected future price along with upper and lower confidence interval bounds (e.g. ₹19,200 - ₹20,800).',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      step: '5. AI RECOMMENDATION ENGINE',
      title: 'Sell / Wait / Partial Sell Decision Logic',
      desc: 'Translates raw price predictions into clear 🟢 SELL NOW, 🟡 WAIT, or 🔵 PARTIAL SELLING advice with rationale factors.',
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-800'
    }
  ];

  return (
    <div className="space-y-8 py-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Judge-Friendly AI Architecture
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">{t('howAiHeader')}</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          How AgriPrice AI transforms complex agricultural indicators into simple selling decisions.
        </p>
      </div>

      {/* VISUAL PIPELINE DIAGRAM */}
      <div className="max-w-3xl mx-auto space-y-4">
        {pipelineSteps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={idx}>
              <div className="agri-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-emerald-500 transition-colors">
                <div className={`p-4 rounded-2xl ${s.color} shrink-0`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-black text-emerald-700 tracking-wider uppercase">{s.step}</span>
                  <h3 className="font-extrabold text-base text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-5 h-5 text-emerald-600 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* RESPONSIBLE AI BANNER */}
      <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-300 rounded-2xl p-6 text-amber-900 space-y-2">
        <h4 className="font-bold text-sm flex items-center gap-2 text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          {t('disclaimerTitle')}
        </h4>
        <p className="text-xs text-amber-900/90 leading-relaxed">
          {t('disclaimerBody')}
        </p>
      </div>
    </div>
  );
}
