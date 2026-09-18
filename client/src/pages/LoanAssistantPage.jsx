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
  const [amount, setAmount] = useState(journeyData.requestedAmount || 200000);
  const [purpose, setPurpose] = useState(journeyData.purpose || 'Personal');
  const [monthlyIncome, setMonthlyIncome] = useState(journeyData.monthlyIncome || 50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(journeyData.monthlyExpenses || 30000);
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

    // Client validation
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
      setError('Monthly expenses must be less than monthly income to qualify for a loan.');
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

      // Automatically update global journey session with actual user values
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
    // Find the calculated EMI for this loan
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Database-Connected Eligibility Engine
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
          <BadgePercent className="w-8 h-8 text-emerald-600" />
          {t.nav.loans}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Enter your required loan parameters. Our backend validates your criteria, evaluates real debt-to-income (DTI) metrics, and queries real bank loan products directly from MongoDB.
        </p>
      </div>

      {/* 5 Inputs Form */}
      <form onSubmit={handleCalculate}>
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Input 1: Loan Amount */}
            <div>
              <Input
                label={t.labels.loanAmount}
                type="number"
                prefix="₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="200000"
                min="10000"
                step="5000"
                required
              />
            </div>

            {/* Input 2: Purpose */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.labels.purpose} <span className="text-rose-500">*</span>
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none shadow-xs"
              >
                {loanPurposes.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
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
                placeholder="50000"
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
                placeholder="30000"
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

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Test preset: <button type="button" onClick={() => { setAmount(200000); setMonthlyIncome(50000); setMonthlyExpenses(30000); setTenure(36); }} className="text-emerald-700 font-medium underline hover:text-emerald-800">₹2L @ 36mo, ₹50k Income / ₹30k Expenses</button>
            </div>

            <Button
              type="submit"
              size="lg"
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
        <LoadingState message="Connecting to MongoDB and calculating loan amortization..." />
      )}

      {/* Results Display */}
      {results && !isLoading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Banner */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                Calculation Completed
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Top Calculated EMI: <span className="text-emerald-700 font-extrabold">₹{results.summary?.topEmi?.toLocaleString('en-IN')}/month</span>
              </h3>
              <p className="text-xs text-slate-600">
                Found {results.products?.length} matching market bank loans in MongoDB. {results.summary?.eligibleCount} meet your DTI threshold.
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              icon={ArrowRight}
              onClick={() => navigate('/summary')}
            >
              View Active Session Summary
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
