import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StockWebSocketService } from '../../services/stock-websocket.service';
import { StockCard, TRACKED_STOCKS } from '../../models/stock.model';
import { StockCardComponent } from '../stock-card/stock-card.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-dashboard',
  standalone: true,
  imports: [CommonModule, StockCardComponent],
  templateUrl: './stock-dashboard.component.html',
  styleUrl: './stock-dashboard.component.css',
})
export class StockDashboardComponent implements OnInit, OnDestroy {
  cards: StockCard[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private stockService: StockWebSocketService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    TRACKED_STOCKS.forEach(({ symbol, name }) => {
      const card: StockCard = {
        stock: {
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
        },
        active: true,
        direction: 'neutral',
      };
      this.cards.push(card);

      const sub = this.stockService.getStockStream(symbol).subscribe((quote) => {
        if (!card.active) return;
        const prevPrice = card.stock.currentPrice;
        card.stock = quote;
        if (prevPrice > 0) {
          card.direction = quote.currentPrice > prevPrice ? 'up' : quote.currentPrice < prevPrice ? 'down' : card.direction;
        }
      });
      this.subscriptions.push(sub);
    });
  }

  toggleCard(card: StockCard): void {
    card.active = !card.active;
    if (!card.active) {
      card.direction = 'neutral';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
