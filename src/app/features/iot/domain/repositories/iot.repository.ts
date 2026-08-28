import { Observable } from 'rxjs';
import { IoTDeviceModel } from '../../models/iot-device.model';
import { TelemetryReadingModel } from '../../models/telemetry.model';
import { CreateIoTDeviceDto, TogglePowerResponseDto } from '../../models/iot-device.dto';

export interface IoTRepository {
  createDevice(dto: CreateIoTDeviceDto): Observable<IoTDeviceModel>;
  getBySpaceId(spaceId: number): Observable<IoTDeviceModel[]>;
  getMyDevices(): Observable<IoTDeviceModel[]>;
  togglePower(deviceId: number): Observable<TogglePowerResponseDto>;
  deleteDevice(deviceId: number): Observable<void>;
  getDeviceTelemetry(deviceId: number): Observable<TelemetryReadingModel>;
  getSpaceTelemetry(spaceId: number): Observable<TelemetryReadingModel[]>;
  getUserTelemetry(): Observable<TelemetryReadingModel[]>;
}
