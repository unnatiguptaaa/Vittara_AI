import React from 'react';
import { Shield, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const isBright = theme === 'bright';

  return (
    <footer className={`w-full border-t transition-colors duration-300 py-12 mt-20 text-xs ${
      isBright 
        ? 'bg-white border-slate-200 text-slate-600' 
        : 'bg-black border-zinc-900 text-zinc-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Footer Container Box */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
          isBright
            ? 'bg-[#F8FAFC] border-slate-200'
            : 'bg-black border-zinc-850 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-850">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${
                  isBright ? 'from-[#00BAF2] to-[#006699]' : 'from-cyan-400 to-blue-600'
                } flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(0,174,239,0.35)]`}>
                  V
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-extrabold text-base tracking-tight ${isBright ? 'text-[#002970]' : 'text-white'}`}>
                    Vittara AI
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold ${
                    isBright ? 'bg-sky-100 text-[#0088CC]' : 'bg-zinc-900 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    AI
                  </span>
                </div>
              </div>
              <p className={`text-xs max-w-md leading-relaxed ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                An intelligent financial companion designed for Indian borrowers and policyholders. Demystifying loan math, insurance clauses, and banking documents with clear, transparent guidance.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isBright ? 'text-[#002970]' : 'text-white'}`}>
                Financial Tools
              </h4>
              <ul className={`space-y-2 text-xs ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                <li>
                  <Link to="/calculator" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <span>EMI Calculator</span>
                  </Link>
                </li>
                <li>
                  <Link to="/loans" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <span>Loan Assistant</span>
                  </Link>
                </li>
                <li>
                  <Link to="/compare" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <span>Compare Loans</span>
                  </Link>
                </li>
                <li>
                  <Link to="/insurance" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <span>Insurance Explainer</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Compliance & Clarity */}
            <div className="space-y-2.5">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isBright ? 'text-[#002970]' : 'text-white'}`}>
                Transparency
              </h4>
              <ul className={`space-y-2 text-xs ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                <li>
                  <Link to="/terms" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <span>Financial Glossary</span>
                  </Link>
                </li>
                <li>
                  <Link to="/documents" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <span>Document Audit</span>
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <span>AI Advisor</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Regulatory & Methodology Disclaimer */}
          <div className={`pt-6 space-y-3 text-[11px] leading-relaxed ${isBright ? 'text-slate-500' : 'text-zinc-500'}`}>
            <p>
              <strong className={isBright ? 'text-slate-700' : 'text-zinc-300'}>Regulatory Notice:</strong> Vittara AI is an educational and analytical tool designed to simplify financial concepts. Calculations utilize standard Indian banking formulas (reducing balance Equated Monthly Installment model) adhering to RBI guidelines. Actual loan approvals, interest rates, processing fees, and insurance underwriting decisions are subject to individual lender and insurer policies.
            </p>
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-zinc-850 text-[11px] ${
              isBright ? 'text-slate-500' : 'text-zinc-500'
            }`}>
              <p>&copy; {new Date().getFullYear()} Vittara AI. Designed with clarity and precision.</p>
              <div className="flex items-center gap-4">
                <span>RBI Reducing Balance Math</span>
                <span>•</span>
                <span>Zero Hallucination Audit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

