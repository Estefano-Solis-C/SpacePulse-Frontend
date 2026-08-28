import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { ENVIRONMENT_CONFIG } from '../config/environment.config';

export const spaceApiInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ENVIRONMENT_CONFIG);
  let clonedReq = req;

  if (req.url.includes('api.nasa.gov') && !req.params.has('api_key')) {
    clonedReq = req.clone({
      setParams: { api_key: config.nasaApiKey }
    });
  }

  return next(clonedReq).pipe(
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status >= 500 || error.status === 0) {
          return timer(retryCount * 1000);
        }
        return throwError(() => error);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let message = 'Error de comunicación con la red de telemetría espacial.';
      if (error.status === 429) {
        message = 'Límite de peticiones de NASA API alcanzado. Mostrando datos en caché local.';
      }
      return throwError(() => new Error(message));
    })
  );
};
