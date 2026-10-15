import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup').then((m) => m.Signup)
  },
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full'
  }
];
