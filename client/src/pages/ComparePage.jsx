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

  // Load all loan products from MongoDB
  useEffect(() => {
    setIsLoading(true);
    apiService.getLoans()
      .then(res => {
        const list = res.data?.data || [];
        setAllLoans(list);

        // If user has less than 2 products selected, select top 2 by default
        const currentSelected = journeyData.comparisonLoanIds || [];
        if (currentSelected.length < 2 && list.length >= 2) {
          toggleCompareLoan(list[0]._id || list[0].id);
          toggleCompareLoan(list[1]._id || list[1].id);
        }
      })
      .catch(err => {
        setError('Financial data could not be loaded.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Run dynamic comparison when selection changes or amount changes
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
        amount: journeyData.requestedAmount || 200000,
        tenure: journeyData.tenureMonths || 36
      });

      setComparisonResult(response.data?.data);
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err.response?.data?.error || 'No matching demo products found.');
    } finally {
      setIsComparing(false);
    }
  };

  // Auto-run comparison when loans or selection changes
  useEffect(() => {
    if (journeyData.comparisonLoanIds?.length >= 2) {
      runComparison();
    }
  }, [journeyData.comparisonLoanIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Side-by-Side Product Benchmarking
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
          <Scale className="w-8 h-8 text-emerald-600" />
          {t.nav.compare}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Select 2 or 3 market bank loan products from MongoDB to dynamically evaluate interest rates, processing fees, total repayment costs, and pre-closure terms side-by-side.
        </p>
      </div>

      {/* Product Selection Bar */}
      <Card className="p-5 bg-white border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Choose Products to Compare (Select 2 or 3)</h3>
            <p className="text-xs text-slate-500">
              Comparing on loan amount: <strong className="text-emerald-700">₹{(journeyData.requestedAmount || 200000).toLocaleString('en-IN')}</strong> for <strong className="text-emerald-700">{journeyData.tenureMonths || 36} months</strong>
            </p>
          </div>

          <Button
            size="sm"
            onClick={runComparison}
            isLoading={isComparing}
            icon={Scale}
          >
            Refresh Comparison
          </Button>
        </div>

        {/* Product Chips */}
        <div className="flex flex-wrap gap-2">
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
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </div>
                <span>{loan.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({loan.interestRate}%)</span>
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
        <LoadingState message="Computing side-by-side repayment metrics and fee structures..." />
      )}
    </div>
  );
}
