
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'POST' && req.url.endsWith('/api/signup')) {
    const body = req.body as {
      name: string;
      email: string;
      password: string;
    };

    // Réponse simulée à partir d'un objet JSON
    return of(
      new HttpResponse({
        status: 201,
        body: {
          success: true,
          message: 'Inscription réussie !',
          user: {
            id: 1,
            name: body.name,
            email: body.email
          }
        }
      })
    );
  }

  return next(req);
};
