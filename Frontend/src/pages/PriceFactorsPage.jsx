import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, TrendingDown, TrendingUp, Sun, CloudRain, PlaneTakeoff, Warehouse } from 'lucide-react';

export default function PriceFactorsPage() {
  const { t } = useLanguage();

  const factors = [
    {
      title: t('factorArrivals'),
      status: '↓ Decreasing in Guntur Mandi',
      impact: 'Positive (+)',
      impactColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
      icon: Warehouse,
      explanation: 'Lower market arrivals create supply tightness, supporting higher prices when domestic & export demand remains stable.'
    },
    {
      title: t('factorDemand'),
      status: '↑ High Export Demand',
      impact: 'Positive (+)',
      impactColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
      icon: PlaneTakeoff,
      explanation: 'Increased buying orders from Bangladesh, Sri Lanka, and Middle East for Teja Chilli varieties.'
    },
    {
      title: t('factorSeasonality'),
      status: 'Peak Demand Cycle',
      impact: 'Positive (+)',
      impactColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
      icon: Sun,
      explanation: 'Pre-festival stocking and masala processing season boosts wholesale purchases across AP markets.'
    },
    {
      title: t('factorWeather'),
      status: 'Isolated Rains Expected',
      impact: 'Neutral / Quality Risk',
      impactColor: 'text-amber-800 bg-amber-100 border-amber-300',
      icon: CloudRain,
      explanation: 'Rainfall may slow down open yard pod drying. Farmers with dry storage can command premium rates.'
    }
  ];

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-emerald-600" />
          {t('factorsHeader')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">{t('factorsSub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {factors.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="agri-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{f.title}</h3>
                    <span className="text-xs text-slate-500">{f.status}</span>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${f.impactColor}`}>
                  {f.impact}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {f.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
