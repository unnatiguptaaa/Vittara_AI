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
      setError('Financial data could not be loaded.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          MongoDB Policy Catalog & Underwriting
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-teal-600" />
          {t.nav.insurance}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Search and inspect real insurance plans loaded directly from MongoDB. Review real deductibles, waiting periods, coverage limits, and explicit exclusions before selecting a policy.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <Card className="p-5 bg-white border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by policy name or insurer (e.g. Care Shield, Max Life, Star Health)..."
              prefix={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button type="submit" size="md" icon={Search} className="w-full md:w-auto">
            Search
          </Button>
        </form>
      </Card>

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading policy records from database..." />}

      {/* Error State */}
      {error && <ErrorState title="Database Query Notice" message={error} onRetry={fetchInsurance} />}

      {/* Insurance Cards Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {insurances.map((item) => (
            <InsuranceCard
              key={item._id || item.id}
              insurance={item}
            />
          ))}

          {insurances.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              No matching demo insurance products found in MongoDB.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
