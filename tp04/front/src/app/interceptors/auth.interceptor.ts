import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

// Routes d'authentification qui ne doivent ni recevoir le token ni déclencher un refresh
const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];

const withToken = (req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> =>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => req.url.endsWith(path));

  if (!isApiRequest || isAuthEndpoint) {
    return next(req);
  }

  return next(withToken(req, auth.getAccessToken())).pipe(
    catchError((error: unknown) => {
      // Access token expiré : on tente un refresh puis on rejoue la requête une seule fois
      if (error instanceof HttpErrorResponse && error.status === 401 && auth.getRefreshToken()) {
        return auth.refresh().pipe(
          catchError(() => {
            auth.logout();
            return throwError(() => error);
          }),
          switchMap(({ accessToken }) => next(withToken(req, accessToken)))
        );
      }
      return throwError(() => error);
    })
  );
};
