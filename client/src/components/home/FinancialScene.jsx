import React, { useState } from 'react';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from '../common/BrandMark';
import useTilt from '../common/useTilt';

export default function FinancialScene({ language }) {
  const sceneRef = useTilt(12);
  const [months, setMonths] = useState(36);
  const monthlyRate = 10.5 / 1200;
  const factor = (1 + monthlyRate) ** months;
  const emi = Math.round(200000 * monthlyRate * factor / (factor - 1));
  const hindi = language === 'Hindi';
  return (
    <div className="finance-scene" ref={sceneRef}>
      <div className="scene-glow" aria-hidden="true" /><div className="scene-grid" aria-hidden="true" />
      <div className="scene-orbit orbit-one" aria-hidden="true" /><div className="scene-orbit orbit-two" aria-hidden="true" />
      <div className="scene-composition">
        <div className="rupee-coin coin-large" aria-hidden="true"><span>₹</span></div><div className="rupee-coin coin-small" aria-hidden="true"><span>₹</span></div>
        <div className="card-depth depth-two" aria-hidden="true" /><div className="card-depth depth-one" aria-hidden="true" />
        <div className="finance-preview">
          <div className="preview-top"><span className="preview-brand"><BrandMark /> vittara<span className="preview-ai">AI</span></span><span className="preview-label">{hindi ? 'लोन प्रीव्यू' : 'LOAN PREVIEW'}</span></div>
          <div className="preview-amount-label">{hindi ? 'आपकी मासिक ईएमआई' : 'Your monthly EMI'}</div>
          <div className="preview-amount" aria-live="polite" aria-atomic="true" key={months}>₹{emi.toLocaleString('en-IN')}<span>/mo</span></div>
          <p className="preview-example">{hindi ? 'उदाहरण' : 'Illustration'} · ₹2,00,000 at 10.5% p.a.</p>
          <div className="repayment-chart" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <span key={i} style={{ '--bar-height': `${88 - i * 3.5}%`, '--bar-delay': `${i * 32}ms` }} />)}</div>
          <div className="chart-labels"><span>{hindi ? 'बाकी लोन राशि' : 'Outstanding balance'}</span><span>{months} {hindi ? 'महीने' : 'months'}</span></div>
          <div className="preview-bottom"><div className="tenure-switch" role="group" aria-label="Preview repayment tenure">{[12, 24, 36].map(value => <button key={value} onClick={() => setMonths(value)} aria-pressed={months === value} className={months === value ? 'selected' : ''}>{value}m</button>)}</div><Link to="/calculator" className="preview-link" aria-label="Open EMI calculator"><ArrowUpRight size={18} /></Link></div>
        </div>
        <div className="floating-insight"><span className="insight-icon"><ShieldCheck size={21} /></span><div><strong>{hindi ? 'हर पहलू समझें' : 'Clarity before commitment'}</strong><span>{hindi ? 'ईएमआई, ब्याज और छिपे शुल्क' : 'EMIs, interest & the fine print'}</span></div><span className="insight-dot" /></div>
        <div className="floating-ai"><Sparkles size={14} /><span>{hindi ? 'आपके साथ, हर कदम' : 'A smarter way forward'}</span></div>
      </div>
      <span className="scene-coordinate" aria-hidden="true">INTELLIGENCE, IN YOUR INTEREST.</span>
    </div>
  );
}
