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
      setError(err.response?.data?.error || 'Explanation is temporarily unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800 border border-slate-700/80 text-xs font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Multilingual Financial Intelligence Dictionary</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory tracking-tight mt-2.5 flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-emerald-400" />
          {t.nav.terms}
        </h1>
        <p className="text-xs sm:text-sm text-ivory-subtle mt-1 max-w-2xl leading-relaxed">
          Click any financial term below. The engine breaks down complex banking jargon with everyday analogies in <strong className="text-emerald-400 font-semibold">{language}</strong>.
        </p>
      </div>

      {/* Primary Clickable Term Chips */}
      <div className="space-y-3">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-300 block">
          Select a Term to Inspect Breakdown:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {primaryTerms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => fetchTerm(term)}
              className={`p-3 rounded-xl text-xs font-medium transition-all text-center border ${
                activeTerm.toLowerCase() === term.toLowerCase()
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-fintech-sm font-semibold'
                  : 'bg-midnight-950/70 border-slate-800 text-slate-300 hover:text-ivory hover:border-slate-700'
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
          placeholder="Or enter custom term (e.g., Amortization)..."
        />
        <Button type="submit" size="md" variant="secondary" icon={Sparkles} className="shrink-0">
          Explain
        </Button>
      </form>

      {/* Loading State */}
      {isLoading && (
        <LoadingState message={`Retrieving explanation for "${activeTerm}" in ${language}...`} />
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
        <Card className="p-6 md:p-8 space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                  {termData.category || 'Financial Concept'}
                </span>
                <span className="text-[10px] font-mono text-ivory-dark">
                  Language: {termData.language || language}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-1">
                {termData.term}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-midnight-950 border border-slate-800 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Engine: {termData.source === 'gemini-3.8-flash' ? 'Google Gemini 3.8' : 'Verified Knowledge Base'}</span>
            </div>
          </div>

          {/* Short Definition */}
          {termData.shortDefinition && (
            <div className="p-4 rounded-xl bg-midnight-950 border border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                Short Definition
              </h4>
              <p className="text-sm text-ivory font-medium leading-relaxed">
                {termData.shortDefinition}
              </p>
            </div>
          )}

          {/* AI Explanation Content */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Comprehensive Breakdown
            </h4>
            <div className="text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line bg-midnight-950/60 p-4 rounded-xl border border-slate-800">
              {termData.explanation}
            </div>
          </div>

          {/* Practical Example & Analogy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {termData.example && (
              <div className="p-4 rounded-xl bg-midnight-950/80 border border-slate-800">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> Indian Banking Example
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {termData.example}
                </p>
              </div>
            )}

            {termData.analogy && (
              <div className="p-4 rounded-xl bg-midnight-950/80 border border-slate-800">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-gold-400" /> Everyday Analogy
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
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
