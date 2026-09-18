import React, { useState } from 'react';
import { BadgePercent, Search, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoanCard from '../components/loans/LoanCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { apiService } from '../api/client';
import { useJourney } from '../context/JourneyContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function LoanAssistantPage() {
  const { t } = useLanguage();
  const { journeyData, updateJourney } = useJourney();
  const navigate = useNavigate();

  // 5 required inputs
  const [amount, setAmount] = useState(journeyData.requestedAmount || 500000);
  const [purpose, setPurpose] = useState(journeyData.purpose || 'Personal');
  const [monthlyIncome, setMonthlyIncome] = useState(journeyData.monthlyIncome || 60000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(journeyData.monthlyExpenses || 25000);
  const [tenure, setTenure] = useState(journeyData.tenureMonths || 36);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const loanPurposes = [
    { value: 'Personal', label: 'Personal Loan' },
    { value: 'Home', label: 'Home Loan' },
    { value: 'Auto', label: 'Car / Auto Loan' },
    { value: 'Education', label: 'Education Loan' },
    { value: 'Business', label: 'Business Growth Loan' }
  ];

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    const numIncome = Number(monthlyIncome);
    const numExpenses = Number(monthlyExpenses);
    const numTenure = Number(tenure);

    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }
    if (!numIncome || numIncome <= 0) {
      setError('Monthly income must be greater than 0.');
      return;
    }
    if (numExpenses < 0) {
      setError('Monthly expenses cannot be negative.');
      return;
    }
    if (numExpenses >= numIncome) {
      setError('Monthly expenses must be less than monthly income to qualify for an installment.');
      return;
    }
    if (!numTenure || numTenure <= 0) {
      setError('Please enter a valid tenure in months.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.calculateLoan({
        amount: numAmount,
        purpose,
        monthlyIncome: numIncome,
        monthlyExpenses: numExpenses,
        tenure: numTenure
      });

      const data = response.data;
      setResults(data);

      const topLoan = data.products && data.products.length > 0 ? data.products[0] : null;
      updateJourney({
        requestedAmount: numAmount,
        purpose,
        monthlyIncome: numIncome,
        monthlyExpenses: numExpenses,
        tenureMonths: numTenure,
        interestRate: topLoan ? topLoan.product.interestRate : 10.35,
        monthlyEmi: topLoan ? topLoan.emiDetails.monthlyEmi : data.summary?.topEmi,
        totalInterest: topLoan ? topLoan.emiDetails.totalInterest : 0,
        totalPayment: topLoan ? topLoan.emiDetails.totalPayment : 0,
        processingFee: topLoan ? topLoan.emiDetails.processingFee : 0,
        estimatedTotalCost: topLoan ? topLoan.emiDetails.estimatedTotalCost : 0,
        selectedProduct: topLoan ? topLoan.product : null,
        eligibilityStatus: topLoan?.eligibility?.status || 'Eligible'
      });

    } catch (err) {
      console.error('Loan assistant error:', err);
      setError(err.response?.data?.error || 'Financial data could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (loanProduct) => {
    const match = results?.products?.find(p => (p.product._id || p.product.id) === (loanProduct._id || loanProduct.id));
    if (match) {
      updateJourney({
        selectedProduct: match.product,
        interestRate: match.product.interestRate,
        monthlyEmi: match.emiDetails.monthlyEmi,
        totalInterest: match.emiDetails.totalInterest,
        totalPayment: match.emiDetails.totalPayment,
        processingFee: match.emiDetails.processingFee,
        estimatedTotalCost: match.emiDetails.estimatedTotalCost
      });
      navigate('/summary');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-slate-700/80 text-xs font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Eligibility & DTI Evaluation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory tracking-tight mt-2.5 flex items-center gap-2.5">
          <BadgePercent className="w-7 h-7 text-emerald-400" />
          {t.nav.loans}
        </h1>
        <p className="text-xs sm:text-sm text-ivory-subtle mt-1 max-w-2xl leading-relaxed">
          Enter your income and required parameters. Our engine evaluates your real debt-to-income (DTI) metrics against standard banking eligibility caps.
        </p>
      </div>

      {/* 5 Inputs Form */}
      <form onSubmit={handleCalculate}>
        <Card className="p-6 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Input 1: Loan Amount */}
            <div>
              <Input
                label={t.labels.loanAmount}
                type="number"
                prefix="₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500000"
                min="10000"
                step="5000"
                required
              />
            </div>

            {/* Input 2: Purpose */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1.5">
                {t.labels.purpose} <span className="text-emerald-400">*</span>
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-xl bg-midnight-950/70 border border-slate-700/80 px-3.5 py-2.5 text-sm text-ivory focus:border-emerald-500 focus:outline-none transition-colors"
              >
                {loanPurposes.map(p => (
                  <option key={p.value} value={p.value} className="bg-midnight-900 text-ivory">{p.label}</option>
                ))}
              </select>
            </div>

            {/* Input 3: Monthly Income */}
            <div>
              <Input
                label={t.labels.monthlyIncome}
                type="number"
                prefix="₹"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="60000"
                min="1000"
                required
              />
            </div>

            {/* Input 4: Monthly Expenses */}
            <div>
              <Input
                label={t.labels.monthlyExpenses}
                type="number"
                prefix="₹"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                placeholder="25000"
                min="0"
                required
              />
            </div>

            {/* Input 5: Tenure */}
            <div>
              <Input
                label={t.labels.tenure}
                type="number"
                suffix="mo"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="36"
                min="6"
                max="360"
                required
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-ivory-dark">
              Preset: <button type="button" onClick={() => { setAmount(500000); setMonthlyIncome(60000); setMonthlyExpenses(25000); setTenure(36); }} className="text-emerald-400 underline hover:text-emerald-300 font-mono">₹5L @ 36mo, ₹60k Income / ₹25k Expenses</button>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              icon={Search}
              className="w-full sm:w-auto"
            >
              {t.actions.calculate}
            </Button>
          </div>
        </Card>
      </form>

      {/* Error state */}
      {error && (
        <ErrorState
          title="Loan Validation Error"
          message={error}
          onRetry={handleCalculate}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <LoadingState message="Connecting to banking database and calculating loan amortization..." />
      )}

      {/* Results Display */}
      {results && !isLoading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-midnight-800/90 border border-emerald-500/40 shadow-fintech-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-400 font-mono font-medium uppercase tracking-wider block">
                Analysis Completed
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-ivory mt-0.5">
                Top Qualified Monthly EMI: <span className="text-emerald-400 font-extrabold font-mono">₹{results.summary?.topEmi?.toLocaleString('en-IN')}</span> /mo
              </h3>
              <p className="text-xs text-ivory-subtle mt-0.5">
                Evaluated {results.products?.length} products. {results.summary?.eligibleCount} match your calculated debt-to-income limits.
              </p>
            </div>

            <Button
              size="sm"
              variant="secondary"
              icon={ArrowRight}
              onClick={() => navigate('/summary')}
            >
              View Financial Summary
            </Button>
          </div>

          {/* Loan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.products?.map((item) => (
              <LoanCard
                key={item.product._id || item.product.id}
                loan={item.product}
                calculatedEmi={item.emiDetails.monthlyEmi}
                isQualified={item.isQualified}
                onSelectForJourney={handleSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
