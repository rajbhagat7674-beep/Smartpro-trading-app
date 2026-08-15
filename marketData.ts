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
  GlobalNewsEvent,
  FIIDIIData,
  PortfolioPosition,
  PortfolioHolding,
  Timeframe
} from '../types';

export const INITIAL_ASSETS: AssetInfo[] = [
  {
    symbol: 'NIFTY 50',
    token: '26000',
    name: 'Nifty 50 Index (NSE)',
    exchange: 'NSE',
    category: 'indices',
    lastPrice: 24368.45,
    change: 184.20,
    changePercent: 0.76,
    dayHigh: 24412.00,
    dayLow: 24210.30,
    open: 24225.00,
    close: 24184.25,
    volume: 18492000,
    lotSize: 25,
    tickSize: 0.05,
    volatilityVIX: 13.42,
    marketState: 'Strong Trend (Trending)'
  },
  {
    symbol: 'BANKNIFTY',
    token: '26009',
    name: 'Nifty Bank Index',
    exchange: 'NSE',
    category: 'indices',
    lastPrice: 51280.90,
    change: 412.60,
    changePercent: 0.81,
    dayHigh: 51420.00,
    dayLow: 50890.10,
    open: 50920.00,
    close: 50868.30,
    volume: 12400000,
    lotSize: 15,
    tickSize: 0.05,
    volatilityVIX: 15.10,
    marketState: 'Breakout Expansion'
  },
  {
    symbol: 'SENSEX',
    token: '1',
    name: 'BSE Sensex Index',
    exchange: 'BSE',
    category: 'indices',
    lastPrice: 80145.20,
    change: 560.80,
    changePercent: 0.70,
    dayHigh: 80290.00,
    dayLow: 79650.00,
    open: 79720.00,
    close: 79584.40,
    volume: 8500000,
    lotSize: 10,
    tickSize: 0.05,
    volatilityVIX: 13.20,
    marketState: 'Strong Trend (Trending)'
  },
  {
    symbol: 'FINNIFTY',
    token: '26037',
    name: 'Nifty Financial Services',
    exchange: 'NSE',
    category: 'indices',
    lastPrice: 23640.15,
    change: 145.30,
    changePercent: 0.62,
    dayHigh: 23710.00,
    dayLow: 23510.00,
    open: 23530.00,
    close: 23494.85,
    volume: 6400000,
    lotSize: 25,
    tickSize: 0.05,
    volatilityVIX: 14.10,
    marketState: 'Strong Trend (Trending)'
  },
  {
    symbol: 'MIDCPNIFTY',
    token: '26074',
    name: 'Nifty Midcap Select',
    exchange: 'NSE',
    category: 'indices',
    lastPrice: 12890.40,
    change: -34.20,
    changePercent: -0.26,
    dayHigh: 12960.00,
    dayLow: 12850.00,
    open: 12940.00,
    close: 12924.60,
    volume: 5200000,
    lotSize: 50,
    tickSize: 0.05,
    volatilityVIX: 16.50,
    marketState: 'Calm / Rangebound'
  },
  {
    symbol: 'RELIANCE',
    token: '2885',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE',
    category: 'equities',
    lastPrice: 2984.60,
    change: 38.40,
    changePercent: 1.30,
    dayHigh: 2998.00,
    dayLow: 2942.00,
    open: 2950.00,
    close: 2946.20,
    volume: 7200000,
    lotSize: 250,
    tickSize: 0.05,
    marketState: 'Strong Trend (Trending)'
  },
  {
    symbol: 'HDFCBANK',
    token: '1333',
    name: 'HDFC Bank Ltd',
    exchange: 'NSE',
    category: 'equities',
    lastPrice: 1682.30,
    change: 18.70,
    changePercent: 1.12,
    dayHigh: 1690.00,
    dayLow: 1660.50,
    open: 1665.00,
    close: 1663.60,
    volume: 14200000,
    lotSize: 550,
    tickSize: 0.05,
    marketState: 'Strong Trend (Trending)'
  },
  {
    symbol: 'TCS',
    token: '11536',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    category: 'equities',
    lastPrice: 4120.00,
    change: -28.50,
    changePercent: -0.69,
    dayHigh: 4165.00,
    dayLow: 4095.00,
    open: 4150.00,
    close: 4148.50,
    volume: 2300000,
    lotSize: 175,
    tickSize: 0.05,
    marketState: 'Calm / Rangebound'
  },
  {
    symbol: 'INFY',
    token: '1594',
    name: 'Infosys Ltd',
    exchange: 'NSE',
    category: 'equities',
    lastPrice: 1748.20,
    change: -12.40,
    changePercent: -0.70,
    dayHigh: 1770.00,
    dayLow: 1740.00,
    open: 1765.00,
    close: 1760.60,
    volume: 4800000,
    lotSize: 400,
    tickSize: 0.05,
    marketState: 'Calm / Rangebound'
  },
  {
    symbol: 'ICICIBANK',
    token: '4963',
    name: 'ICICI Bank Ltd',
    exchange: 'NSE',
    category: 'equities',
    lastPrice: 1224.50,
    change: 14.80,
    changePercent: 1.22,
    dayHigh: 1230.00,
    dayLow: 1208.00,
    open: 1210.00,
    close: 1209.70,
    volume: 9800000,
    lotSize: 700,
    tickSize: 0.05,
    marketState: 'Strong Trend (Trending)'
  },
  {
    symbol: 'TATASTEEL',
    token: '3499',
    name: 'Tata Steel Ltd',
    exchange: 'NSE',
    category: 'equities',
    lastPrice: 154.60,
    change: 3.20,
    changePercent: 2.11,
    dayHigh: 156.20,
    dayLow: 151.00,
    open: 151.80,
    close: 151.40,
    volume: 38400000,
    lotSize: 5500,
    tickSize: 0.05,
    marketState: 'Breakout Expansion'
  },
  {
    symbol: 'CRUDEOIL',
    token: '234500',
    name: 'Crude Oil (MCX)',
    exchange: 'MCX',
    category: 'commodities',
    lastPrice: 6245.00,
    change: -74.00,
    changePercent: -1.17,
    dayHigh: 6350.00,
    dayLow: 6210.00,
    open: 6310.00,
    close: 6319.00,
    volume: 42000,
    lotSize: 100,
    tickSize: 1.0,
    marketState: 'Strong Trend (Trending)'
  },
  {
    symbol: 'GOLD',
    token: '234100',
    name: 'Gold (MCX 10g)',
    exchange: 'MCX',
    category: 'commodities',
    lastPrice: 73850.00,
    change: 320.00,
    changePercent: 0.44,
    dayHigh: 74100.00,
    dayLow: 73500.00,
    open: 73600.00,
    close: 73530.00,
    volume: 18500,
    lotSize: 1,
    tickSize: 1.0,
    marketState: 'Calm / Rangebound'
  },
  {
    symbol: 'USDINR',
    token: '1201',
    name: 'USD / INR Currency (CDS)',
    exchange: 'CDS',
    category: 'forex',
    lastPrice: 84.18,
    change: 0.04,
    changePercent: 0.05,
    dayHigh: 84.22,
    dayLow: 84.12,
    open: 84.15,
    close: 84.14,
    volume: 1540000,
    lotSize: 1000,
    tickSize: 0.0025,
    marketState: 'Calm / Rangebound'
  }
];

