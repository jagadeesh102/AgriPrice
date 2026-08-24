import React, { useState } from 'react';
import { MapPin, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export default function APMarketMap({ markets = [], selectedCrop = 'chilli', onSelectMarket }) {
  const [activeHover, setActiveHover] = useState(null);

  // Geographic SVG relative coordinates mapped to AP region
  const marketMapCoords = {
    'guntur': { x: 62, y: 48, label: 'Guntur Mandi' },
    'duggirala': { x: 68, y: 44, label: 'Duggirala Market' },
    'vijayawada': { x: 65, y: 38, label: 'Vijayawada Rythu Bazar' },
    'kurnool': { x: 32, y: 42, label: 'Kurnool APMC' },
    'kadapa': { x: 42, y: 68, label: 'Kadapa Mandi' },
    'anantapur': { x: 22, y: 65, label: 'Anantapur Market' }
  };

  const getCoords = (m) => {
    const idLower = (m.id || '').toLowerCase();
    const nameLower = (m.name || '').toLowerCase();
    for (const key of Object.keys(marketMapCoords)) {
      if (idLower.includes(key) || nameLower.includes(key)) {
        return marketMapCoords[key];
      }
    }
    return { x: 50, y: 50, label: m.name };
  };

  return (
    <div className="agri-card p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Andhra Pradesh Mandi Price Map
          </h3>
          <p className="text-xs text-slate-500">
            Interactive market locations & price trends for {selectedCrop === 'chilli' ? 'Chilli 🌶️' : 'Turmeric 🌾'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold"><TrendingUp className="w-3.5 h-3.5" /> High Price</span>
          <span className="flex items-center gap-1 text-amber-700 font-semibold"><Minus className="w-3.5 h-3.5" /> Moderate</span>
        </div>
      </div>

      {/* Visual Map Layout Container */}
      <div className="relative w-full h-80 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 rounded-xl overflow-hidden border border-emerald-800 shadow-inner flex items-center justify-center">
        
        {/* Decorative AP Region Contour SVG background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 15,30 Q 35,15 65,25 Q 85,30 88,50 Q 80,75 55,88 Q 30,95 15,75 Q 8,50 15,30 Z"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
        </svg>

        {/* State Label */}
        <div className="absolute top-3 left-4 text-emerald-400/40 text-xs font-black tracking-widest uppercase pointer-events-none">
          Andhra Pradesh Mandi Network
        </div>

        {/* Render Interactive Mandi Pins */}
        {markets.map((m) => {
          const coords = getCoords(m);
          const price = selectedCrop === 'chilli' ? m.chilli_price : m.turmeric_price;
          const isHighest = price >= 18500 || price >= 12400;

          return (
            <div
              key={m.id || m.name}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10"
              onMouseEnter={() => setActiveHover(m)}
              onMouseLeave={() => setActiveHover(null)}
              onClick={() => onSelectMarket && onSelectMarket(m.name.split(' ')[0])}
            >
              {/* Pin Indicator */}
              <div className="relative flex flex-col items-center">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md border ${
                  isHighest ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-emerald-600 text-white border-emerald-400'
                }`}>
                  ₹{price?.toLocaleString() || '18,500'}
                </div>
                <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                  isHighest ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`} />
                <span className="text-[10px] text-emerald-200 font-semibold tracking-tight drop-shadow-md whitespace-nowrap">
                  {m.name.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}

        {/* Hover Info Card Overlay */}
        {activeHover && (
          <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-emerald-300 shadow-xl z-20 w-auto md:w-64 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-emerald-950">{activeHover.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                {activeHover.type}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Chilli Spot:</span>
                <strong className="text-emerald-700">₹{activeHover.chilli_price?.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Turmeric Spot:</span>
                <strong className="text-amber-700">₹{activeHover.turmeric_price?.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span>District / Distance:</span>
                <span>{activeHover.district} • {activeHover.distance_km} km</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-emerald-600" /> Hover over pins to inspect spot rates. Click any mandi pin to select location.
        </span>
        <span className="font-medium text-emerald-700">{markets.length} AP Markets Covered</span>
      </div>
    </div>
  );
}
