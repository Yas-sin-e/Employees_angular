import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);

  // On n'ajoute pas le token pour la requête de login
  if (req.url.includes('/login')) {
    return next(req);
  }

  let jwt = authService.getToken();
  if (jwt) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${jwt}` }
    });
    return next(cloned);
  }

  return next(req);
};
