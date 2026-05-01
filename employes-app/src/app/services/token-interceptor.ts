import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

const excludeArray: string[] = ['/login', '/register', '/verifyEmail'];
function toExclude(url: string): boolean {
  return excludeArray.some(path => url.includes(path));
}
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);

  // On n'ajoute pas le token pour la requête de login

  if (toExclude(req.url)) {
    return next(req); // ← pas de token pour ces URLs
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
