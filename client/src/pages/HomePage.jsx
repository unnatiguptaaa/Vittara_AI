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
  ArrowDown,
  Sparkles,
  Shield,
  CheckCircle2,
  Lock,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Finance3DComposition from '../components/common/Finance3DComposition';
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

  const handleScrollToTools = () => {
    const toolsElement = document.getElementById('financial-tools');
    if (toolsElement) {
      toolsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      to: '/loans',
      title: t.nav.loans,
      desc: language === 'Hindi'
        ? 'आय और निश्चित खर्चों के आधार पर ऋण पात्रता (DTI) और बैंक विकल्पों का मूल्यांकन करें।'
        : language === 'Hinglish'
        ? 'Apni income aur expenses ke hisaab se loan eligibility aur DTI ratio check karein.'
        : 'Evaluate true borrowing capacity, debt-to-income (DTI) ratio, and matching bank product tiers.',
      icon: BadgePercent,
      badge: 'Eligibility Engine',
      edgeClass: 'edge-glow-cyan',
      accentText: 'text-cyan-400',
      iconHover: 'group-hover:bg-cyan-500/15 group-hover:border-cyan-500/50',
      iconHoverText: 'group-hover:text-cyan-300',
      titleHover: 'group-hover:text-cyan-300'
    },
    {
      to: '/calculator',
      title: t.nav.calculator,
      desc: language === 'Hindi'
        ? 'ऋण राशि, ब्याज दर और अवधि बदलकर तुरंत सटीक मासिक ईएमआई और कुल ब्याज निकालें।'
        : language === 'Hinglish'
        ? 'Real formula se instant monthly EMI, total interest aur repayment schedule calculate karein.'
        : 'Instant mathematical breakdown of monthly installments, reducing interest, and total credit cost.',
      icon: Calculator,
      badge: 'Mathematical Engine',
      edgeClass: 'edge-glow-purple',
      accentText: 'text-purple-400',
      iconHover: 'group-hover:bg-purple-500/15 group-hover:border-purple-500/50',
      iconHoverText: 'group-hover:text-purple-300',
      titleHover: 'group-hover:text-purple-300'
    },
    {
      to: '/compare',
      title: t.nav.compare,
      desc: language === 'Hindi'
        ? 'शीर्ष बैंकों के लोन उत्पादों की ब्याज दरों, प्रोसेसिंग शुल्क और शर्तों की साथ-साथ तुलना करें।'
        : language === 'Hinglish'
        ? 'Top banks ke loan products ko side-by-side compare karein aur fees check karein.'
        : 'Side-by-side analysis of bank interest rates, processing fees, pre-closure terms, and total repayment.',
      icon: Scale,
      badge: 'Product Matrix',
      edgeClass: 'edge-glow-emerald',
      accentText: 'text-emerald-400',
      iconHover: 'group-hover:bg-emerald-500/15 group-hover:border-emerald-500/50',
      iconHoverText: 'group-hover:text-emerald-300',
      titleHover: 'group-hover:text-emerald-300'
    },
    {
      to: '/insurance',
      title: t.nav.insurance,
      desc: language === 'Hindi'
        ? 'हेल्थ और लाइफ इंश्योरेंस में डिडक्टिबल, वेटिंग पीरियड और पॉलिसी अपवादों को पारदर्शी तरीके से समझें।'
        : language === 'Hinglish'
        ? 'Health aur Life insurance plans ki coverage, deductible aur exclusions ko clearly samjhein.'
        : 'Transparent audit of deductibles, waiting periods, sub-limits, and critical policy exclusions.',
      icon: ShieldCheck,
      badge: 'Policy Audit',
      edgeClass: 'edge-glow-rose',
      accentText: 'text-rose-400',
      iconHover: 'group-hover:bg-rose-500/15 group-hover:border-rose-500/50',
      iconHoverText: 'group-hover:text-rose-300',
      titleHover: 'group-hover:text-rose-300'
    },
    {
      to: '/terms',
      title: t.nav.terms,
      desc: language === 'Hindi'
        ? 'APR, Deductible, Co-pay जैसे जटिल वित्तीय शब्दों को रोजमर्रा के उदाहरणों से समझें।'
        : language === 'Hinglish'
        ? 'Deductible, APR, NCB jaise complex banking terms ko simple everyday analogies se decode karein.'
        : 'Plain-language definitions, Indian financial examples, and intuitive analogies powered by Gemini.',
      icon: BookOpen,
      badge: 'Multilingual AI',
      edgeClass: 'edge-glow-amber',
      accentText: 'text-amber-400',
      iconHover: 'group-hover:bg-amber-500/15 group-hover:border-amber-500/50',
      iconHoverText: 'group-hover:text-amber-300',
      titleHover: 'group-hover:text-amber-300'
    },
    {
      to: '/documents',
      title: t.nav.documents,
      desc: language === 'Hindi'
        ? 'सैंक्शन लेटर या पॉलिसी दस्तावेज अपलोड करें और छूटी हुई शर्तों का सख्त गैर-भ्रामक ऑडिट पाएं।'
        : language === 'Hinglish'
        ? 'Sanction letter ya agreement upload karein aur unstated terms ka strict audit report dekhein.'
        : 'Upload loan sanction letters. Audits critical figures with strict "Not found in document" flags.',
      icon: FileText,
      badge: 'Agreement Audit',
      edgeClass: 'edge-glow-blue',
      accentText: 'text-blue-400',
      iconHover: 'group-hover:bg-blue-500/15 group-hover:border-blue-500/50',
      iconHoverText: 'group-hover:text-blue-300',
      titleHover: 'group-hover:text-blue-300'
    }
  ];

  const suggestedQuestions = [
    { label: 'What is a deductible?', query: 'Explain deductible in health insurance with an example.' },
    { label: '₹5L Loan EMI calculation', query: 'Calculate monthly EMI for ₹5,00,000 for 36 months at 10.5%.' },
    { label: 'Flat vs Reducing Rate', query: 'What is the difference between flat and reducing interest rates?' },
    { label: 'What is APR?', query: 'Explain APR in simple words and how it includes processing fees.' }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Clear copy and primary CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-zinc-800 text-xs font-medium text-cyan-400 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Financial Intelligence & Borrowing Advisor</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ivory tracking-tight leading-[1.15]">
                {language === 'Hindi' ? (
                  <>
                    लोन और बीमा के सही फैसले लें,{' '}
                    <span className="text-cyan-400">पूरी स्पष्टता और विश्वास के साथ।</span>
                  </>
                ) : language === 'Hinglish' ? (
                  <>
                    Loan aur insurance ke smart decisions,{' '}
                    <span className="text-cyan-400">bina kisi confusion ke.</span>
                  </>
                ) : (
                  <>
                    Make complex financial decisions{' '}
                    <span className="text-cyan-400">with absolute clarity.</span>
                  </>
                )}
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                {language === 'Hindi'
                  ? 'विट्टारा एआई आपको बिना किसी एजेंट के बैंकों के असली ब्याज दरों की तुलना करने, सही ईएमआई निकालने और वित्तीय दस्तावेजों का पारदर्शी ऑडिट करने में मदद करता है।'
                  : language === 'Hinglish'
                  ? 'Real bank interest rates compare karein, DTI eligibility check karein aur sanction letters ko bina kisi broker bias ke audit karein.'
                  : 'Evaluate your true borrowing capacity, calculate exact reducing-balance EMIs, decode insurance deductibles, and audit financial agreements without broker bias.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link to="/chat">
                  <Button size="lg" variant="primary" icon={Bot} className="w-full sm:w-auto">
                    {language === 'Hindi' ? 'एआई सलाहकार से पूछें' : language === 'Hinglish' ? 'Consult AI Advisor' : 'Consult AI Advisor'}
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="secondary"
                  icon={ArrowDown}
                  onClick={handleScrollToTools}
                  className="w-full sm:w-auto"
                >
                  {language === 'Hindi' ? 'वित्तीय टूल्स देखें' : language === 'Hinglish' ? 'Explore Financial Tools' : 'Explore Financial Tools'}
                </Button>
              </div>

              {/* Subtle Methodology Pillars */}
              <div className="pt-6 border-t border-zinc-850 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-white block font-mono">100% RBI Formula</span>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">Standard reducing balance</span>
                </div>
                <div>
                  <span className="font-semibold text-white block font-mono">Zero Hallucination</span>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">Strict document audit</span>
                </div>
                <div>
                  <span className="font-semibold text-white block font-mono">No Broker Bias</span>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">Pure math & transparency</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Loan & EMI Simulator */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <Finance3DComposition />
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE USER JOURNEY ALERT (if active calculation exists) */}
      {journeyData.hasActiveJourney && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="black-card-3d edge-glow-emerald p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ReceiptText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Active Session Calculation in Progress</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Requested Amount: <strong className="text-white font-mono">₹{Number(journeyData.requestedAmount).toLocaleString('en-IN')}</strong> at <strong className="text-cyan-400 font-mono">{journeyData.interestRate}%</strong> • Monthly EMI: <strong className="text-emerald-400 font-mono">₹{Number(journeyData.monthlyEmi).toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>

            <Link to="/summary">
              <Button size="sm" variant="primary" icon={ArrowRight}>
                View Financial Summary
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* THE DIGITAL FINANCIAL HUB (WHATIN THEME WITH SPECIFIC EDGE LIGHT CARDS) */}
      <section id="financial-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ivory tracking-tight">
            {language === 'Hindi'
              ? 'द डिजिटल फाइनेंशियल हब'
              : language === 'Hinglish'
              ? 'The Digital Financial Hub'
              : 'The Digital Financial Hub'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-white via-slate-200 to-transparent rounded-full mx-auto my-3 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {language === 'Hindi'
              ? 'वित्तीय महारत की ओर अपनी यात्रा शुरू करने के लिए अपना पसंदीदा मॉड्यूल चुनें। सभी गणनाएं और बैंक उत्पाद पूरी तरह सत्यापित हैं।'
              : language === 'Hinglish'
              ? 'Select your target domain to begin your journey towards technical financial mastery. All modules are verified for authenticity and precision.'
              : 'Select your target domain to begin your journey towards technical mastery. All banking calculations and tools are verified for authenticity and relevance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link key={feat.to} to={feat.to} className="group block focus:outline-none">
                <div className={`black-card-3d ${feat.edgeClass} h-full flex flex-col justify-between p-8 rounded-[28px] text-center backdrop-blur-xl relative overflow-hidden transition-all duration-300`}>
                  <div>
                    {/* Centered Squircle Icon container with matching hover aura */}
                    <div className={`w-20 h-20 rounded-[22px] bg-zinc-950 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${feat.iconHover}`}>
                      <Icon className={`w-9 h-9 text-white drop-shadow-md transition-colors duration-300 ${feat.iconHoverText}`} />
                    </div>

                    <h3 className={`text-lg font-bold text-white tracking-wide uppercase mb-2 transition-colors duration-300 ${feat.titleHover}`}>
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                      {feat.desc}
                    </p>
                  </div>

                  <div className={`pt-5 mt-6 border-t border-zinc-850 flex items-center justify-center gap-1.5 text-xs font-semibold ${feat.accentText} group-hover:text-white transition-colors`}>
                    <span>Explore Module</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* POLISHED AI QUESTION SECTION (3D BLACK BOX WITH CYAN EDGE GLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="black-card-3d edge-glow-cyan p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <Bot className="w-4 h-4" />
              <span>Direct Financial Query Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ask anything about personal finance, borrowing, or insurance
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Ask about complex clauses, loan comparisons, or definitions in English, Hindi, or Hinglish.
            </p>
          </div>

          {/* Question Input Form */}
          <form onSubmit={handleQuickAsk} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-black border border-zinc-800 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all shadow-inner">
              <div className="flex items-center flex-1 px-3">
                <HelpCircle className="w-5 h-5 text-zinc-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder={
                    language === 'Hindi'
                      ? 'वित्तीय प्रश्न पूछें (जैसे: "Deductible क्या होता है?", "₹5 लाख पर 36 महीने की EMI")...'
                      : language === 'Hinglish'
                      ? 'Financial sawaal poochiye (jaise: "Deductible kya hota hai?", "SBI vs HDFC loan compare")...'
                      : 'Ask a financial question (e.g., "What is a deductible in health insurance?", "Calculate EMI for ₹5L")...'
                  }
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none py-2.5"
                />
              </div>

              <Button type="submit" size="md" variant="primary" icon={ArrowRight} className="sm:w-auto w-full">
                {language === 'Hindi' ? 'पूछें' : language === 'Hinglish' ? 'Ask AI' : 'Ask AI'}
              </Button>
            </div>

            {/* Suggested Prompts */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
              <span className="text-zinc-500 font-medium shrink-0">Suggested:</span>
              {suggestedQuestions.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => navigate(`/chat?q=${encodeURIComponent(chip.query)}`)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors text-xs font-mono"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* METHODOLOGY & HIGH-TRUST HIGHLIGHTS (SPECIFIC EDGE LIGHTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          <div className="black-card-3d edge-glow-cyan p-5 rounded-2xl flex items-start gap-3.5 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 text-cyan-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Reducing Balance Math</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Standard Indian banking formulas calculate exact interest amortization with no hidden markup.
              </p>
            </div>
          </div>

          <div className="black-card-3d edge-glow-emerald p-5 rounded-2xl flex items-start gap-3.5 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Non-Hallucinatory Extraction</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Document agreements are audited strictly: missing or unstated clauses are explicitly flagged.
              </p>
            </div>
          </div>

          <div className="black-card-3d edge-glow-blue p-5 rounded-2xl flex items-start gap-3.5 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Privacy First</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Session inputs stay in your active browser session and local database without broker solicitation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

