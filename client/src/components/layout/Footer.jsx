import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6 mt-16 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Vittara AI — Intelligent Financial Platform powered by Express, MongoDB & Google Gemini.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
            LIVE FINANCIAL PLATFORM
          </span>
          <span>Fully connected database, real-time calculators and AI intelligence.</span>
        </div>
      </div>
    </footer>
  );
}
