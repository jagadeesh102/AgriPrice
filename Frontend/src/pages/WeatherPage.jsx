import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { CloudSun, Thermometer, Droplets, Wind, Info, ShieldCheck } from 'lucide-react';

export default function WeatherPage() {
  const { t } = useLanguage();
  const [district, setDistrict] = useState('Guntur');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    loadWeather();
  }, [district]);

  const loadWeather = async () => {
    try {
      const res = await api.getWeather(district);
      setWeather(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <CloudSun className="w-7 h-7 text-emerald-600" />
          {t('weatherHeader')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">{t('weatherSub')}</p>
      </div>

      <div className="agri-card p-4 flex items-center gap-3">
        <label className="text-xs font-bold text-slate-700 uppercase">Select District:</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-800"
        >
          <option value="Guntur">Guntur District</option>
          <option value="NTR">NTR / Vijayawada</option>
          <option value="Kurnool">Kurnool District</option>
          <option value="YSR Kadapa">YSR Kadapa</option>
          <option value="Anantapur">Anantapur</option>
        </select>
      </div>

      {weather && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="agri-card p-5 space-y-1 border-l-4 border-l-amber-500">
              <span className="text-xs text-slate-500 font-bold uppercase">Temperature</span>
              <div className="text-3xl font-black text-slate-900 flex items-center gap-1">
                <Thermometer className="w-6 h-6 text-amber-500" /> {weather.temperature_c}°C
              </div>
              <span className="text-xs text-slate-500">{weather.condition}</span>
            </div>

            <div className="agri-card p-5 space-y-1 border-l-4 border-l-blue-500">
              <span className="text-xs text-slate-500 font-bold uppercase">Rainfall</span>
              <div className="text-3xl font-black text-blue-600 flex items-center gap-1">
                <Droplets className="w-6 h-6 text-blue-500" /> {weather.rainfall_mm} mm
              </div>
              <span className="text-xs text-slate-500">24-hour accumulation</span>
            </div>

            <div className="agri-card p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Humidity</span>
              <div className="text-3xl font-black text-slate-900">{weather.humidity_pct}%</div>
              <span className="text-xs text-slate-500">Relative Humidity</span>
            </div>

            <div className="agri-card p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Wind Speed</span>
              <div className="text-3xl font-black text-slate-900 flex items-center gap-1">
                <Wind className="w-6 h-6 text-slate-600" /> {weather.wind_speed_kmh} km/h
              </div>
              <span className="text-xs text-slate-500">Moderate breeze</span>
            </div>
          </div>

          {/* AGRICULTURAL IMPACT ADVISORY */}
          <div className="agri-card p-6 space-y-4 border-l-4 border-l-emerald-600">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Crop Storage & Drying Advisory ({district})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-red-900 flex items-center gap-1.5">
                  <span>🌶️ Chilli Pod Drying Impact</span>
                </h4>
                <p className="text-xs text-red-800 leading-relaxed">
                  {weather.agricultural_impact.chilli}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <span>🌾 Turmeric Rhizome Impact</span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {weather.agricultural_impact.turmeric}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
