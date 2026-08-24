import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sprout, TrendingUp, BarChart3, MapPin, Calculator, ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw, CloudSun } from 'lucide-react';

const AP_MARKETS_LIST = [
  { id: "Guntur", name: "Guntur Mandi", district: "Guntur" },
  { id: "Duggirala", name: "Duggirala Market", district: "Guntur" },
  { id: "Vijayawada", name: "Vijayawada Rythu Bazar", district: "NTR" },
  { id: "Kurnool", name: "Kurnool APMC Mandi", district: "Kurnool" },
  { id: "Kadapa", name: "Kadapa Agri Market", district: "YSR Kadapa" },
  { id: "Anantapur", name: "Anantapur Market", district: "Anantapur" }
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [selectedCrop, setSelectedCrop] = useState(user?.primary_crop || 'chilli');
  const [selectedMarket, setSelectedMarket] = useState('Guntur');
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [selectedCrop, selectedMarket]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const selectedM = AP_MARKETS_LIST.find(m => m.id === selectedMarket) || AP_MARKETS_LIST[0];
      const [spot, forecast, weather] = await Promise.all([
        api.getCurrentPrice(selectedCrop, selectedMarket),
        api.getForecast(selectedCrop, selectedMarket, 15, 10.0),
        api.getWeather(selectedM.district)
      ]);
      setCurrentData(spot);
      setForecastData(forecast);
      setWeatherData(weather);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationBadge = (rec) => {
    if (rec === 'WAIT') {
      return <span className="agri-badge-wait text-sm">{t('waitBadge')}</span>;
    }
    if (rec === 'PARTIAL_SELL') {
      return <span className="agri-badge-partial text-sm">{t('partialSellBadge')}</span>;
    }
    return <span className="agri-badge-sell text-sm">{t('sellNowBadge')}</span>;
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* TOP GREETING HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-green-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold uppercase tracking-wider block mb-1">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Active Mandi Location: {selectedMarket}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t('welcomeGreeting')}, {user ? user.name : 'Farmer'}!
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Real-time market insights & AI price decision support for your harvest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="p-2.5 bg-emerald-800 hover:bg-emerald-700 rounded-xl text-emerald-200 border border-emerald-700 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/forecast" className="agri-btn-primary text-xs py-2.5 px-4 bg-amber-400 text-slate-950 hover:bg-amber-300">
            <TrendingUp className="w-4 h-4" />
            <span>Full AI Forecast</span>
          </Link>
        </div>
      </div>

      {/* QUICK SELECTOR BAR: CROP & LOCATION */}
      <div className="agri-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-emerald-600">
        
        {/* LOCATION / MARKET SELECTOR */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wider whitespace-nowrap">Location Mandi:</span>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full md:w-64 bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
          >
            {AP_MARKETS_LIST.map((m) => (
              <option key={m.id} value={m.id}>
                📍 {m.name} ({m.district})
              </option>
            ))}
          </select>
        </div>

        {/* CROP TOGGLE */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{t('selectCropHeader')}:</span>
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCrop('chilli')}
              className={`py-2 px-5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedCrop === 'chilli'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🌶️</span>
              <span>{t('chilliLabel')}</span>
            </button>

            <button
              onClick={() => setSelectedCrop('turmeric')}
              className={`py-2 px-5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedCrop === 'turmeric'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🌾</span>
              <span>{t('turmericLabel')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 MAIN INDICATOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CURRENT PRICE */}
        <div className="agri-card p-6 border-l-4 border-l-emerald-600 space-y-2">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('currentPriceCard')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">
              ₹{currentData ? currentData.current_price.toLocaleString() : '18,500'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{t('perQuintal')} ({selectedMarket})</p>
        </div>

        {/* PREDICTED PRICE */}
        <div className="agri-card p-6 border-l-4 border-l-amber-500 space-y-2">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('predictedPriceCard')} (15 Days)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-600">
              ₹{forecastData ? forecastData.predicted_price.toLocaleString() : '20,050'}
            </span>
          </div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> Range: ₹{forecastData?.min_price?.toLocaleString()} - ₹{forecastData?.max_price?.toLocaleString()}
          </p>
        </div>

        {/* EXPECTED CHANGE */}
        <div className="agri-card p-6 border-l-4 border-l-blue-600 space-y-2">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('expectedChangeCard')}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              +{forecastData ? forecastData.percentage_change : '8.4'}%
            </span>
          </div>
          <p className="text-xs text-slate-500">Based on ML Model Prediction</p>
        </div>

        {/* AI RECOMMENDATION */}
        <div className="agri-card p-6 border-l-4 border-l-emerald-700 space-y-2">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('recommendationCard')}</span>
          <div className="pt-1">
            {getRecommendationBadge(forecastData?.recommendation || 'WAIT')}
          </div>
          <p className="text-xs text-amber-700 font-semibold pt-1">
            +{forecastData?.potential_additional_revenue ? `₹${forecastData.potential_additional_revenue.toLocaleString()} Extra Revenue` : '₹15,500 Extra'}
          </p>
        </div>
      </div>

      {/* QUICK SHORTCUTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/forecast" className="agri-card p-6 hover:border-emerald-500 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">Run Advanced Forecast</h4>
          <p className="text-xs text-slate-500">Select 7 to 90 days horizon and input custom harvest quintals for {selectedMarket}.</p>
        </Link>

        <Link to="/markets" className="agri-card p-6 hover:border-emerald-500 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">Compare AP Markets</h4>
          <p className="text-xs text-slate-500">Compare prices across Guntur, Duggirala, Vijayawada, Kurnool, Kadapa, and Anantapur mandis.</p>
        </Link>

        <Link to="/calculator" className="agri-card p-6 hover:border-emerald-500 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">Net Revenue Calculator</h4>
          <p className="text-xs text-slate-500">Calculate net profit after transport and holding storage fees.</p>
        </Link>
      </div>

      {/* WEATHER SUMMARY WIDGET FOR SELECTED LOCATION */}
      <div className="agri-card p-6 bg-gradient-to-r from-sky-900 to-slate-900 text-white border-sky-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-800/60 rounded-2xl border border-sky-700">
            <CloudSun className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-base text-sky-100">
              {weatherData?.district || selectedMarket} District Weather Insight
            </h4>
            <p className="text-xs text-slate-300">
              Temp: {weatherData?.temperature_c || 32.4}°C • Condition: {weatherData?.condition || 'Partly Cloudy'} • Humidity: {weatherData?.humidity_pct || 68}%
            </p>
          </div>
        </div>
        <Link to="/weather" className="agri-btn-secondary py-2 px-4 text-xs bg-sky-700 text-white border-sky-600 hover:bg-sky-600">
          View Weather Advisory
        </Link>
      </div>

    </div>
  );
}
