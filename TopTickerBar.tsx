import React from 'react';
import { AssetInfo, PriceAlert } from '../types';
import { TrendingUp, TrendingDown, Activity, Download, Smartphone, Bell, BellRing } from 'lucide-react';

interface TopTickerBarProps {
  assets: AssetInfo[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onOpenInstallModal?: () => void;
  onOpenAlertsModal?: () => void;
  alerts?: PriceAlert[];
}

export const TopTickerBar: React.FC<TopTickerBarProps> = ({
  assets,
  selectedSymbol,
  onSelectSymbol,
  onOpenInstallModal,
  onOpenAlertsModal,
  alerts = []
}) => {
  // Key indices & benchmarks for top bar
  const topIndices = assets.filter((a) =>
    ['NIFTY 50', 'BANKNIFTY', 'SENSEX', 'FINNIFTY', 'CRUDEOIL', 'USDINR'].includes(a.symbol)
  );

  const activeAlertsCount = alerts.filter((a) => !a.triggered && a.active).length;
  const recentTriggeredCount = alerts.filter((a) => a.triggered).length;

  return (
    <div className="w-full bg-[#080c14] border-b border-slate-800/80 sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-3 overflow-x-auto py-2.5 px-4 scrollbar-none no-scrollbar">
        {/* Quick Price Alerts Button */}
        {onOpenAlertsModal && (
          <button
            id="topbar-price-alerts-btn"
            onClick={onOpenAlertsModal}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm active:scale-95 ${
              activeAlertsCount > 0
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            {activeAlertsCount > 0 ? (
              <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            ) : (
              <Bell className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Alerts</span>
            {activeAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {activeAlertsCount}
              </span>
            )}
          </button>
        )}

        {topIndices.map((item) => {
          const isSelected = selectedSymbol === item.symbol;
          const isPositive = item.change >= 0;
          const hasActiveAlert = alerts.some((a) => a.symbol === item.symbol && !a.triggered && a.active);
          const hasTriggeredAlert = alerts.some((a) => a.symbol === item.symbol && a.triggered);

          return (
            <button
              key={item.symbol}
              id={`ticker-item-${item.symbol.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all text-left relative ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                  : hasTriggeredAlert
                  ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/50 shadow-md shadow-amber-950/50'
                  : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 tracking-wide">
                    {item.symbol}
                  </span>
                  {hasActiveAlert && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Active Price Alert" />
                  )}
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      isPositive ? 'bg-emerald-400' : 'bg-rose-400'
                    } animate-pulse`}
                  />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">
                  ₹{item.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div
                className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                  isPositive
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/20'
                    : 'text-rose-400 bg-rose-950/60 border border-rose-500/20'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}

        {/* Live India VIX Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">INDIA VIX</span>
            <span className="text-xs font-bold text-amber-300">13.42 (-2.1%)</span>
          </div>
        </div>

        {/* Direct Install APK Button */}
        {onOpenInstallModal && (
          <button
            id="install-apk-top-btn"
            onClick={onOpenInstallModal}
            className="flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Install APK / App</span>
          </button>
        )}
      </div>
    </div>
  );
};

