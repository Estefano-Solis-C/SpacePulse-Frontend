import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/infrastructure/notification/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }

      if (error.status === 401) {
        localStorage.removeItem('spacepulse_jwt_token');
        localStorage.removeItem('spacepulse_user');
        router.navigate(['/iam/login']);
        toast.error('Session expired. Please log in again.');
      } else if (error.status === 403) {
        toast.warning('Access denied: You do not have permission for this action.');
      } else if (error.status === 404) {
        toast.warning(errorMessage || 'Requested resource not found.');
      } else if (error.status >= 500) {
        toast.error(errorMessage || 'Server error. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};
