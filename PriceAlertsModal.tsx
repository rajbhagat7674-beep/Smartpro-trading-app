import React, { useState, useMemo } from 'react';
import { PriceAlert, AssetInfo } from '../types';
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  X,
  Zap,
  Volume2,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { playAlertChime } from '../utils/audio';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetInfo[];
  defaultSymbol?: string;
  alerts: PriceAlert[];
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
  onClearTriggered: () => void;
  onSelectAsset: (symbol: string) => void;
  onTestTrigger?: () => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  assets,
  defaultSymbol = 'NIFTY 50',
  alerts,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
  onClearTriggered,
  onSelectAsset,
  onTestTrigger
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'history'>('create');
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [note, setNote] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected asset object
  const currentAsset = useMemo(() => {
    return assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  }, [assets, selectedSymbol]);

  // Set default target price whenever symbol changes
  React.useEffect(() => {
    if (currentAsset) {
      const defaultTarget = (currentAsset.lastPrice * 1.008).toFixed(2);
      setTargetPrice(defaultTarget);
      setCondition('ABOVE');
    }
  }, [currentAsset.symbol]);

  if (!isOpen) return null;

  const activeAlerts = alerts.filter((a) => !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  // Quick preset percentages
  const applyPresetPercent = (pct: number) => {
    if (!currentAsset) return;
    const computed = Number((currentAsset.lastPrice * (1 + pct / 100)).toFixed(2));
    setTargetPrice(computed.toString());
    setCondition(pct >= 0 ? 'ABOVE' : 'BELOW');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    onAddAlert({
      symbol: currentAsset.symbol,
      name: currentAsset.name,
      targetPrice: priceNum,
      condition,
      createdPrice: currentAsset.lastPrice,
      note: note.trim() || undefined,
      active: true
    });

    setSuccessMsg(`Alert set for ${currentAsset.symbol} at ₹${priceNum.toLocaleString('en-IN')}`);
    setNote('');
    playAlertChime();
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('active');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Price Alerts & Notifications
                </h2>
                {activeAlerts.length > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {activeAlerts.length} Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Instant visual & audio alerts when live ticker hits your target
              </p>
            </div>
          </div>

          <button
            id="close-alerts-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/30 px-4 pt-2 gap-2">
          <button
            id="tab-create-alert"
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set New Alert</span>
          </button>

          <button
            id="tab-active-alerts"
            onClick={() => setActiveTab('active')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Active ({activeAlerts.length})</span>
          </button>

          <button
            id="tab-history-alerts"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Triggered ({triggeredAlerts.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CREATE ALERT */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Asset Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Select Instrument / Stock
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                  {assets.map((asset) => {
                    const isSelected = selectedSymbol === asset.symbol;
                    return (
                      <button
                        key={asset.symbol}
                        type="button"
                        id={`select-alert-asset-${asset.symbol.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setSelectedSymbol(asset.symbol)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 ring-1 ring-amber-500/40 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="text-xs font-extrabold truncate">{asset.symbol}</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                          ₹{asset.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Price Banner */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Current Market Price (LTP)</div>
                  <div className="text-lg font-black text-white flex items-center gap-2">
                    <span>₹{currentAsset.lastPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {currentAsset.exchange}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-400">Day Range</div>
                  <div className="text-slate-300 font-semibold">
                    L: ₹{currentAsset.dayLow} | H: ₹{currentAsset.dayHigh}
                  </div>
                </div>
              </div>

              {/* Condition Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Trigger Condition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="condition-above-btn"
                    onClick={() => setCondition('ABOVE')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      condition === 'ABOVE'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    <span>Price Crosses Above (≥)</span>
                  </button>

                  <button
                    type="button"
                    id="condition-below-btn"
                    onClick={() => setCondition('BELOW')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      condition === 'BELOW'
                        ? 'bg-rose-600/20 border-rose-500 text-rose-300 ring-1 ring-rose-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                    <span>Price Drops Below (≤)</span>
                  </button>
                </div>
              </div>

              {/* Target Price Input & Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Target Price (₹)
                  </label>
                  {targetPrice && (
                    <span className="text-[11px] font-semibold text-amber-400">
                      {((parseFloat(targetPrice) - currentAsset.lastPrice) / currentAsset.lastPrice * 100).toFixed(2)}% from LTP
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-base font-bold rounded-2xl pl-8 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="Enter target price..."
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">
                    Presets:
                  </span>
                  {[
                    { label: '+0.5%', val: 0.5 },
                    { label: '+1.0%', val: 1.0 },
                    { label: '+2.0%', val: 2.0 },
                    { label: '-0.5%', val: -0.5 },
                    { label: '-1.0%', val: -1.0 },
                    { label: '-2.0%', val: -2.0 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPresetPercent(p.val)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setTargetPrice(currentAsset.dayHigh.toString());
                      setCondition('ABOVE');
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60 transition-all"
                  >
                    Day High (₹{currentAsset.dayHigh})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetPrice(currentAsset.dayLow.toString());
                      setCondition('BELOW');
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 transition-all"
                  >
                    Day Low (₹{currentAsset.dayLow})
                  </button>
                </div>
              </div>

              {/* Note / Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Alert Note / Trigger Reason (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Resistance Breakout, SMC Order Block Entry, Stop Loss"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 transition-all placeholder-slate-600"
                />
              </div>

              {/* Success message */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="submit"
                  id="create-alert-submit-btn"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-2xl shadow-lg shadow-amber-950/50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4 fill-slate-950" />
                  <span>Set Price Alert</span>
                </button>

                {onTestTrigger && (
                  <button
                    type="button"
                    onClick={onTestTrigger}
                    title="Test Alert visual & sound"
                    className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Test UI</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: ACTIVE ALERTS */}
          {activeTab === 'active' && (
            <div className="space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-300">No Active Price Alerts</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Set notifications to get alerted as soon as the live ticker hits your strategic entry, target, or stop loss.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl active:scale-95 transition-all"
                  >
                    + Create First Alert
                  </button>
                </div>
              ) : (
                activeAlerts.map((alert) => {
                  const asset = assets.find((a) => a.symbol === alert.symbol);
                  const currentPrice = asset ? asset.lastPrice : alert.createdPrice;
                  const distancePct = ((alert.targetPrice - currentPrice) / currentPrice) * 100;
                  const isAbove = alert.condition === 'ABOVE';

                  return (
                    <div
                      key={alert.id}
                      id={`alert-card-${alert.id}`}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        alert.active
                          ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/40 border-slate-850 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onToggleAlert(alert.id)}
                            title={alert.active ? 'Pause alert' : 'Activate alert'}
                            className={`p-2 rounded-xl border transition-all ${
                              alert.active
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}
                          >
                            <BellRing className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-white">
                                {alert.symbol}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                  isAbove
                                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {isAbove ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {isAbove ? '≥ Above' : '≤ Below'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              LTP: ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>

                        {/* Target Price & Distance */}
                        <div className="text-right">
                          <div className="text-sm font-black text-amber-300">
                            ₹{alert.targetPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div
                            className={`text-[11px] font-semibold ${
                              Math.abs(distancePct) < 0.5 ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-400'
                            }`}
                          >
                            {distancePct > 0 ? '+' : ''}
                            {distancePct.toFixed(2)}% away
                          </div>
                        </div>
                      </div>

                      {/* Note & footer */}
                      <div className="mt-2.5 pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500">
                          {alert.note ? `Note: ${alert.note}` : `Set at ₹${alert.createdPrice.toFixed(1)}`}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectAsset(alert.symbol);
                              onClose();
                            }}
                            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                          >
                            <span>Chart</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteAlert(alert.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: TRIGGERED HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {triggeredAlerts.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800">
                  <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-300">No Triggered Alerts Yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When active tickers reach your designated target prices, they will log here with trigger timestamps.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400">
                      Recently Triggered ({triggeredAlerts.length})
                    </span>
                    <button
                      onClick={onClearTriggered}
                      className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All History</span>
                    </button>
                  </div>

                  {triggeredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-md shadow-emerald-950/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-white">{alert.symbol}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              Target Hit
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {alert.triggeredAt || 'Recently hit target'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-400">
                          ₹{alert.targetPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <button
                          onClick={() => {
                            onSelectAsset(alert.symbol);
                            onClose();
                          }}
                          className="mt-1 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-0.5 justify-end"
                        >
                          <span>Open Chart</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/70 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time WebSocket & Ticker evaluation with instant audio chime</span>
        </div>
      </div>
    </div>
  );
};
