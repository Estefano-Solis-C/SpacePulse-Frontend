import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, switchMap, catchError, of, shareReplay, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IotDevice, TelemetryRecord } from '../../../core/models/spacepulse.models';

@Injectable({ providedIn: 'root' })
export class IotTelemetryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  // Obtener catalogo de dispositivos por espacio
  getDevicesBySpace(spaceId: string): Observable<IotDevice[]> {
    return this.http.get<IotDevice[]>(`${this.baseUrl}/spaces/${spaceId}/iot-devices`);
  }

  // Stream continuo de telemetria en tiempo real
  getLiveTelemetryStream(deviceId: string): Observable<TelemetryRecord | null> {
    return timer(0, 2000).pipe(
      switchMap(() =>
        this.http.get<TelemetryRecord>(`${this.baseUrl}/iot-devices/${deviceId}/telemetry/latest`).pipe(
          catchError(() => of(null))
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
