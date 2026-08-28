import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IoTRepository } from '../domain/repositories/iot.repository';
import { IoTDeviceModel } from '../models/iot-device.model';
import { TelemetryReadingModel } from '../models/telemetry.model';
import { CreateIoTDeviceDto, IoTDeviceSummaryDto, IoTDeviceDetailExtendedDto, TogglePowerResponseDto } from '../models/iot-device.dto';
import { IoTDeviceAssembler } from '../assemblers/iot-device.assembler';

@Injectable({ providedIn: 'root' })
export class IoTService implements IoTRepository {
  private http = inject(HttpClient);
  private deviceEndpoint = `${environment.apiUrl}/monitoring/iot-devices`;
  private readingsEndpoint = `${environment.apiUrl}/monitoring/readings`;

  createDevice(dto: CreateIoTDeviceDto): Observable<IoTDeviceModel> {
    return this.http.post<IoTDeviceSummaryDto>(this.deviceEndpoint, dto).pipe(
      map(res => IoTDeviceAssembler.toModel(res))
    );
  }

  getBySpaceId(spaceId: number): Observable<IoTDeviceModel[]> {
    return this.http.get<IoTDeviceSummaryDto[]>(`${this.deviceEndpoint}/space/${spaceId}`).pipe(
      map(dtos => IoTDeviceAssembler.toModelList(dtos))
    );
  }

  getMyDevices(): Observable<IoTDeviceModel[]> {
    return this.http.get<IoTDeviceSummaryDto[]>(`${this.deviceEndpoint}/my-devices`).pipe(
      map(dtos => IoTDeviceAssembler.toModelList(dtos))
    );
  }

  togglePower(deviceId: number): Observable<TogglePowerResponseDto> {
    return this.http.put<TogglePowerResponseDto>(`${this.deviceEndpoint}/${deviceId}/toggle`, {});
  }

  deleteDevice(deviceId: number): Observable<void> {
    return this.http.delete<void>(`${this.deviceEndpoint}/${deviceId}`);
  }

  getDeviceTelemetry(deviceId: number): Observable<TelemetryReadingModel> {
    return this.http.get<IoTDeviceDetailExtendedDto>(`${this.readingsEndpoint}/device/${deviceId}`).pipe(
      map(dto => IoTDeviceAssembler.toTelemetryModel(dto))
    );
  }

  getSpaceTelemetry(spaceId: number): Observable<TelemetryReadingModel[]> {
    return this.http.get<IoTDeviceDetailExtendedDto[]>(`${this.readingsEndpoint}/space/${spaceId}`).pipe(
      map(dtos => IoTDeviceAssembler.toTelemetryList(dtos))
    );
  }

  getUserTelemetry(): Observable<TelemetryReadingModel[]> {
    return this.http.get<IoTDeviceDetailExtendedDto[]>(`${this.readingsEndpoint}/user`).pipe(
      map(dtos => IoTDeviceAssembler.toTelemetryList(dtos))
    );
  }
}
