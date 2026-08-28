import { IoTDeviceSummaryDto, IoTDeviceDetailExtendedDto } from '../models/iot-device.dto';
import { IoTDeviceModel } from '../models/iot-device.model';
import { TelemetryReadingModel } from '../models/telemetry.model';

export class IoTDeviceAssembler {
  static toModel(dto: IoTDeviceSummaryDto): IoTDeviceModel {
    return {
      id: dto.id,
      spaceId: dto.spaceId,
      type: dto.type,
      name: dto.name,
      serialNumber: dto.serialNumber,
      isOn: dto.isOn ?? true
    };
  }

  static toModelList(dtos: IoTDeviceSummaryDto[]): IoTDeviceModel[] {
    return (dtos || []).map(dto => this.toModel(dto));
  }

  static toTelemetryModel(dto: IoTDeviceDetailExtendedDto): TelemetryReadingModel {
    return {
      id: dto.id,
      spaceId: dto.spaceId,
      type: dto.type,
      name: dto.name,
      serialNumber: dto.serialNumber,
      metricName: dto.metricName,
      unit: dto.unit,
      value: dto.value,
      timestamp: dto.timestamp,
      isOn: dto.isOn,
      minThreshold: dto.minThreshold,
      maxThreshold: dto.maxThreshold,
      isInAlertState: dto.isInAlertState
    };
  }

  static toTelemetryList(dtos: IoTDeviceDetailExtendedDto[]): TelemetryReadingModel[] {
    return (dtos || []).map(dto => this.toTelemetryModel(dto));
  }
}
