import React from 'react';
import { GlobalNewsEvent } from '../types';
import { Globe, TrendingUp, TrendingDown, Minus, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

interface GlobalNewsImpactProps {
  news: GlobalNewsEvent[];
}

export const GlobalNewsImpact: React.FC<GlobalNewsImpactProps> = ({ news }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Globe className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Global News & Macro Impact Engine
            </h2>
            <p className="text-xs text-slate-400">
              Correlating Geopolitics, US Fed, Crude Oil, & DXY to Indian Market Direction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Macro Bias: High Bullish for India</span>
        </div>
      </div>

      {/* News Cards List */}
      <div className="space-y-3">
        {news.map((item) => {
          const isPositive = item.impactOnIndianMarket.includes('POSITIVE');
          const isNegative = item.impactOnIndianMarket.includes('NEGATIVE');

          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-lg hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.source} • {item.timeAgo}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-lg border ${
                    isPositive
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                      : isNegative
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isNegative ? (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{item.impactOnIndianMarket.replace('_', ' ')}</span>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {item.title}
              </h3>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                  Indian Market Transmission Channel:
                </div>
                <p className="text-slate-400 leading-relaxed">{item.impactExplanation}</p>
              </div>

              {/* Affected Sectors */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Benefited Sectors:
                </span>
                {item.affectedSectors.map((sector, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700 font-medium text-[11px]"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
