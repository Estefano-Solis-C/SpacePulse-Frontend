import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IoTRepository } from '../../domain/repositories/iot.repository';
import { IOT_REPOSITORY_TOKEN } from '../../domain/repositories/iot.tokens';

@Injectable({ providedIn: 'root' })
export class DeleteDeviceUseCase {
  constructor(
    @Inject(IOT_REPOSITORY_TOKEN) private iotRepository: IoTRepository
  ) {}

  execute(deviceId: number): Observable<void> {
    return this.iotRepository.deleteDevice(deviceId);
  }
}
