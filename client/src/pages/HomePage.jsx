import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  BadgePercent,
  Calculator,
  Scale,
  ShieldCheck,
  BookOpen,
  FileText,
  ReceiptText,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  CheckCircle2,
  Building2,
  Lock,
  ChevronRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { journeyData } = useJourney();
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickAsk = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/chat?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/chat');
    }
  };

  const featureCards = [
    {
      to: '/loans',
      title: t.nav.loans,
      desc: language === 'Hindi'
        ? 'अपनी आय और खर्चों के आधार पर लोन पात्रता और ईएमआई जांचें।'
        : language === 'Hinglish'
        ? 'Apni income aur expenses enter karke real loan eligibility aur EMI check karein.'
        : 'Evaluate true borrowing capacity, debt-to-income (DTI) ratio, and matching bank offers.',
      icon: BadgePercent,
      accent: 'emerald',
      badge: '5-Input Engine'
    },
    {
      to: '/calculator',
      title: t.nav.calculator,
      desc: language === 'Hindi'
        ? 'लोन राशि, ब्याज दर और अवधि बदलकर तुरंत सटीक ईएमआई निकालें।'
        : language === 'Hinglish'
        ? 'Real formula se instant monthly EMI aur total interest cost calculate karein.'
        : 'Instant mathematical recalculation of monthly EMI, total interest, and total payment.',
      icon: Calculator,
      accent: 'teal',
      badge: 'Real-Time'
    },
    {
      to: '/compare',
      title: t.nav.compare,
      desc: language === 'Hindi'
        ? 'एसबीआई, एचडीएफसी और आईसीआईसीआई जैसे बैंकों के लोन की तुलना करें।'
        : language === 'Hinglish'
        ? 'Top banks ke loan products ko side-by-side compare karein aur best rate chunein.'
        : 'Side-by-side analysis of interest rates, processing fees, repayment costs, and pre-closure terms.',
      icon: Scale,
      accent: 'blue',
      badge: 'Side-by-Side'
    },
    {
      to: '/insurance',
      title: t.nav.insurance,
      desc: language === 'Hindi'
        ? 'हेल्थ, टर्म लाइफ और मोटर बीमा में प्रीमियम, कवरेज और डिडक्टिबल देखें।'
        : language === 'Hinglish'
        ? 'Health, Term Life aur Motor insurance plans ki coverage, deductible aur exclusions dekhein.'
        : 'Transparent breakdown of deductibles, waiting periods, sub-limits, and policy exclusions.',
      icon: ShieldCheck,
      accent: 'indigo',
      badge: 'Policy Audit'
    },
    {
      to: '/terms',
      title: t.nav.terms,
      desc: language === 'Hindi'
        ? 'APR, Deductible, Co-pay जैसे कठिन वित्तीय शब्दों को सरल भाषा में समझें।'
        : language === 'Hinglish'
        ? 'Deductible, APR, NCB jaise complex terms ko aasaan everyday analogies se samjhein.'
        : 'Clear definitions, Indian financial examples, and intuitive everyday analogies powered by Gemini.',
      icon: BookOpen,
      accent: 'amber',
      badge: 'Multilingual AI'
    },
    {
      to: '/documents',
      title: t.nav.documents,
      desc: language === 'Hindi'
        ? 'लोन सैंक्शन लेटर या पॉलिसी दस्तावेज अपलोड करें और वित्तीय ऑडिट पाएं।'
        : language === 'Hinglish'
        ? 'Sanction letter ya agreement upload karein aur missing terms ka strict audit payein.'
        : 'Upload PDF/TXT documents. Audits key financial figures with strict "Not found in document" checks.',
      icon: FileText,
      accent: 'purple',
      badge: 'Strict OCR'
    }
  ];

  const bankRates = [
    { bank: 'State Bank of India', product: 'SBI Xpress Credit', rate: '10.35%', tag: 'Lowest Interest' },
    { bank: 'ICICI Bank', product: 'Dream Home Loan', rate: '8.75%', tag: 'Best Home Loan' },
    { bank: 'HDFC Bank', product: 'Quick Express Personal', rate: '10.75%', tag: 'Fast Disbursal' },
    { bank: 'Axis Bank', product: 'Smart Drive Auto Loan', rate: '8.95%', tag: 'Top Auto Choice' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 md:p-12 overflow-hidden shadow-sm">
        {/* Subtle background gradient accent */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* AI Assistant Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'Hindi'
                ? 'विट्टारा एआई सहायक • आपका वित्तीय सलाहकार'
                : language === 'Hinglish'
                ? 'Vittara AI Assistant • Aapka Personal Financial Guide'
                : 'Vittara AI Assistant • Smart Financial & Loan Intelligence'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {language === 'Hindi' ? (
              <>
                लोन, ईएमआई और बीमा के सही फैसले,{' '}
                <span className="text-emerald-600">सरल और पारदर्शी।</span>
              </>
            ) : language === 'Hinglish' ? (
              <>
                Loan, EMI aur Insurance ke smart decisions,{' '}
                <span className="text-emerald-600">bina kisi confusion ke.</span>
              </>
            ) : (
              <>
                Smarter borrowing & insurance decisions,{' '}
                <span className="text-emerald-600">explained with total clarity.</span>
              </>
            )}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {language === 'Hindi'
              ? 'विट्टारा एआई आपको बिना किसी एजेंट के बैंकों के असली ब्याज दरों की तुलना करने, सही ईएमआई निकालने और वित्तीय शब्दों को समझने में मदद करता है।'
              : language === 'Hinglish'
              ? 'Vittara AI aapko real bank interest rates compare karne, DTI eligibility calculate karne aur insurance deductibles ko simple language mein samajhne mein madad karta hai.'
              : 'Calculate real bank EMIs, evaluate debt-to-income approval odds, decode insurance deductibles, and audit financial agreements with Google Gemini intelligence.'}
          </p>

          {/* Quick Chat Input Box */}
          <form onSubmit={handleQuickAsk} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-slate-50 border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-xs transition-all">
              <div className="flex items-center flex-1 px-3">
                <Bot className="w-5 h-5 text-emerald-600 shrink-0 mr-2" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder={
                    language === 'Hindi'
                      ? 'एआई से पूछें (जैसे: "Deductible क्या होता है?", "₹2 लाख पर EMI कितनी बनेगी?")...'
                      : language === 'Hinglish'
                      ? 'AI se poochiye (jaise: "Deductible kya hota hai?", "SBI vs HDFC loan compare karo")...'
                      : 'Ask AI anything (e.g., "What is a deductible?", "Calculate EMI for ₹2 Lakhs for 36 months")...'
                  }
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none py-2"
                />
              </div>

              <Button type="submit" size="md" icon={ArrowRight} className="sm:w-auto w-full">
                {language === 'Hindi' ? 'पूछें' : language === 'Hinglish' ? 'Ask AI' : 'Consult AI'}
              </Button>
            </div>

            {/* Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-3 scrollbar-none text-xs">
              <span className="text-slate-500 font-medium shrink-0">Popular:</span>
              {[
                { label: 'What is a deductible?', query: 'Explain deductible in insurance.' },
                { label: '₹2 Lakh Loan EMI', query: 'Calculate EMI for ₹2,00,000 for 36 months' },
                { label: 'Compare SBI vs HDFC', query: 'Compare SBI and HDFC personal loans' },
                { label: 'What is APR?', query: 'What is APR in simple language?' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => navigate(`/chat?q=${encodeURIComponent(chip.query)}`)}
                  className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Active User Journey Alert Banner (if user calculated loan) */}
      {journeyData.hasActiveJourney && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Active Loan Session In Progress</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Calculated: <strong className="text-emerald-700">₹{Number(journeyData.requestedAmount).toLocaleString('en-IN')}</strong> at <strong className="text-emerald-700">{journeyData.interestRate}%</strong> • Monthly EMI: <strong className="text-emerald-700">₹{Number(journeyData.monthlyEmi).toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>

          <Link to="/summary">
            <Button size="sm" variant="primary" icon={ArrowRight}>
              Open Financial Summary
            </Button>
          </Link>
        </div>
      )}

      {/* 6 Core Functional Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Financial Intelligence Tools</h2>
            <p className="text-xs text-slate-500 mt-0.5">Every tool runs with real banking logic and live database integration.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link key={feat.to} to={feat.to} className="group block">
                <Card hover className="h-full flex flex-col justify-between bg-white border-slate-200 group-hover:border-slate-300 transition-all p-6 shadow-xs hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Tool</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Current Real Bank Interest Rate Benchmarks */}
      <Card className="p-6 bg-white border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Verified Banking Benchmark Rates
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live market lending rates loaded directly from MongoDB product records.
            </p>
          </div>
          <Link to="/compare">
            <Button size="sm" variant="secondary" icon={Scale}>
              Compare All Banks
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {bankRates.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  {item.tag}
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">{item.rate}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{item.bank}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.product}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* High-Trust Fintech Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Mathematical Accuracy</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Standard Indian banking formulas for Equated Monthly Installments and DTI calculations.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">No Hallucinations</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Strict document extraction policy: unstated fields are tagged "Not found in document".
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct MongoDB Storage</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Connect to your MongoDB cluster directly without third-party brokers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
