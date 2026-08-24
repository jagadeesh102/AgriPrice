import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Bell, Plus, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [crop, setCrop] = useState('chilli');
  const [market, setMarket] = useState('Guntur');
  const [targetPrice, setTargetPrice] = useState(20000);
  const [condition, setCondition] = useState('above');
  const [alertCreatedMsg, setAlertCreatedMsg] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await api.createPriceAlert({
        crop,
        market,
        target_price: parseFloat(targetPrice),
        condition
      });
      setAlertCreatedMsg(`Alert set for ${crop.toUpperCase()} in ${market} when price reaches ₹${targetPrice}!`);
      loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <Bell className="w-7 h-7 text-emerald-600" />
          Price Alerts & Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">Set target price thresholds and receive market movement updates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CREATE ALERT FORM */}
        <div className="lg:col-span-5 agri-card p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Set Target Price Alert
          </h3>

          {alertCreatedMsg && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{alertCreatedMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="chilli">Chilli 🌶️</option>
                <option value="turmeric">Turmeric 🌾</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Market</label>
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="Guntur">Guntur Mandi</option>
                <option value="Duggirala">Duggirala Market</option>
                <option value="Vijayawada">Vijayawada</option>
                <option value="Kurnool">Kurnool APMC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alert me when price is:</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold mb-3"
              >
                <option value="above">Above or equal to (≥)</option>
                <option value="below">Below or equal to (≤)</option>
              </select>

              <input
                type="number"
                step="500"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
                placeholder="Target Price (e.g. 20000)"
              />
            </div>

            <button type="submit" className="agri-btn-primary w-full text-xs py-3 justify-center">
              <span>Create Target Price Alert</span>
            </button>
          </form>
        </div>

        {/* NOTIFICATIONS FEED */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Recent Notifications Feed</h3>
          
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="agri-card p-4 flex items-start gap-3 border-l-4 border-l-emerald-600">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