export function generateCandles(basePrice: number, count: number = 80, timeframe: Timeframe = '5m'): CandleData[] {
  const candles: CandleData[] = [];
  let currentClose = basePrice * 0.985;
  const now = new Date();
  
  const stepMinutes = timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : timeframe === '15m' ? 15 : timeframe === '1h' ? 60 : 1440;
  
  for (let i = count; i >= 0; i--) {
    const time = new Date(now.getTime() - i * stepMinutes * 60 * 1000);
    const volatility = basePrice * 0.0025;
    const change = (Math.random() - 0.47) * volatility;
    
    const open = Number((currentClose).toFixed(2));
    const close = Number((open + change).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * volatility * 0.8).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * volatility * 0.8).toFixed(2));
    const volume = Math.floor(Math.random() * 45000 + 12000);
    
    // Format timestamp for TradingView
    let timeStr: string | number;
    if (timeframe === '1D') {
      timeStr = time.toISOString().split('T')[0];
    } else {
      timeStr = Math.floor(time.getTime() / 1000);
    }

    candles.push({
      time: timeStr,
      open,
      high,
      low,
      close,
      volume
    });

    currentClose = close;
  }

  return candles;
}

export function detectFVGs(candles: CandleData[], timeframe: Timeframe): FVGData[] {
  const fvgs: FVGData[] = [];
  if (candles.length < 3) return fvgs;

  for (let i = 2; i < candles.length - 1; i++) {
    const c1 = candles[i - 2];
    const c2 = candles[i - 1]; // The displacement candle
    const c3 = candles[i];

    const bodySize = Math.abs(c2.close - c2.open);
    const avgBody = (Math.abs(c1.close - c1.open) + Math.abs(c3.close - c3.open)) / 2;
    const isDisplacement = bodySize > avgBody * 1.6;

    // Bullish FVG: Low of candle 3 > High of candle 1
    if (c3.low > c1.high) {
      const gap = c3.low - c1.high;
      fvgs.push({
        id: `fvg-bull-${i}`,
        type: 'bullish',
        top: Number(c3.low.toFixed(2)),
        bottom: Number(c1.high.toFixed(2)),
        candleIndex: i,
        isReal: isDisplacement && gap > 4.0,
        mitigated: i < candles.length - 8,
        timeframe,
        explanation: isDisplacement 
          ? 'Real Institutional Imbalance with aggressive smart money buying & high volume displacement.' 
          : 'Low-volume weak gap, higher risk of being a trap or rapidly swept.'
      });
    }

    // Bearish FVG: High of candle 3 < Low of candle 1
    if (c3.high < c1.low) {
      const gap = c1.low - c3.high;
      fvgs.push({
        id: `fvg-bear-${i}`,
        type: 'bearish',
        top: Number(c1.low.toFixed(2)),
        bottom: Number(c3.high.toFixed(2)),
        candleIndex: i,
        isReal: isDisplacement && gap > 4.0,
        mitigated: i < candles.length - 8,
        timeframe,
        explanation: isDisplacement 
          ? 'Real Bearish Displacement FVG. Aggressive institutional market selling detected.' 
          : 'Fake gap caused by retail liquidity void. Susceptible to sudden mean-reversion.'
      });
    }
  }

  return fvgs.slice(-5); // keep latest 5
}

