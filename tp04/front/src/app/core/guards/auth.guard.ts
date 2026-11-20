import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Réserve une route aux utilisateurs connectés.
// Utilisé en canMatch : si l'accès est refusé, le chunk lazy n'est même pas téléchargé.
export const authGuard: CanMatchFn = (_route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  // Redirection vers la connexion, avec retour sur la page demandée ensuite
  const returnUrl = '/' + segments.map((segment) => segment.path).join('/');
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } });
};
