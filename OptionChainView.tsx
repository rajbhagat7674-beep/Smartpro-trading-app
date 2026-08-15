import React, { useState } from 'react';
import { OptionChainSummary, OptionGreekData } from '../types';
import { Target, Zap, TrendingUp, AlertCircle, Layers } from 'lucide-react';

interface OptionChainViewProps {
  summary: OptionChainSummary;
  onSelectStrike?: (strike: number, type: 'CE' | 'PE', price: number) => void;
}

export const OptionChainView: React.FC<OptionChainViewProps> = ({ summary, onSelectStrike }) => {
  const [showGreeks, setShowGreeks] = useState(true);

  return (
    <div className="w-full space-y-4">
      {/* Option Chain Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Put-Call Ratio (PCR)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-400">{summary.pcr}</span>
            <span className="text-[11px] font-medium text-slate-300">
              {summary.pcr > 1.0 ? 'Bullish (Put Support)' : 'Bearish (Call Resistance)'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Max Pain Strike
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-cyan-400">₹{summary.maxPain}</span>
            <span className="text-[11px] font-medium text-slate-300">Expiry Gravity</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Highest Call OI (Resistance)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-rose-400">₹{summary.highestCallOIStrike}</span>
            <span className="text-[11px] font-medium text-slate-400">Wall</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-md">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Highest Put OI (Support)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-400">₹{summary.highestPutOIStrike}</span>
            <span className="text-[11px] font-medium text-slate-400">Floor</span>
          </div>
        </div>
      </div>

      {/* Writer Bias Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <div className="text-xs text-slate-400">Institutional Option Writers Activity</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{summary.writerBias}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Weekly Expiry {summary.expiry}
              </span>
            </div>
          </div>
        </div>

        <button
          id="toggle-greeks-btn"
          onClick={() => setShowGreeks(!showGreeks)}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          {showGreeks ? 'Hide Greeks (Delta/Theta/IV)' : 'Show Option Greeks'}
        </button>
      </div>

      {/* Option Chain Table */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                <th colSpan={showGreeks ? 5 : 3} className="text-center py-2.5 bg-emerald-950/20 text-emerald-400 border-r border-slate-800">
                  CALL OPTIONS (CE)
                </th>
                <th className="text-center py-2.5 bg-slate-900 text-white font-bold px-3">
                  STRIKE
                </th>
                <th colSpan={showGreeks ? 5 : 3} className="text-center py-2.5 bg-rose-950/20 text-rose-400 border-l border-slate-800">
                  PUT OPTIONS (PE)
                </th>
              </tr>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-2.5">Call OI (Lakhs)</th>
                <th className="py-2 px-2">OI Chg</th>
                <th className="py-2 px-2.5 text-emerald-400">LTP (₹)</th>
                {showGreeks && <th className="py-2 px-2">Delta</th>}
                {showGreeks && <th className="py-2 px-2 border-r border-slate-800">IV%</th>}

                <th className="py-2 px-3 text-center bg-slate-950 text-slate-300 font-bold">PRICE</th>

                {showGreeks && <th className="py-2 px-2 border-l border-slate-800">IV%</th>}
                {showGreeks && <th className="py-2 px-2">Delta</th>}
                <th className="py-2 px-2.5 text-rose-400">LTP (₹)</th>
                <th className="py-2 px-2">OI Chg</th>
                <th className="py-2 px-2.5 text-right">Put OI (Lakhs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {summary.strikes.map((s: OptionGreekData) => {
                const isATM = Math.abs(s.strike - summary.underlyingPrice) <= 30;
                const isHighestCall = s.strike === summary.highestCallOIStrike;
                const isHighestPut = s.strike === summary.highestPutOIStrike;

                return (
                  <tr
                    key={s.strike}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isATM ? 'bg-amber-500/10 font-medium' : ''
                    }`}
                  >
                    {/* Call OI */}
                    <td className="py-2 px-2.5 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>{(s.callOI / 100000).toFixed(2)}L</span>
                        {isHighestCall && (
                          <span className="text-[10px] px-1 py-0.2 bg-rose-500/20 text-rose-300 rounded font-bold">
                            MAX OI
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Call OI Chg / Unwinding */}
                    <td className="py-2 px-2">
                      {s.callUnwinding ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                          Unwinding -{(s.callUnwindingCount / 1000).toFixed(0)}K
                        </span>
                      ) : (
                        <span className={s.callOIChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {s.callOIChange >= 0 ? '+' : ''}{(s.callOIChange / 1000).toFixed(0)}K
                        </span>
                      )}
                    </td>

                    {/* Call LTP with Order Trigger */}
                    <td className="py-2 px-2.5">
                      <button
                        onClick={() => onSelectStrike && onSelectStrike(s.strike, 'CE', s.callLTP)}
                        className="text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-950/40 hover:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30 transition-all"
                      >
                        ₹{s.callLTP.toFixed(1)}
                      </button>
                    </td>

                    {showGreeks && <td className="py-2 px-2 text-slate-400">{s.callDelta.toFixed(2)}</td>}
                    {showGreeks && <td className="py-2 px-2 border-r border-slate-800 text-slate-400">{s.callIV}%</td>}

                    {/* Center Strike Price */}
                    <td className="py-2 px-3 text-center bg-slate-950 font-bold text-white">
                      <div className="flex items-center justify-center gap-1">
                        <span>{s.strike}</span>
                        {isATM && (
                          <span className="text-[9px] px-1 bg-amber-500 text-slate-950 rounded font-black">
                            ATM
                          </span>
                        )}
                      </div>
                    </td>

                    {showGreeks && <td className="py-2 px-2 border-l border-slate-800 text-slate-400">{s.putIV}%</td>}
                    {showGreeks && <td className="py-2 px-2 text-slate-400">{s.putDelta.toFixed(2)}</td>}

                    {/* Put LTP with Order Trigger */}
                    <td className="py-2 px-2.5">
                      <button
                        onClick={() => onSelectStrike && onSelectStrike(s.strike, 'PE', s.putLTP)}
                        className="text-rose-400 hover:text-rose-300 font-bold bg-rose-950/40 hover:bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/30 transition-all"
                      >
                        ₹{s.putLTP.toFixed(1)}
                      </button>
                    </td>

                    {/* Put OI Chg / Unwinding */}
                    <td className="py-2 px-2">
                      {s.putUnwinding ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                          Unwinding -{(s.putUnwindingCount / 1000).toFixed(0)}K
                        </span>
                      ) : (
                        <span className={s.putOIChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {s.putOIChange >= 0 ? '+' : ''}{(s.putOIChange / 1000).toFixed(0)}K
                        </span>
                      )}
                    </td>

                    {/* Put OI */}
                    <td className="py-2 px-2.5 text-right text-slate-300">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>{(s.putOI / 100000).toFixed(2)}L</span>
                        {isHighestPut && (
                          <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                            MAX OI
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
