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
    <Card hover className="bg-white border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                IRDAI Compliant
              </span>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {insurance.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1.5 line-clamp-1">
              {insurance.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Provider: <span className="text-slate-800 font-medium">{insurance.provider}</span>
            </p>
          </div>

          {insurance.badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              {insurance.badge}
            </span>
          )}
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-500 block">{t.labels.coverage}</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{(insurance.coverage / 100000).toFixed(1)} Lakhs
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block">Annual Premium</span>
            <span className="text-lg font-extrabold text-emerald-600">
              ₹{insurance.premium.toLocaleString('en-IN')}
              <span className="text-[10px] font-normal text-slate-500">/yr</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block">{t.labels.deductible}</span>
            <span className="font-semibold text-amber-700">
              {insurance.deductible === 0 ? 'Zero (Nil)' : `₹${insurance.deductible.toLocaleString('en-IN')}`}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block">Monthly Approx</span>
            <span className="font-medium text-slate-800">
              ₹{insurance.monthlyPremium.toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>

        {/* Waiting Period & Sub-Limits */}
        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900">{t.labels.waitingPeriod}: </strong>
              {insurance.waitingPeriod}
            </span>
          </div>

          <div className="flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900">Limits: </strong>
              {insurance.limits}
            </span>
          </div>
        </div>

        {/* Collapsible Details: Exclusions & Conditions */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-2.5 animate-fadeIn">
            <div>
              <p className="font-semibold text-rose-600 flex items-center gap-1 mb-1">
                <AlertOctagon className="w-3.5 h-3.5" /> {t.labels.exclusions}:
              </p>
              <ul className="list-disc ml-4 space-y-0.5 text-slate-600">
                {insurance.exclusions?.map((exc, i) => (
                  <li key={i}>{exc}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-0.5">Policy Conditions & Co-Pay:</p>
              <p className="text-slate-600 text-[11px]">{insurance.conditions}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                <strong>Co-Payment:</strong> {insurance.coPay} • <strong>Network Hospitals:</strong> {insurance.networkHospitals}+
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
        >
          {isExpanded ? (
            <>Less Details <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Deep Policy View <ChevronDown className="w-3.5 h-3.5" /></>
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
