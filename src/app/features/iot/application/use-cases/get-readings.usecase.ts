import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TelemetryReadingModel } from '../../models/telemetry.model';
import { IoTRepository } from '../../domain/repositories/iot.repository';
import { IOT_REPOSITORY_TOKEN } from '../../domain/repositories/iot.tokens';

@Injectable({ providedIn: 'root' })
export class GetReadingsUseCase {
  constructor(
    @Inject(IOT_REPOSITORY_TOKEN) private iotRepository: IoTRepository
  ) {}

  executeForSpace(spaceId: number): Observable<TelemetryReadingModel[]> {
    return this.iotRepository.getSpaceTelemetry(spaceId);
  }

  executeForDevice(deviceId: number): Observable<TelemetryReadingModel> {
    return this.iotRepository.getDeviceTelemetry(deviceId);
  }

  executeForUser(): Observable<TelemetryReadingModel[]> {
    return this.iotRepository.getUserTelemetry();
  }
}
