import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/iam/services/auth.service';

export const defaultRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/iam/dashboard']);
  } else {
    router.navigate(['/iam/login']);
  }

  return false;
};
