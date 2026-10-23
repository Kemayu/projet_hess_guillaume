import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/pollution-list/pollution-list.component').then(
        ({ PollutionListComponent }) => PollutionListComponent
      )
  },
  {
    path: 'pollutions/:id',
    loadComponent: () =>
      import('./pages/pollution-detail/pollution-detail.component').then(
        ({ PollutionDetailComponent }) => PollutionDetailComponent
      )
  },
  { path: '**', redirectTo: '' }
];
