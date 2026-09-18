import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, ShieldCheck } from 'lucide-react';

export default function MarketTicker() {
  const tickerItems = [
    { label: 'RBI REPO RATE', value: '6.50%', change: 'BENCHMARK', type: 'neutral' },
    { label: 'SBI XPRESS CREDIT', value: '10.35%', change: '-0.15%', type: 'down' },
    { label: 'HDFC HOME ADVANTAGE', value: '8.70%', change: '+0.05%', type: 'up' },
    { label: 'ICICI PERSONAL LOAN', value: '10.75%', change: '0.00%', type: 'neutral' },
    { label: 'AXIS SMART DRIVE', value: '8.95%', change: '-0.20%', type: 'down' },
    { label: 'KOTAK MAHINDRA SECURED', value: '8.85%', change: '+0.10%', type: 'up' },
    { label: 'MAX TERM LIFE COVER', value: '₹1.50 Cr', change: '99.2% CSR', type: 'up' },
    { label: 'VITTARA AI ENGINE', value: 'GEMINI 3.8', change: 'VERIFIED', type: 'up' },
  ];

  // Duplicate for seamless infinite loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-y border-emerald-500/20 py-2.5 overflow-hidden select-none">
      <div className="flex items-center">
        {/* Left Live Badge */}
        <div className="shrink-0 flex items-center gap-2 pl-4 pr-3 border-r border-slate-700/60 z-10 bg-slate-900/90 text-xs font-bold text-emerald-400 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LIVE FINANCIAL TICKER</span>
        </div>

        {/* Marquee Track */}
        <div className="flex overflow-hidden relative w-full group">
          <div className="flex gap-8 whitespace-nowrap animate-[shimmer_30s_linear_infinite] group-hover:[animation-play-state:paused]">
            {displayItems.map((item, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">{item.label}:</span>
                <span className="text-white font-bold">{item.value}</span>
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    item.type === 'down'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : item.type === 'up'
                      ? 'bg-blue-950/80 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.type === 'down' && <TrendingDown className="w-3 h-3" />}
                  {item.type === 'up' && <TrendingUp className="w-3 h-3" />}
                  {item.type === 'neutral' && <Minus className="w-3 h-3" />}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
