import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateIoTDeviceDto } from '../../models/iot-device.dto';
import { IoTDeviceModel } from '../../models/iot-device.model';
import { IoTRepository } from '../../domain/repositories/iot.repository';
import { IOT_REPOSITORY_TOKEN } from '../../domain/repositories/iot.tokens';

@Injectable({ providedIn: 'root' })
export class CreateDeviceUseCase {
  constructor(
    @Inject(IOT_REPOSITORY_TOKEN) private iotRepository: IoTRepository
  ) {}

  execute(dto: CreateIoTDeviceDto): Observable<IoTDeviceModel> {
    return this.iotRepository.createDevice(dto);
  }
}
