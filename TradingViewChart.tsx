import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  ColorType
} from 'lightweight-charts';
import { CandleData, FVGData, OrderBlockData, LiquidityPool, SupportResistanceLevel, Timeframe, AISignal } from '../types';
import { Eye, EyeOff, Layers, Zap, Shield, TrendingUp, RefreshCw } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
  candles: CandleData[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  fvgs?: FVGData[];
  orderBlocks?: OrderBlockData[];
  liquidityPools?: LiquidityPool[];
  srLevels?: SupportResistanceLevel[];
  signals?: AISignal[];
  onPlaceOrder?: (type: 'BUY' | 'SELL', price: number) => void;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  candles,
  timeframe,
  onTimeframeChange,
  fvgs = [],
  orderBlocks = [],
  liquidityPools = [],
  srLevels = [],
  signals = [],
  onPlaceOrder
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  // SMC Overlay Toggles
  const [showFVG, setShowFVG] = useState(true);
  const [showOrderBlocks, setShowOrderBlocks] = useState(true);
  const [showLiquidity, setShowLiquidity] = useState(true);
  const [showSR, setShowSR] = useState(true);
  const [showSignals, setShowSignals] = useState(true);

  const lastCandle = candles[candles.length - 1];
  const currentPrice = lastCandle ? lastCandle.close : 0;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize Lightweight Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#090d16' },
        textColor: '#94a3b8',
        fontSize: 12,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.4)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.4)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#64748b',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e293b',
        },
        horzLine: {
          color: '#64748b',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e293b',
        },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
    });

    // Add Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981', // Emerald 500
      downColor: '#ef4444', // Red 500
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#34d399',
      wickDownColor: '#f87171',
    });

    // Add Volume Series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Overlay in same pane
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle Resize
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0 && chartRef.current && chartContainerRef.current) {
        const { width, height } = entries[0].contentRect;
        chartRef.current.applyOptions({ width, height });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  // Update data & markers whenever candles or overlays change
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || candles.length === 0) return;

    // Format candle data
    const formattedCandles: CandlestickData<Time>[] = candles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const formattedVolume = candles.map((c) => ({
      time: c.time as Time,
      value: c.volume,
      color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
    }));

    candleSeriesRef.current.setData(formattedCandles);
    volumeSeriesRef.current.setData(formattedVolume);

    // Apply Markers on Chart for Signals and Liquidity Sweeps
    const markers: any[] = [];

    if (showSignals && signals.length > 0) {
      signals.forEach((sig) => {
        if (sig.symbol === symbol && candles.length > 3) {
          const targetCandle = candles[candles.length - 2] || candles[candles.length - 1];
          if (sig.type.includes('BUY')) {
            markers.push({
              time: targetCandle.time as Time,
              position: 'belowBar',
              color: '#10b981',
              shape: 'arrowUp',
              text: `BUY (RR ${sig.riskReward})`,
              size: 2,
            });
          } else {
            markers.push({
              time: targetCandle.time as Time,
              position: 'aboveBar',
              color: '#ef4444',
              shape: 'arrowDown',
              text: `SELL (RR ${sig.riskReward})`,
              size: 2,
            });
          }
        }
      });
    }

    if (showLiquidity) {
      liquidityPools.forEach((pool, idx) => {
        if (pool.status === 'swept' && candles.length > 10) {
          const sweptCandle = candles[candles.length - 6 - idx] || candles[0];
          markers.push({
            time: sweptCandle.time as Time,
            position: pool.type === 'SSL' ? 'belowBar' : 'aboveBar',
            color: '#f59e0b',
            shape: 'circle',
            text: `Swept ${pool.type}`,
            size: 1,
          });
        }
      });
    }

    // Lightweight charts setMarkers
    try {
      if (candleSeriesRef.current.setMarkers) {
        candleSeriesRef.current.setMarkers(markers);
      }
    } catch {
      // ignore
    }
  }, [candles, signals, liquidityPools, showSignals, showLiquidity, symbol]);

  return (
    <div className="w-full bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['1m', '5m', '15m', '1h', '1D'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              id={`tf-btn-${tf}`}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* SMC Overlays Toggle Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            id="toggle-fvg-btn"
            onClick={() => setShowFVG(!showFVG)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              showFVG
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            FVG Gap {showFVG ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            id="toggle-ob-btn"
            onClick={() => setShowOrderBlocks(!showOrderBlocks)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              showOrderBlocks
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Order Blocks {showOrderBlocks ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            id="toggle-liq-btn"
            onClick={() => setShowLiquidity(!showLiquidity)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              showLiquidity
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Liquidity Pools
          </button>

          <button
            id="toggle-sr-btn"
            onClick={() => setShowSR(!showSR)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              showSR
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            S/R & VWAP
          </button>

          <button
            id="toggle-signals-btn"
            onClick={() => setShowSignals(!showSignals)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              showSignals
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            AI Signals
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="relative w-full h-[380px] sm:h-[450px] bg-[#090d16]">
        <div ref={chartContainerRef} className="w-full h-full" />

        {/* Live SMC Overlay Badges inside Chart area */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none max-w-[280px]">
          {showOrderBlocks && orderBlocks.slice(0, 2).map((ob) => (
            <div
              key={ob.id}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border shadow-lg ${
                ob.type === 'bullish'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{ob.type === 'bullish' ? '🟢 Bullish Order Block (OB)' : '🔴 Bearish Order Block (OB)'}</span>
                <span className="text-[10px] text-slate-400">{ob.timeframe}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] mt-0.5 text-slate-300">
                <span>Zone: ₹{ob.low} - ₹{ob.high}</span>
                <span className="font-semibold text-emerald-400">₹{ob.institutionalVolume} Cr</span>
              </div>
            </div>
          ))}

          {showFVG && fvgs.slice(0, 1).map((fvg) => (
            <div
              key={fvg.id}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border shadow-lg ${
                fvg.isReal
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                  : 'bg-slate-900/80 border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  ⚡ {fvg.isReal ? 'REAL Fair Value Gap (FVG)' : 'Fake Low-Vol Gap'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {fvg.type.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Range: ₹{fvg.bottom} - ₹{fvg.top} • {fvg.isReal ? 'High Displacement' : 'Swept easily'}
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Buy/Sell Quick Trigger Floating Pill */}
        {onPlaceOrder && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl">
            <button
              id="chart-quick-buy-btn"
              onClick={() => onPlaceOrder('BUY', currentPrice)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md shadow-emerald-950 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              BUY @ ₹{currentPrice.toFixed(2)}
            </button>
            <button
              id="chart-quick-sell-btn"
              onClick={() => onPlaceOrder('SELL', currentPrice)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-md shadow-rose-950 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 rotate-180" />
              SELL @ ₹{currentPrice.toFixed(2)}
            </button>
          </div>
        )}
      </div>

      {/* SMC Live Status Indicators Footer */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Active S/R: <span className="text-white font-semibold">{srLevels.length} Levels</span>
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Liquidity: <span className="text-emerald-400 font-semibold">SSL Swept (Reversal)</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Angel One SmartAPI Realtime Feed (~14ms)</span>
        </div>
      </div>
    </div>
  );
};
