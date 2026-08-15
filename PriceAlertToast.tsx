import React, { useEffect, useState } from 'react';
import { PriceAlert, AssetInfo } from '../types';
import { BellRing, X, ArrowUpRight, ArrowDownRight, ExternalLink, CheckCircle2, Volume2, VolumeX } from 'lucide-react';

interface PriceAlertToastProps {
  triggeredAlert: {
    alert: PriceAlert;
    currentPrice: number;
  } | null;
  onDismiss: () => void;
  onViewAsset: (symbol: string) => void;
}

export const PriceAlertToast: React.FC<PriceAlertToastProps> = ({
  triggeredAlert,
  onDismiss,
  onViewAsset
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (!triggeredAlert) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 9000);
    return () => clearTimeout(timer);
  }, [triggeredAlert, onDismiss]);

  if (!triggeredAlert) return null;

  const { alert, currentPrice } = triggeredAlert;
  const isAbove = alert.condition === 'ABOVE';

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[420px] z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-slate-900/95 backdrop-blur-xl p-4 shadow-2xl shadow-amber-500/20 ring-1 ring-amber-400/30">
        {/* Top Glowing Pulse Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 animate-pulse" />

        <div className="flex items-start gap-3">
          {/* Animated Bell Icon */}
          <div className="flex-shrink-0 p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce">
            <BellRing className="w-5 h-5 fill-amber-400/20 text-amber-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 uppercase tracking-wider">
                  Price Alert Triggered
                </span>
                <span className="text-[11px] text-slate-400">Just now</span>
              </div>
              <button
                id="dismiss-alert-toast-btn"
                onClick={onDismiss}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Asset Symbol & Target Trigger Details */}
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-base font-black text-white">{alert.symbol}</span>
              <div className="text-right">
                <span className="text-base font-extrabold text-amber-300">
                  ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Target condition description */}
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
              {isAbove ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>
                Target of <strong className="text-white">₹{alert.targetPrice.toLocaleString('en-IN')}</strong> {isAbove ? 'reached or crossed above' : 'reached or dropped below'}.
              </span>
            </p>

            {/* Note if any */}
            {alert.note && (
              <div className="mt-2 text-[11px] text-slate-300 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-amber-400 font-semibold">Note:</span>
                <span className="truncate">{alert.note}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Live Real-Time Ticker
              </span>
              
              <div className="flex items-center gap-1.5">
                <button
                  id="view-triggered-asset-btn"
                  onClick={() => {
                    onViewAsset(alert.symbol);
                    onDismiss();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/40 active:scale-95 transition-all"
                >
                  <span>Open Chart</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
