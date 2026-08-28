import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/iam/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data?.['roles'] || [];
  const currentRole = authService.userRole();

  if (authService.isAuthenticated() && currentRole && expectedRoles.includes(currentRole)) {
    return true;
  }

  router.navigate(['/iam/dashboard']);
  return false;
};
