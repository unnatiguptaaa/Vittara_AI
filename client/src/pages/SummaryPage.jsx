import React from 'react';
import { ReceiptText, ArrowLeft, Bot, BadgePercent } from 'lucide-react';
import SummaryCard from '../components/summary/SummaryCard';
import Button from '../components/common/Button';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function SummaryPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/40">
            Real Session Record
          </span>
          <h1 className="text-3xl font-black text-ivory tracking-tight mt-2 flex items-center gap-2">
            <ReceiptText className="w-8 h-8 text-emerald-400" />
            {t.nav.summary}
          </h1>
          <p className="text-sm text-ivory-subtle mt-1">
            Zero placeholder numbers. This summary uses the exact values calculated during your active session journey.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/loans">
            <Button size="sm" variant="secondary" icon={BadgePercent}>
              Adjust Loan Inputs
            </Button>
          </Link>
          <Link to="/chat">
            <Button size="sm" variant="primary" icon={Bot}>
              Discuss with AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Dynamic Summary Card */}
      <SummaryCard />
    </div>
  );
}
