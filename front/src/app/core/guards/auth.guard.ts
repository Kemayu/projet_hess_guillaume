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

  // URL complète demandée (ex. /pollutions/new), pour y revenir après la connexion.
  // Les segments seuls ne suffisent pas dans une route enfant (ils ne contiennent que "new").
  const navigation = router.currentNavigation();
  const returnUrl = navigation
    ? router.serializeUrl(navigation.extractedUrl)
    : '/' + segments.map((segment) => segment.path).join('/');

  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } });
};
