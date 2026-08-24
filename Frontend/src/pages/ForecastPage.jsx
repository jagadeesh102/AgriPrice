import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line } from 'recharts';
import { TrendingUp, ShieldAlert, Sparkles, HelpCircle, CheckCircle2, DollarSign, PieChart, ArrowUpRight } from 'lucide-react';

export default function ForecastPage() {
  const { t } = useLanguage();

  const [crop, setCrop] = useState('chilli');
  const [market, setMarket] = useState('Guntur');
  const [horizon, setHorizon] = useState(15);
  const [quantity, setQuantity] = useState(10);

  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    runForecast();
  }, [crop, market, horizon]);

  const runForecast = async () => {
    setLoading(true);
    try {
      const res = await api.getForecast(crop, market, parseInt(horizon), parseFloat(quantity));
      setForecast(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (rec) => {
    if (rec === 'WAIT') return 'agri-badge-wait text-base py-1.5 px-4';
    if (rec === 'PARTIAL_SELL') return 'agri-badge-partial text-base py-1.5 px-4';
    return 'agri-badge-sell text-base py-1.5 px-4';
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-emerald-600" />
          {t('forecastHeader')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">{t('forecastSub')}</p>
      </div>

      {/* INPUT FORM CARD */}
      <div className="agri-card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CROP SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Crop / పంట</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCrop('chilli')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border ${
                  crop === 'chilli' ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>🌶️ Chilli</span>
              </button>
              <button
                type="button"
                onClick={() => setCrop('turmeric')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border ${
                  crop === 'turmeric' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>🌾 Turmeric</span>
              </button>
            </div>
          </div>

          {/* MARKET SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t('labelMarket')}</label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Guntur">Guntur Mandi (గుంటూరు)</option>
              <option value="Duggirala">Duggirala Market (దుగ్గిరాల)</option>
              <option value="Vijayawada">Vijayawada Rythu Bazar (విజయవాడ)</option>
              <option value="Kurnool">Kurnool APMC (కర్నూలు)</option>
              <option value="Kadapa">Kadapa Mandi (కడప)</option>
              <option value="Anantapur">Anantapur Market (అనంతపురం)</option>
            </select>
          </div>

          {/* HORIZON SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t('labelHorizon')}</label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value={7}>7 Days (1 Week)</option>
              <option value={15}>15 Days (2 Weeks)</option>
              <option value={30}>30 Days (1 Month)</option>
              <option value={60}>60 Days (2 Months)</option>
              <option value={90}>90 Days (3 Months)</option>
            </select>
          </div>

          {/* QUANTITY INPUT */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">{t('labelQuantity')}</label>
            <input
              type="number"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* FORECAST RESULTS CONTAINER */}
      {loading ? (
        <div className="agri-card p-12 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">{t('loadingText')}</p>
        </div>
      ) : forecast ? (
        <div className="space-y-8">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="agri-card p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">{t('currentPriceCard')}</span>
              <div className="text-2xl font-black text-slate-900">₹{forecast.current_price.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500">Spot price in {forecast.market}</span>
            </div>

            <div className="agri-card p-5 space-y-1 border-emerald-500">
              <span className="text-xs text-emerald-700 font-bold uppercase">{t('predictedPriceCard')} ({forecast.forecast_days} Days)</span>
              <div className="text-2xl font-black text-emerald-700">₹{forecast.predicted_price.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{forecast.percentage_change}% Expected Change
              </span>
            </div>

            <div className="agri-card p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">{t('rangeLabel')}</span>
              <div className="text-lg font-extrabold text-slate-800">
                ₹{forecast.min_price.toLocaleString()} - ₹{forecast.max_price.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">Confidence Bounds</span>
            </div>

            <div className="agri-card p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">{t('confidenceScore')}</span>
              <div className="text-2xl font-black text-amber-600">{forecast.confidence_score}%</div>
              <span className="text-[11px] text-slate-500">Random Forest Model</span>
            </div>
          </div>

          {/* FORECAST VISUAL CHART */}
          <div className="agri-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {forecast.crop.toUpperCase()} Price Projection Trend ({forecast.market} Mandi)
                </h3>
                <p className="text-xs text-slate-500">
                  Solid green indicates past historical prices. Dashed amber indicates AI future price forecast.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <div className="w-3 h-3 bg-emerald-600 rounded-sm" /> Historical
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <div className="w-3 h-3 bg-amber-500 rounded-sm" /> Forecast
                </span>
              </div>
            </div>

            <div className="w-full h-80 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast.price_chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} unit="₹" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value) => [`₹${value?.toLocaleString()}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="historical_price" name="Historical Price" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorHist)" />
                  <Area type="monotone" dataKey="predicted_price" name="Predicted Price" stroke="#d97706" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECOMMENDATION ENGINE CARD */}
          <div className="agri-card p-6 md:p-8 space-y-6 border-l-4 border-l-amber-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  {t('recommendationTitle')}
                </span>
                <div className="flex items-center gap-3">
                  <div className={getBadgeStyle(forecast.recommendation)}>
                    {forecast.recommendation === 'WAIT' ? t('waitBadge') : forecast.recommendation === 'PARTIAL_SELL' ? t('partialSellBadge') : t('sellNowBadge')}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-right">
                <span className="text-xs text-amber-900 font-semibold block">{t('potentialAdditionalRevenue')}</span>
                <span className="text-2xl font-black text-amber-700">
                  +₹{forecast.potential_additional_revenue.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block">for {quantity} Quintals</span>
              </div>
            </div>

            {/* RATIONALE REASONS LIST */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                {t('whyTitle')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {forecast.recommendation_rationale.map((reason, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PARTIAL SELLING RECOMMENDATION MODULE */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <PieChart className="w-5 h-5" />
                <h4 className="font-extrabold text-base">{t('partialSellTitle')}</h4>
              </div>

              <p className="text-xs text-slate-300">
                Divide your harvest to lock in cash flow today while keeping upside exposure for future price peaks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-emerald-400 font-bold block">{t('sellNowSplit')} (40%)</span>
                  <span className="text-xl font-black text-white">{forecast.partial_sell_advice.sell_now_quintals} Quintals</span>
                  <span className="text-xs text-slate-400 block pt-1">
                    Spot Rev: ₹{forecast.partial_sell_advice.current_spot_revenue.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <span className="text-xs text-amber-400 font-bold block">{t('holdSplit')} (60%)</span>
                  <span className="text-xl font-black text-white">{forecast.partial_sell_advice.hold_quintals} Quintals</span>
                  <span className="text-xs text-slate-400 block pt-1">
                    Future Est: ₹{forecast.partial_sell_advice.estimated_future_revenue.toLocaleString()}
                  </span>
                </div>

                <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-600/40">
                  <span className="text-xs text-amber-300 font-bold block">{t('totalProjectedRevenue')}</span>
                  <span className="text-xl font-black text-amber-400">₹{forecast.partial_sell_advice.total_projected_revenue.toLocaleString()}</span>
                  <span className="text-xs text-emerald-300 block pt-1">Combined Outcome</span>
                </div>
              </div>
            </div>

            {/* RESPONSIBLE AI DISCLAIMER BANNER */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>{t('disclaimerTitle')}:</strong> {forecast.disclaimer}
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
