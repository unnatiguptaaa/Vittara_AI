import React from 'react';
import { ReceiptText, CheckCircle2, TrendingUp, Shield, Sparkles, ArrowRight, Printer } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useJourney } from '../../context/JourneyContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function SummaryCard({ className = '' }) {
  const { journeyData, resetJourney } = useJourney();
  const { t } = useLanguage();

  const {
    requestedAmount,
    purpose,
    monthlyIncome,
    monthlyExpenses,
    tenureMonths,
    interestRate,
    monthlyEmi,
    totalInterest,
    totalPayment,
    processingFee,
    estimatedTotalCost,
    selectedProduct,
    selectedInsurance,
    eligibilityStatus
  } = journeyData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Session Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active User Session Journey
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
              <ReceiptText className="w-6 h-6 text-emerald-600" />
              Verified Financial Summary
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Calculated dynamically from your actual session inputs and real MongoDB bank products.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={Printer}
              onClick={handlePrint}
            >
              Print / Save PDF
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetJourney}
            >
              Reset Session
            </Button>
          </div>
        </div>

        {/* Big Key Figures Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block font-medium">Requested Principal</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              ₹{Number(requestedAmount || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-700 mt-0.5 block">User's Real Input</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block font-medium">Calculated Monthly EMI</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              ₹{Number(monthlyEmi || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Calculator Engine Result</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block font-medium">Applied Interest Rate</span>
            <span className="text-2xl font-black text-teal-700 mt-1 block">
              {interestRate || 0}% <span className="text-xs font-normal text-slate-500">p.a.</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {selectedProduct ? selectedProduct.name : 'Standard Baseline'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block font-medium">Processing Fee</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              ₹{Number(processingFee || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Database Fee Structure</span>
          </div>
        </div>

        {/* Detailed Data Table Breakdown */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit Breakdown of Current Session
            </h4>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {eligibilityStatus || 'Approved in Assessment'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="grid grid-cols-2 px-5 py-3">
              <span className="text-slate-500">Loan Purpose</span>
              <span className="font-semibold text-slate-900 text-right">{purpose} Loan</span>
            </div>

            <div className="grid grid-cols-2 px-5 py-3">
              <span className="text-slate-500">Monthly In-hand Income</span>
              <span className="font-semibold text-slate-900 text-right">₹{Number(monthlyIncome || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 px-5 py-3">
              <span className="text-slate-500">Monthly Fixed Expenses</span>
              <span className="font-semibold text-slate-900 text-right">₹{Number(monthlyExpenses || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 px-5 py-3">
              <span className="text-slate-500">Repayment Duration (Tenure)</span>
              <span className="font-semibold text-slate-900 text-right">{tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} years)</span>
            </div>

            <div className="grid grid-cols-2 px-5 py-3">
              <span className="text-slate-500">Total Interest Accrued</span>
              <span className="font-semibold text-slate-800 text-right">₹{Number(totalInterest || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 px-5 py-3">
              <span className="text-slate-500">Total Principal + Interest Repayment</span>
              <span className="font-bold text-slate-900 text-right">₹{Number(totalPayment || 0).toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 px-5 py-3 bg-emerald-50/60">
              <span className="font-bold text-emerald-800">Estimated Total Cost of Credit</span>
              <span className="font-black text-emerald-700 text-base text-right">
                ₹{Number(estimatedTotalCost || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Product Attribution */}
        {selectedProduct && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Selected Loan Product:</span>
              <span className="font-bold text-slate-900 text-sm">{selectedProduct.name}</span>
              <span className="text-slate-500 block">{selectedProduct.bank} • {selectedProduct.conditions}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider text-[10px]">
              Verified Bank Loan
            </span>
          </div>
        )}

        {/* Selected Insurance Attribution */}
        {selectedInsurance && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Linked Insurance Coverage:</span>
              <span className="font-bold text-teal-800 text-sm">{selectedInsurance.name}</span>
              <span className="text-slate-500 block">
                Coverage: ₹{(selectedInsurance.coverage / 100000).toFixed(1)}L • Premium: ₹{selectedInsurance.premium.toLocaleString('en-IN')}/yr
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold uppercase tracking-wider text-[10px]">
              Active Policy Record
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
