import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Calculator, ArrowRight, DollarSign, PieChart, ShieldAlert } from 'lucide-react';

export default function RevenueCalculatorPage() {
  const { t } = useLanguage();

  const [crop, setCrop] = useState('chilli');
  const [quantity, setQuantity] = useState(10);
  const [currentPrice, setCurrentPrice] = useState(18500);
  const [futurePrice, setFuturePrice] = useState(20050);
  const [transportCost, setTransportCost] = useState(150);
  const [storageCost, setStorageCost] = useState(80);
  const [holdingMonths, setHoldingMonths] = useState(0.5);

  const [result, setResult] = useState(null);

  useEffect(() => {
    runCalculation();
  }, [crop, quantity, currentPrice, futurePrice, transportCost, storageCost, holdingMonths]);

  const runCalculation = async () => {
    try {
      const res = await api.calculateRevenue({
        crop,
        quantity_quintals: parseFloat(quantity) || 10,
        current_price: parseFloat(currentPrice) || 18500,
        expected_future_price: parseFloat(futurePrice) || 20050,
        transport_cost_per_quintal: parseFloat(transportCost) || 150,
        storage_cost_per_quintal_month: parseFloat(storageCost) || 80,
        holding_months: parseFloat(holdingMonths) || 0.5
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <Calculator className="w-7 h-7 text-emerald-600" />
          {t('calcHeader')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">{t('calcSub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT FORM */}
        <div className="lg:col-span-5 agri-card p-6 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
            Financial Inputs
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop</label>
            <select
              value={crop}
              onChange={(e) => {
                const val = e.target.value;
                setCrop(val);
                if (val === 'chilli') {
                  setCurrentPrice(18500);
                  setFuturePrice(20050);
                } else {
                  setCurrentPrice(12400);
                  setFuturePrice(13200);
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="chilli">Chilli 🌶️</option>
              <option value="turmeric">Turmeric 🌾</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity (Quintals)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Current Price (₹/Qtl)</label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-700 uppercase mb-1">Future Price (₹/Qtl)</label>
              <input
                type="number"
                value={futurePrice}
                onChange={(e) => setFuturePrice(e.target.value)}
                className="w-full bg-slate-50 border border-amber-300 rounded-xl p-2 text-xs font-semibold text-amber-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('inputTransportCost')}</label>
            <input
              type="number"
              value={transportCost}
              onChange={(e) => setTransportCost(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">{t('inputStorageCost')}</label>
              <input
                type="number"
                value={storageCost}
                onChange={(e) => setStorageCost(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">{t('inputHoldingMonths')}</label>
              <input
                type="number"
                step="0.5"
                value={holdingMonths}
                onChange={(e) => setHoldingMonths(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* OUTPUT ANALYSIS */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="agri-card p-6 space-y-6 border-l-4 border-l-emerald-600">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                Net Return Comparison
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs text-slate-500 font-bold uppercase">{t('currentGross')}</span>
                  <div className="text-2xl font-black text-slate-900">₹{result.current_gross_revenue.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>Transport Cost:</span>
                      <span className="text-red-600 font-semibold">-₹{result.total_transport_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-1">
                      <span>Current Net Return:</span>
                      <span>₹{result.current_net_revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-xs text-amber-900 font-bold uppercase">{t('futureGross')}</span>
                  <div className="text-2xl font-black text-amber-700">₹{result.future_gross_revenue.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-amber-200">
                    <div className="flex justify-between">
                      <span>Transport Cost:</span>
                      <span className="text-red-600 font-semibold">-₹{result.total_transport_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage Cost:</span>
                      <span className="text-red-600 font-semibold">-₹{result.total_storage_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-amber-900 pt-1">
                      <span>Future Net Return:</span>
                      <span>₹{result.future_net_revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NET DIFFERENCE CARD */}
              <div className="bg-gradient-to-r from-emerald-900 to-green-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">{t('netDifference')}</span>
                  <div className="text-3xl font-black text-amber-400">
                    +₹{result.estimated_net_difference.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-200 mt-1">After deducting all transportation & storage fees.</p>
                </div>
                <div className="bg-emerald-800/80 px-4 py-3 rounded-xl border border-emerald-600 text-center">
                  <span className="text-[11px] text-slate-300 block">{t('roiLabel')}</span>
                  <span className="text-xl font-black text-emerald-300">+{result.roi_percentage}%</span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
