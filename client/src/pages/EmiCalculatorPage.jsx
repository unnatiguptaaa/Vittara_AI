import React, { useState, useMemo } from 'react';
import { Sparkles, Calculator, PieChart, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useJourney } from '../context/JourneyContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function EmiCalculatorPage() {
  const { t } = useLanguage();
  const { journeyData, updateJourney } = useJourney();
  const navigate = useNavigate();

  // Reactive inputs
  const [principal, setPrincipal] = useState(journeyData.requestedAmount || 200000);
  const [interestRate, setInterestRate] = useState(journeyData.interestRate || 10.5);
  const [tenureMonths, setTenureMonths] = useState(journeyData.tenureMonths || 36);
  const [feeRate, setFeeRate] = useState(1.5);

  // Dynamic calculation using real mathematical code immediately on any input change
  const calcResult = useMemo(() => {
    const P = Number(principal) || 0;
    const rate = Number(interestRate) || 0;
    const n = Number(tenureMonths) || 1;

    if (P <= 0 || rate <= 0 || n <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        processingFee: 0,
        estimatedTotalCost: 0,
        principalPercent: 100,
        interestPercent: 0
      };
    }

    const r = rate / (12 * 100);
    const emiFactor = Math.pow(1 + r, n);
    const emi = Math.round((P * r * emiFactor) / (emiFactor - 1));
    const totalPayment = Math.round(emi * n);
    const totalInterest = Math.max(0, totalPayment - P);

    const calculatedFee = Math.round(P * (feeRate / 100));
    const processingFee = Math.max(500, calculatedFee);
    const estimatedTotalCost = totalPayment + processingFee;

    const principalPercent = totalPayment > 0 ? Math.round((P / totalPayment) * 100) : 100;
    const interestPercent = 100 - principalPercent;

    return {
      monthlyEmi: emi,
      totalInterest,
      totalPayment,
      processingFee,
      estimatedTotalCost,
      principalPercent,
      interestPercent
    };
  }, [principal, interestRate, tenureMonths, feeRate]);

  // Sync to Journey on button click or navigation
  const handleSaveToJourney = () => {
    updateJourney({
      requestedAmount: Number(principal),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
      monthlyEmi: calcResult.monthlyEmi,
      totalInterest: calcResult.totalInterest,
      totalPayment: calcResult.totalPayment,
      processingFee: calcResult.processingFee,
      estimatedTotalCost: calcResult.estimatedTotalCost
    });
    navigate('/summary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Dynamic Mathematical Engine
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
          <Calculator className="w-8 h-8 text-emerald-600" />
          {t.nav.calculator}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Changing any input or slider immediately recalculates EMI, total interest, total repayment, processing fee, and estimated total cost of credit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 bg-white border-slate-200 space-y-6 shadow-sm">
            {/* 1. Principal */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Loan Amount (Principal)
                </label>
                <span className="text-base font-extrabold text-slate-900">
                  ₹{Number(principal).toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="25000"
                max="5000000"
                step="25000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>₹25k</span>
                <span>₹25 Lakhs</span>
                <span>₹50 Lakhs</span>
              </div>
            </div>

            {/* 2. Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Annual Interest Rate (% p.a.)
                </label>
                <span className="text-base font-extrabold text-teal-700">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min="7.0"
                max="24.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>7.0%</span>
                <span>15.0%</span>
                <span>24.0%</span>
              </div>
            </div>

            {/* 3. Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Repayment Tenure
                </label>
                <span className="text-base font-extrabold text-slate-900">
                  {tenureMonths} Months <span className="text-xs font-normal text-slate-500">({(tenureMonths / 12).toFixed(1)} yrs)</span>
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="120"
                step="6"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>6 mo</span>
                <span>36 mo (3 yr)</span>
                <span>120 mo (10 yr)</span>
              </div>
            </div>

            {/* 4. Processing fee rate */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Processing Fee Rate (%)
                </label>
                <span className="text-sm font-bold text-slate-800">{feeRate}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.25"
                value={feeRate}
                onChange={(e) => setFeeRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
              />
            </div>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Monthly Repayment Obligation
              </span>
              <div className="text-4xl font-black text-emerald-600 tracking-tight mt-1">
                ₹{calcResult.monthlyEmi.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-500">/month</span>
              </div>
            </div>

            {/* Progress Bar (Principal vs Interest) */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Principal ({calcResult.principalPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Interest ({calcResult.interestPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${calcResult.principalPercent}%` }}
                  className="bg-emerald-600 transition-all duration-300"
                />
                <div
                  style={{ width: `${calcResult.interestPercent}%` }}
                  className="bg-amber-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Key Output Metrics */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.labels.totalInterest}</span>
                <span className="font-bold text-amber-700 text-sm">
                  ₹{calcResult.totalInterest.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.labels.totalPayment}</span>
                <span className="font-bold text-slate-900 text-sm">
                  ₹{calcResult.totalPayment.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">{t.labels.processingFee}</span>
                <span className="font-medium text-slate-800">
                  ₹{calcResult.processingFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800">{t.labels.totalCost}</span>
                <span className="font-black text-emerald-600 text-base">
                  ₹{calcResult.estimatedTotalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSaveToJourney}
              icon={ArrowRight}
            >
              Save to Live Financial Summary
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
