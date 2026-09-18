import React from 'react';
import { Building2, ShieldCheck, CheckCircle2, ChevronRight, Scale, Check } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useJourney } from '../../context/JourneyContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LoanCard({
  loan,
  calculatedEmi = null,
  isQualified = true,
  onSelectForJourney = null
}) {
  const { t } = useLanguage();
  const { journeyData, toggleCompareLoan } = useJourney();

  const isSelectedForCompare = journeyData.comparisonLoanIds?.includes(loan._id || loan.id);
  const isSelectedInJourney = journeyData.selectedProduct?._id === (loan._id || loan.id);

  return (
    <Card hover className="flex flex-col justify-between h-full p-5 sm:p-6">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
              Verified Banking Product
            </span>
            <h3 className="text-base font-bold text-ivory mt-1.5 line-clamp-1">
              {loan.name}
            </h3>
            <p className="text-xs text-ivory-subtle flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{loan.bank}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{loan.category}</span>
            </p>
          </div>

          {loan.badge && (
            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded bg-midnight-950 text-slate-300 border border-slate-800">
              {loan.badge}
            </span>
          )}
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 my-2 border-y border-slate-800/80 bg-midnight-950/60 rounded-xl px-3 font-mono">
          <div>
            <p className="text-[10px] text-ivory-dark uppercase">Interest Rate</p>
            <p className="text-base sm:text-lg font-bold text-ivory mt-0.5">
              {loan.interestRate}% <span className="text-xs font-normal text-ivory-dark">p.a.</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] text-ivory-dark uppercase">
              {calculatedEmi ? 'Monthly EMI' : 'Tenure Range'}
            </p>
            <p className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
              {calculatedEmi ? `₹${calculatedEmi.toLocaleString('en-IN')}` : `${loan.minTenure} - ${loan.maxTenure} mo`}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-ivory-dark uppercase">Processing Fee</p>
            <p className="text-xs font-medium text-slate-300 mt-0.5">
              {loan.processingFeeRate}% (Min ₹{loan.processingFeeMin})
            </p>
          </div>

          <div>
            <p className="text-[10px] text-ivory-dark uppercase">Loan Limit</p>
            <p className="text-xs font-medium text-slate-300 mt-0.5">
              ₹{(loan.minAmount / 100000).toFixed(1)}L - ₹{(loan.maxAmount / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        {/* Features / Conditions */}
        <div className="space-y-1.5 my-3 text-xs">
          {loan.features && loan.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
          {loan.conditions && (
            <p className="text-[11px] text-ivory-dark pt-1">
              <strong className="text-slate-400 font-medium">Terms: </strong>{loan.conditions}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
        <Button
          size="sm"
          variant={isSelectedForCompare ? 'primary' : 'secondary'}
          onClick={() => toggleCompareLoan(loan._id || loan.id)}
          icon={isSelectedForCompare ? Check : Scale}
          className="flex-1 text-xs"
        >
          {isSelectedForCompare ? t.actions.selected : t.actions.selectToCompare}
        </Button>

        {onSelectForJourney && (
          <Button
            size="sm"
            variant={isSelectedInJourney ? 'outline' : 'primary'}
            onClick={() => onSelectForJourney(loan)}
            className="flex-1 text-xs"
          >
            {isSelectedInJourney ? 'Selected' : 'Select Product'}
          </Button>
        )}
      </div>
    </Card>
  );
}
