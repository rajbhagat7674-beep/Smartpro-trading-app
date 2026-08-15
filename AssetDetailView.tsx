import React, { useState } from 'react';
import {
  AssetInfo,
  CandleData,
  FVGData,
  OrderBlockData,
  LiquidityPool,
  SupportResistanceLevel,
  PriceVolumeMatrix,
  OptionChainSummary,
  AISignal,
  Timeframe,
  PriceAlert
} from '../types';
import { TradingViewChart } from './TradingViewChart';
import { VolumeDeltaMatrix } from './VolumeDeltaMatrix';
import { OptionChainView } from './OptionChainView';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Zap,
  BarChart2,
  ListOrdered,
  Layers,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  ShoppingBag,
  Bell,
  BellRing
} from 'lucide-react';

interface AssetDetailViewProps {
  asset: AssetInfo;
  candles: CandleData[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  fvgs: FVGData[];
  orderBlocks: OrderBlockData[];
  liquidityPools: LiquidityPool[];
  srLevels: SupportResistanceLevel[];
  matrix: PriceVolumeMatrix;
  optionChain: OptionChainSummary;
  signal?: AISignal;
  onBack: () => void;
  onOpenOrderModal: (params: {
    symbol: string;
    type: 'BUY' | 'SELL';
    price?: number;
  }) => void;
  alerts?: PriceAlert[];
  onSetAlert?: (symbol: string) => void;
}

export const AssetDetailView: React.FC<AssetDetailViewProps> = ({
  asset,
  candles,
  timeframe,
  onTimeframeChange,
  fvgs,
  orderBlocks,
  liquidityPools,
  srLevels,
  matrix,
  optionChain,
  signal,
  onBack,
  onOpenOrderModal,
  alerts = [],
  onSetAlert
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'volume' | 'options'>('chart');
  const isPositive = asset.change >= 0;
  const assetAlerts = alerts.filter((a) => a.symbol === asset.symbol);
  const activeAlert = assetAlerts.find((a) => !a.triggered && a.active);
  const triggeredAlert = assetAlerts.find((a) => a.triggered);


  return (
    <div className="w-full space-y-4 pb-20">
      {/* Top Navigation & Asset Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              id="back-to-home-btn"
              onClick={onBack}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Back to Watchlist</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {asset.symbol}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {asset.exchange}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline">
                  {asset.marketState}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{asset.name}</p>
            </div>
          </div>

          {/* Right Price & Quick Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ₹{asset.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`flex items-center justify-end gap-1 text-xs sm:text-sm font-bold ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isPositive ? '+' : ''}
                  {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onSetAlert && (
                <button
                  id="asset-detail-alert-btn"
                  onClick={() => onSetAlert(asset.symbol)}
                  title="Set Target Price Alert"
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all ${
                    activeAlert
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {activeAlert ? (
                    <BellRing className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Bell className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="hidden sm:inline">
                    {activeAlert ? `Alert ₹${activeAlert.targetPrice}` : 'Set Alert'}
                  </span>
                </button>
              )}

              <button
                id="header-buy-btn"
                onClick={() => onOpenOrderModal({ symbol: asset.symbol, type: 'BUY', price: asset.lastPrice })}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 active:scale-95 transition-all"
              >
                BUY
              </button>
              <button
                id="header-sell-btn"
                onClick={() => onOpenOrderModal({ symbol: asset.symbol, type: 'SELL', price: asset.lastPrice })}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-950/50 active:scale-95 transition-all"
              >
                SELL
              </button>
            </div>

          </div>
        </div>

        {/* Quick Range Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Day High / Low</span>
            <div className="text-slate-200 font-semibold mt-0.5">
              ₹{asset.dayHigh.toFixed(2)} / ₹{asset.dayLow.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Open / Prev Close</span>
            <div className="text-slate-200 font-semibold mt-0.5">
              ₹{asset.open.toFixed(2)} / ₹{asset.close.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Volume</span>
            <div className="text-slate-200 font-semibold mt-0.5">
              {(asset.volume / 100000).toFixed(2)} Lakhs
            </div>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Lot Size / Tick</span>
            <div className="text-slate-200 font-semibold mt-0.5">
              {asset.lotSize} Qty (₹{asset.tickSize})
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Organized Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <button
          id="tab-chart-signals"
          onClick={() => setActiveTab('chart')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'chart'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Tab 1: Chart & AI Signals</span>
        </button>

        <button
          id="tab-volume-delta"
          onClick={() => setActiveTab('volume')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'volume'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tab 2: Volume Delta & Matrix</span>
        </button>

        <button
          id="tab-option-chain"
          onClick={() => setActiveTab('options')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'options'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Tab 3: Option Chain & Greeks</span>
        </button>
      </div>

      {/* Tab 1 Content: Chart & AI Signals */}
      {activeTab === 'chart' && (
        <div className="space-y-4">
          <TradingViewChart
            symbol={asset.symbol}
            candles={candles}
            timeframe={timeframe}
            onTimeframeChange={onTimeframeChange}
            fvgs={fvgs}
            orderBlocks={orderBlocks}
            liquidityPools={liquidityPools}
            srLevels={srLevels}
            signals={signal ? [signal] : []}
            onPlaceOrder={(type, price) => onOpenOrderModal({ symbol: asset.symbol, type, price })}
          />

          {/* High-Probability AI Signal Box */}
          {signal && (
            <div className="bg-gradient-to-br from-slate-900 via-[#0b1322] to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Zap className="w-6 h-6 fill-emerald-400" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-emerald-500 text-slate-950 tracking-wider">
                        {signal.type}
                      </span>
                      <span className="text-base font-bold text-white">{signal.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {signal.timeframe} TF
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {signal.smartMoneyActivity} • Confidence {signal.confidence}% • Generated {signal.timestamp}
                    </p>
                  </div>
                </div>

                <button
                  id="execute-signal-btn"
                  onClick={() =>
                    onOpenOrderModal({
                      symbol: signal.symbol,
                      type: signal.type.includes('BUY') ? 'BUY' : 'SELL',
                      price: signal.entryPrice
                    })
                  }
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg shadow-emerald-950 active:scale-95 transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  EXECUTE ORDER VIA SMARTAPI
                </button>
              </div>

              {/* Levels Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Entry Price</span>
                  <div className="text-base font-bold text-white mt-0.5">₹{signal.entryPrice}</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-500/30">
                  <span className="text-[11px] text-rose-400 font-medium">Stop Loss (SL)</span>
                  <div className="text-base font-bold text-rose-400 mt-0.5">₹{signal.stopLoss}</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-[11px] text-emerald-400 font-medium">Target 1 (TP1)</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">₹{signal.target1}</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-[11px] text-emerald-400 font-medium">Target 2 (TP2)</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">₹{signal.target2}</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-indigo-500/30 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-indigo-400 font-medium">Risk : Reward</span>
                  <div className="text-base font-bold text-indigo-300 mt-0.5">{signal.riskReward}</div>
                </div>
              </div>

              {/* Confluence Criteria List */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Institutional Confluence & Technical Validations:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {signal.confluenceFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global News Context */}
              <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">Global Macro Backdrop:</span>
                <span className="text-slate-400">{signal.globalNewsImpact}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2 Content: Volume Delta & Matrix */}
      {activeTab === 'volume' && <VolumeDeltaMatrix asset={asset} matrix={matrix} />}

      {/* Tab 3 Content: Option Chain & Greeks */}
      {activeTab === 'options' && (
        <OptionChainView
          summary={optionChain}
          onSelectStrike={(strike, type, price) => {
            onOpenOrderModal({
              symbol: `${asset.symbol} ${strike} ${type}`,
              type: 'BUY',
              price
            });
          }}
        />
      )}
    </div>
  );
};
