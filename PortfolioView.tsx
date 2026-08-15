import React, { useState } from 'react';
import { SmartAPIUserSession, PortfolioPosition, PortfolioHolding, SmartAPIOrderResponse } from '../types';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Layers, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

interface PortfolioViewProps {
  session: SmartAPIUserSession;
  positions: PortfolioPosition[];
  holdings: PortfolioHolding[];
  orders: SmartAPIOrderResponse[];
  onSquareOffPosition: (position: PortfolioPosition) => void;
  onOpenAuthModal: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  session,
  positions,
  holdings,
  orders,
  onSquareOffPosition,
  onOpenAuthModal
}) => {
  const [activeTab, setActiveTab] = useState<'positions' | 'holdings' | 'orders'>('positions');

  const totalPositionsPnL = positions.reduce((acc, p) => acc + p.pnl, 0);
  const totalHoldingsPnL = holdings.reduce((acc, h) => acc + h.pnl, 0);
  const totalHoldingsValue = holdings.reduce((acc, h) => acc + h.currentValue, 0);

  return (
    <div className="w-full space-y-4">
      {/* Account Balance & Margin Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Briefcase className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{session.userName}</h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {session.isDemoSandbox ? 'Sandbox Account' : 'Angel One Live'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Client ID: <span className="text-slate-200 font-bold">{session.clientCode}</span> • SmartAPI Broker Connected
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 transition-all"
          >
            Switch / Reconnect SmartAPI
          </button>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Available Margin</span>
            <div className="text-lg font-black text-emerald-400 mt-1">
              ₹{session.availableMargin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Used Margin</span>
            <div className="text-lg font-black text-slate-200 mt-1">
              ₹{session.usedMargin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Intraday MTM P&L</span>
            <div
              className={`text-lg font-black mt-1 ${
                totalPositionsPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalPositionsPnL >= 0 ? '+₹' : '-₹'}
              {Math.abs(totalPositionsPnL).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Holdings Value</span>
            <div className="text-lg font-black text-cyan-400 mt-1">
              ₹{totalHoldingsValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Positions / Holdings / Orders */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('positions')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'positions'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Positions ({positions.length})
        </button>

        <button
          onClick={() => setActiveTab('holdings')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'holdings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Holdings / CNC ({holdings.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Order Book ({orders.length})
        </button>
      </div>

      {/* Tab: Positions */}
      {activeTab === 'positions' && (
        <div className="space-y-3">
          {positions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              No open intraday positions currently. Place an order from the Watchlist or AI Signals.
            </div>
          ) : (
            positions.map((pos, idx) => {
              const isProfit = pos.pnl >= 0;

              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white">{pos.symbol}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {pos.product}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                          pos.type === 'BUY'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {pos.type} {pos.quantity} Qty
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Avg: ₹{pos.buyPrice.toFixed(2)}</span>
                      <span>LTP: ₹{pos.currentPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`text-base font-black ${
                          isProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isProfit ? '+₹' : '-₹'}
                        {Math.abs(pos.pnl).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          isProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isProfit ? '+' : ''}
                        {pos.pnlPercentage.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={() => onSquareOffPosition(pos)}
                      className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-xl border border-rose-500/40 transition-all"
                    >
                      Exit / Square Off
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Holdings */}
      {activeTab === 'holdings' && (
        <div className="space-y-3">
          {holdings.map((h, idx) => {
            const isProfit = h.pnl >= 0;

            return (
              <div
                key={idx}
                className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{h.symbol}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {h.exchange}
                    </span>
                    <span className="text-xs text-slate-400">{h.totalQuantity} Shares</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>Avg: ₹{h.averagePrice.toFixed(2)}</span>
                    <span>LTP: ₹{h.ltp.toFixed(2)}</span>
                    <span>Invested: ₹{h.investedValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-base font-black ${
                      isProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isProfit ? '+₹' : '-₹'}
                    {Math.abs(h.pnl).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      isProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isProfit ? '+' : ''}
                    {h.pnlPercentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.map((ord, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded ${
                      ord.transactiontype === 'BUY'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {ord.transactiontype}
                  </span>
                  <span className="text-sm font-bold text-white">{ord.tradingsymbol}</span>
                  <span className="text-xs text-slate-400">{ord.quantity} Qty</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Order ID: {ord.orderid} • {ord.ordertime} • {ord.producttype}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white">₹{ord.price}</div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {ord.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
