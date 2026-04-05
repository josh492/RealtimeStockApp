const WebSocket = require('ws');
const https = require('https');

const PORT = 8080;
const FINNHUB_API_KEY = 'd78kgrpr01qp0fl5i7d0d78kgrpr01qp0fl5i7dg';

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'TSLA', name: 'Tesla' },
];

// In-memory current state
const currentQuotes = {};

function httpsGetDirect(targetUrl) {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function fetchFinnhub(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(FINNHUB_API_KEY)}`;
  return httpsGetDirect(url).then((data) => JSON.parse(data));
}

async function fetchRealQuotes() {
  for (const { symbol, name } of STOCKS) {
    try {
      const q = await fetchFinnhub(symbol);
      if (q && q.c) {
        const prev = currentQuotes[symbol];
        currentQuotes[symbol] = {
          symbol,
          name,
          currentPrice: q.c,
          previousClose: q.pc,
          dailyHigh: q.h,
          dailyLow: q.l,
          weekHigh52: prev ? prev.weekHigh52 : q.h,
          weekLow52: prev ? prev.weekLow52 : q.l,
          change: +(q.c - q.pc).toFixed(2),
          changePercent: +(((q.c - q.pc) / q.pc) * 100).toFixed(2),
          timestamp: Date.now(),
        };
        console.log(`Fetched ${symbol}: $${q.c}`);
      } else {
        console.warn(`No data for ${symbol}:`, q);
      }
    } catch (err) {
      console.error(`Error fetching ${symbol}:`, err.message || err);
    }
  }
}

// --- Server Setup ---
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server starting on ws://localhost:${PORT}`);
console.log('Using Finnhub API for real-time data');

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send current snapshot on connect
  STOCKS.forEach(({ symbol }) => {
    if (currentQuotes[symbol]) {
      ws.send(JSON.stringify(currentQuotes[symbol]));
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

function broadcast() {
  const clients = [...wss.clients].filter((c) => c.readyState === WebSocket.OPEN);
  STOCKS.forEach(({ symbol }) => {
    if (currentQuotes[symbol]) {
      const payload = JSON.stringify(currentQuotes[symbol]);
      clients.forEach((c) => c.send(payload));
    }
  });
}

// Fetch real data every 15 seconds (Finnhub free tier: 60 calls/min)
fetchRealQuotes().then(broadcast);
setInterval(async () => {
  await fetchRealQuotes();
  broadcast();
}, 15000);