export function detectOrderBlocks(candles: CandleData[], timeframe: Timeframe): OrderBlockData[] {
  const obs: OrderBlockData[] = [];
  if (candles.length < 5) return obs;

  const lastCandle = candles[candles.length - 1];
  const price = lastCandle.close;

  // Bullish Order block below current price
  obs.push({
    id: 'ob-bull-1',
    type: 'bullish',
    high: Number((price * 0.993).toFixed(2)),
    low: Number((price * 0.988).toFixed(2)),
    institutionalVolume: 842.5, // Crores
    volumeScore: 92,
    mitigated: false,
    strength: 'extreme',
    timeframe
  });

  obs.push({
    id: 'ob-bull-2',
    type: 'bullish',
    high: Number((price * 0.982).toFixed(2)),
    low: Number((price * 0.978).toFixed(2)),
    institutionalVolume: 420.0,
    volumeScore: 78,
    mitigated: true,
    strength: 'medium',
    timeframe
  });

  // Bearish Order block above current price
  obs.push({
    id: 'ob-bear-1',
    type: 'bearish',
    high: Number((price * 1.011).toFixed(2)),
    low: Number((price * 1.006).toFixed(2)),
    institutionalVolume: 960.0,
    volumeScore: 89,
    mitigated: false,
    strength: 'high',
    timeframe
  });

  return obs;
}

