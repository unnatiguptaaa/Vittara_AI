import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Sparkles } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import InsuranceCard from '../components/insurance/InsuranceCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { apiService } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function InsurancePage() {
  const { t } = useLanguage();

  const [insurances, setInsurances] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['All', 'Health', 'Term Life', 'Motor', 'Critical Illness'];

  const fetchInsurance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getInsurance({
        category: category !== 'All' ? category : undefined,
        search: searchQuery.trim() || undefined
      });

      setInsurances(response.data?.data || []);
    } catch (err) {
      console.error('Insurance fetch error:', err);
      setError('Policy catalog could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurance();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInsurance();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-slate-700/80 text-xs font-medium text-teal-400">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>IRDAI Policy Audit & Fine-Print Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory tracking-tight mt-2.5 flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-teal-400" />
          {t.nav.insurance}
        </h1>
        <p className="text-xs sm:text-sm text-ivory-subtle mt-1 max-w-2xl leading-relaxed">
          Transparent breakdown of health, term life, and motor policies. Audit deductibles, waiting periods, sub-limits, and critical claim exclusions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-fintech-sm font-semibold'
                    : 'bg-midnight-950/70 text-slate-400 hover:text-ivory border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-80">
            <Input
              type="text"
              placeholder="Search provider, plan, or term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="w-4 h-4 text-slate-400" />}
              className="flex-1"
            />
            <Button type="submit" size="md" variant="secondary">
              Search
            </Button>
          </form>
        </div>
      </Card>

      {/* Loading / Error States */}
      {isLoading && <LoadingState message="Loading verified insurance catalog..." />}
      {error && <ErrorState title="Unable to Load Policies" message={error} onRetry={fetchInsurance} />}

      {/* Policies Grid */}
      {!isLoading && !error && (
        <>
          {insurances.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-midnight-800/40 border border-slate-800">
              <p className="text-sm text-slate-400">No insurance plans found matching your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insurances.map((policy) => (
                <InsuranceCard key={policy._id || policy.id} insurance={policy} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
