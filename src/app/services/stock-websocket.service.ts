import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StockQuote, TRACKED_STOCKS } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockWebSocketService implements OnDestroy {
  private stockSubjects = new Map<string, BehaviorSubject<StockQuote>>();
  private ws: WebSocket | null = null;

  constructor() {
    this.initSubjects();
    this.connect();
  }

  private initSubjects(): void {
    TRACKED_STOCKS.forEach(({ symbol, name }) => {
      const initial: StockQuote = {
        symbol,
        name,
        currentPrice: 0,
        previousClose: 0,
        dailyHigh: 0,
        dailyLow: 0,
        weekHigh52: 0,
        weekLow52: 0,
        change: 0,
        changePercent: 0,
        timestamp: 0,
      };
      this.stockSubjects.set(symbol, new BehaviorSubject<StockQuote>(initial));
    });
  }

  private connect(): void {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onopen = () => {
      console.log('WebSocket connected to server');
    };

    this.ws.onmessage = (event) => {
      const data: StockQuote = JSON.parse(event.data);
      const subject = this.stockSubjects.get(data.symbol);
      if (subject) {
        subject.next(data);
      }
    };

    this.ws.onerror = () => {
      console.error('WebSocket error — is the server running? (node ws-server.js)');
    };

    this.ws.onclose = () => {
      console.warn('WebSocket closed, reconnecting in 5s...');
      setTimeout(() => this.connect(), 5000);
    };
  }

  getStockStream(symbol: string): Observable<StockQuote> {
    const subject = this.stockSubjects.get(symbol);
    if (!subject) {
      throw new Error(`No stream for symbol: ${symbol}`);
    }
    return subject.asObservable();
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
    this.stockSubjects.forEach((s) => s.complete());
  }
}