export function detectLiquidityPools(price: number): LiquidityPool[] {
  return [
    {
      id: 'liq-bsl-1',
      type: 'BSL',
      level: Number((price * 1.008).toFixed(2)),
      status: 'unswept',
      unfilledVolume: 142000,
      description: 'Major Equal Highs (EQH) Buy-side Liquidity pool. Retail stop-loss clusters resting above.'
    },
    {
      id: 'liq-bsl-2',
      type: 'BSL',
      level: Number((price * 1.015).toFixed(2)),
      status: 'unswept',
      unfilledVolume: 89000,
      description: 'Swing High Liquidity target for algorithmic market makers.'
    },
    {
      id: 'liq-ssl-1',
      type: 'SSL',
      level: Number((price * 0.994).toFixed(2)),
      status: 'swept',
      sweptAt: 'Today 10:15 AM IST',
      unfilledVolume: 220000,
      description: 'Sell-side Liquidity swept cleanly by institutional absorption wick prior to upward reversal.'
    },
    {
      id: 'liq-ssl-2',
      type: 'SSL',
      level: Number((price * 0.986).toFixed(2)),
      status: 'unswept',
      unfilledVolume: 175000,
      description: 'Untapped Daily Low liquidity resting beneath key psychological round number.'
    }
  ];
}

export function detectSupportResistance(price: number): SupportResistanceLevel[] {
  return [
    {
      level: Number((price * 1.012).toFixed(2)),
      type: 'resistance',
      strength: 5,
      touches: 4,
      retested: true
    },
    {
      level: Number((price * 1.004).toFixed(2)),
      type: 'pivot',
      strength: 4,
      touches: 3,
      retested: true
    },
    {
      level: Number((price * 0.999).toFixed(2)),
      type: 'vwap',
      strength: 5,
      touches: 6,
      retested: false
    },
    {
      level: Number((price * 0.992).toFixed(2)),
      type: 'support',
      strength: 4,
      touches: 4,
      retested: true
    },
    {
      level: Number((price * 0.985).toFixed(2)),
      type: 'support',
      strength: 5,
      touches: 5,
      retested: true
    }
  ];
}

export function calculatePriceVolumeMatrix(symbol: string, currentPrice: number): PriceVolumeMatrix {
  return {
    trend: 'Price Up + Vol Up (Strong Bullish)',
    status: 'confirmed',
    buyerVolumePercent: 68,
    sellerVolumePercent: 32,
    delta: 428000,
    cumulativeDelta: 1254000,
    absorptionDetected: true,
    breakoutValidity: 'Real Institutional Breakout',
    reversalValidity: 'Real Reversal (Smart Money Buying)'
  };
}

export function generateOptionChain(symbol: string, underlyingPrice: number): OptionChainSummary {
  const step = symbol === 'NIFTY 50' ? 50 : symbol === 'BANKNIFTY' ? 100 : 20;
  const atm = Math.round(underlyingPrice / step) * step;
  
  const strikes = [];
  let totalCallOI = 0;
  let totalPutOI = 0;

  for (let i = -7; i <= 7; i++) {
    const strike = atm + i * step;
    const distFromATM = Math.abs(strike - underlyingPrice);
    
    // Call metrics
    const callLTP = strike <= underlyingPrice 
      ? Math.max(5, underlyingPrice - strike + Math.max(10, 80 - distFromATM * 0.15))
      : Math.max(2, 90 - (strike - underlyingPrice) * 0.35);
      
    // Put metrics
    const putLTP = strike >= underlyingPrice 
      ? Math.max(5, strike - underlyingPrice + Math.max(10, 80 - distFromATM * 0.15))
      : Math.max(2, 90 - (underlyingPrice - strike) * 0.35);

    const callOI = Math.floor(Math.random() * 80000 + 40000 + (strike > underlyingPrice ? 35000 : 10000));
    const putOI = Math.floor(Math.random() * 80000 + 40000 + (strike < underlyingPrice ? 45000 : 10000));
    
    const callOIChange = Math.floor((Math.random() - 0.45) * 18000);
    const putOIChange = Math.floor((Math.random() - 0.35) * 22000);
    
    totalCallOI += callOI;
    totalPutOI += putOI;

    const callDelta = Number((1 / (1 + Math.exp((strike - underlyingPrice) / 120))).toFixed(2));
    const putDelta = Number((callDelta - 1).toFixed(2));
    const gamma = Number((0.0025 * Math.exp(-Math.pow((strike - underlyingPrice) / 150, 2))).toFixed(4));
    const theta = Number((-12.5 - Math.random() * 4).toFixed(1));
    const vega = Number((8.2 + Math.random() * 2).toFixed(1));
    const iv = Number((12.8 + (Math.abs(strike - underlyingPrice) / underlyingPrice) * 15).toFixed(1));

    strikes.push({
      strike,
      callOI,
      callOIChange,
      callLTP: Number(callLTP.toFixed(1)),
      callIV: iv,
      callDelta,
      callGamma: gamma,
      callTheta: theta,
      callVega: vega,
      callVolume: Math.floor(callOI * 1.8),
      callUnwinding: callOIChange < -5000,
      callUnwindingCount: callOIChange < -5000 ? Math.abs(callOIChange) : 0,

      putOI,
      putOIChange,
      putLTP: Number(putLTP.toFixed(1)),
      putIV: iv,
      putDelta,
      putGamma: gamma,
      putTheta: theta,
      putVega: vega,
      putVolume: Math.floor(putOI * 2.1),
      putUnwinding: putOIChange < -5000,
      putUnwindingCount: putOIChange < -5000 ? Math.abs(putOIChange) : 0
    });
  }

  const pcr = Number((totalPutOI / totalCallOI).toFixed(2));
  const highestCallOIStrike = strikes.reduce((max, s) => s.callOI > max.callOI ? s : max, strikes[0]).strike;
  const highestPutOIStrike = strikes.reduce((max, s) => s.putOI > max.putOI ? s : max, strikes[0]).strike;
  const highestVolumeStrike = strikes.reduce((max, s) => (s.callVolume + s.putVolume) > (max.callVolume + max.putVolume) ? s : max, strikes[0]).strike;

  return {
    symbol,
    expiry: '21 AUG 2026 (Weekly)',
    underlyingPrice,
    pcr,
    maxPain: atm,
    highestCallOIStrike,
    highestPutOIStrike,
    highestVolumeStrike,
    totalCallOI,
    totalPutOI,
    ivPercentile: 38.4,
    writerBias: pcr > 1.15 ? 'Aggressive Put Writing (Bullish)' : pcr < 0.85 ? 'Aggressive Call Writing (Bearish)' : 'Short Straddle (Rangebound)',
    strikes
  };
}

