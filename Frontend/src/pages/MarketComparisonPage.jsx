import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import APMarketMap from '../components/APMarketMap';
import { Store, Award, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MarketComparisonPage() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('chilli');
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const data = await api.getMarketsSummary();
      setSummaryData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-7 h-7 text-emerald-600" />
            {t('marketCompHeader')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">{t('marketCompSub')}</p>
        </div>

        {/* CROP TOGGLE */}
        <div className="flex bg-slate-200 p-1 rounded-xl w-fit">
          <button
            onClick={() => setSelectedCrop('chilli')}
            className={`py-1.5 px-4 rounded-lg font-bold text-xs cursor-pointer transition-all ${
              selectedCrop === 'chilli' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-700'
            }`}
          >
            🌶️ Chilli
          </button>
          <button
            onClick={() => setSelectedCrop('turmeric')}
            className={`py-1.5 px-4 rounded-lg font-bold text-xs cursor-pointer transition-all ${
              selectedCrop === 'turmeric' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700'
            }`}
          >
            🌾 Turmeric
          </button>
        </div>
      </div>

      {/* HIGHLIGHT BADGES */}
      {summaryData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="agri-card p-6 border-l-4 border-l-emerald-600 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">{t('bestCurrentPrice')} ({selectedCrop.toUpperCase()})</span>
              <h3 className="text-xl font-black text-slate-900">
                {summaryData.best_current_price[selectedCrop].market}
              </h3>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                ₹{summaryData.best_current_price[selectedCrop].price.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ Quintal</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="agri-card p-6 border-l-4 border-l-amber-500 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">{t('bestForecastedPrice')} (15 Days)</span>
              <h3 className="text-xl font-black text-slate-900">
                {summaryData.best_forecasted_price[selectedCrop].market}
              </h3>
              <p className="text-2xl font-black text-amber-600 mt-1">
                ₹{summaryData.best_forecasted_price[selectedCrop].price.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ Quintal</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE AP MAP COMPONENT */}
      <APMarketMap markets={summaryData?.markets || []} selectedCrop={selectedCrop} />

      {/* COMPARISON TABLE */}
      <div className="agri-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">All Andhra Pradesh Mandis</h3>
          <span className="text-xs text-slate-500 font-medium">Sorted by Primary Trade Centers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <th className="p-4">{t('colMarket')}</th>
                <th className="p-4">{t('colChilli')}</th>
                <th className="p-4">{t('colTurmeric')}</th>
                <th className="p-4">{t('colTrend')}</th>
                <th className="p-4">{t('colDistance')}</th>
                <th className="p-4">{t('colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {summaryData?.markets.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>{m.name}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{m.type} ({m.district})</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-black text-red-700">₹{m.chilli_price.toLocaleString()}</td>
                  <td className="p-4 text-sm font-black text-amber-700">₹{m.turmeric_price.toLocaleString()}</td>
                  <td className="p-4">
                    {m.trend === 'up' ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">↑ Rising</span>
                    ) : m.trend === 'down' ? (
                      <span className="text-red-600 font-bold flex items-center gap-1">↓ Falling</span>
                    ) : (
                      <span className="text-slate-500 font-bold">→ Stable</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">{m.distance_km} km</td>
                  <td className="p-4">
                    <Link
                      to={`/forecast`}
                      className="inline-flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-3 py-1.5 rounded-lg transition-colors text-[11px]"
                    >
                      <span>Forecast</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
