export type MarketSegment = 'NSE' | 'BSE' | 'NFO' | 'MCX' | 'CDS';

export type AssetCategory = 'indices' | 'equities' | 'fno' | 'commodities' | 'forex';

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '1D';

export interface CandleData {
  time: string | number; // YYYY-MM-DD or Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FVGData {
  id: string;
  type: 'bullish' | 'bearish';
  top: number;
  bottom: number;
  candleIndex: number;
  isReal: boolean; // Real displacement vs low-volume fake gap
  mitigated: boolean;
  timeframe: Timeframe;
  explanation: string;
}

export interface OrderBlockData {
  id: string;
  type: 'bullish' | 'bearish';
  high: number;
  low: number;
  institutionalVolume: number; // in Crores or contracts
  volumeScore: number; // 0-100
  mitigated: boolean;
  strength: 'high' | 'medium' | 'extreme';
  timeframe: Timeframe;
}

export interface LiquidityPool {
  id: string;
  type: 'BSL' | 'SSL'; // Buy-side Liquidity vs Sell-side Liquidity
  level: number;
  status: 'swept' | 'unswept';
  sweptAt?: string;
  unfilledVolume: number;
  description: string;
}

export interface SupportResistanceLevel {
  level: number;
  type: 'support' | 'resistance' | 'pivot' | 'vwap';
  strength: number; // 1 to 5 stars
  touches: number;
  retested: boolean;
}

export interface PriceVolumeMatrix {
  trend: 'Price Up + Vol Up (Strong Bullish)' | 'Price Up + Vol Down (Weak/Exhaustion)' | 'Price Down + Vol Up (Strong Bearish/Dumping)' | 'Price Down + Vol Down (Dry-off Pullback)';
  status: 'confirmed' | 'divergence' | 'climax' | 'absorption';
  buyerVolumePercent: number;
  sellerVolumePercent: number;
  delta: number;
  cumulativeDelta: number;
  absorptionDetected: boolean;
  breakoutValidity: 'Real Institutional Breakout' | 'Fake Trap / Stop Hunt' | 'Testing Range';
  reversalValidity: 'Real Reversal (Smart Money Buying)' | 'Fake Bounce (Dead Cat)' | 'Consolidation';
}

export interface OptionGreekData {
  strike: number;
  callOI: number;
  callOIChange: number;
  callLTP: number;
  callIV: number;
  callDelta: number;
  callGamma: number;
  callTheta: number;
  callVega: number;
  callVolume: number;
  callUnwinding: boolean;
  callUnwindingCount: number;

  putOI: number;
  putOIChange: number;
  putLTP: number;
  putIV: number;
  putDelta: number;
  putGamma: number;
  putTheta: number;
  putVega: number;
  putVolume: number;
  putUnwinding: boolean;
  putUnwindingCount: number;
}

export interface OptionChainSummary {
  symbol: string;
  expiry: string;
  underlyingPrice: number;
  pcr: number;
  maxPain: number;
  highestCallOIStrike: number;
  highestPutOIStrike: number;
  highestVolumeStrike: number;
  totalCallOI: number;
  totalPutOI: number;
  ivPercentile: number;
  writerBias: 'Aggressive Call Writing (Bearish)' | 'Aggressive Put Writing (Bullish)' | 'Short Straddle (Rangebound)' | 'Heavy Unwinding (Breakout imminent)';
  strikes: OptionGreekData[];
}

export interface AISignal {
  id: string;
  symbol: string;
  name: string;
  type: 'STRONG_BUY' | 'BUY' | 'STRONG_SELL' | 'SELL';
  timeframe: Timeframe;
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  target3: number;
  riskReward: string;
  confidence: number; // 0-100%
  timestamp: string;
  smartMoneyActivity: 'Smart Money Accumulation' | 'Institutional Distribution' | 'Liquidity Sweep Entry' | 'Order Block Rejection';
  confluenceFactors: string[];
  globalNewsImpact: string;
  status: 'ACTIVE' | 'TARGET_HIT' | 'SL_HIT' | 'INVALIDATED';
  fvgConfirmed: boolean;
  orderBlockConfirmed: boolean;
}

export interface GlobalNewsEvent {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Geopolitics' | 'Central Banks / RBI' | 'Crude Oil & Energy' | 'Macro Economic' | 'Corporate / FII';
  impactOnIndianMarket: 'HIGH_POSITIVE' | 'MODERATE_POSITIVE' | 'NEUTRAL' | 'MODERATE_NEGATIVE' | 'HIGH_NEGATIVE';
  impactExplanation: string;
  affectedSectors: string[];
  relevanceScore: number;
}

export interface FIIDIIData {
  date: string;
  fiiNetBuySellCr: number;
  diiNetBuySellCr: number;
  fiiIndexFuturesOI: number;
  fiiStockFuturesOI: number;
  fiiCallLongShortRatio: number;
  fiiPutLongShortRatio: number;
  sentiment: 'Institutional Bullish' | 'Institutional Bearish' | 'Neutral Rebalancing';
  intradayHourlyFlows: {
    time: string;
    fiiFlowCr: number;
    diiFlowCr: number;
    cumulativeCr: number;
  }[];
}

export interface AssetInfo {
  symbol: string;
  token: string;
  name: string;
  exchange: MarketSegment;
  category: AssetCategory;
  lastPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  close: number;
  volume: number;
  lotSize: number;
  tickSize: number;
  volatilityVIX?: number;
  marketState: 'Strong Trend (Trending)' | 'Calm / Rangebound' | 'High Volatility Squeeze' | 'Breakout Expansion';
}

export interface SmartAPIUserSession {
  isLoggedIn: boolean;
  isDemoSandbox: boolean;
  apiKey: string;
  clientCode: string;
  userName: string;
  email: string;
  broker: 'Angel One SmartAPI';
  feedToken: string;
  jwtToken: string;
  refreshToken: string;
  balance: number;
  availableMargin: number;
  usedMargin: number;
  realizedPnL: number;
  unrealizedPnL: number;
}

export interface SmartAPIOrderPayload {
  variety: 'NORMAL' | 'STOPLOSS' | 'AMO' | 'ROBO';
  tradingsymbol: string;
  symboltoken: string;
  transactiontype: 'BUY' | 'SELL';
  exchange: 'NSE' | 'BSE' | 'NFO' | 'MCX' | 'CDS';
  ordertype: 'MARKET' | 'LIMIT' | 'STOPLOSS_LIMIT' | 'STOPLOSS_MARKET';
  producttype: 'DELIVERY' | 'CARRYFORWARD' | 'MARGIN' | 'INTRADAY' | 'BO';
  duration: 'DAY' | 'IOC';
  price: string;
  squareoff?: string;
  stoploss?: string;
  quantity: string;
  disclosedquantity?: string;
  triggerprice?: string;
}

export interface SmartAPIOrderResponse {
  orderid: string;
  status: 'COMPLETE' | 'OPEN' | 'REJECTED' | 'CANCELLED';
  message?: string;
  tradingsymbol: string;
  transactiontype: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  averageprice: number;
  ordertime: string;
  exchange: string;
  producttype: string;
}

export interface PortfolioPosition {
  symbol: string;
  token: string;
  exchange: string;
  product: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  type: 'BUY' | 'SELL';
}

export interface PortfolioHolding {
  symbol: string;
  token: string;
  exchange: string;
  isin: string;
  totalQuantity: number;
  averagePrice: number;
  ltp: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  name?: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdPrice: number;
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
  note?: string;
  active: boolean;
}

