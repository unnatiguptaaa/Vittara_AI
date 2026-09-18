import React from 'react';
import { Check, Star, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useJourney } from '../../context/JourneyContext';

export default function ComparisonTable({ comparisonData, onSelectWinner = null }) {
  const { comparisons, highlights } = comparisonData;
  const { updateJourney } = useJourney();

  if (!comparisons || comparisons.length < 2) return null;

  return (
    <div className="space-y-6">
      {/* Dynamic Highlights Header */}
      {highlights && (
        <div className="p-5 rounded-2xl bg-midnight-800 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4 shadow-fintech-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ivory">Comparison Analysis</h4>
              <p className="text-xs text-ivory-subtle">
                Rate variance: <strong className="text-emerald-400 font-mono">{highlights.rateDiff}%</strong> • Monthly savings potential: <strong className="text-emerald-400 font-mono">₹{highlights.monthlySaving.toLocaleString('en-IN')}/mo</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-midnight-950 border border-slate-800 text-slate-300 font-mono">
              Lowest Rate: <strong className="text-emerald-400">{highlights.lowestRate}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-midnight-950 border border-slate-800 text-slate-300 font-mono">
              Lowest Fee: <strong className="text-teal-400">{highlights.lowestFee}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="overflow-x-auto pb-2">
        <div className={`grid grid-cols-${comparisons.length} gap-4 min-w-[650px]`}>
          {comparisons.map((c, idx) => {
            const isLowestRate = c.product.name === highlights?.lowestRate;
            const isLowestFee = c.product.name === highlights?.lowestFee;

            return (
              <Card
                key={c.product._id || idx}
                highlight={isLowestRate}
                className="flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-mono font-medium text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                      Verified Product
                    </span>
                    {isLowestRate && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Best Rate
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-ivory line-clamp-1">{c.product.name}</h3>
                  <p className="text-xs text-ivory-subtle mb-4">{c.product.bank}</p>

                  {/* Metrics List */}
                  <div className="space-y-3 text-xs divide-y divide-slate-800/80 font-mono">
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-ivory-dark font-sans text-xs">Interest Rate</span>
                      <span className={`font-bold ${isLowestRate ? 'text-emerald-400 text-sm' : 'text-ivory'}`}>
                        {c.interestRate}% p.a.
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-ivory-dark font-sans text-xs">Monthly EMI</span>
                      <span className="font-bold text-ivory text-sm">
                        ₹{c.monthlyEmi.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-ivory-dark font-sans text-xs">Processing Fee</span>
                      <span className={`font-medium ${isLowestFee ? 'text-teal-400' : 'text-slate-300'}`}>
                        ₹{c.processingFee.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-ivory-dark font-sans text-xs">Total Interest</span>
                      <span className="font-medium text-gold-400">
                        ₹{c.totalInterest.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-ivory-dark font-sans text-xs">Total Repayment</span>
                      <span className="font-bold text-ivory">
                        ₹{c.totalPayment.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-ivory-dark font-sans text-xs">Pre-closure Terms</span>
                      <span className="font-sans text-[11px] text-slate-400 text-right max-w-[140px] truncate">
                        {c.product.preClosurePenalty || 'Nil charges'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <Button
                    size="sm"
                    variant={isLowestRate ? 'primary' : 'secondary'}
                    className="w-full text-xs"
                    onClick={() => {
                      if (onSelectWinner) onSelectWinner(c.product);
                      else {
                        updateJourney({
                          selectedProduct: c.product,
                          interestRate: c.interestRate,
                          monthlyEmi: c.monthlyEmi,
                          totalInterest: c.totalInterest,
                          totalPayment: c.totalPayment,
                          processingFee: c.processingFee,
                          estimatedTotalCost: c.estimatedTotalCost
                        });
                      }
                    }}
                  >
                    Select This Product
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
