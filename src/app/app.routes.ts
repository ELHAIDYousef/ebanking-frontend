import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () =>
      import('./components/customers/customers')
        .then(m => m.Customers)
  },
  {
    path: 'customers/new',
    loadComponent: () =>
      import('./components/new-customer/new-customer')
        .then(m => m.NewCustomer)
  },
  {
    path: 'customers/edit/:id',
    loadComponent: () =>
      import('./components/edit-customer/edit-customer')
        .then(m => m.EditCustomer)
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./components/accounts/accounts')
        .then(m => m.Accounts)
  },
  {
    path: 'accounts/:id',
    loadComponent: () =>
      import('./components/account-details/account-details')
        .then(m => m.AccountDetails)
  },
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full'
  }
];