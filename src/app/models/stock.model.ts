export interface StockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  dailyHigh: number;
  dailyLow: number;
  weekHigh52: number;
  weekLow52: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface StockCard {
  stock: StockQuote;
  active: boolean;
  direction: 'up' | 'down' | 'neutral';
}

export const TRACKED_STOCKS: { symbol: string; name: string }[] = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'TSLA', name: 'Tesla' },
];
