import React, { useState, useEffect, useMemo } from 'react';
import {
  AssetInfo,
  CandleData,
  Timeframe,
  SmartAPIUserSession,
  PortfolioPosition,
  PortfolioHolding,
  SmartAPIOrderResponse,
  AISignal,
  PriceAlert
} from './types';
import {
  INITIAL_ASSETS,
  generateCandles,
  detectFVGs,
  detectOrderBlocks,
  detectLiquidityPools,
  detectSupportResistance,
  calculatePriceVolumeMatrix,
  generateOptionChain,
  MOCK_AI_SIGNALS,
  MOCK_GLOBAL_NEWS,
  MOCK_FII_DII,
  INITIAL_POSITIONS,
  INITIAL_HOLDINGS
} from './data/marketData';
import { TopTickerBar } from './components/TopTickerBar';
import { WatchlistSection } from './components/WatchlistSection';
import { AssetDetailView } from './components/AssetDetailView';
import { SignalsFeed } from './components/SignalsFeed';
import { FIIDIITracker } from './components/FIIDIITracker';
import { GlobalNewsImpact } from './components/GlobalNewsImpact';
import { PortfolioView } from './components/PortfolioView';
import { SmartAPIAuthModal } from './components/SmartAPIAuthModal';
import { OrderPlacementModal } from './components/OrderPlacementModal';
import { AppInstallModal } from './components/AppInstallModal';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { PriceAlertToast } from './components/PriceAlertToast';
import { BottomNavBar, MainNavScreen } from './components/BottomNavBar';
import { playAlertChime } from './utils/audio';

