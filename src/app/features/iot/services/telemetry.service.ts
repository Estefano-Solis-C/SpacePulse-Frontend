import { Injectable, inject } from '@angular/core';
import { interval, switchMap, startWith, Observable, shareReplay } from 'rxjs';
import { IoTService } from './iot.service';
import { TelemetryReadingModel } from '../models/telemetry.model';

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private iotService = inject(IoTService);

  getLiveSpaceTelemetry(spaceId: number, intervalMs = 5000): Observable<TelemetryReadingModel[]> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.iotService.getSpaceTelemetry(spaceId)),
      shareReplay(1)
    );
  }

  getLiveUserTelemetry(intervalMs = 6000): Observable<TelemetryReadingModel[]> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.iotService.getUserTelemetry()),
      shareReplay(1)
    );
  }
}
