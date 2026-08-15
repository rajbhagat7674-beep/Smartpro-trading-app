import React from 'react';
import { FIIDIIData } from '../types';
import { Landmark, TrendingUp, TrendingDown, Layers, BarChart3, ShieldCheck } from 'lucide-react';

interface FIIDIITrackerProps {
  data: FIIDIIData;
}

export const FIIDIITracker: React.FC<FIIDIITrackerProps> = ({ data }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header Summary */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Landmark className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Institutional FII & DII Smart Money Flow
            </h2>
            <p className="text-xs text-slate-400">
              Real-time Cash Market, Index Futures & Options Open Interest Tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{data.sentiment}</span>
        </div>
      </div>

      {/* Net Buy/Sell Cash Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            FII Net Cash Flow
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black text-emerald-400">
              +₹{data.fiiNetBuySellCr.toLocaleString()} Cr
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Aggressive Institutional Buying
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            DII Net Cash Flow
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black text-emerald-400">
              +₹{data.diiNetBuySellCr.toLocaleString()} Cr
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Domestic Mutual Funds Accumulating
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            FII Index Futures Long %
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black text-indigo-400">
              {data.fiiIndexFuturesOI}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Short covering underway</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            FII Call/Put Ratio
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black text-cyan-400">
              {data.fiiCallLongShortRatio}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bullish option skew</p>
        </div>
      </div>

      {/* Intraday Cumulative Inflow Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Intraday Cumulative Institutional Flow (Today)
        </h3>

        <div className="space-y-3">
          {data.intradayHourlyFlows.map((flow, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 w-20">{flow.time}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400">FII: +₹{flow.fiiFlowCr} Cr</span>
                  <span className="text-indigo-400">DII: +₹{flow.diiFlowCr} Cr</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500">Cumulative Inflow: </span>
                <span className="text-xs font-black text-emerald-400">
                  +₹{flow.cumulativeCr.toLocaleString()} Cr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