import {
  TrendingUp,
  Zap,
  BarChart2,
  Landmark,
  Globe,
  Briefcase,
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<MainNavScreen>('home');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY 50');
  const [timeframe, setTimeframe] = useState<Timeframe>('5m');

  // Live market assets state
  const [assets, setAssets] = useState<AssetInfo[]>(INITIAL_ASSETS);

  // SmartAPI Session state
  const [session, setSession] = useState<SmartAPIUserSession>({
    isLoggedIn: true,
    isDemoSandbox: true,
    apiKey: 'SMARTAPI_ANGEL_SANDBOX_KEY',
    clientCode: 'S948291',
    userName: 'Rajinder Bhagat (Pro)',
    email: 'rajinderbhagat26@gmail.com',
    broker: 'Angel One SmartAPI',
    feedToken: 'feed_token_live_12',
    jwtToken: 'jwt_token_live_88',
    refreshToken: 'ref_tok_live',
    balance: 245800.0,
    availableMargin: 198450.0,
    usedMargin: 47350.0,
    realizedPnL: 8955.0,
    unrealizedPnL: 12185.0
  });

  // Portfolio & Order state
  const [positions, setPositions] = useState<PortfolioPosition[]>(INITIAL_POSITIONS);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(INITIAL_HOLDINGS);
  const [orders, setOrders] = useState<SmartAPIOrderResponse[]>([
    {
      orderid: '240815000189',
      status: 'COMPLETE',
      tradingsymbol: 'NIFTY 24350 CE',
      transactiontype: 'BUY',
      quantity: 150,
      price: 112.5,
      averageprice: 112.5,
      ordertime: '10:45:12 AM',
      exchange: 'NFO',
      producttype: 'INTRADAY'
    },
    {
      orderid: '240815000192',
      status: 'COMPLETE',
      tradingsymbol: 'BANKNIFTY 51200 CE',
      transactiontype: 'BUY',
      quantity: 60,
      price: 284.0,
      averageprice: 284.0,
      ordertime: '11:16:04 AM',
      exchange: 'NFO',
      producttype: 'INTRADAY'
    }
  ]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [alertModalSymbol, setAlertModalSymbol] = useState('NIFTY 50');
  const [triggeredAlertToast, setTriggeredAlertToast] = useState<{
    alert: PriceAlert;
    currentPrice: number;
  } | null>(null);

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('smartpro_price_alerts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading alerts:', e);
    }
    return [
      {
        id: 'alert-1',
        symbol: 'NIFTY 50',
        name: 'Nifty 50 Index (NSE)',
        targetPrice: 24395.0,
        condition: 'ABOVE',
        createdPrice: 24378.0,
        createdAt: '10:30 AM',
        triggered: false,
        note: 'SMC Resistance Breakout level',
        active: true
      },
      {
        id: 'alert-2',
        symbol: 'BANKNIFTY',
        name: 'Nifty Bank Index',
        targetPrice: 51260.0,
        condition: 'BELOW',
        createdPrice: 51273.38,
        createdAt: '11:00 AM',
        triggered: false,
        note: 'Order block mitigation retest',
        active: true
      },
      {
        id: 'alert-3',
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        targetPrice: 2995.0,
        condition: 'ABOVE',
        createdPrice: 2986.51,
        createdAt: '09:45 AM',
        triggered: false,
        note: 'Bullish liquidity sweep target',
        active: true
      }
    ];
  });

  // Persist alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartpro_price_alerts', JSON.stringify(priceAlerts));
    } catch (e) {}
  }, [priceAlerts]);

  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [orderModalParams, setOrderModalParams] = useState<{
    isOpen: boolean;
    symbol: string;
    type: 'BUY' | 'SELL';
    price?: number;
  }>({
    isOpen: false,
    symbol: 'NIFTY 50',
    type: 'BUY'
  });


  // Listen for native Android APK beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredInstallPrompt(null);
      setIsInstallModalOpen(false);
    }
  };


  // Active selected asset
  const activeAsset = useMemo(() => {
    return assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  }, [assets, selectedSymbol]);

  // Computed Candlestick Data for active asset
  const [candles, setCandles] = useState<CandleData[]>(() =>
    generateCandles(activeAsset.lastPrice, 80, timeframe)
  );

  // Re-generate candles when asset or timeframe changes
  useEffect(() => {
    setCandles(generateCandles(activeAsset.lastPrice, 80, timeframe));
  }, [activeAsset.symbol, timeframe]);

  // Real-time market tick simulation (simulates Angel One WebSocket ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const delta = (Math.random() - 0.48) * (asset.lastPrice * 0.0006);
          const newPrice = Number((asset.lastPrice + delta).toFixed(2));
          const newChange = Number((asset.change + delta).toFixed(2));
          const newChangePercent = Number(((newChange / (asset.close || 1)) * 100).toFixed(2));
          const newHigh = Math.max(asset.dayHigh, newPrice);
          const newLow = Math.min(asset.dayLow, newPrice);

          return {
            ...asset,
            lastPrice: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            dayHigh: newHigh,
            dayLow: newLow
          };
        })
      );
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Update latest candle on tick
  useEffect(() => {
    if (candles.length === 0) return;
    const last = candles[candles.length - 1];
    if (!last) return;

    if (Math.abs(last.close - activeAsset.lastPrice) > 0.01) {
      setCandles((prev) => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        copy[lastIdx] = {
          ...copy[lastIdx],
          close: activeAsset.lastPrice,
          high: Math.max(copy[lastIdx].high, activeAsset.lastPrice),
          low: Math.min(copy[lastIdx].low, activeAsset.lastPrice)
        };
        return copy;
      });
    }
  }, [activeAsset.lastPrice]);

  // Computed SMC indicators
  const fvgs = useMemo(() => detectFVGs(candles, timeframe), [candles, timeframe]);
  const orderBlocks = useMemo(() => detectOrderBlocks(candles, timeframe), [candles, timeframe]);
  const liquidityPools = useMemo(() => detectLiquidityPools(activeAsset.lastPrice), [activeAsset.lastPrice]);
  const srLevels = useMemo(() => detectSupportResistance(activeAsset.lastPrice), [activeAsset.lastPrice]);
  const matrix = useMemo(() => calculatePriceVolumeMatrix(activeAsset.symbol, activeAsset.lastPrice), [activeAsset]);
  const optionChain = useMemo(() => generateOptionChain(activeAsset.symbol, activeAsset.lastPrice), [activeAsset]);
  const activeSignal = useMemo(() => MOCK_AI_SIGNALS.find((s) => s.symbol === activeAsset.symbol), [activeAsset.symbol]);

  // Real-time Price Alert Target Evaluation
  useEffect(() => {
    if (priceAlerts.length === 0) return;

    setPriceAlerts((prevAlerts) => {
      let hasChanges = false;
      const updated = prevAlerts.map((alert) => {
        if (alert.triggered || !alert.active) return alert;

        const currentAsset = assets.find((a) => a.symbol === alert.symbol);
        if (!currentAsset) return alert;

        let isTriggered = false;
        if (alert.condition === 'ABOVE' && currentAsset.lastPrice >= alert.targetPrice) {
          isTriggered = true;
        } else if (alert.condition === 'BELOW' && currentAsset.lastPrice <= alert.targetPrice) {
          isTriggered = true;
        }

        if (isTriggered) {
          hasChanges = true;
          playAlertChime();
          setTriggeredAlertToast({
            alert: { ...alert, triggered: true, triggeredAt: new Date().toLocaleTimeString() },
            currentPrice: currentAsset.lastPrice
          });

          return {
            ...alert,
            triggered: true,
            triggeredAt: new Date().toLocaleTimeString()
          };
        }

        return alert;
      });

      return hasChanges ? updated : prevAlerts;
    });
  }, [assets]);

  // Alert Management Handlers
  const handleAddAlert = (newAlertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: PriceAlert = {
      ...newAlertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      triggered: false
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
  };

  const handleDeleteAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    setPriceAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleClearTriggeredAlerts = () => {
    setPriceAlerts((prev) => prev.filter((a) => !a.triggered));
  };

  const handleOpenAlertModal = (symbol?: string) => {
    if (symbol) setAlertModalSymbol(symbol);
    setIsAlertsModalOpen(true);
  };

  const handleTestAlertTrigger = () => {
    playAlertChime();
    setTriggeredAlertToast({
      alert: {
        id: `test-${Date.now()}`,
        symbol: activeAsset.symbol,
        name: activeAsset.name,
        targetPrice: activeAsset.lastPrice,
        condition: 'ABOVE',
        createdPrice: activeAsset.lastPrice * 0.99,
        createdAt: 'Just now',
        triggered: true,
        triggeredAt: new Date().toLocaleTimeString(),
        note: 'Simulated Target Hit Test',
        active: true
      },
      currentPrice: activeAsset.lastPrice
    });
  };

  // Handlers
  const handleSelectAsset = (asset: AssetInfo) => {
    setSelectedSymbol(asset.symbol);
    setCurrentScreen('detail');
  };


  const handleOpenOrderModal = (params: { symbol: string; type: 'BUY' | 'SELL'; price?: number }) => {
    setOrderModalParams({
      isOpen: true,
      symbol: params.symbol,
      type: params.type,
      price: params.price
    });
  };

  const handleOrderSuccess = (newOrder: any) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Add to active positions if intraday
    const newPosition: PortfolioPosition = {
      symbol: newOrder.tradingsymbol,
      token: '999',
      exchange: newOrder.exchange,
      product: newOrder.producttype,
      quantity: Number(newOrder.quantity),
      buyPrice: Number(newOrder.price),
      currentPrice: Number(newOrder.price),
      pnl: 0,
      pnlPercentage: 0,
      type: newOrder.transactiontype
    };
    setPositions((prev) => [newPosition, ...prev]);
  };

  const handleSquareOffPosition = (pos: PortfolioPosition) => {
    setPositions((prev) => prev.filter((p) => p.symbol !== pos.symbol));
    const squareOffOrder: SmartAPIOrderResponse = {
      orderid: `AO${Date.now().toString().slice(-8)}`,
      status: 'COMPLETE',
      tradingsymbol: pos.symbol,
      transactiontype: pos.type === 'BUY' ? 'SELL' : 'BUY',
      quantity: pos.quantity,
      price: pos.currentPrice,
      averageprice: pos.currentPrice,
      ordertime: new Date().toLocaleTimeString(),
      exchange: pos.exchange,
      producttype: pos.product,
      message: 'Position closed via SmartAPI Square-off'
    };
    setOrders((prev) => [squareOffOrder, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Real-time Ticker Bar */}
      <TopTickerBar
        assets={assets}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={(sym) => {
          setSelectedSymbol(sym);
          if (currentScreen === 'home') {
            setCurrentScreen('detail');
          }
        }}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAlertsModal={() => handleOpenAlertModal(selectedSymbol)}
        alerts={priceAlerts}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Screen 1: Home / Watchlist / Dashboard */}
        {currentScreen === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Market Pulse Banner */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    SmartPro Market Dashboard
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                  Pro-grade Indian market intelligence powered by Smart Money Concepts, Order Flow, Option Greeks & Angel One SmartAPI.
                </p>
              </div>

              {/* Quick Broker Status, Price Alerts & Native APK Button */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="dashboard-price-alerts-btn"
                  onClick={() => handleOpenAlertModal(selectedSymbol)}
                  className="px-3.5 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 transition-all text-left flex items-center gap-2.5 shadow-md active:scale-95"
                >
                  <span className="p-1 rounded-lg bg-amber-500 text-slate-950">
                    <Zap className="w-4 h-4 fill-slate-950" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <span>Price Alerts</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                        {priceAlerts.filter((a) => !a.triggered && a.active).length}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Target Notifications
                    </div>
                  </div>
                </button>

                <button
                  id="install-apk-badge-btn"
                  onClick={() => {
                    if (deferredInstallPrompt) {
                      handleNativeInstall();
                    } else {
                      setIsInstallModalOpen(true);
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all text-left flex items-center gap-2.5 shadow-md active:scale-95"
                >
                  <span className="p-1 rounded-lg bg-emerald-500 text-slate-950">
                    <Zap className="w-4 h-4 fill-slate-950" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-emerald-300 flex items-center gap-1">
                      <span>Install Native App</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Standalone APK mode
                    </div>
                  </div>
                </button>

                <button
                  id="broker-status-card"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all text-left flex items-center gap-3"
                >
                  <div className="relative">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Angel One SmartAPI</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Margin: <span className="text-emerald-400 font-semibold">₹{session.availableMargin.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                id="quick-nav-signals"
                onClick={() => setCurrentScreen('signals')}
                className="p-4 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl shadow-lg text-left transition-all group active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Zap className="w-5 h-5 fill-emerald-400" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    4 Active
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-3 group-hover:text-emerald-400 transition-colors">
                  AI Trading Signals
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">High-probability SMC setups</p>
              </button>

              <button
                id="quick-nav-fiidii"
                onClick={() => setCurrentScreen('fiidii')}
                className="p-4 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl shadow-lg text-left transition-all group active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Landmark className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                    +₹4,120 Cr
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-3 group-hover:text-indigo-300 transition-colors">
                  FII / DII Flow
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Institutional buying activity</p>
              </button>

              <button
                id="quick-nav-news"
                onClick={() => setCurrentScreen('news')}
                className="p-4 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl shadow-lg text-left transition-all group active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Globe className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                    Bullish
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                  Global News Impact
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Crude, Fed, RBI & Geo events</p>
              </button>

              <button
                id="quick-nav-portfolio"
                onClick={() => setCurrentScreen('portfolio')}
                className="p-4 bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl shadow-lg text-left transition-all group active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    +₹12,185
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-3 group-hover:text-purple-300 transition-colors">
                  Portfolio & Orders
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Positions & Available Margin</p>
              </button>
            </div>

            {/* Watchlist Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Live Market Watchlist</h2>
                  <p className="text-xs text-slate-400">
                    Tap any asset to open the Dedicated TradingView Chart, Volume Delta Matrix, and Option Chain.
                  </p>
                </div>
              </div>

              <WatchlistSection
                assets={assets}
                selectedSymbol={selectedSymbol}
                onSelectAsset={handleSelectAsset}
                alerts={priceAlerts}
                onSetAlert={handleOpenAlertModal}
              />
            </div>
          </div>
        )}

        {/* Screen 2: Dedicated Asset Detail View */}
        {currentScreen === 'detail' && (
          <AssetDetailView
            asset={activeAsset}
            candles={candles}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            fvgs={fvgs}
            orderBlocks={orderBlocks}
            liquidityPools={liquidityPools}
            srLevels={srLevels}
            matrix={matrix}
            optionChain={optionChain}
            signal={activeSignal}
            onBack={() => setCurrentScreen('home')}
            onOpenOrderModal={handleOpenOrderModal}
            alerts={priceAlerts}
            onSetAlert={handleOpenAlertModal}
          />
        )}

        {/* Screen 3: AI Trading Signals */}
        {currentScreen === 'signals' && (
          <SignalsFeed
            signals={MOCK_AI_SIGNALS}
            onExecuteSignal={(sig) => {
              handleOpenOrderModal({
                symbol: sig.symbol,
                type: sig.type.includes('BUY') ? 'BUY' : 'SELL',
                price: sig.entryPrice
              });
            }}
            onOpenChart={(sym) => {
              setSelectedSymbol(sym);
              setCurrentScreen('detail');
            }}
          />
        )}

        {/* Screen 4: FII & DII Tracking */}
        {currentScreen === 'fiidii' && <FIIDIITracker data={MOCK_FII_DII} />}

        {/* Screen 5: Global News Impact */}
        {currentScreen === 'news' && <GlobalNewsImpact news={MOCK_GLOBAL_NEWS} />}

        {/* Screen 6: Portfolio & Orders */}
        {currentScreen === 'portfolio' && (
          <PortfolioView
            session={session}
            positions={positions}
            holdings={holdings}
            orders={orders}
            onSquareOffPosition={handleSquareOffPosition}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Real-time Price Alert Toast */}
      <PriceAlertToast
        triggeredAlert={triggeredAlertToast}
        onDismiss={() => setTriggeredAlertToast(null)}
        onViewAsset={(sym) => {
          setSelectedSymbol(sym);
          setCurrentScreen('detail');
        }}
      />

      {/* Price Alerts Configuration & Management Modal */}
      <PriceAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        assets={assets}
        defaultSymbol={alertModalSymbol}
        alerts={priceAlerts}
        onAddAlert={handleAddAlert}
        onDeleteAlert={handleDeleteAlert}
        onToggleAlert={handleToggleAlert}
        onClearTriggered={handleClearTriggeredAlerts}
        onSelectAsset={(sym) => {
          setSelectedSymbol(sym);
          setCurrentScreen('detail');
        }}
        onTestTrigger={handleTestAlertTrigger}
      />

      {/* Angel One SmartAPI Auth Modal */}
      <SmartAPIAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        session={session}
        onLoginSuccess={(newSession) => setSession(newSession)}
      />

      {/* Angel One Order Placement Modal */}
      <OrderPlacementModal
        isOpen={orderModalParams.isOpen}
        onClose={() => setOrderModalParams((prev) => ({ ...prev, isOpen: false }))}
        initialSymbol={orderModalParams.symbol}
        initialType={orderModalParams.type}
        initialPrice={orderModalParams.price}
        assets={assets}
        session={session}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Direct Install / PWA Mobile Modal */}
      <AppInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        appUrl={window.location.href}
        deferredPrompt={deferredInstallPrompt}
        onInstallClick={handleNativeInstall}
      />



      {/* Bottom Mobile Navigation Bar */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isLoggedIn={session.isLoggedIn}
      />
    </div>
  );
}
