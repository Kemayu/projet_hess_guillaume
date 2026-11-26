import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../states/auth/auth.state';

export const authGuard: CanMatchFn = (_route, segments) => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.selectSnapshot(AuthState.isAuthenticated)) {
    return true;
  }

  const navigation = router.currentNavigation();
  const returnUrl = navigation
    ? router.serializeUrl(navigation.extractedUrl)
    : '/' + segments.map((segment) => segment.path).join('/');

  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } });
};
