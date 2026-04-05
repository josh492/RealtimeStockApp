import { Routes } from '@angular/router';
import { StockDashboardComponent } from './components/stock-dashboard/stock-dashboard.component';

export const routes: Routes = [
    {path: 'stocks', component: StockDashboardComponent},
    {path: '', redirectTo: '/stocks', pathMatch: 'full'},
];
