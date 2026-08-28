export interface TelemetryReadingModel {
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
