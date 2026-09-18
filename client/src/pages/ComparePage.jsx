import React, { useState, useEffect } from 'react';
import { Scale, Check, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ComparisonTable from '../components/loans/ComparisonTable';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { apiService } from '../api/client';
import { useJourney } from '../context/JourneyContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function ComparePage() {
  const { t } = useLanguage();
  const { journeyData, toggleCompareLoan } = useJourney();
  const navigate = useNavigate();

  const [allLoans, setAllLoans] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    apiService.getLoans()
      .then(res => {
        const list = res.data?.data || [];
        setAllLoans(list);

        const currentSelected = journeyData.comparisonLoanIds || [];
        if (currentSelected.length < 2 && list.length >= 2) {
          toggleCompareLoan(list[0]._id || list[0].id);
          toggleCompareLoan(list[1]._id || list[1].id);
        }
      })
      .catch(err => {
        setError('Financial products could not be loaded.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const runComparison = async () => {
    const selectedIds = journeyData.comparisonLoanIds || [];
    if (selectedIds.length < 2) {
      setError('Please select at least 2 loan products to compare.');
      return;
    }

    setError(null);
    setIsComparing(true);

    try {
      const response = await apiService.compareLoans({
        loanIds: selectedIds,
        amount: journeyData.requestedAmount || 500000,
        tenure: journeyData.tenureMonths || 36
      });

      setComparisonResult(response.data?.data);
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err.response?.data?.error || 'Unable to compare selected products.');
    } finally {
      setIsComparing(false);
    }
  };

  useEffect(() => {
    if (journeyData.comparisonLoanIds?.length >= 2) {
      runComparison();
    }
  }, [journeyData.comparisonLoanIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-slate-700/80 text-xs font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Multi-Lender Amortization Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory tracking-tight mt-2.5 flex items-center gap-2.5">
          <Scale className="w-7 h-7 text-emerald-400" />
          {t.nav.compare}
        </h1>
        <p className="text-xs sm:text-sm text-ivory-subtle mt-1 max-w-2xl leading-relaxed">
          Select 2 or 3 market bank loan products to evaluate reducing interest rates, processing fees, pre-closure charges, and total repayment costs side-by-side.
        </p>
      </div>

      {/* Product Selection Bar */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-ivory">Choose Products to Compare (Select 2 or 3)</h3>
            <p className="text-xs text-ivory-subtle mt-0.5">
              Evaluating on loan amount: <strong className="text-ivory font-mono">₹{(journeyData.requestedAmount || 500000).toLocaleString('en-IN')}</strong> for <strong className="text-emerald-400 font-mono">{journeyData.tenureMonths || 36} months</strong>
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={runComparison}
            isLoading={isComparing}
            icon={Scale}
          >
            Refresh Comparison
          </Button>
        </div>

        {/* Product Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {allLoans.map((loan) => {
            const id = loan._id || loan.id;
            const isSelected = journeyData.comparisonLoanIds?.includes(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCompareLoan(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-semibold shadow-fintech-sm'
                    : 'bg-midnight-950/70 border-slate-700/80 text-slate-300 hover:text-ivory hover:border-slate-600'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-midnight-800 text-slate-400'}`}>
                  {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </div>
                <span>{loan.name}</span>
                <span className="text-[10px] text-ivory-dark font-mono">({loan.interestRate}%)</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Loading / Error States */}
      {isLoading && <LoadingState message="Loading loan products from database..." />}
      {error && <ErrorState title="Comparison Error" message={error} onRetry={runComparison} />}

      {/* Side-by-Side Comparison Table */}
      {comparisonResult && !isComparing && (
        <ComparisonTable
          comparisonData={comparisonResult}
          onSelectWinner={(winner) => navigate('/summary')}
        />
      )}

      {isComparing && (
        <LoadingState message="Computing side-by-side repayment amortization and fees..." />
      )}
    </div>
  );
}
