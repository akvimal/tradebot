import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SecuredComponent } from './secured/secured.component';
import { AuthGuard } from './auth/auth.guard';
import { OrdersComponent } from './secured/orders/orders.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'secured', component: SecuredComponent, canActivate: [AuthGuard],
      children: [
        {path: 'orders', component: OrdersComponent}
      ]
     },
    { path: '**', redirectTo: '/login' }
];
