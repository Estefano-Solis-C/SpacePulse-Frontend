import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { timer, switchMap, map, catchError, of, shareReplay, Observable } from 'rxjs';
import { IssTelemetry, IssTelemetryDto, mapToIssTelemetry, ApiResponseState } from '../../../core/models/space-telemetry.models';

@Injectable({ providedIn: 'root' })
export class IssTelemetryService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://api.wheretheiss.at/v1/satellites/25544';

  private readonly stream$: Observable<ApiResponseState<IssTelemetry>> = timer(0, 1500).pipe(
    switchMap(() =>
      this.http.get<IssTelemetryDto>(this.endpoint).pipe(
        map((dto): ApiResponseState<IssTelemetry> => ({
          data: mapToIssTelemetry(dto),
          status: 'success',
          error: null
        })),
        catchError((err): Observable<ApiResponseState<IssTelemetry>> =>
          of({
            data: null,
            status: 'error',
            error: err.message || 'Error al conectar con ISS'
          })
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly telemetry: Signal<ApiResponseState<IssTelemetry>> = toSignal(this.stream$, {
    initialValue: { data: null, status: 'loading', error: null }
  });
}
