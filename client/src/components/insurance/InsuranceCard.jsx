import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, AlertOctagon, HeartPulse, Clock, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useJourney } from '../../context/JourneyContext';
import { useLanguage } from '../../context/LanguageContext';

export default function InsuranceCard({ insurance }) {
  const { t } = useLanguage();
  const { journeyData, updateJourney } = useJourney();
  const [isExpanded, setIsExpanded] = useState(false);

  const isSelected = journeyData.selectedInsurance?._id === (insurance._id || insurance.id);

  return (
    <Card hover className="flex flex-col justify-between h-full p-5 sm:p-6">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 bg-teal-950/70 px-2 py-0.5 rounded border border-teal-500/30">
                IRDAI Compliant
              </span>
              <span className="text-[10px] text-slate-300 bg-midnight-950 px-2 py-0.5 rounded border border-slate-800 font-mono">
                {insurance.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-ivory mt-1.5 line-clamp-1">
              {insurance.name}
            </h3>
            <p className="text-xs text-ivory-subtle mt-0.5">
              Provider: <span className="text-slate-300 font-medium">{insurance.provider}</span>
            </p>
          </div>

          {insurance.badge && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-midnight-950 text-slate-300 border border-slate-800 shrink-0">
              {insurance.badge}
            </span>
          )}
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-midnight-950/60 border border-slate-800/80 mb-3 text-xs font-mono">
          <div>
            <span className="text-[10px] text-ivory-dark block font-sans uppercase">{t.labels.coverage}</span>
            <span className="text-base sm:text-lg font-bold text-ivory">
              ₹{(insurance.coverage / 100000).toFixed(1)} Lakhs
            </span>
          </div>

          <div>
            <span className="text-[10px] text-ivory-dark block font-sans uppercase">Annual Premium</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">
              ₹{insurance.premium.toLocaleString('en-IN')}
              <span className="text-[10px] font-normal text-ivory-dark">/yr</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-ivory-dark block font-sans uppercase">{t.labels.deductible}</span>
            <span className="font-semibold text-gold-400">
              {insurance.deductible === 0 ? 'Zero (Nil)' : `₹${insurance.deductible.toLocaleString('en-IN')}`}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-ivory-dark block font-sans uppercase">Monthly Approx</span>
            <span className="font-medium text-slate-300">
              ₹{insurance.monthlyPremium.toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>

        {/* Waiting Period & Sub-Limits */}
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-ivory">{t.labels.waitingPeriod}: </strong>
              {insurance.waitingPeriod}
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-ivory">Limits: </strong>
              {insurance.limits}
            </span>
          </div>
        </div>

        {/* Collapsible Details: Exclusions & Conditions */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2.5 animate-fadeIn">
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <p className="font-semibold text-rose-500 flex items-center gap-1 mb-1">
                <AlertOctagon className="w-3.5 h-3.5" /> {t.labels.exclusions}:
              </p>
              <ul className="list-disc ml-4 space-y-0.5 text-slate-300 text-[11px]">
                {insurance.exclusions?.map((exc, i) => (
                  <li key={i}>{exc}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 text-ivory-subtle text-[11px]">
              <p className="font-medium text-slate-300">Policy Conditions & Co-Pay:</p>
              <p>{insurance.conditions}</p>
              <p className="mt-0.5">
                <strong className="text-slate-300">Co-Payment:</strong> {insurance.coPay} • <strong className="text-slate-300">Network Hospitals:</strong> {insurance.networkHospitals}+
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-400 hover:text-ivory flex items-center gap-1 font-medium transition-colors"
        >
          {isExpanded ? (
            <>Less Details <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Full Policy Breakdown <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>

        <Button
          size="sm"
          variant={isSelected ? 'outline' : 'secondary'}
          onClick={() => updateJourney({ selectedInsurance: insurance })}
          className="text-xs"
        >
          {isSelected ? 'Saved to Session' : 'Save to Journey'}
        </Button>
      </div>
    </Card>
  );
}
