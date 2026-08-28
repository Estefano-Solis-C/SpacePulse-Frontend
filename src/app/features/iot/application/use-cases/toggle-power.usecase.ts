import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TogglePowerResponseDto } from '../../models/iot-device.dto';
import { IoTRepository } from '../../domain/repositories/iot.repository';
import { IOT_REPOSITORY_TOKEN } from '../../domain/repositories/iot.tokens';

@Injectable({ providedIn: 'root' })
export class TogglePowerUseCase {
  constructor(
    @Inject(IOT_REPOSITORY_TOKEN) private iotRepository: IoTRepository
  ) {}

  execute(deviceId: number): Observable<TogglePowerResponseDto> {
    return this.iotRepository.togglePower(deviceId);
  }
}
