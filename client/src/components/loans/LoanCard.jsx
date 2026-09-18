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
    <Card hover className="flex flex-col justify-between h-full bg-white border-slate-200 shadow-xs">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified Banking Product
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1.5 line-clamp-1">
              {loan.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{loan.bank}</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">{loan.category} Loan</span>
            </p>
          </div>

          {loan.badge && (
            <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
              {loan.badge}
            </span>
          )}
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 my-2 border-y border-slate-100 bg-slate-50 rounded-xl px-3">
          <div>
            <p className="text-[11px] text-slate-500">Interest Rate</p>
            <p className="text-lg font-extrabold text-slate-900">
              {loan.interestRate}% <span className="text-xs font-normal text-slate-500">p.a.</span>
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500">
              {calculatedEmi ? 'Monthly EMI' : 'Tenure Range'}
            </p>
            <p className="text-lg font-extrabold text-emerald-600">
              {calculatedEmi ? `₹${calculatedEmi.toLocaleString('en-IN')}` : `${loan.minTenure} - ${loan.maxTenure} mo`}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500">Processing Fee</p>
            <p className="text-xs font-medium text-slate-800 mt-0.5">
              {loan.processingFeeRate}% (Min ₹{loan.processingFeeMin})
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-500">Loan Limit</p>
            <p className="text-xs font-medium text-slate-800 mt-0.5">
              ₹{(loan.minAmount / 100000).toFixed(1)}L - ₹{(loan.maxAmount / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        {/* Features / Conditions */}
        <div className="space-y-1.5 my-3 text-xs">
          {loan.features && loan.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 pt-1">
            <strong className="text-slate-700">Terms: </strong>{loan.conditions}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
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
            {isSelectedInJourney ? 'Selected for Journey' : 'Select Product'}
          </Button>
        )}
      </div>
    </Card>
  );
}
