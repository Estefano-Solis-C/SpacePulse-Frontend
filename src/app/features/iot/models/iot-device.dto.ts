export interface CreateIoTDeviceDto {
  spaceId: number;
  type: string;
  name: string;
  serialNumber: string;
  customMetricName?: string;
  customUnit?: string;
  customMinThreshold?: number;
  customMaxThreshold?: number;
}

export interface IoTDeviceSummaryDto {
  id: number;
  spaceId: number;
  type: string;
  name: string;
  serialNumber: string;
  isOn?: boolean;
}

export interface IoTDeviceDetailExtendedDto {
  id: number;
  spaceId: number;
  type: string;
  name: string;
  serialNumber: string;
  metricName: string;
  unit: string;
  value: number;
  timestamp: string;
  isOn: boolean;
  minThreshold: number;
  maxThreshold: number;
  isInAlertState: boolean;
}

export interface TogglePowerResponseDto {
  message: string;
  data: IoTDeviceSummaryDto;
  isOn: boolean;
}
