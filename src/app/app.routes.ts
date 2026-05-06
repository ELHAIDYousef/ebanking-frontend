import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login')
        .then(m => m.Login)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'customers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/customers/customers')
        .then(m => m.Customers)
  },
  {
    path: 'customers/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/new-customer/new-customer')
        .then(m => m.NewCustomer)
  },
  {
    path: 'customers/edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/edit-customer/edit-customer')
        .then(m => m.EditCustomer)
  },
  {
    path: 'customers/:customerId/accounts/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./components/new-account/new-account')
        .then(m => m.NewAccount)
  },
  {
    path: 'accounts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/accounts/accounts')
        .then(m => m.Accounts)
  },
  {
    path: 'accounts/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/account-details/account-details')
        .then(m => m.AccountDetails)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];