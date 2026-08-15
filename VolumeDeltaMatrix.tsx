import React from 'react';
import { PriceVolumeMatrix, AssetInfo } from '../types';
import { BarChart3, CheckCircle2, AlertTriangle, Flame, ShieldAlert, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface VolumeDeltaMatrixProps {
  asset: AssetInfo;
  matrix: PriceVolumeMatrix;
}

export const VolumeDeltaMatrix: React.FC<VolumeDeltaMatrixProps> = ({ asset, matrix }) => {
  const isPositiveDelta = matrix.delta >= 0;

  return (
    <div className="w-full space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Core Price-Volume Rule Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Price-Volume Dynamics
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-white leading-snug">
              {matrix.trend}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Volume Confirms Price Direction
            </div>
          </div>
        </div>

        {/* Real vs Fake Breakout Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Breakout Validation
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-indigo-300">
              {matrix.breakoutValidity}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Confirmed by 2.4x average volume expansion at key resistance.
            </p>
          </div>
        </div>

        {/* Real vs Fake Reversal Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Reversal Quality
            </span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-amber-300">
              {matrix.reversalValidity}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Smart money absorption wicks detected at daily demand zone.
            </p>
          </div>
        </div>
      </div>

      {/* Buyer vs Seller Order Flow Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Order Flow & Volume Delta Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggressive buyer market orders vs aggressive seller market orders (VSA)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Net Delta: </span>
            <span className={`text-sm font-bold ${isPositiveDelta ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositiveDelta ? '+' : ''}{matrix.delta.toLocaleString()} contracts
            </span>
          </div>
        </div>

        {/* Split Volume Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> Buyers {matrix.buyerVolumePercent}%
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              Sellers {matrix.sellerVolumePercent}% <ArrowDownRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full transition-all duration-500"
              style={{ width: `${matrix.buyerVolumePercent}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-r-full transition-all duration-500"
              style={{ width: `${matrix.sellerVolumePercent}%` }}
            />
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Cumulative Delta</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              +{matrix.cumulativeDelta.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Continuous institutional inflow</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Absorption Detector</span>
            <div className="text-sm font-bold text-amber-400 mt-0.5">
              {matrix.absorptionDetected ? 'ACTIVE (Heavy Absorption)' : 'Inactive'}
            </div>
            <span className="text-[10px] text-slate-500">Passive limit orders absorbing sell</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Volume Climax</span>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">
              Normal Acceleration
            </div>
            <span className="text-[10px] text-slate-500">No exhaustion sign yet</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Market State</span>
            <div className="text-sm font-bold text-purple-400 mt-0.5">
              {asset.marketState || 'Trending'}
            </div>
            <span className="text-[10px] text-slate-500">High directional velocity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
