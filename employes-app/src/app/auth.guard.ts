// src/app/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  authService.loadToken(); // ← charger token depuis localStorage

  if (authService.isloggedIn && !authService.isTokenExpired()) {
    return true; // ← connecté → accès autorisé
  } else {
    router.navigate(['/login']); // ← non connecté → rediriger login
    return false;
  }
};
