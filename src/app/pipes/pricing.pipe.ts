import { Pipe } from "@angular/core";


@Pipe({
    name: 'pricing',
    standalone: true
})
export class PricingPipe {
    transform(value: number, currency: string = 'USD'): string {
        if (currency === 'USD') {
            return `$${value.toFixed(2)}`;
        } else if (currency === 'EUR') {
            return `€${value.toFixed(2)}`;
        } else if (currency === 'JPY') {
            return `¥${Math.round(value)}`;
        } else {
            return `${value.toFixed(2)} ${currency}`;
        }
    }
}