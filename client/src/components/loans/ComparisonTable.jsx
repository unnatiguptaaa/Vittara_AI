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
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">AI Comparison Insights</h4>
              <p className="text-xs text-slate-600">
                Rate variance: <strong className="text-emerald-700">{highlights.rateDiff}%</strong> • Monthly savings potential: <strong className="text-emerald-700">₹{highlights.monthlySaving.toLocaleString('en-IN')}/mo</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Lowest Rate: <strong className="text-emerald-700">{highlights.lowestRate}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Lowest Fee: <strong className="text-teal-700">{highlights.lowestFee}</strong>
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
                className="flex flex-col justify-between bg-white border-slate-200 shadow-xs"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Bank Product
                    </span>
                    {isLowestRate && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Best Rate
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{c.product.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{c.product.bank}</p>

                  {/* Metrics List */}
                  <div className="space-y-3 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">Interest Rate</span>
                      <span className={`font-bold ${isLowestRate ? 'text-emerald-700 text-sm' : 'text-slate-900'}`}>
                        {c.interestRate}% p.a.
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">Monthly EMI</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{c.monthlyEmi.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">Processing Fee</span>
                      <span className={`font-medium ${isLowestFee ? 'text-teal-700 font-semibold' : 'text-slate-800'}`}>
                        ₹{c.processingFee.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">Total Interest</span>
                      <span className="font-medium text-slate-800">
                        ₹{c.totalInterest.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">Total Repayment</span>
                      <span className="font-bold text-slate-900">
                        ₹{c.totalPayment.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">Estimated Total Cost</span>
                      <span className="font-extrabold text-emerald-600">
                        ₹{c.estimatedTotalCost.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2">
                      <span className="text-slate-500 block mb-1">Pre-closure Policy</span>
                      <span className="text-[11px] text-slate-600 leading-tight block">
                        {c.preClosureCharges}
                      </span>
                    </div>

                    <div className="pt-2">
                      <span className="text-slate-500 block mb-1">Key Conditions</span>
                      <span className="text-[11px] text-slate-600 leading-tight block">
                        {c.conditions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apply / Choose for Journey */}
                <div className="mt-6 pt-3 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant={isLowestRate ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() => {
                      updateJourney({
                        selectedProduct: c.product,
                        interestRate: c.interestRate,
                        monthlyEmi: c.monthlyEmi,
                        totalInterest: c.totalInterest,
                        totalPayment: c.totalPayment,
                        processingFee: c.processingFee,
                        estimatedTotalCost: c.estimatedTotalCost
                      });
                      if (onSelectWinner) onSelectWinner(c.product);
                    }}
                  >
                    Select for Financial Journey
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