export const MOCK_AI_SIGNALS: AISignal[] = [
  {
    id: 'sig-1',
    symbol: 'NIFTY 50',
    name: 'Nifty 50 24350 CE Call',
    type: 'STRONG_BUY',
    timeframe: '5m',
    entryPrice: 24355.00,
    stopLoss: 24295.00,
    target1: 24420.00,
    target2: 24480.00,
    target3: 24550.00,
    riskReward: '1 : 2.8',
    confidence: 94,
    timestamp: '10:45 AM Today',
    smartMoneyActivity: 'Liquidity Sweep Entry',
    confluenceFactors: [
      'Sell-side liquidity (SSL) swept at 24300 level with rejection wick',
      'Bullish Order Block retested at 24320 with massive FII institutional volume (+₹450 Cr)',
      'Real 15m Fair Value Gap (FVG) created with high displacement',
      'Price-Volume Confirmation: Buying volume delta +428K with positive delta divergence',
      '24300 Put writers adding +28.4L OI, 24400 Call writers unwinding (-12.8L OI)'
    ],
    globalNewsImpact: 'Global Brent crude down 1.4% (Positive for Indian Macro) + Asian markets green.',
    status: 'ACTIVE',
    fvgConfirmed: true,
    orderBlockConfirmed: true
  },
  {
    id: 'sig-2',
    symbol: 'BANKNIFTY',
    name: 'Bank Nifty 51200 CE',
    type: 'STRONG_BUY',
    timeframe: '15m',
    entryPrice: 51250.00,
    stopLoss: 51080.00,
    target1: 51450.00,
    target2: 51650.00,
    target3: 51900.00,
    riskReward: '1 : 3.2',
    confidence: 91,
    timestamp: '11:15 AM Today',
    smartMoneyActivity: 'Smart Money Accumulation',
    confluenceFactors: [
      'Breakout above previous Day High with institutional volume expansion',
      'HDFC Bank & ICICI Bank leading with heavy positive cumulative delta',
      'DII net inflow positive (+₹820 Cr in banking basket)',
      'Option PCR jumped from 0.92 to 1.34 indicating aggressive put writing support at 51000'
    ],
    globalNewsImpact: 'RBI liquidity stance remains neutral-accommodative, bond yields stable at 6.84%.',
    status: 'ACTIVE',
    fvgConfirmed: true,
    orderBlockConfirmed: true
  },
  {
    id: 'sig-3',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Cash / Fut',
    type: 'BUY',
    timeframe: '1h',
    entryPrice: 2980.00,
    stopLoss: 2948.00,
    target1: 3025.00,
    target2: 3060.00,
    target3: 3100.00,
    riskReward: '1 : 2.5',
    confidence: 88,
    timestamp: '09:45 AM Today',
    smartMoneyActivity: 'Order Block Rejection',
    confluenceFactors: [
      'Demand zone & Bullish Order Block tested with high absorption',
      'Refining margins GRM expanded in Singapore crack spreads',
      'Delivery volume percentage above 62% (Smart money spot accumulation)'
    ],
    globalNewsImpact: 'OPEC+ output steady, petrochemical demand stabilizing.',
    status: 'ACTIVE',
    fvgConfirmed: true,
    orderBlockConfirmed: true
  },
  {
    id: 'sig-4',
    symbol: 'CRUDEOIL',
    name: 'MCX Crude Oil Futures',
    type: 'STRONG_SELL',
    timeframe: '15m',
    entryPrice: 6250.00,
    stopLoss: 6310.00,
    target1: 6180.00,
    target2: 6120.00,
    target3: 6050.00,
    riskReward: '1 : 2.2',
    confidence: 89,
    timestamp: '12:05 PM Today',
    smartMoneyActivity: 'Institutional Distribution',
    confluenceFactors: [
      'Bearish Fair Value Gap (FVG) formed after fake breakout above 6320',
      'US inventory build exceeded estimates (+3.2M barrels vs -1.1M expected)',
      'High volume selling climax followed by lower low lower high sequence'
    ],
    globalNewsImpact: 'US EIA inventory surplus + Dollar Index (DXY) firming up at 103.8.',
    status: 'ACTIVE',
    fvgConfirmed: true,
    orderBlockConfirmed: true
  }
];

