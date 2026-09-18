import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Info } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useJourney } from '../context/JourneyContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function EmiCalculatorPage() {
  const { t } = useLanguage();
  const { journeyData, updateJourney } = useJourney();
  const navigate = useNavigate();

  // Reactive inputs
  const [principal, setPrincipal] = useState(journeyData.requestedAmount || 500000);
  const [interestRate, setInterestRate] = useState(journeyData.interestRate || 10.5);
  const [tenureMonths, setTenureMonths] = useState(journeyData.tenureMonths || 36);
  const [feeRate, setFeeRate] = useState(1.5);

  // Dynamic reducing-balance formula
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-slate-700/80 text-xs font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Reducing Balance Formula Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory tracking-tight mt-2.5 flex items-center gap-2.5">
          <Calculator className="w-7 h-7 text-emerald-400" />
          {t.nav.calculator}
        </h1>
        <p className="text-xs sm:text-sm text-ivory-subtle mt-1 max-w-2xl leading-relaxed">
          Standard Indian banking formula calculations with immediate recalculation of monthly installments, reducing interest, and total credit cost.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-7 space-y-6">
            {/* 1. Principal */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Loan Amount (Principal)
                </label>
                <span className="text-base font-bold text-ivory font-mono">
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
                className="w-full h-2 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-slate-800"
              />
              <div className="flex justify-between text-[11px] text-ivory-dark mt-1 font-mono">
                <span>₹25,000</span>
                <span>₹25 Lakhs</span>
                <span>₹50 Lakhs</span>
              </div>
            </div>

            {/* 2. Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Annual Interest Rate (% p.a.)
                </label>
                <span className="text-base font-bold text-emerald-400 font-mono">
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
                className="w-full h-2 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-slate-800"
              />
              <div className="flex justify-between text-[11px] text-ivory-dark mt-1 font-mono">
                <span>7.0%</span>
                <span>15.0%</span>
                <span>24.0%</span>
              </div>
            </div>

            {/* 3. Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Repayment Tenure
                </label>
                <span className="text-base font-bold text-ivory font-mono">
                  {tenureMonths} Months <span className="text-xs font-normal text-ivory-subtle">({(tenureMonths / 12).toFixed(1)} yrs)</span>
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="120"
                step="6"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-slate-800"
              />
              <div className="flex justify-between text-[11px] text-ivory-dark mt-1 font-mono">
                <span>6 mo</span>
                <span>36 mo (3 yr)</span>
                <span>120 mo (10 yr)</span>
              </div>
            </div>

            {/* 4. Processing Fee Rate */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Estimated Processing Fee Rate (%)
                </label>
                <span className="text-sm font-bold text-slate-300 font-mono">{feeRate}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.25"
                value={feeRate}
                onChange={(e) => setFeeRate(Number(e.target.value))}
                className="w-full h-1.5 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-slate-400 border border-slate-800"
              />
            </div>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card highlight className="p-6 sm:p-7 space-y-6">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-ivory-subtle block">
                Monthly Repayment Obligation
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-ivory tracking-tight mt-1 flex items-baseline gap-1">
                <span className="text-emerald-400 font-mono">₹{calcResult.monthlyEmi.toLocaleString('en-IN')}</span>
                <span className="text-xs font-normal text-ivory-dark">/ month</span>
              </div>
            </div>

            {/* Progress Bar (Principal vs Interest) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-ivory-subtle font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Principal ({calcResult.principalPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500" />
                  Interest ({calcResult.interestPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-midnight-950 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  style={{ width: `${calcResult.principalPercent}%` }}
                  className="bg-emerald-500 transition-all duration-300"
                />
                <div
                  style={{ width: `${calcResult.interestPercent}%` }}
                  className="bg-gold-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Key Output Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-ivory-subtle">{t.labels.totalInterest}</span>
                <span className="font-bold text-gold-400 font-mono text-sm">
                  ₹{calcResult.totalInterest.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-ivory-subtle">{t.labels.totalPayment}</span>
                <span className="font-bold text-ivory font-mono text-sm">
                  ₹{calcResult.totalPayment.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-ivory-subtle">{t.labels.processingFee}</span>
                <span className="font-medium text-slate-300 font-mono">
                  ₹{calcResult.processingFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <span className="font-bold text-ivory">{t.labels.totalCost}</span>
                <span className="font-extrabold text-emerald-400 font-mono text-base">
                  ₹{calcResult.estimatedTotalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              variant="primary"
              onClick={handleSaveToJourney}
              icon={ArrowRight}
            >
              Save to Financial Journey
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
