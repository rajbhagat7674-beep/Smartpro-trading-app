import React, { useState } from 'react';
import { AISignal } from '../types';
import { Zap, CheckCircle2, ShieldCheck, ShoppingBag, TrendingUp, TrendingDown, Clock, Sparkles } from 'lucide-react';

interface SignalsFeedProps {
  signals: AISignal[];
  onExecuteSignal: (signal: AISignal) => void;
  onOpenChart: (symbol: string) => void;
}

export const SignalsFeed: React.FC<SignalsFeedProps> = ({
  signals,
  onExecuteSignal,
  onOpenChart
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filteredSignals = signals.filter((s) => {
    if (filterType === 'BUY') return s.type.includes('BUY');
    if (filterType === 'SELL') return s.type.includes('SELL');
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-6 h-6 fill-emerald-400" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Institutional High-Probability Signals
            </h2>
            <p className="text-xs text-slate-400">
              Confluence of Global Macro, Smart Money (SMC), FVG, Order Blocks, & Option Unwinding
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'BUY', 'SELL'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filterType === t
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Signals' : t === 'BUY' ? '🟢 Buy Only' : '🔴 Sell Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Cards */}
      <div className="space-y-4">
        {filteredSignals.map((signal) => {
          const isBuy = signal.type.includes('BUY');

          return (
            <div
              key={signal.id}
              className={`p-5 rounded-2xl border transition-all shadow-xl bg-slate-900/95 ${
                isBuy ? 'border-emerald-500/40' : 'border-rose-500/40'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 text-xs font-black rounded-lg ${
                      isBuy
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {signal.type}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{signal.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{signal.symbol}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {signal.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    Confidence {signal.confidence}%
                  </span>
                  <button
                    onClick={() => onOpenChart(signal.symbol)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition-all"
                  >
                    Open Chart
                  </button>
                </div>
              </div>

              {/* Levels Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium">Entry Price</span>
                  <div className="text-sm font-bold text-white mt-0.5">₹{signal.entryPrice}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-rose-500/30">
                  <span className="text-[10px] text-rose-400 font-medium">Stop Loss (SL)</span>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">₹{signal.stopLoss}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 font-medium">Target 1 (TP1)</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">₹{signal.target1}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 font-medium">Target 2 (TP2)</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">₹{signal.target2}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-indigo-500/30 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-indigo-400 font-medium">Risk : Reward</span>
                  <div className="text-sm font-bold text-indigo-300 mt-0.5">{signal.riskReward}</div>
                </div>
              </div>

              {/* Confluences List */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  SMC & Option Confluence Factors:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-400">
                  {signal.confluenceFactors.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  Macro Context: <span className="text-slate-400">{signal.globalNewsImpact}</span>
                </span>
                <button
                  onClick={() => onExecuteSignal(signal)}
                  className={`px-4 py-2 text-xs font-black rounded-xl text-white shadow-lg active:scale-95 transition-all flex items-center gap-1.5 ${
                    isBuy ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  EXECUTE VIA SMARTAPI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
