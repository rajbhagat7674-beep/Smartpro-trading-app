import React, { useState } from 'react';
import { AssetInfo, AssetCategory, PriceAlert } from '../types';
import { TrendingUp, TrendingDown, ChevronRight, Activity, Zap, Search, Bell, BellRing } from 'lucide-react';

interface WatchlistSectionProps {
  assets: AssetInfo[];
  selectedSymbol: string;
  onSelectAsset: (asset: AssetInfo) => void;
  alerts?: PriceAlert[];
  onSetAlert?: (symbol: string) => void;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  assets,
  selectedSymbol,
  onSelectAsset,
  alerts = [],
  onSetAlert
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | AssetCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = activeCategory === 'all' || asset.category === activeCategory;
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-4">
      {/* Category Filter Chips & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar">
          {[
            { id: 'all', label: 'All Markets' },
            { id: 'indices', label: 'Indices (Nifty/Sensex)' },
            { id: 'equities', label: 'Top Equities' },
            { id: 'commodities', label: 'Commodities (MCX)' },
            { id: 'forex', label: 'Forex (CDS)' }
          ].map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stocks, indices, MCX..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-500"
          />
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredAssets.map((asset) => {
          const isPositive = asset.change >= 0;
          const isSelected = selectedSymbol === asset.symbol;
          const assetAlerts = alerts.filter((a) => a.symbol === asset.symbol);
          const activeAlert = assetAlerts.find((a) => !a.triggered && a.active);
          const triggeredAlert = assetAlerts.find((a) => a.triggered);

          const rangePercent = Math.min(
            100,
            Math.max(
              0,
              ((asset.lastPrice - asset.dayLow) / (asset.dayHigh - asset.dayLow || 1)) * 100
            )
          );

          return (
            <div
              key={asset.symbol}
              id={`watchlist-card-${asset.symbol.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onSelectAsset(asset)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg hover:shadow-xl relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/70 ring-1 ring-emerald-500/40 shadow-emerald-950/30'
                  : triggeredAlert
                  ? 'bg-slate-900 border-amber-500/80 ring-1 ring-amber-500/50 shadow-amber-950/40'
                  : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {asset.exchange}
                    </span>
                    {asset.volatilityVIX && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        VIX {asset.volatilityVIX}
                      </span>
                    )}
                    {activeAlert && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Bell className="w-2.5 h-2.5 text-amber-400" />
                        <span>₹{activeAlert.targetPrice}</span>
                      </span>
                    )}
                    {triggeredAlert && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 flex items-center gap-1 animate-pulse">
                        <BellRing className="w-2.5 h-2.5" />
                        <span>ALERT HIT</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{asset.name}</p>
                </div>

                {/* Price & Change & Quick Alert Button */}
                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-lg font-black text-white tracking-tight">
                      ₹{asset.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`flex items-center justify-end gap-1 text-xs font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>
                        {isPositive ? '+' : ''}
                        {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {onSetAlert && (
                    <button
                      type="button"
                      title="Set Price Alert"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetAlert(asset.symbol);
                      }}
                      className={`p-2 rounded-xl border transition-all active:scale-90 ${
                        activeAlert
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Day High / Low Range Slider */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-1 text-[11px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span>L: ₹{asset.dayLow.toFixed(1)}</span>
                  <span className="text-[10px] font-medium text-slate-500">Day Range</span>
                  <span>H: ₹{asset.dayHigh.toFixed(1)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${rangePercent}%` }}
                  />
                </div>
              </div>

              {/* Footer row */}
              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
                  {asset.marketState}
                </span>

                <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
                  <span>Open Chart & SMC</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

