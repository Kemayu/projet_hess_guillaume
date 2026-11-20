import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  {
    path: 'pollutions',
    // Le chunk JS de la feature n'est téléchargé qu'à l'accès à /pollutions
    loadChildren: () =>
      import('./features/pollutions/pollution.routes').then((m) => m.POLLUTION_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'users',
    // canMatch : sans connexion, la feature n'est pas chargée et on est redirigé vers /auth/login
    canMatch: [authGuard],
    loadChildren: () => import('./features/users/user.routes').then((m) => m.USER_ROUTES)
  },
  // Route joker : toute URL inconnue renvoie vers la liste
  { path: '**', redirectTo: 'pollutions' }
];
