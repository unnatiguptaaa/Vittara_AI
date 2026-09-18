import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Lightbulb, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { apiService } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function TermExplainerPage() {
  const { language, t } = useLanguage();

  // The 8 explicit terms required by prompt + 4 additional banking terms
  const primaryTerms = [
    'APR',
    'Deductible',
    'Premium',
    'Tenure',
    'Processing Fee',
    'Waiting Period',
    'Coverage',
    'Exclusions',
    'Co-pay',
    'Pre-closure Penalty',
    'LTV Ratio',
    'NCB'
  ];

  const [activeTerm, setActiveTerm] = useState('Deductible');
  const [termData, setTermData] = useState(null);
  const [customTerm, setCustomTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTerm = async (termToFetch) => {
    const target = (termToFetch || activeTerm).trim();
    if (!target) return;

    setActiveTerm(target);
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiService.getTermExplanation(target, language);
      setTermData(res.data);
    } catch (err) {
      console.error('Term explanation error:', err);
      setError(err.response?.data?.error || 'Vittara AI is temporarily unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when language changes so explanations dynamically match the active language!
  useEffect(() => {
    fetchTerm(activeTerm);
  }, [language]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customTerm.trim()) {
      fetchTerm(customTerm.trim());
      setCustomTerm('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Multilingual Gemini Reasoning
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          {t.nav.terms}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Click any financial term below. The application dynamically queries Google Gemini 3.8 Flash to return a crystal-clear breakdown with everyday analogies in <strong className="text-emerald-700">{language}</strong>.
        </p>
      </div>

      {/* Primary Clickable Term Chips */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Click Any Term to Request Live Gemini Explanation:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {primaryTerms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => fetchTerm(term)}
              className={`p-3 rounded-xl text-xs font-bold transition-all text-center border ${
                activeTerm.toLowerCase() === term.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Term Search */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2 max-w-md">
        <Input
          type="text"
          value={customTerm}
          onChange={(e) => setCustomTerm(e.target.value)}
          placeholder="Or enter any custom term (e.g., Amortization)..."
        />
        <Button type="submit" size="md" icon={Sparkles} className="shrink-0">
          Explain
        </Button>
      </form>

      {/* Loading State */}
      {isLoading && (
        <LoadingState message={`Requesting explanation for "${activeTerm}" from Gemini in ${language}...`} />
      )}

      {/* Error State */}
      {error && (
        <ErrorState
          title="Explanation Notice"
          message={error}
          onRetry={() => fetchTerm(activeTerm)}
        />
      )}

      {/* Term Result Card */}
      {termData && !isLoading && (
        <Card className="p-6 md:p-8 bg-white border-slate-200 shadow-sm space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {termData.category || 'Financial Concept'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Language: {termData.language || language}
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {termData.term}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Source: {termData.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Database Record'}</span>
            </div>
          </div>

          {/* Short Definition */}
          {termData.shortDefinition && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Short Definition
              </h4>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {termData.shortDefinition}
              </p>
            </div>
          )}

          {/* AI Explanation Content */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Comprehensive AI Explanation
            </h4>
            <div className="text-sm text-slate-800 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
              {termData.explanation}
            </div>
          </div>

          {/* Practical Example & Analogy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {termData.example && (
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80">
                <h5 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Real-World Example
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {termData.example}
                </p>
              </div>
            )}

            {termData.analogy && (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" /> Everyday Analogy
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {termData.analogy}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