export const MOCK_GLOBAL_NEWS: GlobalNewsEvent[] = [
  {
    id: 'news-1',
    title: 'Crude Oil Falls 1.8% to $76/bbl on Weakening US Demand & Higher Inventory Build',
    source: 'Bloomberg Energy',
    timeAgo: '18 mins ago',
    category: 'Crude Oil & Energy',
    impactOnIndianMarket: 'HIGH_POSITIVE',
    impactExplanation: 'Lower crude oil directly cuts India’s import bill, strengthens INR against USD, and reduces inflation pressure for FMCG, Paints, and OMCs.',
    affectedSectors: ['Auto', 'Paints', 'Aviation', 'Oil Marketing Companies'],
    relevanceScore: 96
  },
  {
    id: 'news-2',
    title: 'US Fed Signals Rate Cut Trajectory Intact as Core Inflation Cools to 2.6%',
    source: 'Reuters Macro',
    timeAgo: '42 mins ago',
    category: 'Central Banks / RBI',
    impactOnIndianMarket: 'HIGH_POSITIVE',
    impactExplanation: 'US yields easing towards 3.88% triggers aggressive FII portfolio allocation back into high-growth emerging markets like India (NSE/BSE).',
    affectedSectors: ['Banking & Financials', 'IT & Tech', 'Real Estate'],
    relevanceScore: 94
  },
  {
    id: 'news-3',
    title: 'India Manufacturing PMI Surges to 58.6 in August, Highest in 16 Months',
    source: 'S&P Global India',
    timeAgo: '1 hr ago',
    category: 'Macro Economic',
    impactOnIndianMarket: 'HIGH_POSITIVE',
    impactExplanation: 'Strong industrial factory output and capital goods order book growth confirm robust domestic corporate earnings growth.',
    affectedSectors: ['Capital Goods', 'Infrastructure', 'Metals', 'Automotive'],
    relevanceScore: 92
  },
  {
    id: 'news-4',
    title: 'FIIs Turn Net Buyers in Indian Equities with ₹2,480 Cr Inflow in Cash Segment',
    source: 'NSE Institutional Bulletin',
    timeAgo: '2 hrs ago',
    category: 'Corporate / FII',
    impactOnIndianMarket: 'HIGH_POSITIVE',
    impactExplanation: 'Institutional short-covering in Index Futures combined with spot buying creates strong momentum floor at 24,200 support.',
    affectedSectors: ['Nifty 50 Heavyweights', 'Private Banks', 'Defense'],
    relevanceScore: 90
  },
  {
    id: 'news-5',
    title: 'Middle East Ceasefire Talks Progress in Cairo, De-escalating Red Sea Shipping Risk',
    source: 'Financial Times',
    timeAgo: '3 hrs ago',
    category: 'Geopolitics',
    impactOnIndianMarket: 'MODERATE_POSITIVE',
    impactExplanation: 'Shipping freight rates easing and supply chain risk diminishing reduces export-import bottlenecks for Indian engineering firms.',
    affectedSectors: ['Shipping & Ports', 'Textiles', 'Chemicals'],
    relevanceScore: 85
  }
];

