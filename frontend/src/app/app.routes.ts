import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SecuredComponent } from './secured/secured.component';
import { AuthGuard } from './auth/auth.guard';
import { OrdersComponent } from './secured/orders/orders.component';
import { AlertsComponent } from './secured/alerts/alerts.component';
import { MyAlertsComponent } from './secured/myalerts/myalerts.component';
import { SecuritiesComponent } from './secured/alerts/securities/securities.component';
import { FeedComponent } from './secured/feed/feed.component';
import { BacktestComponent } from './secured/backtest/backtest.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'secured', component: SecuredComponent, canActivate: [AuthGuard],
      children: [
        { path: 'alerts', component: AlertsComponent, children: [
          { path: 'securities/:id', component: SecuritiesComponent }  
        ] },
        { path: 'alerts/my', component: MyAlertsComponent },
        { path: 'orders', component: OrdersComponent },
        { path: 'feed', component: FeedComponent },
        { path: 'backtest', component: BacktestComponent }
      ]
     },
    { path: '**', redirectTo: '/login' }
];
