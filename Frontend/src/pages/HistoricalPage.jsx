import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Calendar, ShieldCheck, MapPin } from 'lucide-react';

const AP_MARKETS = [
  { value: "", label: "All AP Markets Combined" },
  { value: "Guntur", label: "Guntur Mandi (గుంటూరు)" },
  { value: "Duggirala", label: "Duggirala Market (దుగ్గిరాల)" },
  { value: "Vijayawada", label: "Vijayawada Rythu Bazar (విజయవాడ)" },
  { value: "Kurnool", label: "Kurnool APMC (కర్నూలు)" },
  { value: "Kadapa", label: "Kadapa Agri Market (కడప)" },
  { value: "Anantapur", label: "Anantapur Market (అనంతపురం)" }
];

export default function HistoricalPage() {
  const { t } = useLanguage();
  const [crop, setCrop] = useState('chilli');
  const [market, setMarket] = useState('');
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, [crop, market, days]);

  const loadData = async () => {
    try {
      const res = await api.getHistoricalPrices(crop, market, days);
      setData(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-emerald-600" />
          {t('historicalHeader')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">{t('historicalSub')}</p>
      </div>

      <div className="agri-card p-4 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-emerald-600">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCrop('chilli')}
            className={`py-2 px-4 rounded-xl font-bold text-xs cursor-pointer ${
              crop === 'chilli' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            🌶️ Chilli
          </button>
          <button
            onClick={() => setCrop('turmeric')}
            className={`py-2 px-4 rounded-xl font-bold text-xs cursor-pointer ${
              crop === 'turmeric' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}
          >
            🌾 Turmeric
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* LOCATION SELECTOR */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <label className="text-xs font-bold text-slate-700">Location:</label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-800"
            >
              {AP_MARKETS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* TIME RANGE */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-600" />
            <label className="text-xs font-bold text-slate-700">Range:</label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-800"
            >
              <option value={15}>15 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="agri-card p-4">
              <span className="text-xs text-slate-500 font-bold block">HIGHEST PRICE</span>
              <span className="text-xl font-black text-emerald-700">₹{data.statistics.highest_price.toLocaleString()}</span>
            </div>
            <div className="agri-card p-4">
              <span className="text-xs text-slate-500 font-bold block">LOWEST PRICE</span>
              <span className="text-xl font-black text-slate-800">₹{data.statistics.lowest_price.toLocaleString()}</span>
            </div>
            <div className="agri-card p-4">
              <span className="text-xs text-slate-500 font-bold block">AVERAGE PRICE</span>
              <span className="text-xl font-black text-blue-700">₹{data.statistics.average_price.toLocaleString()}</span>
            </div>
            <div className="agri-card p-4">
              <span className="text-xs text-slate-500 font-bold block">VOLATILITY</span>
              <span className="text-xl font-black text-amber-600">{data.statistics.volatility}</span>
            </div>
          </div>

          <div className="agri-card p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              {crop.toUpperCase()} Historical Daily Spot Trend ({data.market}) - {days} Days
            </h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.records}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} unit="₹" />
                  <Tooltip formatter={(val) => [`₹${val}`, 'Price']} />
                  <Line type="monotone" dataKey="price" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
