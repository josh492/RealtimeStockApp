import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockCard } from '../../models/stock.model';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.css',
})
export class StockCardComponent {
  @Input() card!: StockCard;
  @Output() toggle = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }

  get cardClass(): string {
    if (!this.card.active) return 'card-off';
    return this.card.direction === 'up' ? 'card-up' : this.card.direction === 'down' ? 'card-down' : 'card-neutral';
  }

  get arrowIcon(): string {
    if (!this.card.active) return '';
    return this.card.direction === 'up' ? '▲' : this.card.direction === 'down' ? '▼' : '';
  }
}