export const MOCK_FII_DII: FIIDIIData = {
  date: 'Today (Live Session)',
  fiiNetBuySellCr: 2480.50,
  diiNetBuySellCr: 1640.20,
  fiiIndexFuturesOI: 68.4, // % Long
  fiiStockFuturesOI: 72.1, // % Long
  fiiCallLongShortRatio: 1.48,
  fiiPutLongShortRatio: 0.72,
  sentiment: 'Institutional Bullish',
  intradayHourlyFlows: [
    { time: '09:30 AM', fiiFlowCr: 320, diiFlowCr: 180, cumulativeCr: 500 },
    { time: '10:30 AM', fiiFlowCr: 580, diiFlowCr: 410, cumulativeCr: 1490 },
    { time: '11:30 AM', fiiFlowCr: 840, diiFlowCr: 620, cumulativeCr: 2950 },
    { time: '12:30 PM', fiiFlowCr: 420, diiFlowCr: 230, cumulativeCr: 3600 },
    { time: '01:30 PM', fiiFlowCr: 320.5, diiFlowCr: 200.2, cumulativeCr: 4120.7 }
  ]
};

export const INITIAL_POSITIONS: PortfolioPosition[] = [
  {
    symbol: 'NIFTY 24350 CE',
    token: '45890',
    exchange: 'NFO',
    product: 'INTRADAY',
    quantity: 150, // 6 lots
    buyPrice: 112.50,
    currentPrice: 148.80,
    pnl: 5445.00,
    pnlPercentage: 32.27,
    type: 'BUY'
  },
  {
    symbol: 'BANKNIFTY 51200 CE',
    token: '46120',
    exchange: 'NFO',
    product: 'INTRADAY',
    quantity: 60, // 4 lots
    buyPrice: 284.00,
    currentPrice: 342.50,
    pnl: 3510.00,
    pnlPercentage: 20.60,
    type: 'BUY'
  },
  {
    symbol: 'RELIANCE',
    token: '2885',
    exchange: 'NSE',
    product: 'DELIVERY',
    quantity: 50,
    buyPrice: 2920.00,
    currentPrice: 2984.60,
    pnl: 3230.00,
    pnlPercentage: 2.21,
    type: 'BUY'
  }
];

export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'RELIANCE',
    token: '2885',
    exchange: 'NSE',
    isin: 'INE002A01018',
    totalQuantity: 80,
    averagePrice: 2840.00,
    ltp: 2984.60,
    investedValue: 227200,
    currentValue: 238768,
    pnl: 11568.00,
    pnlPercentage: 5.09
  },
  {
    symbol: 'HDFCBANK',
    token: '1333',
    exchange: 'NSE',
    isin: 'INE040A01034',
    totalQuantity: 120,
    averagePrice: 1580.00,
    ltp: 1682.30,
    investedValue: 189600,
    currentValue: 201876,
    pnl: 12276.00,
    pnlPercentage: 6.47
  },
  {
    symbol: 'TATASTEEL',
    token: '3499',
    exchange: 'NSE',
    isin: 'INE081A01020',
    totalQuantity: 1000,
    averagePrice: 142.00,
    ltp: 154.60,
    investedValue: 142000,
    currentValue: 154600,
    pnl: 12600.00,
    pnlPercentage: 8.87
  }
];
